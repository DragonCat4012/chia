const { Message } = require('discord.js');
var { exec } = require('child_process');
const { colors, confirmAction, newEmb } = require('../utilities');

module.exports = {
  name: 'Exec',
  syntax: 'exec <command>',
  args: true,
  description: 'Executes a command on the host machine',
  perm: 'DEVELOPER',
  commands: ['exec', 'execute'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg, args) {
    var command = args.join(' ');

    exec(command, function (error, stdout, stderr) {
      let emb = newEmb(msg).setTitle("Executed Command:");
      emb.addField("**Command:**", command);
      if (error != null) emb.addField("**Error:**", "```" + error.message + "```");
      if (stdout != "") emb.addField("**Stdout:**", "```" + stdout + "```");
      if (stderr != "") emb.addField("**Stderr:**", "```" + stderr + "```");

      msg.channel.send(emb);
    });
  }
};