const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');
const itemTest = require('../../items.json')
module.exports = {
    name: 'inventory',
    syntax: 'inventory [@user] [full/rare]',
    args: false,
    description: 'Zeigt dir das Inventar eines Spielers, nutze "full" oder "rare" für genauere Auskunft darüber.',
    cooldown: 10,
    type: 'ECONEMY',
    commands: ['inventory', 'inv'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)
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
            return msg.channel.send(emb)
        } else {
            arr = []
            let Swords = 0;
            let Shields = 0;
            let Material = 0;

            let Eins = 0;
            let Zwei = 0;
            let Drei = 0;
            let Vier = 0;
            let Fünf = 0;

            switch (caseSwitch) {
                case ("normal"):
                    {
                        emb.setTitle("Inventar")
                        for (let iten of itemArray) {
                            if (item.type == "SWORD") Swords += 1;
                            if (item.type == "SHIELD") Shields += 1;
                            if (item.type == "MATERIAL") Material += 1;
                        }
                        let text = []
                        if (Swords > 1) text.push("⚔️ **Schwerter:** ⚔️ " + Swords)
                        if (Shields > 1) text.push("🛡️ **Schilder:** 🛡️ " + Shields)
                        if (Material > 1) text.push("🍃 **Material:** 🍃 " + Material)
                        emb.setDescription(text.join("\n"))
                        return msg.channel.send(emb)
                        break
                    }
                case ("rare"):
                    {
                        emb.setTitle("Inventar [Rare]")

                        for (let IID of itemArray) {
                            if (item.rare == 1) Eins += 1;
                            if (item.rare == 2) Zwei += 1;
                            if (item.rare == 3) Drei += 1;
                            if (item.rare == 4) Vier += 1;
                            if (item.rare == 5) Fünf += 1;
                        }
                        let text = []
                        if (Eins > 1) text.push("⭐  " + Eins)
                        if (Zwei > 1) text.push("⭐⭐  " + Zwei)
                        if (Drei > 1) text.push("⭐⭐⭐ " + Drei)
                        if (Vier > 1) text.push("🌟  " + Vier)
                        if (Fünf > 1) text.push("🌟🌟  " + Fünf)
                            //✨
                        emb.setDescription(text.join("\n"))
                        return msg.channel.send(emb)
                        break
                    }
                case ("full"):
                    {
                        emb.setTitle("Inventar [Full]")
                        for (let IID of itemArray) {
                            arr.push(IID)
                        }
                        arr.sort(function(a, b) {
                            var nameA = a.TYPE
                            var nameB = b.TYPE
                            if (nameA < nameB) { return -1; }
                            if (nameA > nameB) { return 1; }
                            return 0;
                        });

                        let size = arr.map(v => `[${v.ATK}/${v.DEV}] ${v.NAME} [${v.Rare}]`).join(" \n")
                        page = Math.round(size.length / 2000)

                        if (page > 1) {
                            for (let num = page; num > 1; num -= 1) {
                                let B = arr.slice(0, 55)
                                let shift = 55;
                                B = B.map(v => "[" + v.ATK + "/" + v.DEV + "] " + v.NAME + " [" + v.RARE + "]").join(" \n")
                                if (shift > 0) {
                                    arr.shift()
                                    shift -= 1;
                                }
                                emb.setDescription(B)
                                msg.channel.send(emb)
                            }
                        } else {
                            emb.setDescription(arr.map(v => `[${v.ATK}/${v.DEV}] ${v.NAME} [${v.RARE}]`).join(" \n"))
                            return msg.channel.send(emb)
                        }
                    }
                    break
                case ("value"):
                    {
                        emb.setTitle("Inventar [Value]")
                        for (let IID of itemArray) {
                            arr.push(IID)
                        }
                        arr.sort(function(a, b) {
                            var nameA = a.TYPE
                            var nameB = b.TYPE
                            if (nameA < nameB) { return -1; }
                            if (nameA > nameB) { return 1; }
                            return 0;
                        });

                        let size = arr.map(v => `${v.VALUE}¥ ${v.NAME}`).join(" \n")
                        page = Math.round(size.length / 2000)

                        if (page > 1) {
                            for (let num = page; num > 1; num -= 1) {
                                let B = arr.slice(0, 55)
                                let shift = 55;
                                B = B.map(v => v.VALUE + "¥  " + v.NAME).join(" \n")
                                if (shift > 0) {
                                    arr.shift()
                                    shift -= 1;
                                }
                                emb.setDescription(B)
                                msg.channel.send(emb)
                            }
                        } else {
                            emb.setDescription(arr.map(v => `${v.VALUE}¥ ${v.NAME}`).join(" \n"))
                            return msg.channel.send(emb)
                        }
                    }
                    break
            }
        }
    }
};