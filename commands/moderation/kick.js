const { Message, TextChannel } = require('discord.js');
const { newEmb } = require('../utilities');

RegExp.escape = function (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

module.exports = {
    name: 'kick',
    syntax: 'kick <@user> [@user]...',
    args: true,
    description: 'Entfernt den unwürdige Wesen von deinem Server ^^',
    commands: ['kick'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = newEmb(msg)
            .setTitle('Dir fehlt leider folgende Berechtigung: \`KICK_MEMBERS\`')

        let members = msg.mentions.members.array();
        let not_kicked = new Array();
        let reason = 'Kicked by ' + msg.author.tag;
        if (!msg.author.hasPermission('KICK_MEMBERS')) return msg.channel.send(emb)

        for (let member of members) {
            try {
                await member.kick(reason);
            } catch (err) {
                not_kicked.push(member);
            }
        }
        let kicked = members.length - not_kicked.length;
        emb.setDescription(not_kicked.join(', '))
        msg.channel.send(emb.setTitle(`Diese ${not_kicked.length} Nutzer konnte ich leider nicht kicken qwq`).setFooter(`${kicked} Nutzer wurden gekickt`))


     



    }

};

