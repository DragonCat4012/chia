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
                .sort((a, b) => b.COINS - a.COINS)
                .filter((v, i, arr) => i < 10)
                .map((user, index) => {
                    let u = msg.client.users.resolve(user.UID);
                    if (!u) {
                        entry = {
                            a: `**${index + 1}. | Not Found**`,
                            b: `**¥.** \`${(user.COINS).toLocaleString()}\``
                        }
                    } else {
                        entry = {
                            a: `**${index + 1}. | ${u.tag}**`,
                            b: `**¥.** \`${(user.COINS).toLocaleString()}\``
                        }
                    }
                    return entry
                });
        } else if (args[0] == "rank") {
            emb.setTitle("Leaderboard [Rank]")
            users = users
                .sort((a, b) => (b.RANK - a.RANK))
                .filter((v, i, arr) => i < 10)
                .map((user, index) => {
                    let u = msg.client.users.resolve(user.UID);
                    if (!u) {
                        entry = {
                            a: `**${index + 1}. | Not Found**`,
                            b: ` \`${(user.RANK).toLocaleString()}\``
                        }
                    } else {
                        entry = {
                            a: `**${index + 1}. | ${u.tag}**`,
                            b: ` \`${(user.RANK).toLocaleString()}\``
                        }
                    }
                    return entry
                });
        } else {
            users = users
                .sort((a, b) => b.XP - a.XP)
                .filter((v, i, arr) => i < 10)
                .map((user, index) => {
                    let u = msg.client.users.resolve(user.UID);
                    if (!u) {
                        entry = {
                            a: `**${index + 1}. | Not Found**`,
                            b: `Lvl. **${calcLevel(user.XP)}** - \`[${(user.XP).toLocaleString()}]\``
                        }
                    } else {
                        entry = {
                            a: `**${index + 1}. | ${u.tag}**`,
                            b: `Lvl. **${calcLevel(user.XP)}** \`[${(user.XP).toLocaleString()}]\``
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