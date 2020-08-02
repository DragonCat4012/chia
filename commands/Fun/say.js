
const { Message } = require('discord.js');
const { newEmb } = require('../utilities');

module.exports = {
    name: 'say',
    syntax: 'say <Message>',
    args: true,
    description: 'sagt etwas für dich',
    commands: ['say'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg, args) {
       
        const sayMessage = args.join(" ");
        msg.delete().catch();
    
        let emb = newEmb(msg)
          .setTitle(msg.author.username)
          .setDescription(sayMessage);
          emb.footer = undefined;
          emb.timestamp = undefined;
         msg.channel.send(emb);

      
    

  }

        

    };
