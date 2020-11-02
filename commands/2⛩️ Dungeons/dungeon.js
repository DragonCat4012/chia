const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');

module.exports = {
    name: 'dungeon',
    syntax: 'dungeon <id>',
    args: true,
    description: 'Zeigt dir informationen über einen Dungeon',
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
        var dungeon = await msg.client.database.dungeon_cache.findRoom(args[0]);
        if (!dungeon) return msg.channel.send(emb.setDescription('**Kein Raum mit dieser ID gefunden**').setColor(colors.error))

        emb.setTitle(dungeon.NAME)
        let line = (dungeon.LINE).split(/ +/);
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
                let monster = await msg.client.database.monster_cache.getConfig(obj);
                if (!monster) monster = await msg.client.database.monster_cache.getConfig(parseInt(obj))
                progress.push(`▪🔸 ${monster.NAME} [${monster.ATK}/${monster.DEV}]`)
            }
        }
    }
};