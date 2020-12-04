const { Message } = require('discord.js');
const { rawEmb, calcLevel } = require('../utilities');

module.exports = {
    name: 'leaderboard',
    syntax: 'leaderboard [coins | rank]',
    args: false,
    description: 'Zeigt dir das Leaderboard nach "rank", "coins" oder "XP"',
    type: 'ECONEMY',
    commands: ['leaderboard', 'lb', 'top'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg).setTitle("Leaderboard [Level]")
        var users = msg.client.database.player_cache.array();

        if (args[0] == "coins") {
            users = users
                .sort((a, b) => (parseInt(b.COINS) + parseInt(b.COINS)) - (parseInt(a.COINS) + parseInt(a.COINS)))
                .filter((v, i, arr) => i < 10)
                .map((user, index) =>
                    `\`${index + 1}.\` ${msg.client.users.cache.get(user.UID)} **[ ${user.COINS.toLocaleString()} ]¥**`
                );
        } else if (args[0] == "rank") {
            users = users
                .sort((a, b) => (parseInt(b.RANK) + parseInt(b.RANK)) - (parseInt(a.RANK) + parseInt(a.RANK)))
                .filter((v, i, arr) => i < 10)
                .map((user, index) =>
                    `\`${index + 1}.\` ${msg.client.users.cache.get(user.UID)} **[ ${user.RANK.toLocaleString()} ]**`
                );
        } else {
            users = users
                .sort((a, b) => (parseInt(b.XP) + parseInt(b.XP)) - (parseInt(a.XP) + parseInt(a.XP)))
                .filter((v, i, arr) => i < 10)
                .map((user, index) =>
                    `\`${index + 1}.\` ${msg.client.users.cache.get(user.UID)} **[ ${calcLevel(user.XP).toLocaleString()} ]**`
                );
        }
        return msg.channel.send(
            emb.setDescription(users.join("\n"))
        );
    }
};