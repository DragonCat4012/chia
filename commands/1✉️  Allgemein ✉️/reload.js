const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'reload',
    syntax: 'reload <Modul>|*',
    args: true,
    description: 'Lädt das angegebene Modul neu',
    perm: 'DEVELOPER',
    commands: ['reload'],

    /**
     *@document
     * @this
     * @param {Discord.Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute: function (msg, args) {

    }
};