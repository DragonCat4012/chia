const { Message } = require('discord.js');
const { rawEmb, emotes, calcLevel, colors } = require('../utilities');

module.exports = {
    name: 'start',
    syntax: 'start',
    args: false,
    description: 'Zeigt dir die Spieler Karte eines Läst dich dein Abenteuer mit mir starten ^^',
    type: 'ALLGEMEIN',
    commands: ['start'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let user = msg.author;
        let emb = rawEmb(msg)

        let alreadyCreated = await msg.client.database.player_cache.getConfig(user.id)
        if (alreadyCreated) {
            emb.setDescription('**Du hast bereits ein Profil O.o**')
            return msg.channel.send(emb.setColor(colors.error))
        }
        var player = await msg.client.database.player_cache.addProfile(user.id);

        emb.setTitle(`${msg.author.username}`).setDescription('**startete sein Abenteuer, wünscht ihm/ihr/es Glück!**')

        msg.channel.send(emb)
    }
};