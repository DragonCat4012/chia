const {Message} = require('discord.js');
const {rawEmb, colors } = require('../utilities');

module.exports = {
    name: 'transfer',
    syntax: 'transfer <@user> <amount>',
    args: true,
    description: 'Transferiert deine Coins OvO',
    type: 'Economy',
    commands: ['transfer'],
    
    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg).setTitle("Transfer")
        if (msg.mentions.members.first()) {user = msg.mentions.members.first().user}
        if(!user) return msg.channel.send(emb.setTitle("Bitte gib einen Nutzer an").setColor(colors.nothing))

        if(user.bot) return msg.channel.send(emb.setTitle("Bots können keine Coins haben").setColor(colors.nothing))
       
        let Kunde = await msg.client.database.player_cache.getConfig(user.id)
        let Verkäufer = await msg.client.database.player_cache.getConfig(msg.author.id)
       
        let amount = parseInt(args[1])
        if (Math.sign(amount) == -1) amount = amount*-1

        if(isNaN(amount) || !amount) return msg.channel.send(emb.setTitle("Bitte gib eine gültige Zahl an").setColor(colors.nothing))
  
       if (Verkäufer.COINS < amount) return msg.channel.send(emb.setTitle("Du hats nicht gnügend Geld auf deinem Konto!").setColor(colors.nothing))
        let Paid = Math.floor(amount * 0.75)

        Verkäufer.COINS-= Paid
        Kunde.COINS += Paid;
        await Kunde.save()
        await Verkäufer.save()

        return msg.channel.send(emb.setTitle(Paid + ` [25% Steuern] Coins erfolgreich übertragen OvO`))

   



    }
};
