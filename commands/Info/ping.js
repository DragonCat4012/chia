
const { Message } = require('discord.js');
const { newEmb } = require('../utilities');

module.exports = {
    name: 'Ping',
    syntax: 'ping',
    args: false,
    description: 'Zeigt dir deinen Ping',
    commands: ['ping'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
       
        
  
    
        let emb = newEmb(msg)
          .setTitle("Pong!")
          const m = await msg.channel.send(emb);

          m.edit(emb.setDescription(
            `Pong! Latency is ${new Date() - m.createdTimestamp}ms. API Latency is ${Math.round(
              msg.client.ws.ping
            )}ms`)
          );

    }
};