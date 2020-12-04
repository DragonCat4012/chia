const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'monster',
    syntax: 'monster',
    args: false,
    description: 'Zeigt dir alle Monster',
    cooldown: 10,
    type: 'ECONEMY',
    commands: ['monster', 'm'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        var dungeon = await msg.client.database.monster_cache.getMonsters();
        let emb = rawEmb(msg).setTitle("[ATK/DEF] HP Monster ").setFooter(dungeon.length + " Monster insgesamt")

        text = ""
        let arr = []
        for (let MID of dungeon) {
            var monster = await msg.client.database.monster_cache.getConfig(MID.MID);
            if (!monster) console.log("Failure by detecting monster")
            if (monster.RARE == "1") {
                arr.push(`**${monster.id} -** [${monster.ATK}/${monster.DEV}] ❤️${monster.HP} ⭐ **${monster.NAME}**`)
            } else if (monster.RARE == "2") {
                arr.push(`**${monster.id} -** [${monster.ATK}/${monster.DEV}] ❤️${monster.HP} ⭐⭐ **${monster.NAME}**`)
            } else if (monster.RARE == "3") {
                arr.push(`**${monster.id} -** [${monster.ATK}/${monster.DEV}] ❤️${monster.HP} ⭐⭐⭐ **${monster.NAME}**`)
            } else if (monster.RARE == "4") {
                arr.push(`**${monster.id} -** [${monster.ATK}/${monster.DEV}] ❤️${monster.HP} 🌟 **${monster.NAME}**`)
            } else {
                arr.push(`**${monster.id} -** [${monster.ATK}/${monster.DEV}] ❤️${monster.HP} 🌟🌟 **${monster.NAME}**`)
            }
        }
        let page = Math.round(arr.length / 200)
        if (page > 1) {
            for (let num = page; num > 1; num -= 1) {
                let B = arr.slice(0, 55)
                let shift = 55;
                B = B.map(v => "[" + v.ATK + "/" + v.DEV + "] " + v.NAME + " [" + v.RARE + "]").join(" \n")
                if (shift > 0) {
                    arr.shift()
                    shift -= 1;
                }
                emb.setDescription(B)
                msg.channel.send(emb)
            }
        } else {
            emb.setDescription(arr.join(" \n"))
            return msg.channel.send(emb)
        }
    }
};