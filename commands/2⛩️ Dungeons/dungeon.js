const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');
const monsterArray = require('../../monster.json')
const dungeonArray = require('../../dungeons.json')

module.exports = {
    name: 'dungeon',
    syntax: 'dungeon <id>',
    args: true,
    description: 'Zeigt dir informationen über einen Dungeon',
    cooldown: 5,
    type: 'DUNGEONS',
    commands: ['dungeon'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)
        if (!args[0] || isNaN(args[0])) return msg.channel.send(emb.setDescription('**Achte bitte auf den Syntax! Du musst eine ID angeben**').setColor(colors.error))
        var dungeon = (dungeonArray.filter(m => m.id == args[0])).shift()
        if (!dungeon) return msg.channel.send(emb.setDescription('**Kein Raum mit dieser ID gefunden**').setColor(colors.error))

        emb.setTitle("Dungeon: " + dungeon.name).setFooter(`ID: ${dungeon.id}`)
        let line = (dungeon.line).split(/ +/);
        let i = true;
        let progress = []

        while (i) {
            let obj = line.shift()

            if (obj == "E") {
                i = false
                progress.push(`🎁 Belohnung`)
                return msg.channel.send(emb.setDescription(progress.join('\n'))).catch()
            } else if (obj == "H") {
                progress.push(`♻️ Healing +20`)
            } else {
                let monster = (monsterArray.filter(m => m.name.toLowerCase() == obj.toLowerCase())).shift()
                if (monster) progress.push(`🔸 ${monster.name} [${monster.ATK}/${monster.DEF}]`)
                if (!monster) progress.push(`🔸 Name [0/0]`)
            }
        }
    }
};