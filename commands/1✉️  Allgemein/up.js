const { Message } = require('discord.js');
const { colors, rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'up',
    syntax: 'up',
    args: false,
    description: 'Bin ich online.....?',
    commands: ['up'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)

        const date = new Date(msg.client.uptime);
        const days = date.getUTCDate() - 1,
            hours = date.getUTCHours(),
            minutes = date.getUTCMinutes(),
            seconds = date.getUTCSeconds();

        let segments = [];
        if (days > 0) segments.push(days + ' Tag' + ((days == 1) ? '' : 'e'));
        if (hours > 0) segments.push(hours + ' Stunde' + ((hours == 1) ? '' : 'n'));
        if (minutes > 0) segments.push(minutes + ' Minute' + ((minutes == 1) ? '' : 'n'));
        if (seconds > 0) segments.push(seconds + ' Sekunde' + ((seconds == 1) ? '' : 'n'));
        const timeString = segments.join(', ');

        /*    let text;
            text = `${emotes.staff} **Fixed** ${emotes.staff}\n` +
                "• explore\n • fight\n • inventory\n\n" +
                `${emotes.plus} **Added** ${emotes.plus} \n` +
                "• dungeons\n • dungeon\n\n"
                //   `:warning:  **Removed** :warning: \n` +
                // "• Ticket System\n• 20 nsfw cmds"
            emb.setDescription(text)
    
            msg.channel.send(emb.setTitle("Update 1.2 [02.10]"))
            msg.delete().catch();
            msg.channel.send("||<@everyone>||").catch()
    */

        emb.setColor(colors.nothing)
        emb.setTitle(`Ja ich bin Online ${emotes.yeah} \n${timeString}`)

        msg.channel.send(emb);
    }
};