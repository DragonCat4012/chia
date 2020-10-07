const { Message } = require('discord.js');
const { rawEmb, emotes, calcLevel } = require('../utilities');

module.exports = {
    name: 'Profile',
    syntax: 'profile [@user]',
    args: false,
    description: 'Zeigt dir die Spieler Karte eines Spielers',
    commands: ['profile', 'bal', 'money'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let user;
        let emb = rawEmb(msg)
        if (msg.mentions.users.first()) {
            user = msg.mentions.users.first();
        } else { user = msg.author; }

        if (user.bot) {
            emb.setDescription("Bots haben kein Profil qwq")
            return msg.channel.send(emb.setColor(colors.error))
        }


        var player = await msg.client.database.player_cache.getConfig(user.id);
        var AK = 0;
        var DK = 0;
        emb.setTitle("Profil")

        if (player.WEAPON == "0") { a = emotes.false } else {
            let id = player.WEAPON
            let uid = user.id
            var order = await msg.client.database.order_cache.getOrder(id, uid)
            if (!order || order == undefined) {
                a = emotes.false
            } else {
                var item = await msg.client.database.item_cache.getConfig(order.IID);
                if (item == undefined || item == null || !item) {
                    msg.channel.send("Schwert konnte nicht identifiziert werden")
                    a = emotes.false;
                } else if (item.TYPE !== "SWORD") { a = emotes.false } else { a = item.NAME + "  [" + item.ATK + "/" + item.DEV + "]" }
            }

            AK += parseInt(item.ATK)
            DK += parseInt(item.DEV)

        }

        if (player.SHIELD == "0") { b = emotes.false } else {
            let id = player.SHIELD
            let uid = user.id
            var order = await msg.client.database.order_cache.getOrder(id, uid)
            if (!order || order == undefined) {
                b = emotes.false
            } else {
                item = await msg.client.database.item_cache.getConfig(order.IID);

                if (item == undefined || item == null || !item) {
                    msg.channel.send("Schild konnte nicht identifiziert werden")
                    b = emotes.false;
                } else if (item.TYPE !== "SHIELD") { b = emotes.false } else { b = item.NAME + "  [" + item.ATK + "/" + item.DEV + "]" }
            }
            AK += parseInt(item.ATK)
            DK += parseInt(item.DEV)
        }

        let query = parseInt(user.id)
        var cache = msg.client.database.player_cache.array();
        cache = cache.sort((a, b) => (parseInt(b.RANK) + parseInt(b.RANK)) - (parseInt(a.RANK) + parseInt(a.RANK)))
        let A = cache.find(user => user.UID == query)
        let rank = cache.indexOf(A) + 1

        emb.addField("⚔️", a)
            .addField(emotes.shield, b)
            .addField("**Münzen: **", (player.COINS).toLocaleString() + "¥")
            .addField("**Level: **", calcLevel(player.XP))
            .addField("**Kampfstärke gesamt:**", `[${AK}/${DK}]`)
            .addField("**Rank:**", `${player.RANK} [${rank}]`)

        msg.channel.send(emb)
    }
};