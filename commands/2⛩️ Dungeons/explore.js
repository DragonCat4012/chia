const { Message } = require('discord.js');
const { rawEmb, emotes, calcLevel, colors } = require('../utilities');

module.exports = {
    name: 'explore',
    syntax: 'explore',
    args: false,
    description: 'Kämpfe in Dungeons',
    cooldwon: 20,
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
        var A = await msg.client.database.player_cache.getConfig(user.id);
        var room = await msg.client.database.dungeon_cache.findRoom(A.DUNGEON)
        emb.setFooter(`Dungeon: ${room.NAME} || ID: ${room.DID}`)
        let CacheSword = 0;
        let CacheShield = 0;


        if (A.STAMINA <= 5) {
            emb.setDescription('**Du benötigst 5 Ausdauer zum kämpfen. Diese werden jeden Tag zurück gesetzt, bitte warte bis deine Ausdauer wieder aufgefüllt ist**')
            return msg.channel.send(emb.setColor(colors.error))
        }

        if (parseInt(A.WEAPON) !== 0) {
            let Item = await msg.client.database.item_cache.getConfig(A.WEAPON)
            if (Item) CacheSword = Item.ATK
        }
        if (parseInt(A.SHIELD) !== 0) {
            Item = await msg.client.database.item_cache.getConfig(A.SHIELD)
            if (Item) CacheShield = Item.DEV
        }
        let CacheHP = parseInt(A.HP) + parseInt(calcLevel(A.XP));

        let player = {
            ATK: parseInt(CacheSword),
            DEF: parseInt(CacheShield),
            HP: parseInt(CacheHP)
        }

        if (player.ATK < 7 || player.DEF < 7) {
            emb.setDescription('**Trainiere lieber noch ein bisschen, die Monster hier sind sonst zu stark für dich**')
                .setFooter('Nutze dafür z.B. -hunt und jage schwächere monster')
            return msg.channel.send(emb.setColor(colors.error))
        }

        player.STAMINA -= 5;
        await player.save()

        let line = (room.LINE).split(/ +/);
        let L = (room.LINE).replace(/H/i, "♻️").replace(/E/i, "🎁").replace(/[0-9]/g, "🔸")
        let progress = L.split(/ +/)
        emb.setTitle(L)
        let i = true
        let text = ""
        const m = await msg.channel.send(emb).catch()
        setTimeout(() => {}, 4000)

        while (i) {
            let obj = line.shift()

            if (obj == "E") {
                i = false
                text += "\n**Dungeon beendet**"
                let newroom = await msg.client.database.dungeon_cache.findRoom(parseInt(A.DUNGEON) + 1)
                if (newroom) A.DUNGEON = parseInt(A.DUNGEON) + 1
                await A.save()
                return msg.channel.send(emb.setDescription(text).setColor(colors.success)).catch()
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
                    return msg.channel.send(emb.setColor(colors.error).setDescription("**Das Monster war wohl zu stark für dich qwq**")).catch()
                }
                progress.shift()
                progress.push("▪️")
                text += line.length + `. **Monster:** [${monster.ATK}/${monster.DEV}] :heart_exclamation:${monster.HP}\n`
                emb.setTitle(progress.join(" "))
                    .setDescription(text)
                    .setColor(colors.success)
                m.edit(emb).catch()
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

    if (Math.sign(Damage) == -1) Damage = Damage = 1

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