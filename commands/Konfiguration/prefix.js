const {Message} = require('discord.js');
const {newEmb } = require('../utilities');


module.exports = {
    name: 'prefix',
    syntax: 'prefix <value>',
    args: true,
    description: 'Ändert das Bot Prefix für deinen Server',
     perm: 'ADMINISTRATOR',
    commands: ['prefix', 'set-prefix'],
    
    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {

	//if(!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send('Dir fehlt leider folgende Berechtigung: \`ADMINISTRATOR\`')

        var guild_config = await msg.client.database.server_configs.getConfig(msg.guild.id);
        let old_prefix = guild_config.prefix;
        let new_prefix = args[0];

        let emb = newEmb(msg).setTitle("Prefix Changed").addField('**Old Prefix**', old_prefix).addField('**New Prefix**', new_prefix);
        guild_config.prefix = new_prefix;
               guild_config.save().then(() => msg.channel.send(emb));

    }
};
