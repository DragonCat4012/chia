const { Message } = require('discord.js');
const { rawEmb, emotes, getAnswer, calcLevel, colors } = require('../utilities');

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
        //  return msg.channel.send("Dieser cmd ist egrade in arbeit qwq")
        let emb = rawEmb(msg)
        user = msg.author;
        var room = await msg.client.database.dungeon_cache.getRoom()
        var A = await msg.client.database.player_cache.getConfig(user.id);

        let CacheSword = (await msg.client.database.item_cache.getConfig(A.WEAPON)).ATK;
        if (!CacheSword) CacheSword = 0;
        let CacheHP = A.HP + parseInt(calcLevel(A.XP));
        let CacheShield = (await msg.client.database.item_cache.getConfig(A.SHIELD)).DEV;
        if (!CacheShield) CacheShield = 0;

        let player = {
            ATK: CacheSword,
            DEF: CacheShield,
            HP: CacheHP
        }

        let line = (room.LINE).split(/ +/);
        let L = (room.LINE).replace(/H/i, "♻️").replace(/E/i, "🎁").replace(/[0-9]/g, "🔸")
        emb.setTitle(L)
        let i = true

        while (i) {
            let progress = line;
            let obj = line.shift()

            if (obj == "E") {
                i = false
                return msg.channel.send("End")
            } else if (obj == "H") {
                player.HP += 20
                msg.channel.send("Heal")
                line.unshift("➕")
            } else {
                let R = await fight(msg, player, obj)
                console.log(R)
                if (!R.value) {
                    i = false
                    emb.setFooter(R.runden == 1 ? `${R.runden} Runde` : `${R.runden} Runden`)
                    return msg.channel.send(emb.setColor(colors.error).setDescription("**Das Monster war wohl zu stark für dich qwq**"))
                }
                line.unshift("▪️")
                emb.setTitle(line)
            }
        }

        return msg.channel.send(emb.setTitle("Dungeon closed"))
    }
};

async function fight(msg, player, id) {
    let monster = await msg.client.database.monster_cache.getConfig(id);
    if (!monster) await msg.client.database.monster_cache.getConfig(parseInt(id));
    console.log(monster)
    let enemy = {
        ATK: monster.ATK,
        DEF: monster.DEV,
        HP: monster.HP
    }
    let res = {
        runden: 0,
        value: false
    }

    let r = 0;
    if (monster.DEV > player.ATK) {
        res.value = false
        console.log("DEf")
        return res
    } // wenn dev zu hoch für dich

    var Damage = player.ATK - enemy.DEF;
    var PDamage = enemy.ATK - player.DEF;
    console.log(player)
    console.log(enemy)
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