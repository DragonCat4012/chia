const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');
const shopItems = require('../../items.json')

module.exports = {
    name: 'equip',
    syntax: 'equip <item>',
    args: true,
    description: 'Lässt dich Items ausrüsten',
    cooldown: 5,
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

        let item = (inventory.filter(e => e.name.toLowerCase() == args[0].toLowerCase())).shift()
        if (!item) return msg.channel.send(emb.setTitle("Dieses Item konnte nicht gefunden werden qwq"))
        if (item.type !== "sword" && item.type !== "shield") return msg.channel.send(emb.setTitle("Du kannst nur Schilder oder Schwerter ausrüsten"))

        if (item.type == "sword") {
            if (player.weapon) {
                let oldWeapon = (shopItems.filter(e => e.name.toLowerCase() == player.weapon.toLowerCase())).shift()
                emb.addField("Voherige Waffe", (oldWeapon.name + " [" + oldWeapon.ATK + "/" + oldWeapon.DEF + "]"))
            }
            player.weapon = item.name;
            emb.addField("**Jetzige Waffe:**", (item.name + " [" + item.ATK + "/" + item.DEF + "]"))
            return player.save().then(() => msg.channel.send(emb));

        } else if (item.type == "shield") {
            if (player.shield) {
                let oldShield = (shopItems.filter(e => e.name.toLowerCase() == player.shield.toLowerCase())).shift()
                emb.addField("Voheriges Schild", (oldShield.name + " [" + oldShield.ATK + "/" + oldShield.DEF + "]"))
            }
            player.shield = item.name
            emb.addField("**Jetziges Schild:**", (item.name + " [" + item.ATK + "/" + item.DEF + "]"))
            return player.save().then(() => msg.channel.send(emb));
        }
        return msg.channel.send(emb)
    }
};