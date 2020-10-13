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


        if (user.bot) {
            emb.setDescription("Bots können nicht kämpfen qwq")
            return msg.channel.send(emb.setColor(colors.error))
        }

        var enemy = await msg.client.database.player_cache.getConfig(enemy_user.id);
        var player = await msg.client.database.player_cache.getConfig(user.id);

        ////////////////////////// -- Vorbereitung --/////////////////////////////
        let P_Lifes = player.HP + parseInt(calcLevel(player.XP));
        let E_Lifes = enemy.HP + parseInt(calcLevel(enemy.XP))
            ///////////////////////////////////////////////////////////////////////

        let quest = "Möchtest du Kämpfen"
        let answer = await getAnswer(msg, quest + "?", 30, enemy_user)
        if (answer !== "yes" && answer !== "ja" && answer !== "Yes" && answer !== "Ja") return msg.channel.send(emb.setDescription("Kampf abgebrochen"))

        if (player.WEAPON !== "0" && player.WEAPON !== 0) { var weapon = (await msg.client.database.item_cache.getConfig(player.WEAPON)).ATK } else { weapon = 0 }
        if (player.SHIELD !== "0" && player.SHIELD !== 0) { var shield = (await msg.client.database.item_cache.getConfig(player.SHIELD)).DEV } else { shield = 0 }

        if (enemy.WEAPON !== "0" && enemy.WEAPON !== 0) { var enemy_weapon = (await msg.client.database.item_cache.getConfig(enemy.WEAPON)).ATK } else { enemy_weapon = 0 }
        if (enemy.SHIELD !== "0" && enemy.SHIELD !== 0) { var enemy_shield = (await msg.client.database.item_cache.getConfig(enemy.SHIELD)).DEV } else { enemy_shield = 0 }

        let r = 0;
        var Damage = enemy_weapon - weapon;
        var EnemyDamage = enemy_shield - weapon;

        //  if (Math.sign(Damage) == -1) Damage = 1
        //if (Math.sign(EnemyDamage) == -1) EnemyDamage = 1

        while (P_Lifes > 0 && E_Lifes > 0) {
            E_Lifes -= EnemyDamage;
            P_Lifes -= Damage;
            r = r + 1;
        }
        emb.setFooter(r + (r > 1 ? " Runden" : " Runde"))

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