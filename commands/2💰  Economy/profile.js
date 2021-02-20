const { Message } = require('discord.js');
const { rawEmb, emotes, calcLevel } = require('../utilities');
var items = require('../../items.json')

module.exports = {
    name: 'Profile',
    syntax: 'profile [@user]',
    args: false,
    description: 'Zeigt dir die Spieler Karte eines Spielers',
    type: 'ECONEMY',
    commands: ['profile', 'bal', 'money'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let user;
        if (msg.mentions.users.first()) {
            user = msg.mentions.users.first();
        } else { user = msg.author; }
        let emb = rawEmb(msg).setTitle(`Profil von ${user.username}`)

        if (user.bot) {
            emb.setDescription("Bots haben kein Profil qwq")
            return msg.channel.send(emb.setColor(colors.error))
        }

        var player = await msg.client.database.UserConfigCache.getConfig(user.id);
        var AK = 0;
        var DK = 0;

        if (!player.weapon) { a = '❌' } else {
            var item = (items.filter(e => e.itemID == player.weapon)).shift()
            if (!item) {
                a = '❌'
            } else {
                if (item.type !== "sword") { a = '❌' } else { a = `${item.name} \`[${item.ATK} / ${item.DEF}]\`` }
            }
            AK = item ? item.ATK : 0
        }

        if (!player.shield) { b = '❌' } else {
            var item = (items.filter(e => e.itemID == player.shield)).shift()
            if (!item) {
                b = '❌'
            } else {
                if (item.type !== "shield") { b = '❌' } else { b = `${item.name} \`[${item.ATK} / ${item.DEF}]\`` }
            }
            DK = item ? item.DEF : 0
        }

        let query = parseInt(user.id)
        var cache = msg.client.database.UserConfigCache.array();
        cache = cache.sort((a, b) => (parseInt(b.rank) + parseInt(b.rank)) - (parseInt(a.rank) + parseInt(a.rank)))
        let A = cache.find(user => user.userID == query)
        let rank = cache.indexOf(A) + 1

        let text = ''
        text += `⚔️ ${a} \n ${emotes.shield} ${b}\n`
        text += `**Münzen:** \`${player.coins} ¥\` \n`
        text += `**Level:** \`${calcLevel(player.xp)}\` \n`
        text += `**Rank:** \`${rank}. [${player.rank}]\` \n`
        text += `**Ausdauer:** \`${player.stamina} /40\` \n`
        text += `**Dungeon** \`${player.dungeon}\``

        emb.setFooter("Kampfstärke gesamt: " + `[${AK}/${DK}]`)
            .setDescription(text)
        msg.channel.send(emb)
    }
};