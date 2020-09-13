const { Message } = require('discord.js');
const { colors, rawEmb } = require('../utilities');

module.exports = {
    name: 'up',
    syntax: 'up',
    args: false,
    description: 'Bin ich online.....?',
    perm: 'DEVELOPER',
    commands: ['up'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)
        emb.setColor(colors.nothing)
        emb.setTitle("Online")

        msg.channel.send(emb);
    }
};