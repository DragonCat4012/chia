
const { Message } = require('discord.js');
const { newEmb } = require('../utilities');

module.exports = {
    name: 'uptime',
    syntax: 'uptime>',
    args: false,
    description: 'zeigt iwe lang ich schon obline bin uwu',
    commands: ['uptime'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg) {

        const date = new Date(msg.client.uptime);
        const days = date.getUTCDate() - 1,
            hours = date.getUTCHours(),
            minutes = date.getUTCMinutes(),
            seconds = date.getUTCSeconds();

        let segments = [];

        if (days > 0) segments.push(days + ' Tage' + ((days == 1) ? '' : 's'));
        if (hours > 0) segments.push(hours + ' Stunden' + ((hours == 1) ? '' : 's'));
        if (minutes > 0) segments.push(minutes + ' Minuten' + ((minutes == 1) ? '' : 's'));
        if (seconds > 0) segments.push(seconds + ' Sekunden' + ((seconds == 1) ? '' : 's'));
        const timeString = segments.join(', ');

        let emb = newEmb(msg)
            .setTitle(timeString)
        emb.footer = undefined;
        emb.timestamp = undefined;
        msg.channel.send(emb);




    }



};
