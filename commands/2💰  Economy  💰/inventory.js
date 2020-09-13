const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'inventory',
    syntax: 'inventory [@user] || inevntory [@user] full/rare',
    args: false,
    description: 'Zeigt dir das Inventar eines Spielers. Nutze `full` um dein vollständioges Inventar angezeigt zu bekommen. Nach Seltenheit nutze `rare`.',
    commands: ['inventory', 'inv'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let user;
        if (msg.mentions.users.first()) {
            user = msg.mentions.users.first();
        } else { user = msg.author; }

        let S = "Normal"
        if (args[1] == "full" || args[0] == "full") S = "Full"
        if (args[1] == "rare" || args[0] == "rare") S = "Rare"


        var player = await msg.client.database.player_cache.getConfig(user.id);
        let emb = rawEmb(msg).setTitle("Inventar")

        let uid = user.id
        var order = await msg.client.database.order_cache.getInventory(uid)

        if (!order || order == undefined) {
            emb.setDescription("Du besitzt noch keine Items")
            return msg.channel.send(emb)
        } else {
            arr = []

            switch (S) {
                case ("Normal"): {
                    let Swords = 0;
                    let Shields = 0;
                    let Material = 0;

                    for (let IID of order) {
                        var item = await msg.client.database.item_cache.getConfig(IID.IID);
                        if (item.TYPE == "SWORD") Swords += 1;
                        if (item.TYPE == "SHIELD") Shields += 1;
                        if (item.TYPE == "MATERIAL") Material += 1;
                    }
                    let text = []
                    if (Swords > 1) text.push("⚔️ **Schwerter:** ⚔️ " + Swords)
                    if (Shields > 1) text.push("🛡️ **Schilder:** 🛡️ " + Shields)
                    if (Material > 1) text.push("🍃 **Material:** 🍃 " + Material)
                    emb.setDescription(text.join("\n"))
                    return msg.channel.send(emb)
                }
                case ("Rare"): {
                    let Eins = 0;
                    let Zwei = 0;
                    let Drei = 0;
                    let Vier = 0;
                    let Fünf = 0;

                    for (let IID of order) {
                        var item = await msg.client.database.item_cache.getConfig(IID.IID);
                        if (item.RARE == 1) Eins += 1;
                        if (item.RARE == 2) Zwei += 1;
                        if (item.RARE == 3) Drei += 1;
                        if (item.RARE == 4) Vier += 1;
                        if (item.RARE == 5) Fünf += 1;
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
                }
                case ("Full"): {
                    for (let IID of order) {
                        var item = await msg.client.database.item_cache.getConfig(IID.IID);
                        arr.push(item)
                    }
                    arr.sort(function (a, b) {
                        var nameA = a.TYPE
                        var nameB = b.TYPE
                        if (nameA < nameB) { return -1; }
                        if (nameA > nameB) { return 1; }
                        return 0;
                    });

                    let size = arr.map(v => `[${v.ATK}/${v.DEV}] ¥${v.VALUE} ${v.NAME}`).join(" \n")
                    page = Math.round(size.length / 2000)
                    console.log(page)

                    if (page > 1) {
                        for (let num = page; num > 1; num -= 1) {
                            let B = arr.slice(0, 55)
                            let shift = 55;
                            B = B.map(v => "[" + v.ATK + "/" + v.DEV + "] " + v.VALUE + "¥  " + v.NAME).join(" \n")
                            if (shift > 0) {
                                arr.shift()
                                shift -= 1;
                            }
                            emb.setDescription(B)
                            msg.channel.send(emb)
                        }
                    } else {
                        emb.setDescription(arr.map(v => `[${v.ATK}/${v.DEV}] ¥${v.VALUE} ${v.NAME}`).join(" \n"))
                        return msg.channel.send(emb)
                    }
                }
            }


        }
    }
};