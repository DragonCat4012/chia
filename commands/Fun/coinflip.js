
const { Message } = require('discord.js');
const { newEmb } = require('../utilities');

module.exports = {
    name: 'Coinflip',
    syntax: 'flip',
    args: false,
    description: 'Wirft eine münze',
    commands: ['coinflip','flip'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg) {
       
        function doRandHT() {
            var rand = ["Kopf!", "Zahl!"];
            return rand[Math.floor(Math.random() * rand.length)];
          }

          let emb = newEmb(msg)
          .setTitle(doRandHT())
          .setFooter('\u200b')
            msg.channel.send(emb)
       
    }
};