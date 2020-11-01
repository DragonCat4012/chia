const { Message } = require('discord.js');
const { rawEmb, emotes, calcLevel, colors } = require('../utilities');

module.exports = {
    name: 'fight',
    syntax: 'fight <@user>',
    args: true,
    description: 'Kämpf gegen andere Spieler. Nutze "ranked" um das Ergebnis zu werten',
    commands: ['fight'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        user = msg.author;
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

        var enemyconfig = await msg.client.database.player_cache.getConfig(enemy_user.id);
        var player = await msg.client.database.player_cache.getConfig(user.id);
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
            return msg.channel.send(emb)
        })

        if (skip) return
            ////////////////////////// -- Vorbereitung --/////////////////////////////
        let P_Lifes = parseInt(player.HP) + parseInt(calcLevel(player.XP));
        let E_Lifes = parseInt(enemyconfig.HP) + parseInt(calcLevel(enemyconfig.XP))

        if (player.WEAPON !== "0" && player.WEAPON !== 0) { var weapon = (await msg.client.database.item_cache.getConfig(player.WEAPON)).ATK } else { weapon = 0 }
        if (player.SHIELD !== "0" && player.SHIELD !== 0) { var shield = (await msg.client.database.item_cache.getConfig(player.SHIELD)).DEV } else { shield = 0 }

        if (enemyconfig.WEAPON !== "0" && enemyconfig.WEAPON !== 0) { var enemy_weapon = (await msg.client.database.item_cache.getConfig(enemyconfig.WEAPON)).ATK } else { enemy_weapon = 0 }
        if (enemyconfig.SHIELD !== "0" && enemyconfig.SHIELD !== 0) { var enemy_shield = (await msg.client.database.item_cache.getConfig(enemyconfig.SHIELD)).DEV } else { enemy_shield = 0 }
        let r = 0;

        var enemy = {
            HP: parseInt(E_Lifes),
            ATK: parseInt(enemy_weapon),
            DEF: parseInt(enemy_shield)
        }
        var fighter = {
            HP: parseInt(P_Lifes),
            ATK: parseInt(weapon) + 1,
            DEF: parseInt(shield)
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

        while (fighter.HP > 0 && enemy.HP > 0 && r < 35) {
            enemy.HP = enemy.HP - EnemyDamage;
            fighter.HP = fighter.HP - Damage;
            r = r + 1;
        }
        emb.setFooter(r + (r > 1 ? " Runden" : " Runde"))

        if (enemy.HP <= 0) {
            if (ranked) {
                player.RANK += 3;
                enemy.RANK -= 3;
                if (enemy.RANK <= 0) enemy.RANK = 0;

                await player.save()
                emb.setDescription("Du gewinnst 3 Punkte " + emotes.cool)
            }
            return msg.channel.send(emb.setTitle("Sieg für " + user.username + emotes.cool).setColor(colors.success))
        } else if (fighter.HP <= 0) {
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