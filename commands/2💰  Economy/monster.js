const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');
const allMontser = require('../../monster.json')

module.exports = {
    name: 'monster',
    syntax: 'monster',
    args: false,
    description: 'Zeigt dir alle Monster',
    type: 'ECONEMY',
    commands: ['monster', 'm'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let emb = rawEmb(msg).setTitle("[ATK/DEF] healthPoints Monster ").setFooter(allMontser.length + " Monster insgesamt")
        text = ""
        let arr = []

        for (let monster of allMontser) {
            if (monster.rare == "1") {
                arr.push(`**${monster.id} -** [${monster.ATK}/${monster.DEF}] ❤️${monster.healthPoints} ⭐ **${monster.name}**`)
            } else if (monster.rare == "2") {
                arr.push(`**${monster.id} -** [${monster.ATK}/${monster.DEF}] ❤️${monster.healthPoints} ⭐⭐ **${monster.name}**`)
            } else if (monster.rare == "3") {
                arr.push(`**${monster.id} -** [${monster.ATK}/${monster.DEF}] ❤️${monster.healthPoints} ⭐⭐⭐ **${monster.name}**`)
            } else if (monster.rare == "4") {
                arr.push(`**${monster.id} -** [${monster.ATK}/${monster.DEF}] ❤️${monster.healthPoints} 🌟 **${monster.name}**`)
            } else {
                arr.push(`**${monster.id} -** [${monster.ATK}/${monster.DEF}] ❤️${monster.healthPoints} 🌟🌟 **${monster.name}**`)
            }
        }
        let page = Math.round(arr.length / 200)
        if (page > 1) {
            for (let num = page; num > 1; num -= 1) {
                let B = arr.slice(0, 55)
                let shift = 55;
                B = B.map(v => "[" + v.ATK + "/" + v.DEF + "] " + v.name + " [" + v.rare + "]").join(" \n")
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