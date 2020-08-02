const { Message } = require('discord.js');
const { newEmb } = require('../utilities');
const api_dog = "https://random.dog/woof.json";
const fetch = require('node-fetch');



module.exports = {
    name: 'Dog',
    syntax: 'dog',
    args: false,
    description: 'Zeigt dir knuffige Hunde',
    commands: ['dog'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {

        let emb = newEmb(msg)
        let body = (await fetch(api_dog).then(res => res.json()));
        let { fileSizeBytes, file } = body;

        if (!body) return msg.channel.send(emb.setTitle("Etwas ist schief gelaufen qwq"));

        emb.setImage(file)
        .setFooter(fileSizeBytes + " Bytes")
        msg.channel.send(emb)


    }
};