
const { Message } = require('discord.js');
const { newEmb } = require('../utilities');

module.exports = {
    name: 'Gayrate',
    syntax: 'gayrate [@user]',
    args: false,
    description: 'Zeigt wie gay du bist :smirk:',
    commands: ['gayrate','rate'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg) {
       
        let user;
        if (msg.mentions.users.first()) {
          user = msg.mentions.users.first();
        } else {
          user = msg.author;
        }
    
        if (!user)
          return msg.channel.send(emb.setTitle(
            "Bitte gebe einen Nutzer an der gescannt werden soll!")
          );
    
        const randomnumber = Math.floor(Math.random() * 101);
    
        let emb = newEmb(msg)
          .setDescription(`:smirk: ${user} ist zu ${randomnumber}% gay! :gay_pride_flag:`)
          .setTitle("Gay Rate")
          msg.channel.send(emb)

    }
};