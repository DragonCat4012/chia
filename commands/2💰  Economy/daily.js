const { Message } = require('discord.js');
const { money, rawEmb, colors } = require('../utilities');
const ms = require('parse-ms')

module.exports = {
    name: 'daily',
    syntax: 'daily',
    args: false,
    type: 'ECONEMY',
    description: 'Gibt dir dein tägliches vermögen aus OvO',
    commands: ['daily'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let emb = rawEmb()
        let now = Date.now();

        let profile = await msg.client.database.UserConfigCache.getConfig(msg.author.id)
        let lastDaily = profile.daily;

        let cooldown = 8.64e+7;
        let time = ms(cooldown - (now - lastDaily))

        if (lastDaily == "0") {
            profile.daily = now;
            await profile.save()
        }

        let segments = []

        if (time.days > 0) segments.push(time.days + ' Tag' + ((time.days == 1) ? '' : 'e'));
        if (time.hours > 0) segments.push(time.hours + ' Stunde' + ((time.hours == 1) ? '' : 'n'));
        if (time.minutes > 0) segments.push(time.minutes + ' Minute' + ((time.minutes == 1) ? '' : 'n'));

        const timeString = segments.join('\n');

        if (cooldown - (now - lastDaily) > 0) {
            emb.setDescription(`**${timeString}**`)
                .setTitle("Du musst noch warten ;-;")
            return msg.channel.send(emb.setColor(colors.error)).catch()

        } else {
            profile.daily = now;
            profile.coins += money.daily;
            await profile.save()
            msg.channel.send(emb.setDescription("Tägliche **" + money.daily + "¥** wurden dir ausgezahlt")).catch()
        }
    }
};