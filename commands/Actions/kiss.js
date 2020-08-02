const { Message } = require('discord.js');
const { rawEmb, getTenor } = require('../utilities');



module.exports = {
    name: 'Kiss',
    syntax: 'kiss [@user]',
    args: false,
    description: 'Zeigt dir knuffige Gifs qwq',
    commands: ['kiss'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)
            .setTitle(`API Fehler`);

        let victim = msg.mentions.members.first() || msg.member;
        if (victim == msg.member) {
            var n = "sich selbst"
        } else {
            var n = msg.member.displayName
        }

        let url = await getTenor('anime kiss');

        if (url == null) {
            return msg.channel.send(emb);
        }

        emb.setTitle(`${victim.displayName} wurde von ${n} gek�sst \*^\*`)
            .setImage(url);
        msg.channel.send(emb);


    }
};