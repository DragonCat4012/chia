const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');
const shopItems = require('../../items.json')

module.exports = {
    name: 'sell',
    syntax: 'sell <item>',
    args: true,
    description: 'Lässt dich Items verkaufen',
    type: 'ECONEMY',
    commands: ['sell'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        var player = await msg.client.database.UserConfigCache.getConfig(msg.author.id);
        let emb = rawEmb(msg).setTitle("Item Verkauf")

        var inventory = player.items.toObject()
        let arr = [];

        let itemTosell = (inventory.filter(e => e.name.toLowerCase() == args[0].toLowerCase())).shift()
        if (!itemTosell) return msg.channel.send(emb.setTitle("Dieses Item konnte nicht gefunden werden qwq"))

        player.coins += itemTosell.value;
        emb.addField("**Preis:**", itemTosell.value + " ¥[55%]")
            .addField("**Item:**", itemTosell.name)

        let needItem = (inventory.filter(item => item.name == itemTosell.name)).shift()
        let itemIndex = inventory.indexOf(needItem)
        itemIndex > -1 ? inventory.splice(itemIndex, 1) : false
        player.items = inventory
        await player.save()
        return msg.channel.send(emb)
    }
};