const { Message } = require('discord.js');
var { exec } = require('child_process');
const { colors, confirmAction, newEmb } = require('../utilities');

module.exports = {
  name: 'Git Update',
  syntax: 'git-update',
  args: false,
  description: 'Updates The Bot',
  perm: 'DEVELOPER',
  commands: ['git', 'git-update', 'update'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg, args) {
    exec("git pull", function (error, stdout, stderr) {
      let emb = newEmb(msg).setTitle("Cloned from Git, Results:");
      if (error != null) emb.addField("**Error:**", "```" + error.message + "```");
      if (stdout != "") emb.addField("**Stdout:**", "```" + stdout + "```");
      if (stderr != "") emb.addField("**Stderr:**", "```" + stderr + "```");

      msg.channel.send(emb);
    });
  }
};