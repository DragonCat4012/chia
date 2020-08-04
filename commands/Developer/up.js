const {Message} = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');


module.exports = {
    name: 'up',
    syntax: 'up',
    args: false,
    description: 'Bin ich online.....?',
    perm: 'ADMINISTRATOR',
    commands: ['up'],
    
    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg, args) {


        let emb = newEmb(msg)
		emb.setColor('0x2C2F33')
 	emb.setTitle("Sure, bin offline uwu")
	emb.footer = undefined;
        emb.timestamp = undefined;

       
        msg.channel.send(emb);

    }
};
