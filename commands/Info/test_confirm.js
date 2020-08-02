const Discord = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');

module.exports = {
    name: 'test confirm',
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
        let {command, module} = msg.client.commands.find(c => c.command.name == this.name);

        confirmAction(msg, 'Willst du sinnlose dinge bstätigen?', () => {
            msg.reply(module);
        }, () => {
            msg.reply('NEIN');
        })
    }
}