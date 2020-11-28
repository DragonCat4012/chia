const { Message } = require('discord.js');
const { colors, rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'update',
    syntax: 'update',
    args: false,
    description: 'Zeigt dir meien neusten Änderungen',
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
            "• dungeons\n• dungeon\n• update\n• Ausdauer System\n\n"
            //   `:warning:  **Removed** :warning: \n` +
            // "• Ticket System\n• 20 nsfw cmds"
        emb.setDescription(text)

        msg.channel.send(emb.setTitle("Update 1.3 [28.11]"))
    }
};