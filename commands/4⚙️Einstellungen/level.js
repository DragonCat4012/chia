const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'level',
    syntax: 'level',
    args: false,
    description: 'Deaktiviert/Aktiviert die Level Nachricht für deinen Server',
    perm: 'MANAGE_GUILD',
    type: 'EINSTELLUNGEN',
    commands: ['level', 'setlevel'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let emb = rawEmb(msg)
        var settings = await msg.client.database.GuildConfigCache.getConfig(msg.guild.id);
        let old = settings.levelMessage

        if (settings.levelMessage) {
            settings.levelMessage = false
        } else { settings.levelMessage = true }

        await settings.save()

        emb.setDescription(`Level Nachricht geändert zu \`${settings.levelMessage}\``)
        msg.channel.send(emb)
    }
};