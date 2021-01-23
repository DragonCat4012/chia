const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'buy',
    syntax: 'buy <item>',
    args: true,
    description: 'Lässt dich Items kaufen',
    cooldown: 10,
    type: 'ECONEMY',
    commands: ['buy'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        user = msg.author;

        var player = await msg.client.database.player_cache.getConfig(user.id);
        let emb = rawEmb(msg).setTitle("Item Kaufen")

        var shop = await msg.client.database.item_cache.getShop()
        let arr = [];

        for (let IID of shop) {
            var item = await msg.client.database.item_cache.getConfig(IID.IID);
            if (msg.content.toLowerCase().includes(item.NAME.toLowerCase()))
                arr.push(item)
        }

        item = arr[0];
        if (arr.length < 1) return msg.channel.send(emb.setTitle("Dieses Item konnte nicht gefunden werden qwq"))

        item = await msg.client.database.item_cache.getConfig(item.IID)

        if (item.SALE == "0") { msg.channel.send(emb.setDescription("Dieses Item steht nicht zum Verkauf")) } else {
            let value = parseInt(item.VALUE);

            player.COINS -= value;

            let order = await msg.client.database.order_cache.setOrder(item.IID, user.id);

            emb.setDescription(`**${item.NAME}** für ¥${item.VALUE} gekauft`)
            await order.save()
            await player.save()
            return msg.channel.send(emb)
        }
    }
};