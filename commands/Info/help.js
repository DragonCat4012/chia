const { Message } = require('discord.js');
const { rawEmb } = require('../utilities');



module.exports = {
    name: 'Help',
    syntax: 'help',
    args: false,
    description: 'Zeigt dir alle Commands',
    commands: ['help'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg, args) {
        let emb = rawEmb(msg)
            .setTitle(`Modul Hilfe`);


        if (args[0]) {
            var commandObj = msg.client.commands.find(cmd => cmd.command.commands.includes(args[0].toLowerCase()));
            if (!commandObj) return msg.channel.send(emb.setTitle("Modul nicht gefunden qwq"));
            var { command, module } = commandObj;
            emb.addField("**Name:**", command.name)
                .addField("**Syntax:**", command.syntax)
                .addField("**Beschreibung:**", command.description)
                .setFooter(command.commands.join(', '))

            msg.channel.send(emb);
        } else {
            var modules = msg.client.commands.map((cmd) => cmd.module).filter((mod,i,arr) => arr.indexOf(mod) == i);

            for (let mod of modules) {
                let commands = msg.client.commands.filter(cmd => cmd.module == mod).map(cmdO => cmdO.command);
                emb.addField(`**${mod.toUpperCase()}**`, commands.map(v => `\`${v.commands[0]}\``).join(', '));
            }

            msg.channel.send(emb.setTitle("Hilfsmenü"));
        }
    }
};