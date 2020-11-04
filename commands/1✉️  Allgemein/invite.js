const { Message } = require('discord.js');
const { rawEmb } = require('../utilities');

module.exports = {
    name: 'invite',
    syntax: 'invite',
    args: false,
    description: 'Gibt den Linki mit dem du mich zu deinem server hinzufügen kannst UwU',
    commands: ['invite', 'link'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let link = "https://discord.com/oauth2/authorize?client_id=" + msg.client.user.id + "&scope=bot&permissions=289856"
        neko = "https://discord.gg/2AGVgNM"
        invite = "https://discord.gg/Emk2udJ";
        let emb = rawEmb(msg)
            .setTitle("Invite Links")
            .addField("**Bot-Invite**", `[Klick](${link})`)
            .addField("**Support Server**", `[Klick](${invite})`)
            .addField("**Neko Dev Hood**", `[Klick](${neko})`)
        msg.channel.send(emb);
    }
};