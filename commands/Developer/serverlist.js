const { Message } = require('discord.js');
const { newEmb } = require('../utilities');
const { dev } = require("./debug.json");

module.exports = {
  name: 'serverlist',
  syntax: 'serverlist',
  args: false,
  description: 'Eine liste aller server auf denen ich bin mit deren id, damit du sie finden kannst UwU',
  perm: 'DEVELOPER',
  commands: ['serverlist', 'slist'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg) {
    // const { prefix, token, owner } = msg.client.config;

    let emb = newEmb(msg).setTitle('Serverlist');

    let names = msg.client.guilds.cache.map(g => g.name);
    let ids = msg.client.guilds.cache.map(g => g.id);
    let created = msg.client.guilds.cache.map(g => g.createdAt.toLocaleDateString("de-DE"));
    let joinedAt = msg.client.guilds.cache.map(g => g.joinedAt.toLocaleDateString("de-DE"));

    for (let i = 0; i < names.length; i++) {
      emb.addField(`**${names[i]}**`, ` \`${ids[i]}\`\n\`${created[i]}\` ◈ \`${joinedAt[i]}\`\n|| ||`)
    }


    msg.channel.send(emb);
  }
};
