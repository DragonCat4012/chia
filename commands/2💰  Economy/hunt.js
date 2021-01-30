const { Message } = require('discord.js');
const { rawEmb, emotes, getAnswer, calcLevel, colors } = require('../utilities');

module.exports = {
    name: 'hunt',
    syntax: 'hunt',
    args: false,
    description: 'Lässt dich Monster jagen',
    cooldown: 15,
    type: 'ECONEMY',
    commands: ['hunt'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        //    return msg.channel.send('Dieser Cmd ist zurzeit in Wartung qwq')
        user = msg.author;
        msg.client.guilds.cache.size
        var player = await msg.client.database.UserConfigCache.getConfig(user.id);
        let emb = rawEmb(msg)

        ////////////////////////// -- Stamina BREAK --/////////////////////////////
        if (player.STAMINA <= 5) {
            emb.setDescription('**Du benötigst 5 Ausdauer zum kämpfen. Diese werden jeden Tag zurück gesetzt, bitte warte bis deine Ausdauer wieder aufgefüllt ist**')
            return msg.channel.send(emb.setColor(colors.error))
        }
        ////////////////////////// -- ITEM BREAK --/////////////////////////////
        var inventory = await msg.client.database.order_cache.getInventory(user.id)
        var enemy = await msg.client.database.monster_cache.getEnemy(),
            rare = ""
            ////////////////////////// -- Vorbereitung --/////////////////////////////
        if (enemy.rare == 1) rare = "⭐"
        if (enemy.rare == 2) rare = "⭐⭐"
        if (enemy.rare == 3) rare = "⭐⭐⭐"
        if (enemy.rare == 4) rare = "🌟"
        if (enemy.rare == 5) rare = "🌟🌟"

        msg.channel.send(emb.setDescription("**" + enemy.NAME + `** ${rare}
        \n ⚔️ [${enemy.ATK}]  ${emotes.shield} [${enemy.DEF}]  ❤️ [${enemy.HP}]`).setColor(colors.warning))
        let quest = "Möchtest du Kämpfen"
        let answer = await getAnswer(msg, quest + "?", 30)
        if (answer !== "yes" && answer !== "ja" && answer !== "Yes" && answer !== "Ja") return msg.channel.send(emb.setDescription("Kampf abgebrochen"))

        if (player.WEAPON !== "0" && player.WEAPON !== 0) { var weapon = (await msg.client.database.item_cache.getConfig(player.WEAPON)).ATK } else { weapon = 0 }
        if (player.SHIELD !== "0" && player.SHIELD !== 0) { var shield = (await msg.client.database.item_cache.getConfig(player.SHIELD)).DEF } else { shield = 0 }

        let r = 0;
        player.STAMINA -= 5;
        await player.save()

        var monster = {
            ATK: parseInt(enemy.ATK),
            DEF: parseInt(enemy.DEF),
            HP: parseInt(enemy.HP)
        }
        var fighter = {
            HP: parseInt(player.HP) + parseInt(calcLevel(player.XP)),
            ATK: parseInt(weapon),
            DEF: parseInt(shield),
        }
        if (monster.DEF > fighter.ATK) emb.setFooter("Die Defensive des Gegners war stärker du")

        var Damage = (fighter.ATK) - (monster.DEF);
        var PDamage = (monster.ATK) - (fighter.DEF);

        if (Math.sign(Damage) == -1) Damage = Damage * -1
        if (Math.sign(PDamage) == -1) PDamage = PDamage * -1

        while (fighter.HP > 0 && monster.HP > 0) {
            monster.HP -= Damage;
            fighter.HP -= PDamage;
            r = r + 1;
        }
        emb.setFooter(r + (r > 1 ? " Runden" : " Runde"))

        let Dropped = ""
        let value = percent()

        if (monster.HP <= 0) {
            let loot = enemy.DROPRATE;
            if (enemy.DROPRATE < 2) loot = 1;
            let arr = [];
            player.COINS += parseInt(enemy.DROPCOIN);
            await player.save()
            while (loot > 0) {
                let item = (await msg.client.database.item_cache.getItem())
                if (item.rare == enemy.rare) {
                    if (item.type == "SWORD") t = `**[ ⚔️ ATK:  ${item.ATK} ]**`
                    if (item.type == "SHIELD") t = `**[ ${emotes.shield} DEF:  ${item.DEF} ]**`
                    if (item.type == "MATERIAL") t = "**[ 🍃 ]**"
                    arr.push(`${t} ` + item.NAME)
                    let order = await msg.client.database.order_cache.setOrder(item.IID, user.id)
                    await order.save()
                    loot -= 1;
                }
            }

            if (value == "drop") {
                var drop = inventory[Math.floor(Math.random() * inventory.length)];
                inventory = await msg.client.database.order_cache.deleteOrder(drop.IID, user.id)
                drop = await msg.client.database.item_cache.getConfig(drop.IID)
                drop = `${drop.NAME}`
                Dropped = "\n \n**Dropped** " + drop
            }
            if (arr.length == 0) arr.push("Kein Loot qwq", "qwq")
            return msg.channel.send(emb.setTitle("Sieg").setDescription(arr.join("\n") + `${Dropped}`).setColor(colors.success))
        }

        if (fighter.HP <= 0) {
            if (player.COINS > 10) player.COINS -= 10;
            if (value == "drop") {
                var drop = inventory[Math.floor(Math.random() * inventory.length)];
                inventory = await msg.client.database.order_cache.deleteOrder(drop.IID, user.id)
                drop = await msg.client.database.item_cache.getConfig(drop.IID)
                drop = `${drop.NAME}`
                Dropped = "\n \n**Dropped** " + drop
            }
            await player.save()
            return msg.channel.send(emb.setTitle("Niederlage").setDescription("Du verlierst 10 Coins.").setColor(colors.error))
        }
        msg.channel.send('Nuuuuuuuuuu')
    }
};

function percent() {
    var rand = ["drop", "0", "0", "0"];
    return rand[Math.floor(Math.random() * rand.length)];
}