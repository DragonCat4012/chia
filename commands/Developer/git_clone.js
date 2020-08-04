const { Message } = require('discord.js');
var { exec } = require('child_process');
const { colors, confirmAction, newEmb } = require('../utilities');

module.exports = {
    name: 'Shutdown',
    syntax: 'shutdown',
    args: false,
    description: 'Stops the Bot',
    perm: 'ADMINISTRATOR',
    commands: ['shutdown','restart', 'disconnect'],
    
    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg, args) {
        confirmAction(msg, 'Willst du den Bot wirklich herunterfahren?', async () => {
          process.exit();
        }, () => {
          
        })
    }
};