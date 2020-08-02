const {Message} = require('discord.js');
const {newEmb } = require('../utilities');


module.exports = {
    name: 'set',
    syntax: 'set <modul> <wert>',
    args: true,
    description: 'Ändert die serverspezifischen Einstellungen des Bots.',
    commands: ['set'],
    
    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
          /*  

        var guild_config = await msg.client.database.server_configs.getConfig(msg.guild.id);
        let emb = newEmb(msg).setTitle("Server Konfiguration geändert")

        if(!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send('Dir fehlt leider folgende Berechtigung: \`ADMINISTRATOR\`')


        switch (args[0]){
        
        case "team_role": {
            let old_role = guild_config.team_rolle;
            let new_role = msg.mentions.roles.first();

            emb.addField('**Alte Team Rolle:**', old_role).addField('**Neue Team Rolle:**', new_role);
            guild_config.team_rolle = new_role;
            
            guild_config.save().then(() => msg.channel.send(emb));
        }


        case "mute_role": {
            let old_role = guild_config.mute_role;
            let new_role = msg.mentions.roles.first();

            emb.addField('**Alte Mute Rolle:**', old_role).addField('**Neue Mute Rolle:**', new_role);
            guild_config.mute_role = new_role;
            
            guild_config.save().then(() => msg.channel.send(emb));
        }

        case "xp": {
            let old_m = guild_config.xp_msg;
            let new_m = args[1]

            if(args[1]== true | false)  return msg.channel.send(emb.setTitle("**Eingabefehler:** Der Wert dieses Moduls kann nur `true` oder `false` betragen"))

            emb.addField('**Alte Einstellung:**', old_m).addField('**Neue Einstellung:**', new_m);
            guild_config.xp_msg = new_m;
            
            guild_config.save().then(() => msg.channel.send(emb));
        }

        case "xp_ch": {
            let old_m = guild_config.xp_ch;
            let new_m = msg.mentions.channels.first();
            if(!new_m) msg.reply( "Bitte achte auf den Syntax")

            emb.addField('**Alter XP-Channel:**', old_m).addField('**Neuer XP-Channel:**', new_m);
            guild_config.xp_ch = new_m;
            
            guild_config.save().then(() => msg.channel.send(emb));
        }

        case "welcome": {
            let old_m = guild_config.wlc;

            if(args[1]== true | false)  return msg.channel.send(emb.setTitle("**Eingabefehler:** Der Wert dieses Moduls kann nur `true` oder `false` betragen"))

            emb.addField('**Alte Einstellung:**', old_m).addField('**Neue Einstellung:**', new_m);
            guild_config.wlc = new_m;
            
            guild_config.save().then(() => msg.channel.send(emb));
        }
        case "welcomemessage": {
            let old_m = guild_config.wlc_msg;
            var text = args.shift(1)
            var new_m = args.join(' ');

            emb.addField('**Alte Nachricht:**', old_m).addField('**Neue Nachricht:**', new_m);
            guild_config.wlc_msg = new_m;
            
            guild_config.save().then(() => msg.channel.send(emb));

        }
        case "welcomechannel": {
            let old_m = guild_config.wlc_ch;
            let new_m = msg.mentions.channels.first();
            if(!new_m) msg.reply( "Bitte achte auf den Syntax")

            emb.addField('**Alter welcome-Channel:**', old_m).addField('**Neuer Welcome-Channel:**', new_m);
            guild_config.wlc_ch = new_m;
            
            guild_config.save().then(() => msg.channel.send(emb));
        }
       
        case "goodbye": {

            var text = message.content.slice();
            msg.channel.send(text)

            let old_m = guild_config.gb;
            let new_m = args[1]

            if(args[1]== true | false)  return msg.channel.send(emb.setTitle("**Eingabefehler:** Der Wert dieses Moduls kann nur `true` oder `false` betragen"))

            emb.addField('**Alte Einstellung:**', old_m).addField('**Neue Einstellung:**', new_m);
            guild_config.gb = new_m;
            
            guild_config.save().then(() => msg.channel.send(emb));
        }
        case "goodbyemessage": {
            let old_m = guild_config.gb_msg;
            var text = args.shift(1)
            var new_m = args.join(' ');

            emb.addField('**Alte Nachricht:**', old_m).addField('**Neue Nachricht:**', new_m);
            guild_config.gb_msg = new_m;
            
            guild_config.save().then(() => msg.channel.send(emb));
        }
        case "goodbyechannel": {
            let old_m = guild_config.gb_ch;
            let new_m = msg.mentions.channels.first();
            if(!new_m) msg.reply( "Bitte achte auf den Syntax")

            emb.addField('**Alter verabschiedungs-Channel:**', old_m).addField('**Neuerverabschiedungs-Channel:**', new_m);
            guild_config.gb_ch = new_m;
            
            guild_config.save().then(() => msg.channel.send(emb));
        }





        }



*/
msg.channel.send("Set")

      /*  
        let old_prefix = guild_config.prefix;
        let new_prefix = args[0];

        let emb = newEmb(msg).setTitle("Prefix Changed").addField('Old Prefix', old_prefix).addField('New prefix', new_prefix);
        guild_config.prefix = new_prefix;
        
        guild_config.save().then(() => msg.channel.send(emb));

        */

    }
};
