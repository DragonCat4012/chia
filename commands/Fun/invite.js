
const { Message } = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');

module.exports = {
    name: 'Invite',
    syntax: 'invite <server-id>',
    args: true,
    description: 'Gibt dir den Invite eines servers',
    commands: ['invite'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute (msg, args) {
        
      let emb = newEmb(msg)
      .setTimestamp()
      
      if (!args[0]) {
      return msg.channel.send(emb.setTitle('Du musst eine Server ID angeben!'))
    }

    let guild = msg.client.guilds.cache.array().find(g => g.id == args[0]);

    if (guild == undefined) {
      return msg.channel.send(emb.setTitle('Diesen server konnte ich leider nicht finden qwq'))
    }

    let text_channel = guild.channels.cache.array().filter(ch => ch.type == "text")[0];

    if (text_channel == undefined) {
      msg.channel.send(emb.setTitle('Kein Channel zum einladen gefunden qwq'))
    }

    let invite = await text_channel.createInvite({
      maxAge: 100,
      maxUses: 1
    }).catch(console.log);

    emb.addField(`${invite.url}`, '\u200b' )
  

    
   
       msg.channel.send(emb.setTitle('Guild Invite (ID)'))
        
    }
};