const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');
const shopItems = require('../../items.json')

module.exports = {
    name: 'equip',
    syntax: 'equip <item>',
    args: true,
    description: 'Lässt dich Items ausrüsten',
    type: 'ECONEMY',
    commands: ['equip'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        var player = await msg.client.database.UserConfigCache.getConfig(msg.author.id);
        let emb = rawEmb(msg).setTitle("Equip")
        var inventory = player.items.toObject()

        let playerItem = (inventory.filter(e => e.itemID == args[0])).shift()
        if (!playerItem) return msg.channel.send(emb.setTitle("Dieses Item besitzt du nicht"))
        if (playerItem.type !== "sword" && playerItem.type !== "shield") return msg.channel.send(emb.setTitle("Du kannst nur Schilder oder Schwerter ausrüsten").setColor(colors.error)).catch()

        let item = (shopItems.filter(e => e.itemID == args[0])).shift()
        if (!item) return msg.channel.send(emb.setTitle("Dieses Item konnte nicht gefunden werden qwq").setColor(colors.error)).catch()

        if (item.type == "sword") {
            if (player.weapon) {
                let oldWeapon = (shopItems.filter(e => e.itemID == player.weapon)).shift()
                emb.addField("Voherige Waffe", (oldWeapon.name + " [" + oldWeapon.ATK + "/" + oldWeapon.DEF + "]"))
            }
            player.weapon = item.itemID;
            emb.addField("**Jetzige Waffe:**", (item.name + " [" + item.ATK + "/" + item.DEF + "]"))
            return player.save().then(() => msg.channel.send(emb).catch());

        } else if (item.type == "shield") {
            if (player.shield) {
                let oldShield = (shopItems.filter(e => e.itemID == player.shield)).shift()
                emb.addField("Voheriges Schild", (oldShield.name + " [" + oldShield.ATK + "/" + oldShield.DEF + "]"))
            }
            player.shield = item.itemID
            emb.addField("**Jetziges Schild:**", (item.name + " [" + item.ATK + "/" + item.DEF + "]"))
            return player.save().then(() => msg.channel.send(emb).catch());
        }
        return msg.channel.send(emb)
    }
};