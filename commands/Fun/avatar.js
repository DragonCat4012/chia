
const { Message } = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');

module.exports = {
    name: 'Avatar',
    syntax: 'avatar <@user>',
    args: false,
    description: 'Gibt dir den Avatar eiunes Nutzers',
    commands: ['avatar'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg, args) {
        
        let user = msg.mentions.users.first();
   if (!user) user = msg.author;
  

    let emb = newEmb(msg)
      .setImage(user.avatarURL)
      .setTimestamp()
   
       msg.channel.send(emb.setTitle('Avatar'))
        
    }
};