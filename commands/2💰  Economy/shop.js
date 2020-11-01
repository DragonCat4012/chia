const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'shop',
    syntax: 'shop',
    args: false,
    description: 'Zeigt dir alle verfügbaren Items',
    commands: ['items', 'shop'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        var shop = await msg.client.database.item_cache.getShop();
        let emb = rawEmb(msg).setTitle("Shop").setFooter(shop.length + " Items insgesamt")

        text = ""
        for (let IID of shop) {
            var item = await msg.client.database.item_cache.getConfig(IID.IID);
            if (!item) console.log("Failure by detecting Item")
            if (item.BUYABLE) {
                if (item.RARE == "1") {
                    if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                    if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                    if (item.TYPE == "MATERIAL") t = "[🍃]"
                    text = (text + `**${item.VALUE}¥** ⭐ ${item.NAME} ${t}\n`)
                } else if (item.RARE == "2") {
                    if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                    if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                    if (item.TYPE == "MATERIAL") t = "[🍃]"
                    text = (text + `**${item.VALUE}¥** ⭐⭐ ${item.NAME} ${t}\n`)
                } else if (item.RARE == "3") {
                    if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                    if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                    if (item.TYPE == "MATERIAL") t = "[🍃]"
                    text = (text + `**${item.VALUE}¥** ⭐⭐⭐ ${item.NAME} ${t}\n`)
                } else if (item.RARE == "4") {
                    if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                    if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                    if (item.TYPE == "MATERIAL") t = "[🍃]"
                    text = (text + `**${item.VALUE}¥** 🌟 ${item.NAME} ${t}\n`)
                } else if (item.RARE == "5") {
                    if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                    if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                    if (item.TYPE == "MATERIAL") t = "[🍃]"
                    text = (text + `**${item.VALUE}¥** 🌟🌟 ${item.NAME} ${t}\n`)
                } else {
                    if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                    if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                    if (item.TYPE == "MATERIAL") t = "[🍃]"
                    text = (text + `**${item.VALUE}¥** ${item.NAME} ${t}\n`)
                }
            }
        }
        emb.setDescription(text)
        msg.channel.send(emb)
    }
};