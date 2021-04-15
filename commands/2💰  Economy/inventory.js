const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');
const allItems = require('../../items.json')

module.exports = {
    name: 'inventory',
    syntax: 'inventory [@user] [full/value]',
    args: false,
    description: 'Zeigt dir das Inventar eines Spielers, nutze "full" oder "value" für genauere Auskunft darüber.',
    type: 'ECONEMY',
    commands: ['inventory', 'inv'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg).setTitle("Inventar")
        let user;
        if (msg.mentions.users.first()) {
            user = msg.mentions.users.first();
        } else { user = msg.author; }

        if (user.bot) {
            emb.setDescription("Bots besitzen kein Inventar qwq")
            return msg.channel.send(emb.setColor(colors.error))
        }

        let caseSwitch = args[0] ? args[0].toLowerCase() : 'normal'
        let optionsArray = ['full', 'rare', 'value']
        if (!optionsArray.includes(caseSwitch)) caseSwitch = 'normal'

        let uid = user.id
        let userProfile = await msg.client.database.UserConfigCache.getConfig(uid)
        let itemArray = userProfile.items.toObject()

        if (!itemArray.length > 0) {
            emb.setDescription(user.username + " besitzt noch keine Items!")
            return msg.channel.send(emb.setColor(colors.error))
        }
        let inventory = itemArray

        arr = []
        let Swords = 0;
        let Shields = 0;
        let Material = 0;

        let Eins = 0;
        let Zwei = 0;
        let Drei = 0;
        let Vier = 0;
        let Fünf = 0;

        emb.setFooter(inventory.length + ' Items')

        switch (caseSwitch) {
            case ("normal"):
                {
                    let text = []
                    for (let item of inventory) {
                        if (!item) continue
                        if (item.type) {
                            if (item.type == "sword") Swords += 1;
                            if (item.type == "shield") Shields += 1;
                            if (item.type == "material") Material += 1;
                        }

                        if (item.rare == 1) Eins += 1;
                        if (item.rare == 2) Zwei += 1;
                        if (item.rare == 3) Drei += 1;
                        if (item.rare == 4) Vier += 1;
                        if (item.rare == 5) Fünf += 1;

                    }
                    text.push('**Item Typen**')
                    if (Swords >= 1) text.push("⚔️ **Schwerter:** " + Swords)
                    if (Shields >= 1) text.push("🛡️ **Schilder:** " + Shields)
                    if (Material >= 1) text.push("🍃 **Material:** " + Material)

                    text.push('\n **Item Seltenheiten**')

                    if (Eins >= 1) text.push("⭐  " + Eins)
                    if (Zwei >= 1) text.push("⭐⭐  " + Zwei)
                    if (Drei >= 1) text.push("⭐⭐⭐ " + Drei)
                    if (Vier >= 1) text.push("🌟  " + Vier)
                    if (Fünf >= 1) text.push("🌟🌟  " + Fünf)

                    emb.setDescription(text.join("\n"))
                    return msg.channel.send(emb)
                    break
                }
            case ("full"):
                {
                    arr = inventory
                    emb.setTitle("Inventar [Full]")

                    arr.sort(function (a, b) {
                        var nameA = a.type
                        var nameB = b.type
                        if (nameA < nameB) { return -1; }
                        if (nameA > nameB) { return 1; }
                        return 0;
                    });
                    let size = arr.map(v => `10 - [${v.ATK}/${v.DEF}] ${v.name} [${v.rare}]`).join(" \n")
                    page = Math.round(size.length / 2000)

                    if (page > 1) {
                        for (let num = page; num > 1; num -= 1) {
                            let B = arr.slice(0, 55)
                            let shift = 55;
                            B = B.map(v => `${v.itemID} - [${v.ATK}/${v.DEF}] ${v.name} [${v.rare}]`).join(" \n")
                            if (shift > 0) {
                                arr.shift()
                                shift -= 1;
                            }
                            emb.setDescription(B)
                            msg.channel.send(emb)
                        }
                    } else {
                        emb.setDescription(arr.map(v => `${v.itemID} - [${v.ATK}/${v.DEF}] ${v.name} [${v.rare}]`).join(" \n"))
                        return msg.channel.send(emb)
                    }
                }
                break
            case ("value"):
                {
                    emb.setTitle("Inventar [Value]")
                    arr = inventory

                    arr.sort(function (a, b) {
                        var nameA = a.type
                        var nameB = b.type
                        if (nameA < nameB) { return -1; }
                        if (nameA > nameB) { return 1; }
                        return 0;
                    });

                    let size = arr.map(v => `${v.itemID} - ${v.value}¥ ${v.name}`).join(" \n")
                    page = Math.round(size.length / 2000)

                    if (page > 1) {
                        for (let num = page; num > 1; num -= 1) {
                            let B = arr.slice(0, 55)
                            let shift = 55;
                            B = B.map(v => `${v.itemID} - ${v.value}¥ ${v.name}`).join(" \n")
                            if (shift > 0) {
                                arr.shift()
                                shift -= 1;
                            }
                            emb.setDescription(B)
                            msg.channel.send(emb)
                        }
                    } else {
                        emb.setDescription(arr.map(v => `${v.itemID} - ${v.value}¥ ${v.name}`).join(" \n"))
                        return msg.channel.send(emb)
                    }
                }
                break
        }

    }
};