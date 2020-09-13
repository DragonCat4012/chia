const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'sell',
    syntax: 'sell <item>',
    args: true,
    description: 'Lässt dich Items verkaufen',
    commands: ['sell'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        user = msg.author;

        var player = await msg.client.database.player_cache.getConfig(user.id);
        let emb = rawEmb(msg).setTitle("Item Verkauf")

        var order = await msg.client.database.order_cache.getInventory(user.id)
        let arr = [];

        for (let IID of order) {
            var item = await msg.client.database.item_cache.getConfig(IID.IID);
            if (msg.content.toLowerCase().includes(item.NAME.toLowerCase()))
                arr.push(item)
        }


        item = arr[0];
        if (arr.length < 1) return msg.channel.send(emb.setTitle("Dieses Item konnte nicht gefunden werden qwq"))


        item = await msg.client.database.item_cache.getConfig(item.IID)
        let value = item.VALUE;

        value = Math.floor(value * 0.45)
        player.COINS += value;

        emb.addField("**Preis:**", item.VALUE + " ¥[55%]")
            .addField("**Item:**", item.NAME)
        await player.save()
        order = (await msg.client.database.order_cache.deleteOrder(item.IID, user.id))
        //await order.save()

        return msg.channel.send(emb)



    }
};
