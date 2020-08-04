
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

      if (days > 0) segments.push(days + ' Tag' + ((days == 1) ? '' : 'e'));
        if (hours > 0) segments.push(hours + ' Stunde' + ((hours == 1) ? '' : 'n'));
        if (minutes > 0) segments.push(minutes + ' Minute' + ((minutes == 1) ? '' : 'n'));
        if (seconds > 0) segments.push(seconds + ' Sekunde' + ((seconds == 1) ? '' : 'n'));        
const timeString = segments.join(', ');

        let emb = newEmb(msg)
            .setTitle(timeString)
.setColor('0x2C2F33')
        emb.footer = undefined;
        emb.timestamp = undefined;
        msg.channel.send(emb);




    }



};
