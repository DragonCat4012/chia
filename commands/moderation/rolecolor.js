
const { Message } = require('discord.js');
const { newEmb } = require('../utilities');

module.exports = {
    name: 'Roelcolor',
    syntax: 'rolecolor <@role> <Farbe>',
    args: true,
    description: 'Ändert die Farbe einer Rolle',
    commands: ['rolecolor', 'rcolor'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg, args) {
    let guild = msg.guild;
    let role = msg.mentions.roles.first();
    

    let emb = newEmb(msg)
    .setTitle('Die Rolle ist leider mächtiger als ich.')

    if (!role) return msg.channel.send(emb.setTitle("Syntaxfehler: Keine Rolle angegeben"));
    if(!args[1]) return msg.channel.send(emb.setTitle("Syntaxfehler: Keine Farbe angegeben"))

    if(args[1].startsWith('#')) { var color = args[1].slice(1)
    } else {var color = args[1];}

    let x = guild.members.cache.find(m => m.id == msg.client.user.id).roles.highest;
    let y = x.comparePositionTo(role);
    if (y < 1) {
     return msg.channel.send(emb); 
    }

    role.setColor(color).catch();

      emb.setTitle(`Rollenfarbe geändert`)
      .addField("**Rolle:** ", role)
      .addField("**Farbe:** ", color)
      msg.channel.send(emb)

        
    }
};