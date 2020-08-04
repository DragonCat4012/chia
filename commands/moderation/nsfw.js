
const { Message } = require('discord.js');
const { newEmb } = require('../utilities');

module.exports = {
    name: 'NSFW',
    syntax: 'nsfw <#channel>',
    args: false,
    description: 'Ändert die NSFW Einstellung eines Kanals',
    perm: 'MANAGE_CHANNELS',
    commands: ['nsfw', 'sfw'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg, args) {
        let emb = newEmb(msg)
        
        var channel = msg.mentions.channels.first();
        if (!channel) channel = msg.channel;
        if(!channel.type == "text") return msg.channel.send(emb.setTitle("Das ist kein Text Channel qwq"))

        if (channel.nsfw) {
          channel.setNSFW(false);
  
          emb.setTitle("Kanal geändert")
          .addField("**Channel:**", msg.channel)
            .addField(`**Zustand:**`, `SFW :white_check_mark:`)
            msg.channel.send(emb);
        } else {
            channel.setNSFW(true);
    
            emb.setTitle("Kanal geändert")
            .addField("**Channel:**", msg.channel)
            .addField(`**Zustand:**`, `NSFW :underage:`);
            msg.channel.send(emb)
        }
      
        
    }
};