const {Message} = require('discord.js');
const {newEmb, emotes } = require('../utilities');


module.exports = {
    name: 'settings',
    syntax: 'settings',
    args: false,
    description: 'Zeigt die serverspezifischen Einstellungen des Bots.',
    commands: ['settings'],
    
    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {

        var guild_config = await msg.client.database.server_configs.getConfig(msg.guild.id);
        let emb = newEmb(msg).setTitle("Server Konfiguration [" + guild_config.prefix + "]")

        if (guild_config.team_role == "0") {  a = emotes.false } else {
        let A = msg.guild.roles.cache.get(guild_config.team_role)
        if (!A) {  guild_config.team_role = 0;
        A = 0;
        return guild_config.save().then(() => msg.channel.send(emb.setTitle("Team Rolle nicht gefudnen, Wert wurde zurückgesetzt.")));
        }  a = A}
        
   
        if (guild_config.mute_role == "0") {  b = emotes.false } else {
        let B = msg.guild.roles.cache.get(guild_config.mute_role)
        if (!B) {  guild_config.mute_role = 0;
        B = 0;
        return guild_config.save().then(() => msg.channel.send(emb.setTitle("Mute Rolle nicht gefunden, Wert wurde zurückgesetzt.")));
        }  b = B}
            
        if (guild_config.join_role == "0") {  c = emotes.false } else {
        let C = msg.guild.roles.cache.get(guild_config.join_role)
        if (!C) {  guild_config.join_role = 0;
        C = 0
        return guild_config.save().then(() => msg.channel.send(emb.setTitle("Join Rolle nicht gefunden, Wert wurde zurückgesetzt.")));
        }  c = C}

        if (guild_config.xp == true) {  d = emotes.true } else { d = emotes.false }
        if (guild_config.xp_msg == "0") {  e = emotes.false } else e =guild_config.xp_msg
        if (guild_config.xp_ch  == "0") {  f = emotes.false } else {   
            let F = msg.guild.channels.cache.get(guild_config.xp_ch)
            if (!F) {  guild_config.xp_ch = 0;
                F = 0;
            return guild_config.save().then(() => msg.channel.send(emb.setTitle("XP-nachricht-Channel nicht gefunden, Wert wurde zurückgesetzt.")));
            } else f = "<#" + F + ">"}          


        if (guild_config.wlc == true) {  g = emotes.true } else { g = emotes.false }
        if (guild_config.wlc_msg == "0") {  h = emotes.false } else h =guild_config.wlc_msg
        if (guild_config.wlc_ch  == "0") {  i = emotes.false } else {   
            let I = msg.guild.channels.cache.get(guild_config.wlc_ch)
            if (!I) {  guild_config.wlc_ch = 0;
            I = 0;
            return guild_config.save().then(() => msg.channel.send(emb.setTitle("Wilkommensnachricht-Channel nicht gefunden, Wert wurde zurückgesetzt.")));
            } else i = "<#" + I + ">"}

        if (guild_config.gb == true) {  j = emotes.true } else { j = emotes.false }
        if (guild_config.gb_msg == "0") {  k = emotes.false } else k =guild_config.gb_msg
        if (guild_config.gb_ch  == "0") {  l = emotes.false } else {   
            let L = msg.guild.channels.cache.get(guild_config.gb_ch)
            if (!L) {  guild_config.gb_ch = 0;
            L = 0;
            return guild_config.save().then(() => msg.channel.send(emb.setTitle("Verabschiedungsnachricht-Channel nicht gefunden, Wert wurde zurückgesetzt.")));
            } else l = "<#" + L + ">"}
    

        emb.addField("**Team Rolle:**", a )
        .addField("**Mute Rolle:**", b )
       .addField("**Join Rolle:**", c )

        .addField("**Leveling:**", d )
        .addField("**Levelup Nachricht:**", e )
        .addField("**XP Channel:**", f )

        .addField("**Begrüßung:**", g )
        .addField("**Begrüßungs Nachricht:**", h )
        .addField("**Begrüßungs Channel:**", i )

        .addField("**Abschied:**", j )
        .addField("**Abschieds Nachricht:**", k )
        .addField("**Abschieds Channel:**", l )
            

        msg.channel.send(emb)


    }
};
