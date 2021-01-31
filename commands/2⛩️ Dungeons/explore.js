const { Message } = require('discord.js');
const { rawEmb, emotes, calcLevel, colors } = require('../utilities');
const monsterArray = require('../../monster.json')
const dungeonArray = require('../../dungeons.json')
const itemArray = require('../../items.json')

module.exports = {
    name: 'explore',
    syntax: 'explore',
    args: false,
    description: 'Kämpfe in Dungeons',
    type: 'DUNGEONS',
    commands: ['explore', 'e'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)
        var A = await msg.client.database.UserConfigCache.getConfig(msg.author.id);
        let room = (dungeonArray.filter(d => d.dungeonID == A.dungeon)).shift()

        let CacheSword = 0;
        let CacheShield = 0;

        if (!room) {
            emb.setFooter(`Dungeon: Not Found || ID: ${A.dungeon}`)
            emb.setDescription('🔒 **Dieser Dungeon ist noch nicht verfügbar**')
            return msg.channel.send(emb.setColor(colors.error))
        }

        if (A.stamina <= 5) {
            emb.setDescription('**Du benötigst 5 Ausdauer zum kämpfen. Diese werden jeden Tag zurück gesetzt, bitte warte bis deine Ausdauer wieder aufgefüllt ist**')
            return msg.channel.send(emb.setColor(colors.error))
        }
        emb.setFooter(`Dungeon: ${room.name} || ID: ${room.dungeonID}`)

        if (A.weapon) {
            let item = (itemArray.filter(i => i.itemID == A.weapon)).shift()
            if (item) CacheSword = item.ATK
        }
        if (A.shield) {
            let item = (itemArray.filter(i => i.itemID == A.shield)).shift()
            if (item) CacheShield = item.DEF
        }
        let CacheHP = A.healthPoints + calcLevel(A.xp);

        let player = {
            ATK: CacheSword,
            DEF: CacheShield,
            healthPoints: CacheHP
        }


        if (player.ATK < 7 || player.DEF < 7) {
            emb.setDescription('**Trainiere lieber noch ein bisschen, die Monster hier sind sonst zu stark für dich**')
                .setFooter('Nutze dafür z.B. -hunt und jage schwächere monster')
            return msg.channel.send(emb.setColor(colors.error))
        }

        player.stamina -= 5;

        let line = (room.line).split(/ +/);
        let L = (room.line).replace(/H/i, "♻️").replace(/E/i, "🎁").replace(/[0-9]/g, "🔸")
        let progress = L.split(/ +/)
        emb.setTitle(L)
        let i = true
        let text = ""
        const m = await msg.channel.send(emb).catch()
        setTimeout(() => {}, 4000)

        while (i) {
            let obj = line.shift()
            if (obj == "E") {
                i = false
                text += "\n**Dungeon beendet**"
                A.dungeon = A.dungeon + 1
                await A.save()
                return m.edit(emb.setDescription(text).setColor(colors.success)).catch()
            } else if (obj == "H") {
                player.healthPoints += 20
                text += "---- Heal **+20** ---- \n"
                progress.shift()
                progress.push("➕")
            } else {
                let monster = (monsterArray.filter(m => m.monsterID == obj)).shift()
                let R = await fight(msg, player, obj)
                if (!R.value) {
                    i = false
                    emb.setAuthor(R.runden == 1 ? `${R.runden} Runde` : `${R.runden} Runden`)
                    return msg.channel.send(emb.setColor(colors.error).setDescription("**Das Monster war wohl zu stark für dich qwq**")).catch()
                }
                progress.shift()
                progress.push("▪️")
                text += line.length + `. **Monster:** [${monster.ATK}/${monster.DEF}] :heart_exclamation:${monster.healthPoints}\n`
                emb.setTitle(progress.join(" "))
                    .setDescription(text)
                    .setColor(colors.success)
                m.edit(emb).catch()
            }
        }
    }
};
/**
 * @param {number} id Item ID
 * @param {object} player Item ID
 * @returns {object}  User
 */
async function fight(msg, player, id) {
    let monster = (monsterArray.filter(m => m.monsterID == id)).shift()

    var enemy = {
        ATK: monster.ATK,
        DEF: monster.DEF,
        healthPoints: parseInt(monster.healthPoints)
    }
    var res = {
        runden: 0,
        healthPoints: player.healthPoints,
        value: false
    }

    let r = 0;
    if (monster.DEF > player.ATK) {
        res.value = false
        return res
    } // wenn dev zu hoch für dich

    if (player.DEF > enemy.ATK) {
        res.value = true
        return res
    } // wenn dev zu hoch für das monster

    var Damage = player.ATK - enemy.DEF;
    if (Damage > enemy.healthPoints) {
        r = true
        return r
    }
    var PDamage = enemy.ATK - player.DEF;
    if (PDamage > player.healthPoints) {
        r = false
        return r
    }

    if (Math.sign(Damage) == -1) Damage = Damage = 1

    while (player.healthPoints > 0 && enemy.healthPoints > 0) {
        enemy.healthPoints -= Damage;
        player.healthPoints -= PDamage;
        r = r + 1;
    }
    res.runden = r

    if (enemy.healthPoints <= 0) { res.value = true }

    if (player.healthPoints <= 0) { res.value = false }
    return res
}