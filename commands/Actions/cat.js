const { Message } = require('discord.js');
const { newEmb } = require('../utilities');
const api_cat = "http://aws.random.cat/meow";
const fetch = require('node-fetch');

module.exports = {
    name: 'Cat',
    syntax: 'cat',
    args: false,
    description: 'Zeigt dir knuffige Katzen',
    commands: ['cat'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {

        let emb = newEmb(msg)
        let file = (await fetch(api_cat).then(res => res.json())).file;

        if (!file) return msg.channel.send(emb.setTitle("Etwas ist schief gelaufen qwq"));

        emb.setImage(file);
        msg.channel.send(emb)


    }
};