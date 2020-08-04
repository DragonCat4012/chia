const { Message, Discord } = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');
//const { prefix, token, owner } = require("../config.json");

module.exports = {
  name: 'update',
  syntax: 'update',
  args: false,
  description: 'der aktuelle Update bericht!!',
  perm: 'ADMINISTRATOR',
  commands: ['update'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg, args) {



    let emb = newEmb(msg)
   
      .setTitle("Bot Update 03.08. ")
      .addField("**Welcome Message etc.**", "Wilkomemns und verabscheidunsgnachrihcten funktionieren nun :tada:")
      .addField("**XP System**", "Datenbank struktur für Econemy und Level System wurden erstellt")
      .addField("**Online Zeit:**", "Der Bot wird nun wieder dauerhaft online sien OvO")
	.addField("**weitere pläne:**", "Moderations Cmd übernehmen, verwarnungsystem, level system")

    msg.channel.send(emb);

  }
};