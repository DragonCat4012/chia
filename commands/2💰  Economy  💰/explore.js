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

        let CacheSword = await msg.client.database.item_cache.getItem(A.SWORD);
        if (!CacheSword) CacheSword = 0;
        let CacheHP = A.HP + parseInt(calcLevel(A.XP));
        let CacheShield = await msg.client.database.item_cache.getItem(A.SHIELD);
        if (!CacheShield) CacheShield = 0;

        let player = {
            ATK: CacheSword,
            DEF: CacheShield,
            HP: CacheHP
        }

        let line = (room.LINE).split(/ +/);
        // console.log(line)

        let L = (room.LINE).replace(/H/i, "♻️").replace(/E/i, "🎁").replace(/[0-9]/g, "🔸")
        msg.channel.send(emb.setTitle(L))

        let i = true
        let arr = []
        while (i) {
            let obj = line.shift()
            if (obj == "E") {
                return msg.channel.send("End")
                i = false
            } else if (obj == "H") {
                player.HP += 20
                msg.channel.send("Heal")
            } else {
                //  console.log(await fight(msg, player, obj))
                let R = await fight(msg, player, obj)
                console.log(R)
                return
                if (!R.value) {
                    i = false
                    return msg.channel.send(emb.setColor(colors.error).setDescription("**Das Monster war wohl zu stark für dich qwq**"))
                }
                // console.log(res)
                // arr.join(`Ergebnis${}: ` + +` Runden: ${}`)
                //   msg.channel.send("Monster")
            }
        }

        return msg.channel.send(emb.setTitle("Dungeon closed"))
    }
};

async function fight(msg, player, id) {
    let monster = await msg.client.database.monster_cache.getEnemy(id);
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
        return res
    } // wenn dev zu hoch für dich

    var Damage = player.ATK - enemy.DEV;
    var PDamage = enemy.ATK - player.DEF;
    // if (Math.sign(Damage) == -1) Damage = 1

    while (player.HP > 0 && enemy.HP > 0) {
        enemy.HP -= Damage;
        player.HP -= PDamage;
        r = r + 1;
    }
    res.runden = r

    if (enemy.HP <= 0) {
        res.value = true
        return res
    }
    if (player.HP <= 0) {
        res.value = false
        return res
    }
}