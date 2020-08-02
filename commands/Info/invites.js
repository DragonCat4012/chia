const { Message } = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');
//const arraySort = require('array-sort');



module.exports = {
    name: 'invites',
    syntax: 'invites',
    args: false,
    description: 'Zeigt dir alle invites des Servers',
    commands: ['invites'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {

        let emb = newEmb(msg).setTitle('Invites')

        let invites = await msg.guild.fetchInvites();

        invites = invites.array().sort((a, b) => a.uses - b.uses).filter(invite => invite.inviter);

        for (let inv of invites) {
            emb.addField(`**${inv.code}**`, 
                `\`${inv.uses ? inv.uses : '0?'}\` - ${inv.inviter}`
            );
        }

        if (emb.fields.length < 1) return msg.channel.send(emb.setTitle('Keine Invites gefunden'));

        msg.channel.send(emb);
    }
};
