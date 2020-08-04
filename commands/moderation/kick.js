const { kMaxLength } = require('buffer');
const { Message, TextChannel } = require('discord.js');
const { newEmb, colors } = require('../utilities');

RegExp.escape = function (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

module.exports = {
    name: 'kick',
    syntax: 'kick <@user|@role> [@user|@role]...',
    args: true,
    description: 'Entfernt die unwürdigen Wesen von deinem Server ^^',
    perm: 'KICK_MEMBERS',
    commands: ['kick'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let emb = newEmb(msg).setColor(colors.nothing);

        let roles = msg.mentions.roles.array();
        let members = msg.mentions.members.array();
        let not_kicked = new Array();
        let kicked = new Array();
        let reason = 'Kicked by ' + msg.author.tag;

        if (roles.length > 0) {
            for (let role of roles) {
                for (let member of role.members.array()) {
                    try {
                        await member.kick(reason);
                        kicked.push(member);
                    } catch (err) {
                        //console.log(err)
                        //msg.channel.send(`**Fehler bei ${member}**`)
                        not_kicked.push(member);
                    }
                }
            }
        }

        if (members.length > 0) {
            for (let member of members) {
                try {
                    await member.kick(reason);
                    kicked.push(member);
                } catch (err) {
                    //console.log(err)
                    //msg.channel.send(`**Fehler bei ${member}**`)
                    not_kicked.push(member);
                }
            }
        }


        emb.setFooter(`${kicked.length} Nutzer wurden gekickt`);

        if (not_kicked.length > 0) {
            emb.addField(`**${not_kicked.length} Nutzer wurden nicht gekickt**`, not_kicked.join(', '));
        }

        if (kicked.length > 0) {
            emb.addField(`**Erfolreich entfernt wurden ${kicked.length} Nutzer**`, kicked.join(', '));
        }

        msg.channel.send(emb);
    }
};

