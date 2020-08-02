const { Message } = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');
//const { prefix, token, owner } = require("../config.json");


module.exports = {
  name: 'channelinfo',
  syntax: 'channelinfo <#Channel>',
  args: true,
  description: 'Zeigt dir Informationen zu einem Channel!',
  commands: ['channelinfo', 'chinfo'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg, args) {

    let channel = msg.mentions.channels.first();
    let emb = newEmb(msg)
      .setTitle("Bitte gib einen Channel an dessen Infos ich dir zeigen soll");

    if (!channel) return msg.channel.send(emb);

    if (channel.nsfw === false) {
      var fw = ":x: ";
    } else {
      var fw = ":white_check_mark:";
    }


    emb.addField("**Name:**", channel, true)
      .addField("**ID:**", channel.id, true);
    if (!channel.parentID) {
      emb.addField(`**Kategorie:**`, `Unkategorisiert`, true);
    } else {
      emb.addField(`**Kategorie:**`, `<#${channel.parentID}>`, true);
    }

    emb
      .addField("**Typ:**", channel.type, true)
      .addField("**Erstellt:**", channel.createdAt, true)
      .addField("**Position:**", channel.position + 1, true)
      .addField("**NSFW:**", fw, true)

      .setTimestamp()
    msg.channel.send(emb);

  }
};