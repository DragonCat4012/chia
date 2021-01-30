const { Message } = require('discord.js');
const { rawEmb, emotes, calcLevel, colors } = require('../utilities');
const itemArray = require('../../items.json')

module.exports = {
    name: 'fight',
    syntax: 'fight <@user>',
    args: true,
    description: 'Kämpf gegen andere Spieler. Nutze "ranked" um das Ergebnis zu werten',
    cooldown: 30,
    type: 'DUNGEONS',
    commands: ['fight'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)
        ranked = false;
        if (args[1] == "ranked") ranked = true;

        enemy_user = msg.mentions.members.first()
        if (!enemy_user) return msg.channel.send(emb.setDescription("Bitte erwähne einen Gegner").setColor(colors.error))

        if (enemy_user.id == msg.author.id) return msg.channel.send(emb.setDescription("Du kannst nicht gegen dich selbst kämpfen ;-;").setColor(colors.error))


        if (enemy_user.user.bot) {
            emb.setDescription("**Bots können nicht kämpfen qwq**")
            return msg.channel.send(emb.setColor(colors.error))
        }

        var enemyconfig = await msg.client.database.UserConfigCache.getConfig(enemy_user.id);
        var player = await msg.client.database.UserConfigCache.getConfig(msg.author.id);
        let quest = "**Möchtest du Kämpfen?** " + enemy_user.user.tag

        const filter = m => m.author.id === enemy_user.id;
        answercahce = ["yes", "ja", "oui", "Yes", "Ja", 'si', 'hai']
        msg.channel.send(emb.setDescription(quest).setFooter('Achtung! Der Herausforder erhält +1 ATK !!!'))
        emb.setDescription('Was für ein spannender Kampf!')

        let skip;
        let test = await msg.channel.awaitMessages(filter, {
            max: 1,
            time: 20000,
            errors: ['time']
        }).then(async(collected) => {
            let answer = collected.first().content.toLowerCase()
            if (!answercahce.includes((answer)) || answer == 'cancel') {
                skip = true;
                emb.setDescription('**Kampf abgebrochen qwq** ' + emotes.threatening).setColor(colors.error)
                    .setFooter('Ich erwarte nur eine Antwort bei dieser Frage ')
                return msg.channel.send(emb)
            }
        }).catch(() => {
            emb.setDescription('**Zeit abgelaufen, du hast zu lang gebraucht** ' + emotes.wus).setColor(colors.error)
            skip = true;
            return msg.channel.send(emb)
        })

        if (skip) return
            ////////////////////////// -- Vorbereitung --/////////////////////////////
        let P_Lifes = player.healthPoints + player.xp
        let E_Lifes = enemyconfig.healthPoints + enemyconfig.xp

        if (player.weapon) { var weapon = ((itemArray.filter(e => e.name.toLowerCase() == player.weapon)).shift()).ATK } else { weapon = 0 }
        if (player.shield) { var shield = ((itemArray.filter(e => e.name.toLowerCase() == player.shield)).shift()).DEF } else { shield = 0 }

        if (enemyconfig.weapon) { var enemy_weapon = ((itemArray.filter(e => e.name.toLowerCase() == enemyconfig.weapon)).shift()).ATK } else { enemy_weapon = 0 }
        if (enemyconfig.shield) { var enemy_shield = ((itemArray.filter(e => e.name.toLowerCase() == enemyconfig.shield)).shift()).DEF } else { enemy_shield = 0 }
        let r = 0;

        var enemy = {
            healthPoints: E_Lifes,
            ATK: enemy_weapon,
            DEF: enemy_shield
        }
        var fighter = {
            healthPoints: P_Lifes,
            ATK: weapon + 1,
            DEF: shield
        }

        if (fighter == enemy) {
            emb.setDescription('**Ihr seid gleichstark, ein Kampf hätte wohl kaum einen Sinn')
            return msg.channel.send(emb.setColor(colors.error))
        }

        if (enemy.DEF > fighter.ATK) {
            emb.setDescription(`**<@${enemy_user}> ist zu stark für dich!**`).setColor(colors.error).setFooter('Tipp: Lege dir bessere Waffen zu')
        }
        if (fighter.DEF > enemy.ATK) {
            emb.setDescription(`**<@${user.id}> du bist zu stark für deinen gegner... Kämpfe lieber gegen ebenbürdige**`).setColor(colors.error).setFooter('Tipp: Lege dir bessere Waffen zu')
        }
        ///////////////////////////////////////////////////////////////////////
        var Damage = fighter.DEF - enemy.ATK;
        var EnemyDamage = enemy.DEF - fighter.ATK;
        if (Math.sign(Damage) == -1) Damage = Damage * -1
        if (Math.sign(EnemyDamage) == -1) EnemyDamage = EnemyDamage * -1

        while (fighter.healthPoints > 0 && enemy.healthPoints > 0 && r < 35) {
            enemy.healthPoints = enemy.healthPoints - EnemyDamage;
            fighter.healthPoints = fighter.healthPoints - Damage;
            r = r + 1;
        }
        emb.setFooter(r + (r > 1 ? " Runden" : " Runde"))

        if (enemy.healthPoints <= 0) {
            if (ranked) {
                player.RANK += 3;
                enemy.RANK -= 3;
                if (enemy.RANK <= 0) enemy.RANK = 0;

                await player.save()
                emb.setDescription("Du gewinnst 3 Punkte " + emotes.cool)
            }
            return msg.channel.send(emb.setTitle("Sieg für " + user.username + emotes.cool).setColor(colors.success))
        } else if (fighter.healthPoints <= 0) {
            if (ranked) {
                enemy.RANK += 3;
                player.RANK -= 3;

                await enemy.save()
                emb.setDescription("Du verlierst 3 Punkte")
            }
            return msg.channel.send(emb.setTitle("Sieg für " + enemy_user.user.username + emotes.oha).setColor(colors.error))
        } else {
            if (ranked) {
                emb.setDescription("Niemand verlieret oder gewinnt Punkte " + emotes.wus)
            }
            return msg.channel.send(emb.setDescription("**Euer Kampf ging zu lang qwq Ihr scheint euch ebenbürdig zu sein**").setColor(colors.error))
        }
    }
};