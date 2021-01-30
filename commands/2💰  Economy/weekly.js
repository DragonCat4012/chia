const { Message } = require('discord.js');
const { money, rawEmb, colors } = require('../utilities');
const ms = require('parse-ms')

module.exports = {
    name: 'weekly',
    syntax: 'weekly',
    args: false,
    type: 'ECONEMY',
    description: 'Gibt dir dein wöchentliches vermögen aus OvO',
    commands: ['weekly'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let emb = rawEmb(msg)
        let now = Date.now();

        let profile = await msg.client.database.UserConfigCache.getConfig(msg.author.id)
        let lastDaily = profile.weekly;

        let cooldown = 6.048e+8;
        let time = ms(cooldown - (now - lastDaily))

        if (lastDaily == "0") {
            profile.weekly = now;
            await profile.save()
        }

        let segments = []

        if (time.days > 0) segments.push(time.days + ' Tag' + ((time.days == 1) ? '' : 'e'));
        if (time.hours > 0) segments.push(time.hours + ' Stunde' + ((time.hours == 1) ? '' : 'n'));
        if (time.minutes > 0) segments.push(time.minutes + ' Minute' + ((time.minutes == 1) ? '' : 'n'));

        const timeString = segments.join('\n');

        if (cooldown - (now - lastDaily) > 0) {
            emb.setColor(colors.economy)
                .setDescription(`**${timeString}**`)
            emb.setTitle("Du musst noch warten ;-;")
            return msg.channel.send(emb).catch()

        } else {
            profile.weekly = now;
            profile.coins += money.weekly;
            await profile.save()

            emb.setDescription("Tägliche **" + money.weekly + "¥** wurden dir ausgezahlt")
            msg.channel.send(emb).catch()
        }
    }
};