const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');
const shopItems = require('../../items.json')

module.exports = {
    name: 'items',
    syntax: 'items',
    args: false,
    description: 'Zeigt dir alle Items',
    cooldown: 10,
    type: 'ECONEMY',
    commands: ['items'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let emb = rawEmb(msg).setTitle("Alle Items").setFooter(shopItems.length + " Items insgesamt")
        let arr = []

        let text = "",
            t
        for (let item of shopItems) {
            if (item.rare == 1) {
                if (item.type == "sword") t = `[⚔️ ${item.ATK}]`
                if (item.type == "shield") t = `[${emotes.shield} ${item.DEF}]`
                if (item.type == "material") t = "[🍃]"
                text = (text + `**${item.value}¥** ⭐ ${item.name} ${t}\n`)
            } else if (item.rare == 2) {
                if (item.type == "sword") t = `[⚔️ ${item.ATK}]`
                if (item.type == "shield") t = `[${emotes.shield} ${item.DEF}]`
                if (item.type == "material") t = "[🍃]"
                text = (text + `**${item.value}¥** ⭐⭐ ${item.name} ${t}\n`)
            } else if (item.rare == 3) {
                if (item.type == "sword") t = `[⚔️ ${item.ATK}]`
                if (item.type == "shield") t = `[${emotes.shield} ${item.DEF}]`
                if (item.type == "material") t = "[🍃]"
                text = (text + `**${item.value}¥** ⭐⭐⭐ ${item.name} ${t}\n`)
            } else if (item.rare == 4) {
                if (item.type == "sword") t = `[⚔️ ${item.ATK}]`
                if (item.type == "shield") t = `[${emotes.shield} ${item.DEF}]`
                if (item.type == "material") t = "[🍃]"
                text = (text + `**${item.value}¥** 🌟 ${item.name} ${t}\n`)
            } else if (item.rare == 5) {
                if (item.type == "sword") t = `[⚔️ ${item.ATK}]`
                if (item.type == "shield") t = `[${emotes.shield} ${item.DEF}]`
                if (item.type == "material") t = "[🍃]"
                text = (text + `**${item.value}¥** 🌟🌟 ${item.name} \n`)
            } else {
                if (item.type == "sword") t = `[⚔️ ${item.ATK}]`
                if (item.type == "shield") t = `[${emotes.shield} ${item.DEF}]`
                if (item.type == "material") t = "[🍃]"
                text = (text + `**${item.value}¥** ${item.name} ${t}\n`)
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