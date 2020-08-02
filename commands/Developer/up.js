const {Message} = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');


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
    execute(msg, args) {


        let emb = newEmb(msg)
        .setTitle("Sure, bin offline uwu");
        msg.channel.send(emb);

    }
};
