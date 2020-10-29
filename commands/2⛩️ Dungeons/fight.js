const { Message } = require('discord.js');
const { rawEmb, emotes, getAnswer, calcLevel, colors } = require('../utilities');

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

        var enemy = await msg.client.database.player_cache.getConfig(enemy_user.id);
        var player = await msg.client.database.player_cache.getConfig(user.id);

        let quest = "Möchtest du Kämpfen? " + enemy_user.user.tag
        let answer = await getAnswer(msg, quest + "?", 30, enemy_user)
        answercahce = ["yes", "ja", "oui", "Yes", "Ja"]
        if (answercahce.includes((answer))) console.log("Answered")
        if (!answercahce.includes((answer))) return msg.channel.send(emb.setDescription("Kampf abgebrochen"))

        ////////////////////////// -- Vorbereitung --/////////////////////////////
        let P_Lifes = player.HP + parseInt(calcLevel(player.XP));
        let E_Lifes = enemy.HP + parseInt(calcLevel(enemy.XP))

        if (player.WEAPON !== "0" && player.WEAPON !== 0) { var weapon = (await msg.client.database.item_cache.getConfig(player.WEAPON)).ATK } else { weapon = 0 }
        if (player.SHIELD !== "0" && player.SHIELD !== 0) { var shield = (await msg.client.database.item_cache.getConfig(player.SHIELD)).DEV } else { shield = 0 }

        if (enemy.WEAPON !== "0" && enemy.WEAPON !== 0) { var enemy_weapon = (await msg.client.database.item_cache.getConfig(enemy.WEAPON)).ATK } else { enemy_weapon = 0 }
        if (enemy.SHIELD !== "0" && enemy.SHIELD !== 0) { var enemy_shield = (await msg.client.database.item_cache.getConfig(enemy.SHIELD)).DEV } else { enemy_shield = 0 }
        let r = 0;
        var enemy = {
            HP: E_Lifes,
            ATK: enemy_weapon,
            DEF: enemy_shield
        }
        var fighter = {
                HP: P_Lifes,
                ATK: weapon,
                DEF: shield
            }
            ///////////////////////////////////////////////////////////////////////

        console.log(fighter)
        console.log(enemy)

        var Damage = fighter.DEF - enemy.ATK;
        var EnemyDamage = enemy.DEF - fighter.ATK;

        if (Math.sign(Damage) == -1) Damage = 0
        if (Math.sign(EnemyDamage) == -1) EnemyDamage = 0

        while (P_Lifes > 0 && E_Lifes > 0) {
            E_Lifes -= EnemyDamage;
            E_Lifes -= Damage;
            r = r + 1;
        }
        emb.setFooter(r + (r > 1 ? " Runden" : " Runde"))
        console.log('D')

        if (E_Lifes <= 0) {
            if (ranked) {
                player.RANK += 3;
                enemy.RANK -= 3;
                if (enemy.RANK <= 0) enemy.RANK = 0;

                await player.save()
                emb.setDescription("Du gewinnst 3 Punkte")
            }
            return msg.channel.send(emb.setTitle("Sieg für " + user.username).setColor(colors.success))
        }

        if (P_Lifes <= 0) {
            if (ranked) {
                enemy.RANK += 3;
                player.RANK -= 3;

                await enemy.save()
                emb.setDescription("Du verlierst 3 Punkte")
            }
            return msg.channel.send(emb.setTitle("Sieg für " + enemy_user.user.username).setColor(colors.error))
        }
    }
};