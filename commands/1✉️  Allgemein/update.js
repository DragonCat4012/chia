const { Message } = require('discord.js');
const { colors, rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'update',
    syntax: 'update',
    args: false,
    description: 'Zeigt dir meien neusten Änderungen',
    type: 'ALLGEMEIN',
    commands: ['update'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)

        let text;
        text = `${emotes.staff} **Fixed** ${emotes.staff}\n` +
            "• explore\n• fight\n• inventory\n\n" +
            `${emotes.plus} **Added** ${emotes.plus} \n` +
            "• dungeons\n• weekly\n• daily\n• dungeon\n• update\n• Ausdauer System\n• start cmd\n• prefix\• level\n\n"
            //   `:warning:  **Removed** :warning: \n` +
            // "• Ticket System\n• 20 nsfw cmds"
        emb.setDescription(text)
            .addField('**Start Cmd**', 'Über den start-cmd kann nun ein Profil erstellt werden. Ohne Profil sind Econemy und Dungeon cmds nciht verfügbar')
            .addField('**Einstellungen**', 'für jeden Server kann nun ein eigenes Prefix eingetsellt und die Levelup Nachricht muss explizit aktiviert werden')

        msg.channel.send(emb.setTitle("Update 2.1 [01.12]"))
    }
};