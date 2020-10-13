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
        console.log(line)

        let L = (room.LINE).replace(/H/i, "♻️").replace(/E/i, "🎁").replace(/[0-9]/g, "🔸")
        msg.channel.send(L)

        let i = true
        while (i) {
            let obj = line.shift()
            if (obj == "E") {
                return msg.channel.send("End")
                i = false
            } else if (obj == "H") {
                player.HP += 20
                msg.channel.send("Heal")
            } else {
                fight(player, obj)
                msg.channel.send("Monster")
            }
        }

        return

        if (E_Lifes <= 0) {
            let arr = [];
            return msg.channel.send(emb.setTitle("Sieg").setDescription(arr.join("\n") + `${Dropped}`).setColor(colors.success))
        }

        if (P_Lifes <= 0) {
            return msg.channel.send(emb.setTitle("Niederlage"))
        }
    }
};

async function fight(player, id) {
    let monster = await msg.client.database.monster_cache.getEnemy(id);
    let enemy = {
        ATK: monster.ATK,
        DEF: monster.DEV,
        HP: monster.HP
    }
    let r = 0;
    if (monster.DEV > player.ATK) return false // wenn dev zu hoch für dich

    var Damage = player.ATK - enemy.DEV;
    var PDamage = enemy.ATK - player.DEF;
    // if (Math.sign(Damage) == -1) Damage = 1

    while (player.HP > 0 && enemy.HP > 0) {
        enemy.HP -= Damage;
        player.HP -= PDamage;
        r = r + 1;
    }
    emb.setFooter(r + (r > 1 ? " Runden" : "Runde"))


}