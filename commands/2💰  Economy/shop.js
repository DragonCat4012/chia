const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');
const shopItems = require('../../items.json')

module.exports = {
    name: 'shop',
    syntax: 'shop',
    args: false,
    description: 'Zeigt dir alle verfügbaren Items',
    type: 'ECONEMY',
    commands: ['shop'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let emb = rawEmb(msg).setTitle("Shop").setFooter(shopItems.length + " Items insgesamt")

        let text = "",
            t
        for (let item of shopItems) {
            if (item.buyable) {
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
        }
        emb.setDescription(text)
        msg.channel.send(emb)
    }
};