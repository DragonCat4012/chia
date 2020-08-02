const { Message } = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');
//const { prefix, token, owner } = require("../config.json");

module.exports = {
  name: 'roleinfo',
  syntax: 'roleinfo <@Role>',
  args: true,
  description: 'Zeigt dir Informationen zu einer Rolle!',
  commands: ['roleinfo', 'rinfo'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg, args) {

    let role = msg.mentions.roles.first();
    let emb = newEmb(msg)
      .setTitle("Bitte gib einen Rolle an deren Infos ich dir zeigen soll");

    if (!role) return msg.channel.send(emb);


    if (role.mentionable === false) {
      var mention = ":x: ";
    } else {
      var mention = ":white_check_mark:";
    }

    if (role.hoist === false) {
      var hoist = ":x: ";
    } else {
      var hoist = ":white_check_mark:";
    }

    if (role.permissions.has('ADMINISTRATOR')) {
      var perm = ":white_check_mark:";
    } else {
      var perm = ":x: ";
    }

    let count = role.members.size;

    emb.addField("**Name:**", role, true)
      .addField("**ID:**", role.id, true)
      .addField(`**Farbe:**`, role.hexColor, true)

      .addField("**Gruppieren:**", hoist, true)
      .addField("**Erwähnbar:**", mention, true)
      .addField("**Adminrolle:**", perm, true)

      .addField("**User Count:**", count, true)
      .addField("**Erstellt:**", role.createdAt, true)
      .addField("**Position:**", role.position, true)

      .setTimestamp()
      .setColor(red)
    msg.channel.send(emb);

  }
};
