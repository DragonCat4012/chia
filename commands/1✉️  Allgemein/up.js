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
        emb.setColor(colors.nothing)
        emb.setTitle("Ja ich bin Online " + emotes.yeah)

        msg.channel.send(emb);
    }
};