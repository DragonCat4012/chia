const { Message } = require('discord.js');
const { newEmb, colors } = require('../utilities');


module.exports = {
    name: 'set',
    syntax: 'set <modul> <wert>',
    args: true,
    description: 'Ändert die serverspezifischen Einstellungen des Bots. Verfügbare Module sind: \n->team_role, \n-> join_role, \n-> mute_role, \n-> xp, \n-> xp_msg, \n-> xp_ch, \n-> wlc, \n-> wlc_msg, \n-> wlc_ch, \n-> gb, \n-> gb_msg, \n-> gb_ch, \n-> prefix \n**Tipp: Nutze %level%, %user%, %count%, %server% in den Event Nachrichten.**',
   perm: 'MANAGE_GUILD',   
   commands: ['set'],
 
    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {


        var guild_config = await msg.client.database.server_configs.getConfig(msg.guild.id);
        let emb = newEmb(msg).setTitle("Server Konfiguration geändert")

        if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send('Dir fehlt leider folgende Berechtigung: \`ADMINISTRATOR\`')

        var neu;

        switch (args[0]) {



            case "prefix": {
                let old_prefix = guild_config.prefix;
                let new_prefix = args[1];

                let emb = newEmb(msg).setTitle("Prefix Changed").addField('Old Prefix', old_prefix).addField('New prefix', new_prefix);
                guild_config.prefix = new_prefix;

                return guild_config.save().then(() => msg.channel.send(emb));

            }

            case "team_role": {
                let old_role = guild_config.team_role;
                let new_role = msg.mentions.roles.first().id;

                emb.addField('**Vorher:**', old).addField('**Neuer Team Rolle:**', "<@&" + neu + ">");
                guild_config.team_role = new_role;

                return guild_config.save().then(() => msg.channel.send(emb));
            }

            case "join_role": {
                let old_role = guild_config.join_role;
                let new_role = msg.mentions.roles.first().id;

                emb.addField('**Vorher:**', old).addField('**Neuer Join Rolle:**', "<@&" + neu + ">");
                guild_config.join_role = new_role;

                return guild_config.save().then(() => msg.channel.send(emb));
            }

            case "mute_role": {
                let old_role = guild_config.mute_role;
                let new_role = msg.mentions.roles.first().id;

                emb.addField('**Vorher:**', old).addField('**Neuer Mute Rolle:**', "<@&" + neu + ">");
                guild_config.mute_role = new_role;

                return guild_config.save().then(() => msg.channel.send(emb));
            }






            case "xp": {
                let old = guild_config.xp;
                neu = args[1]

                if (args[1] == "true") {
                    emb.addField('**Vorher:**', old).addField('**Jetzt:**', neu);
                    guild_config.xp = true;

                    return guild_config.save().then(() => msg.channel.send(emb));



                } else if (args[1] == "false") {
                    emb.addField('**Vorher:**', old).addField('**Jetzt:**', neu);
                    guild_config.xp = false;

                    guild_config.save().then(() => msg.channel.send(emb));
                    return
                }
                else { return msg.channel.send(emb.setTitle("**Eingabefehler:** Der Wert dieses Moduls kann nur `true` oder `false` betragen").setColor(colors.nothing)) }


            }

            case "xp_msg": {
                let old = guild_config.xp_msg;
                neu = args.join(' ');

                if (!args[1]) msg.reply("Bitte achte auf den Syntax")
                if (neu.length > 1024) msg.channel.send(emb.setTitle("Die Nachricht darf nicht über 1024 Zeichen betragen!").setColor(colors.nothing))
                emb.addField('**Vorher:**', old).addField('**Jetzt:**', neu);
                guild_config.xp_msg = neu;

                return guild_config.save().then(() => msg.channel.send(emb));
            }


            
                    case "xp_ch": {
                neu = msg.mentions.channels.first().id;
                if (!neu) return msg.channel.send(emb.setTitle("Bitte achte auf den Syntax").setColor(colors.nothing))
                guild_config.xp_ch = neu;
               
                let old = guild_config.xp_ch;
                emb.addField('**Vorher:**', old).addField('**Neuer XP-Channel:**', "<#" + neu + ">");
                return guild_config.save().then(() => msg.channel.send(emb));
                    }
            
            


            case "welcome": {
                let old = guild_config.wlc;
                neu = args[1]

                if (args[1] == "true") {
                    emb.addField('**Vorher:**', old).addField('**Jetzt:**', neu);
                    guild_config.wlc = true;

                    return guild_config.save().then(() => msg.channel.send(emb));



                } else if (args[1] == "false") {
                    emb.addField('**Vorher:**', old).addField('**Jetzt:**', neu);
                    guild_config.wlc = false;

                    guild_config.save().then(() => msg.channel.send(emb));
                    return
                }
                else { return msg.channel.send(emb.setTitle("**Eingabefehler:** Der Wert dieses Moduls kann nur `true` oder `false` betragen").setColor(colors.nothing)) }


            }
            case "welcomemessage": {
                let old = guild_config.wlc_msg;
                var text = args.shift(1)
                neu = args.join(' ');

                if (neu.length > 1024) msg.channel.send(emb.setTitle("Die Nachricht darf nicht über 1024 Zeichen betragen!").setColor(colors.nothing))

                emb.addField('**Vorher:**', old).addField('**Neue Nachricht:**', neu);
                guild_config.wlc_msg = neu;

                return guild_config.save().then(() => msg.channel.send(emb));

            }
            case "welcomechannel": {
                neu = msg.mentions.channels.first().id;
                if (!neu) return msg.channel.send(emb.setTitle("Bitte achte auf den Syntax").setColor(colors.nothing))
                guild_config.wlc_ch = neu;
               
                let old = guild_config.wlc_ch;
                emb.addField('**Vorher:**', old).addField('**Neuer Welcome-Channel:**', "<#" + neu + ">");
                return guild_config.save().then(() => msg.channel.send(emb));
            }






            case "goodbye": {
                let old = guild_config.gb;
                neu = args[1]

                if (args[1] == "true") {
                    emb.addField('**Vorher:**', old).addField('**Jetzt:**', neu);
                    guild_config.gb = true;

                    return guild_config.save().then(() => msg.channel.send(emb));



                } else if (args[1] == "false") {
                    emb.addField('**Vorher:**', old).addField('**Jetzt:**', neu);
                    guild_config.gb = false;

                    guild_config.save().then(() => msg.channel.send(emb));
                    return
                }
                else { return msg.channel.send(emb.setTitle("**Eingabefehler:** Der Wert dieses Moduls kann nur `true` oder `false` betragen").setColor(colors.nothing)) }


            }
            case "goodbyemessage": {
                let old = guild_config.gb_msg;
                var text = args.shift(1)
                neu = args.join(' ');

                if (neu.length > 1024) msg.channel.send(emb.setTitle("Die Nachricht darf nicht über 1024 Zeichen betragen!").setColor(colors.nothing))

                emb.addField('**Vorher:**', old).addField('**Neue Nachricht:**', neu);
                guild_config.gb_msg = neu;

                return guild_config.save().then(() => msg.channel.send(emb));
            }
            
            case "goodbyechannel": {
                neu = msg.mentions.channels.first().id;
                if (!neu) return msg.channel.send(emb.setTitle("Bitte achte auf den Syntax").setColor(colors.nothing))
                guild_config.gb_ch = neu;

                let old = guild_config.gb_ch;
                emb.addField('**Vorher:**', old).addField('**Neuer Verabschiedungs-Channel:**', "<#" + neu + ">");
                return guild_config.save().then(() => msg.channel.send(emb));
            }

            default: { msg.channel.send(emb.setTitle("Kein Modul unter diesem Namen gefunden").setColor(colors.nothing)) }



        }




    }
};
