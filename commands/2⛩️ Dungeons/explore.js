const { Message } = require('discord.js');
const { rawEmb, emotes, calcLevel, colors } = require('../utilities');

module.exports = {
    name: 'explore',
    syntax: 'explore',
    args: false,
    description: 'Kämpfe in Dungeons',
    commands: ['explore', 'e'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)
        user = msg.author;
        var room = await msg.client.database.dungeon_cache.getRoom()
        emb.setFooter("Dungeon: " + room.NAME)
        var A = await msg.client.database.player_cache.getConfig(user.id);

        let CacheSword = (await msg.client.database.item_cache.getConfig(A.WEAPON)).ATK;
        if (!CacheSword) CacheSword = 0;
        let CacheHP = parseInt(A.HP) + parseInt(calcLevel(A.XP));
        let CacheShield = (await msg.client.database.item_cache.getConfig(A.SHIELD)).DEV;
        if (!CacheShield) CacheShield = 0;

        let player = {
            ATK: parseInt(CacheSword),
            DEF: parseInt(CacheShield),
            HP: parseInt(CacheHP)
        }

        let line = (room.LINE).split(/ +/);
        let L = (room.LINE).replace(/H/i, "♻️").replace(/E/i, "🎁").replace(/[0-9]/g, "🔸")
        let progress = L.split(/ +/)
        emb.setTitle(L)
        let i = true
        let text = ""

        const m = await msg.channel.send(emb)
        while (i) {
            let obj = line.shift()

            if (obj == "E") {
                i = false
                text += "\n**Dungeon beendet**"
                return msg.channel.send(emb.setDescription(text).setColor(colors.success))
            } else if (obj == "H") {
                player.HP += 20
                text += "---- Heal **+20** ---- \n"
                progress.shift()
                progress.push("➕")
            } else {
                let monster = await msg.client.database.monster_cache.getConfig(obj);
                if (!monster) monster = await msg.client.database.monster_cache.getConfig(parseInt(obj))

                let R = await fight(msg, player, obj)
                if (!R.value) {
                    i = false
                    emb.setAuthor(R.runden == 1 ? `${R.runden} Runde` : `${R.runden} Runden`)
                    return msg.channel.send(emb.setColor(colors.error).setDescription("**Das Monster war wohl zu stark für dich qwq**"))
                }
                progress.shift()
                progress.push("▪️")
                text += line.length + `. **Monster:** ${monster.ATK} - ${monster.DEV} - ${monster.HP} \n`
                emb.setTitle(progress.join(" "))
                    .setDescription(text)
                    .setColor(colors.success)
                m.edit(emb)
            }
        }
    }
};
/**
 * @param {number} id Item ID
 * @param {object} player Item ID
 * @returns {object}  User
 */
async function fight(msg, player, id) {
    let monster = await msg.client.database.monster_cache.getConfig(id);
    if (!monster) monster = await msg.client.database.monster_cache.getConfig(parseInt(id));

    var enemy = {
        ATK: parseInt(monster.ATK),
        DEF: parseInt(monster.DEV),
        HP: parseInt(monster.HP)
    }
    var res = {
        runden: 0,
        HP: player.HP,
        value: false
    }

    let r = 0;
    if (monster.DEV > player.ATK) {
        res.value = false
        return res
    } // wenn dev zu hoch für dich

    if (player.DEF > enemy.ATK) {
        res.value = true
        return res
    } // wenn dev zu hoch für das monster

    var Damage = player.ATK - enemy.DEF;
    if (Damage > enemy.HP) {
        r = true
        return r
    }
    var PDamage = enemy.ATK - player.DEF;
    if (PDamage > player.HP) {
        r = false
        return r
    }

    // if (Math.sign(Damage) == -1) Damage = 1

    while (player.HP > 0 && enemy.HP > 0) {
        enemy.HP -= Damage;
        player.HP -= PDamage;
        r = r + 1;
    }
    res.runden = r

    if (enemy.HP <= 0) { res.value = true }

    if (player.HP <= 0) { res.value = false }
    return res
}