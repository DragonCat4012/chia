const { Message } = require('discord.js');
const { rawEmb } = require('../utilities');

module.exports = {
    name: 'info',
    syntax: 'info',
    args: false,
    description: 'Gibt den Linki mit dem du mich zu deinem server hinzufügen kannst UwU',
    commands: ['info', 'botinfo'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {

        let emb = rawEmb(msg)
            .setTitle("Meine Infos")
            .addField("**Sever**", (msg.client.guilds.cache.size).toLocaleString(), true)
            .addField("**User**", (msg.client.users.cache.size).toLocaleString(), true)
            .addField("**Channel**", (msg.client.channels.cache.size).toLocaleString(), true)
        msg.channel.send(emb);
    }
};