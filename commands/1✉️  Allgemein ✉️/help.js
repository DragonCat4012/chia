const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');

module.exports = {
    name: 'Help',
    syntax: 'help',
    args: false,
    description: 'Zeigt dir alle Befehle',
    commands: ['help'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)

        if (args[0]) {
            var commandObj = msg.client.commands.find(cmd => cmd.command.commands.includes(args[0].toLowerCase()));
            if (!commandObj) {
                emb.setTitle("Modul nicht gefunden qwq")
                return msg.channel.send(emb);
            }
            var { command, module } = commandObj;
            emb.setTitle(command.name)
                .addField("**Syntax:**", command.syntax)
                .setFooter("Trigger: " + command.commands.join(', '))
            emb.addField("**Beschreibung:**", command.description ? command.description : emotes.false)
            if (command.type) emb.addField("**Typ:**", command.type ? command.type : emotes.false)
            emb.addField("**Berechtigung:(User)**", command.perm ? command.perm : emotes.false)
                .addField("**Berechtigung: (Bot)**", command.needed ? command.needed : emotes.false)

            msg.channel.send(emb);
        } else {
            let a = 0;
            let b = 0;
            var modules = msg.client.commands.map((cmd) => cmd.module)
                .filter((mod, i, arr) => arr.indexOf(mod) == i)
                .sort((a, b) => parseInt(a) - parseInt(b));

            //C.map(v => `\`${v.commands[0]}\``)
            //let C = msg.client.commands
            // emb.setDescription(`**${command.name}**\n \`${command.syntax}\`\n\n`)

            let A = []
            console.log(msg.client.commands)
            for (cmd of msg.client.commands) {
                let command = cmd[1]
                A.push(`**${command.name}**\n \`.${command.syntax}\`\n\n`)
            }
            emb.setDescription(A.join(" "))
                /*
                            for (let mod of modules) {
                                let commands = msg.client.commands.filter(cmd => cmd.module == mod).map(cmdO => cmdO.command);
                                b += commands.length;
                                a += 1;
                                emb.addField(`**${mod.substr(1)}** [${commands.length}]`, commands.map(v => `\`${v.commands[0]}\``).join(', ') + "\n\u200b");
                            }*/
            msg.channel.send(emb.setFooter(`Nutze +help <command> für mehr || ${a} Module mit ${b} Commands`));
        }
    }
};