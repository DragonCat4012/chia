const { Message } = require('discord.js');
const { rawEmb, getTenor } = require('../utilities');



module.exports = {
    name: 'Lewd',
    syntax: 'lewd',
    args: false,
    description: 'Zeigt dir knuffige Gifs qwq',
    commands: ['lewd'],

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
    

        let url = await getTenor('anime lewd');

        if (url == null) {
            return msg.channel.send(emb);
        }

        emb.setTitle(`${victim.displayName} fühlt den lewd-Vibe >.>`)
            .setImage(url);
        msg.channel.send(emb);


    }
};