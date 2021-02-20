const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');

module.exports = {
    name: 'Help',
    syntax: 'help',
    args: false,
    description: 'Zeigt dir alle Befehle',
    type: 'ALLGEMEIN',
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
            emb.addField("**Beschreibung:**", command.description ? command.description : '❌')

            msg.channel.send(emb);
        } else {
            let a = 0;
            let b = 0;
            var modules = msg.client.commands.map((cmd) => cmd.module)
                .filter((mod, i, arr) => arr.indexOf(mod) == i)
                .sort((a, b) => parseInt(a) - parseInt(b));

            for (let mod of modules) {
                let commands = msg.client.commands.filter(cmd => cmd.module == mod).map(cmdO => cmdO.command);
                mod = mod.substr(1)
                b += commands.length;
                a += 1;
                let prop = (mod.toString()).toLowerCase()

                emb.addField(`**${mod}** [${commands.length}]`, commands.map(v => `**-${v.syntax}** [\`${v.description}\`]`).join('\n') + "\n\u200b");
            }
            let voteLink = 'https://top.gg/bot/744883074508259329/vote'
            let githubLink = 'https://github.com/DragonCat4012/chia'
            let supportInvite = 'https://discord.gg/Emk2udJ'
            let inviteLink = 'https://discord.com/oauth2/authorize?client_id=744883074508259329&scope=bot&permissions=289856'
            emb.addField('Links', `[Vote](${voteLink}) • [Github](${githubLink}) • [Support](${supportInvite}) • [invite](${inviteLink})`)
            msg.channel.send(emb.setFooter(`Nutze +help <command> für mehr || ${a} Module mit ${b} Commands`));
        }
    }
};