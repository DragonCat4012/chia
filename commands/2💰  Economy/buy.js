const { Message } = require('discord.js');
const { rawEmb, colors } = require('../utilities');
const shopItems = require('../../items.json')

module.exports = {
    name: 'buy',
    syntax: 'buy <item>',
    args: true,
    description: 'Lässt dich Items kaufen',
    type: 'ECONEMY',
    commands: ['buy'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        var userProfile = await msg.client.database.UserConfigCache.getConfig(msg.author.id);
        let emb = rawEmb().setTitle("Item Kaufen")

        let arr = []
        for (let item of shopItems) {
            if (msg.content.toLowerCase().includes(item.name.toLowerCase()))
                arr.push(item)
        }
        item = arr[0];
        if (arr.length < 1) return msg.channel.send(emb.setTitle("Dieses Item konnte nicht gefunden werden qwq").setColor(colors.error)).catch()

        if (!item.price) return msg.channel.send(emb.setDescription("Dieses Item steht nicht zum Verkauf").setColor(colors.error)).catch()

        userProfile.coins -= item.price;
        let oldItems = userProfile.items.toObject()
        oldItems.push(item)
        userProfile.items = oldItems;

        emb.setDescription(`**${item.name}** für ¥${item.price} gekauft`)
        await userProfile.save()
        return msg.channel.send(emb).catch()
    }
};