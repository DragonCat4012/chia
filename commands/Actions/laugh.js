const { Message } = require('discord.js');
const { rawEmb, getTenor } = require('../utilities');



module.exports = {
    name: 'Laugh',
    syntax: 'laugh',
    args: false,
    description: 'Zeigt dir knuffige Gifs qwq',
    commands: ['laugh'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)
            .setTitle(`API Fehler`);

        let victim = msg.member;
    

        let url = await getTenor('anime laugh');

        if (url == null) {
            return msg.channel.send(emb);
        }

        emb.setTitle(`${victim.displayName} lacht UwU`)
            .setImage(url);
        msg.channel.send(emb);


    }
};