const { Message } = require('discord.js');
const { rawEmb, emotes, getAnswer, calcLevel, colors } = require('../utilities');
const monsterArray = require('../../monster.json')
const shopItems = require('../../items.json')

module.exports = {
    name: 'hunt',
    syntax: 'hunt',
    args: false,
    description: 'Lässt dich Monster jagen',
    cooldown: 8,
    type: 'ECONEMY',
    commands: ['hunt'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        var player = await msg.client.database.UserConfigCache.getConfig(msg.author.id);
        let emb = rawEmb(msg)
        ////////////////////////// -- Stamina BREAK --/////////////////////////////
        if (player.stamina <= 5) {
            emb.setDescription('**Du benötigst 5 Ausdauer zum kämpfen. Diese werden jeden Tag zurück gesetzt, bitte warte bis deine Ausdauer wieder aufgefüllt ist**')
            return msg.channel.send(emb.setColor(colors.error)).catch()
        }
        ////////////////////////// -- ITEM BREAK --/////////////////////////////
        var playerInventory = player.items.toObject()
        let inventory = []
        playerInventory.forEach(e => {
            let i = (shopItems.filter(a => a.itemID == e)).shift()
            inventory.push(i)
        })
        var enemy = monsterArray[Math.floor(Math.random() * monsterArray.length)];
        ////////////////////////// -- Vorbereitung --/////////////////////////////

        var rare = rarity(enemy.rare)

        msg.channel.send(emb.setDescription("**" + enemy.name + `** ${rare}
        \n ⚔️ [${enemy.ATK}]  ${emotes.shield} [${enemy.DEF}]  ❤️ [${enemy.healthPoints}]`).setColor(colors.warning))
        let quest = "Möchtest du Kämpfen";
        let answer = await getAnswer(msg, quest + "?", 30);
        player = await msg.client.database.UserConfigCache.getConfig(msg.author.id);
        let answerArray = ['ja', 'yes', 'si']
        if (!answerArray.includes(answer.toLowerCase())) return msg.channel.send(emb.setDescription("Kampf abgebrochen")).catch()

        if (player.weapon) { var weapon = ((shopItems.filter(e => e.itemID == player.weapon)).shift()).ATK } else { weapon = 0 }
        if (player.shield) { var shield = ((shopItems.filter(e => e.itemID == player.shield)).shift()).DEF } else { shield = 0 }

        let r = 0;

        var monster = {
            ATK: enemy.ATK,
            DEF: enemy.DEF,
            healthPoints: enemy.healthPoints
        }
        var fighter = {
            healthPoints: player.healthPoints + calcLevel(player.xp),
            ATK: weapon,
            DEF: shield,
        }
        if (monster.DEF > fighter.ATK) emb.setFooter("Die Defensive des Gegners war stärker du")

        var Damage = (fighter.ATK) - (monster.DEF);
        var PDamage = (monster.ATK) - (fighter.DEF);

        if (Math.sign(Damage) == -1) Damage = Damage * -1
        if (Math.sign(PDamage) == -1) PDamage = PDamage * -1

        while (fighter.healthPoints > 0 && monster.healthPoints > 0) {
            monster.healthPoints -= Damage;
            fighter.healthPoints -= PDamage;
            r = r + 1;
        }
        emb.setFooter(r + (r > 1 ? " Runden" : " Runde"))

        if (monster.healthPoints <= 0) {
            let loot = enemy.droprate;
            if (enemy.droprate < 2) loot = 1;
            let arr = [];
            player.coins += enemy.dropcoin;
            while (loot > 0) {
                var item = shopItems[Math.floor(Math.random() * shopItems.length)];
                if (item.rare == enemy.rare) {
                    if (item.type == "sword") t = `**[ ⚔️ ATK:  ${item.ATK} ]**`
                    if (item.type == "shield") t = `**[ ${emotes.shield} DEF:  ${item.DEF} ]**`
                    if (item.type == "material") t = "**[ 🍃 ]**"
                    arr.push(`${t} ` + item.name)
                    inventory.push(item)
                    loot -= 1;
                }
            }
            player.items = inventory
            if (arr.length == 0) arr.push("Kein Loot qwq", "qwq")
            msg.channel.send(emb.setTitle("Sieg").setDescription(arr.join("\n")).setColor(colors.success))

        } else if (fighter.healthPoints <= 0) {
            if (player.coins > 10) player.coins -= 10;
            msg.channel.send(emb.setTitle("Niederlage").setDescription("Du verlierst 10 Coins.").setColor(colors.error)).catch()
        }
        player.stamina -= 5;
        await player.save()
    }
};

function rarity(level) {
    if (level == 1) return "⭐"
    if (level == 2) return "⭐⭐"
    if (level == 3) return "⭐⭐⭐"
    if (level == 4) return "🌟"
    if (level == 5) return "🌟🌟"
}