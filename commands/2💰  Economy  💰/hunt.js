const { Message } = require('discord.js');
const { rawEmb, emotes, getAnswer, calcLevel, colors } = require('../utilities');

module.exports = {
    name: 'hunt',
    syntax: 'hunt',
    args: false,
    description: 'Lässt dich Monster jagen',
    commands: ['hunt'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        user = msg.author;
        var player = await msg.client.database.player_cache.getConfig(user.id);
        let emb = rawEmb(msg)
        ////////////////////////// -- ITEM BREAK --/////////////////////////////
        var inventory = await msg.client.database.order_cache.getInventory(user.id)
        ///////////////////////////////////////////////////////////////////////

        var enemy = await msg.client.database.monster_cache.getEnemy()

        let P_Lifes = player.HP + parseInt(calcLevel(player.XP));
        console.log(P_Lifes)
        let E_Lifes = enemy.HP,
            rare = ""

        ////////////////////////// -- Vorbereitung --/////////////////////////////
        if (enemy.RARE == 1) rare = "⭐"
        if (enemy.RARE == 2) rare = "⭐⭐"
        if (enemy.RARE == 3) rare = "⭐⭐⭐"
        if (enemy.RARE == 4) rare = "🌟"
        if (enemy.RARE == 5) rare = "🌟🌟"

        msg.channel.send(emb.setDescription("**" + enemy.NAME + `** ${rare}
        \n ⚔️ [${enemy.ATK}]  ${emotes.shield} [${enemy.DEV}]  ❤️ [${E_Lifes}]`).setColor(colors.warning))
        let quest = "Möchtest du Kämpfen"
        let answer = await getAnswer(msg, quest + "?", 30)
        if (answer !== "yes" && answer !== "ja" && answer !== "Yes" && answer !== "Ja") return msg.channel.send(emb.setDescription("Kampf abgebrochen"))

        if (player.WEAPON)
            if (player.WEAPON !== "0" && player.WEAPON !== 0) { var weapon = (await msg.client.database.item_cache.getConfig(player.WEAPON)).ATK }
            else { weapon = 0 }
        if (player.SHIELD !== "0" && player.SHIELD !== 0) { var shield = (await msg.client.database.item_cache.getConfig(player.SHIELD)).DEV }
        else { shield = 0 }

        let r = 0;

        if (enemy.DEV > player.WEAPON) emb.setFooter("Die Defensive des Gegners war stärker du")
        var Damage = player.WEAPON - enemy.DEV;
        var PDamage = enemy.ATK - shield;
        if (Math.sign(Damage) == -1) Damage = 1

        while (P_Lifes > 0 && E_Lifes > 0) {
            E_Lifes -= Damage;
            P_Lifes -= PDamage;
            r = r + 1;
        }
        emb.setFooter(r + (r > 1 ? " Runden" : "Runde"))

        if (E_Lifes <= 0) {
            let loot = enemy.DROPRATE;
            if (enemy.DROPRATE < 2) loot = 1;
            let arr = [];
            player.COINS += parseInt(enemy.DROPCOIN);
            await player.save()
            while (loot > 0) {
                let item = (await msg.client.database.item_cache.getItem())
                if (item.RARE == enemy.RARE) {
                    if (item.TYPE == "SWORD") t = `**[ ⚔️ ATK:  ${item.ATK} ]**`
                    if (item.TYPE == "SHIELD") t = `**[ ${emotes.shield} DEF:  ${item.DEV} ]**`
                    if (item.TYPE == "MATERIAL") t = "**[ 🍃 ]**"
                    arr.push(`${t} ` + item.NAME)
                    let order = await msg.client.database.order_cache.setOrder(item.IID, user.id)
                    await order.save()
                    loot -= 1;
                }
            }

            let Dropped = ""
            let value = percent()
            if (value == "drop") {
                var drop = inventory[Math.floor(Math.random() * inventory.length)];
                inventory = await msg.client.database.order_cache.deleteOrder(drop.IID, user.id)
                drop = await msg.client.database.item_cache.getConfig(drop.IID)
                drop = `${drop.NAME}`
                Dropped = "\n \n**Dropped** " + drop
            } else { }
            if (arr.length == 0) arr.push("Kein Loot qwq", "qwq")
            return msg.channel.send(emb.setTitle("Sieg").setDescription(arr.join("\n") + `${Dropped}`).setColor(colors.success))
        }

        if (P_Lifes <= 0) {
            if (player.COINS > 10) player.COINS -= 10;
            let value = percent()


            if (value == "drop") {
                msg.channel.send("Dropped something qwq")
            } else { }


            await player.save()
            return msg.channel.send(emb.setTitle("Niederlage").setDescription("Du verlierst 10 Coins (falls du so viele besitzt)").setColor(colors.error))
        }
    }
};

function percent() {
    var rand = ["drop", "0", "0", "0"];
    return rand[Math.floor(Math.random() * rand.length)];
}