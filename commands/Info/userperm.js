const { Message } = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');
//const { prefix, token, owner } = require("../config.json");

const moment = require("moment");


module.exports = {
  name: 'userperm',
  syntax: 'userperm <@user>',
  args: false,
  description: 'Zeigt dir Berechtigungen eines Nutzers auf dem Server!',
  commands: ['userperm', 'uperm'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg, args) {

    let user;
    if (msg.mentions.users.first()) {
      user = msg.mentions.users.first();
    } else {
      user = msg.author;
    }
    var member = msg.guild.member(user);

    let emb = newEmb(msg)

      .addField("Name", user.username, true)
      .addField(`Tag`, user.discriminator, true)
      .addField("ID", user.id, true)

      .addField("Nickname", `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
      .addField("Status", `${user.presence.status}`, true)
      .addField("Bot:", `${user.bot}`, true)

      .addField('Roles:', member.roles ? member.roles.cache.map(r => `${r}`).join(' | ') : "", true)
      .addField('Berechtigungen:', msg.member.permissions.toArray().map(p => p).join('  |  ') + "")
      .setTimestamp()
    msg.channel.send(emb);

  }
};






