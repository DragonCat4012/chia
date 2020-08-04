const { kMaxLength } = require('buffer');
const { Message, TextChannel } = require('discord.js');
const { newEmb, colors } = require('../utilities');

RegExp.escape = function (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

module.exports = {
    name: 'kick',
    syntax: 'kick <@user> [@user]...',
    args: true,
    description: 'Entfernt den unwürdige Wesen von deinem Server ^^',
 perm: 'KICK_MEMBERS',
    commands: ['kick'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let emb = newEmb(msg)
            
        let members = msg.mentions.members.array();
        let not_kicked = new Array();
        let kicked = new Array();
        let reason = 'Kicked by ' + msg.author.tag;
       
        for (let member of members) {
            try {
                kicked.push(member).then
                await member.kick(reason) ;
            } catch (err) {
                console.log(err)
                msg.channel.send( `**Fehler bei ${member}**` + err )
                not_kicked.push(member);
            }
        }
        let kickedamount = members.length - not_kicked.length;
        
       if(not_kicked.length > 0) {
           emb.setDescription(not_kicked.join(', '))
           msg.channel.send(emb.setTitle(`Diese(n) ${not_kicked.length} Nutzer konnte ich leider nicht kicken qwq`).setFooter(`${kickedamount} Nutzer wurden gekickt`).setColor(colors.nothing))}

       if (kicked.length > 0) {
        emb.setDescription(kicked.join(', '))
       return msg.channel.send(emb.setTitle(`Erfolreich entfernt wurden ${kicked.lenght}`))}



    }

};

