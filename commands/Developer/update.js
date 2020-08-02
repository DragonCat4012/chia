const { Message, Discord } = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');
//const { prefix, token, owner } = require("../config.json");

module.exports = {
  name: 'update',
  syntax: 'update',
  args: false,
  description: 'der aktuelle Update bericht!!',
  commands: ['update'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg, args) {



    let emb = newEmb(msg)
   
      .setTitle("Bot Update 15.07 ")
      .addField("**Datenbank**", "Die Server Datenbank geht nun, Prefix kann z.B. geändert werden")
      .addField("**Moderation**", "der clear cmd wurde üebrarbeitet, die restlichen cmd brauhcne noch eine weile")
      .addField("**Version:**", "Der Bot wird weiterhin auf Discord.js V12 geupdated!")
.addField("**weitere pläne:**", "Datenbank für die user, wilkommensnachricht fertig machen")

    msg.channel.send(emb);

  }
};