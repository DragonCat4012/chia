
const { Message } = require('discord.js');
const { newEmb } = require('../utilities');

module.exports = {
    name: 'Lovecalc',
    syntax: 'lovecalc <user1> <user2>',
    args: true,
    description: 'berechnet die Leibe zwischen zwei Nutzern',
    commands: ['lovecalc'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg) {

        let member1 = msg.mentions.members.first();
        let member2 =
            msg.mentions.members.filter(m => m.id !== member1.id).first() ||
            msg.member;

        if (!member1 || !member2) {
            return msg.channel.send(
                emb.setTitle("Du musst zwei Nutzer angeben!"))

        }

        let percent = Math.floor(
            (
                (member1.id + member2.id) / Math.pow(10, 18 * 2)
            ) * 100
        );

        let emb = newEmb(msg)
            .setTitle("**:sparkling_heart: LoveCalc :sparkling_heart:**")
            .setDescription(`${member1} :revolving_hearts: **${percent}%** :revolving_hearts: ${member2}`)
        

        emb.footer = undefined;
        emb.timestamp = undefined;
        msg.channel.send(emb);




    }



};
