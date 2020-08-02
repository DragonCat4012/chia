const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'reload',
    syntax: 'reload <Modul>|*',
    args: true,
    description: 'Lädt das angegebene Modul neu',
    commands: ['reload'],

    /**
     *@document
     * @this
     * @param {Discord.Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute: function(msg, args) {
        /*
        const commandName = args[0].toLowerCase();

        if (commandName == '*') {

            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                var newCommand;
                try {
                    delete require.cache[require.resolve(`./${file}`)];
                    newCommand = require(`./${file}`);

                    msg.client.commands.set(newCommand.name, newCommand);
                    msg.channel.send(`Command \`${newCommand.name}\` wurde neu geladen!`);
                } catch (error) {
                    console.log(error);
                    msg.channel.send(`Beim neuladen von \`${newCommand.commands[0]}\` ist ein Fehler aufgetreten:\n\`${error.message}\``);
                }
            }
        } else {

            const command = msg.client.commands.find(cmd => cmd.commands.includes(commandName));

            if (!command) {
                return msg.channel.send(`Diesen befehl gibt es nicht \`${commandName}\`, ${msg.author}!`);
            }

            delete require.cache[require.resolve(`./${command.name}.js`)];

            try {
                const newCommand = require(`./${command.name}.js`);
                msg.client.commands.set(newCommand.name, newCommand);
                msg.channel.send(`Command \`${command.name}\` wurde neu geladen!`);
            } catch (error) {
                console.log(error);
                msg.channel.send(`Beim neuladen von \`${command.commands[0]}\` ist ein Fehler aufgetreten:\n\`${error.message}\``);
            }
        }
        */
    }
};