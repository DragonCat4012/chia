const Discord = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');

module.exports = {
    name: 'test_confirm',
    syntax: 'test_confirm',
    args: false,
    description: 'Ping!',
    commands: ['test', 'confirm'],

    /**
     *@document
     * @this
     * @param {Discord.Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let command = client.commands.find(c => c.name == this.name);

        confirmAction(msg, 'Willst du sinnlose dinge bstätigen?', () => {
            msg.reply(command.module);
        }, () => {
            msg.reply('NEIN');
        })
    }
}