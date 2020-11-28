const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'items',
    syntax: 'items',
    args: false,
    description: 'Zeigt dir alle Items',
    cooldown: 10,
    commands: ['items'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        var shop = await msg.client.database.item_cache.getShop();
        let emb = rawEmb(msg).setTitle("Alle Items").setFooter(shop.length + " Items insgesamt")
        let arr = []

        text = ""
        for (let IID of shop) {
            var item = await msg.client.database.item_cache.getConfig(IID.IID);
            if (!item) console.log("Failure by detecting Item")

            if (item.RARE == "1") {
                if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                if (item.TYPE == "MATERIAL") t = "[🍃]"
                arr.push(`**${item.VALUE}¥** ⭐ ${item.NAME} ${t}`)
            } else if (item.RARE == "2") {
                if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                if (item.TYPE == "MATERIAL") t = "[🍃]"
                arr.push(`**${item.VALUE}¥** ⭐⭐ ${item.NAME} ${t}`)
            } else if (item.RARE == "3") {
                if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                if (item.TYPE == "MATERIAL") t = "[🍃]"
                arr.push(`**${item.VALUE}¥** ⭐⭐⭐ ${item.NAME} ${t}`)
            } else if (item.RARE == "4") {
                if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                if (item.TYPE == "MATERIAL") t = "[🍃]"
                arr.push(`**${item.VALUE}¥** 🌟 ${item.NAME} ${t}`)
            } else if (item.RARE == "5") {
                if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                if (item.TYPE == "MATERIAL") t = "[🍃]"
                arr.push(`**${item.VALUE}¥** 🌟🌟 ${item.NAME} ${t}`)
            } else {
                if (item.TYPE == "SWORD") t = `[⚔️ ${item.ATK}]`
                if (item.TYPE == "SHIELD") t = `[${emotes.shield} ${item.DEV}]`
                if (item.TYPE == "MATERIAL") t = "[🍃]"
                arr.push(`**${item.VALUE}¥** ${item.NAME} ${t}`)
            }


        }

        let size = (arr.join('\n')).length
        page = Math.round(size / 2000)
        if (page > 1) {
            for (let num = page; num > 1; num -= 1) {
                let B = arr.slice(0, 55)
                let shift = 55;
                B = B.join(" \n")
                if (shift > 0) {
                    arr.shift()
                    shift -= 1;
                }
                emb.setDescription(B)
                msg.channel.send(emb)
            }
        } else {
            emb.setDescription(arr.join(" \n"))
            return msg.channel.send(emb)
        }

        //  emb.setDescription(text)
        //    msg.channel.send(emb)
    }
};