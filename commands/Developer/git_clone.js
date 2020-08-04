const { Message } = require('discord.js');
var { exec } = require('child_process');
const { colors, confirmAction, newEmb } = require('../utilities');

module.exports = {
  name: 'Git Update',
  syntax: 'git-update',
  args: false,
  description: 'Updates The Bot',
  perm: 'ADMINISTRATOR',
  commands: ['git', 'git-update', 'update'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg, args) {
    confirmAction(msg, 'Willst du den Bot wirklich updaten via Git?', async () => {
      exec("ls", function (error, stdout, stderr) {
        msg.channel.send(newEmb(msg)
        .setTitle("Cloned Git, Results")
        .addField("**Error:**", `\`${error.message}\``)
        .addField("**Stdout:**", stdout)
        .addField("**Stderr:**", stderr)
        )
      });
    }, () => {

    })
  }
};