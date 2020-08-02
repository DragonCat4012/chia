
const { Message } = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');

module.exports = {
    name: 'POP',
    syntax: 'pop [size]',
    args: false,
    description: 'Pop!',
    commands: ['pop'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg, args) {
        let emb = newEmb(msg);

            let size = Number(args.length ? args[0] : 4) || 4;
            size < 2 ? size = 2 : "";
            //size += 1;//Für Arrays

            let arr = new Array();

            for (let x = 0; x < size; x++) {
		arr[x] = new Array();
                for (let y = 0; y < size; y++) {
                    arr[x][y] = '⛓';
                }
            }

            let x = Math.floor(Math.random() * size + 1);
            let y = Math.floor(Math.random() * size + 1);

            arr[x][y] = '🧨';

            for (let x = 0; x < size; x++) {
                arr[x] = arr[x].map(v => `||${v}||`).join('');
            }

            emb.setTitle('Finde den POP!')
                .setDescription(arr.join('\n'))
            msg.channel.send(emb)
       
    }
};