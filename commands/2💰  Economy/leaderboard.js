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
        var users = msg.client.database.UserConfigCache.array();

        if (args[0] == "coins") {
            emb.setTitle("Leaderboard [Coins]")
            users = users
                .sort((a, b) => b.coins - a.coins)
                .filter((v, i, arr) => i < 10)
                .map((user, index) => {
                    let u = msg.client.users.resolve(user.userID);
                    if (!u) {
                        entry = {
                            a: `**${index + 1}. | Not Found**`,
                            b: `**¥.** \`${(user.coins).toLocaleString()}\``
                        }
                    } else {
                        entry = {
                            a: `**${index + 1}. | ${u.tag}**`,
                            b: `**¥.** \`${(user.coins).toLocaleString()}\``
                        }
                    }
                    return entry
                });
        } else if (args[0] == "rank") {
            emb.setTitle("Leaderboard [Rank]")
            users = users
                .sort((a, b) => (b.rank - a.rank))
                .filter((v, i, arr) => i < 10)
                .map((user, index) => {
                    let u = msg.client.users.resolve(user.userID);
                    if (!u) {
                        entry = {
                            a: `**${index + 1}. | Not Found**`,
                            b: ` \`${(user.rank).toLocaleString()}\``
                        }
                    } else {
                        entry = {
                            a: `**${index + 1}. | ${u.tag}**`,
                            b: ` \`${(user.rank).toLocaleString()}\``
                        }
                    }
                    return entry
                });
        } else {
            users = users
                .sort((a, b) => b.xp - a.xp)
                .filter((v, i, arr) => i < 10)
                .map((user, index) => {
                    let u = msg.client.users.resolve(user.userID);
                    if (!u) {
                        entry = {
                            a: `**${index + 1}. | Not Found**`,
                            b: `Lvl. **${calcLevel(user.xp)}** - \`[${(user.xp).toLocaleString()}]\``
                        }
                    } else {
                        entry = {
                            a: `**${index + 1}. | ${u.tag}**`,
                            b: `Lvl. **${calcLevel(user.xp)}** \`[${(user.xp).toLocaleString()}]\``
                        }
                    }
                    return entry
                });
        }
        users.forEach(entry => {
            emb.addField(entry.a, entry.b)
        });
        return msg.channel.send(emb)
    }
};