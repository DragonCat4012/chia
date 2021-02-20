const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');
const shopItems = require('../../items.json')

module.exports = {
    name: 'sell',
    syntax: 'sell <itemID>',
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

        let itemTosell = (inventory.filter(e => e.itemID == parseInt(args[0]))).shift()
        var itemValue = (shopItems.filter(e => e.itemID == parseInt(args[0]))).shift()

        if (!itemTosell) return msg.channel.send(emb.setTitle("Du besitzt dieses Item nicht qwq").setColor(colors.error))
        if (!itemValue) return msg.channel.send(emb.setTitle("Dieses Item konnte nicht gefunden werden qwq").setColor(colors.error))

        player.coins += itemValue.value;
        emb.addField("**Preis:**", itemValue.value + " ¥[55%]")
            .addField("**Item:**", itemValue.name)

        let needItem = (inventory.filter(item => item.itemID == itemValue.itemID)).shift()
        let itemIndex = inventory.indexOf(needItem)
        itemIndex > -1 ? inventory.splice(itemIndex, 1) : false
        player.items = inventory
        await player.save()
        return msg.channel.send(emb)
    }
};