const { Message, MessageEmbed } = require("discord.js");
const fs = require("fs")

const colors = {
    error: 0xF91A3C,
    blue: 0x93a7cf,
    success: 0x13EF8D,
    warning: 0xF9D71A,
    nothing: 0x303136,
}
const emotes = {
    shield: "<:shield:753309572055171173>",
    location: "<:location:771483527169966090>",
    wus: '<:wus:761274129583964201>',
    threatening: '<:threatening:750711786256203777>',
    cool: '<:gilgacool:754654249773957134>',
    oha: '<:0000:761274355841499207>',
    yeah: '<:yeah:768747358937808926>',

    staff: "<:staff:752248790198648852>",
    plus: "<:plus:768749896995569674>"
}

const money = {
    daily: 40,
    weekly: 100,
}

/**
 * A simple Framework for a Action Confirm
 * @param {Message} msg Message from the Command
 * @param {string} text Text for the Embed
 * @param {MessageAction} confim Action executed when confirmed
 * @param {MessageAction} cancel Action executed when canceld
 */

const confirmAction = (msg, text, confim, cancel) => {
    var emb = rawEmb();

    emb.setTitle('Bestätigung').setDescription(text)

    msg.channel.send(emb).then(async message => {
        emb = rawEmb(msg);

        const filter = (reaction, user) => {
            return (reaction.emoji.name == '✅' ||
                reaction.emoji.name === '❌') &&
                user.id == msg.author.id;
        };
        const collector = message.createReactionCollector(filter, { time: 5000 });

        message.react('✅');
        message.react('❌');

        collector.on('collect', (reaction, user) => {
            reaction.remove().catch();

            switch (reaction.emoji.name) {
                case '✅':
                    emb.setTitle('Bestätigt uwu');
                    emb.setColor(colors.success);
                    message.edit(emb).then(m => {
                        confim(m);
                    });
                    collector.removeAllListeners();
                    break;
                case '❌':
                    emb.setTitle('Abgebrochen qwq');
                    emb.setColor(colors.error);
                    message.edit(emb).then(m => {
                        cancel(m);
                    });
                    collector.removeAllListeners();
                    break;
                default:
                    reaction.remove().then().catch();
                    break;
            }
        });

        collector.on('end', collected => {
            emb.setTitle('Abgebrochen qwq');
            emb.setColor(colors.error);
            message.edit(emb).then(m => {
                cancel(m);
            });
        });
    });
}
/**
 * @param {Message} msg 
 * @returns {MessageEmbed} a clean Embed
 */
const rawEmb = () => {
    return new MessageEmbed()
        .setColor(colors.nothing)
        .setTimestamp()
}


function getStats() {
    var project_stats = {
        files: 0,
        lines: 0,
        size: 0 //In KB
    }

    scanDir(".");
    project_stats.size = Number(project_stats.size.toFixed(0));
    return project_stats;

    function scanDir(dirpath) {
        var ls = fs.readdirSync(dirpath).filter((name) => !(["node_modules", ".git", ".vscode", "log.log"].includes(name)));

        for (let file of ls) {
            let path = dirpath + "/" + file;
            let stat = fs.lstatSync(path);

            if (stat.isFile()) {
                project_stats.files++;
                project_stats.size += stat.size / 1024;
                project_stats.lines += fs.readFileSync(path).toString('utf8').split("\n").length;
            } else if (stat.isDirectory()) {
                scanDir(path);
            }
        }
    }
}

/**
 * @param {Message} msg  Message
 * @param {string} question Question?
 * @param {number} time Time in seconds
 */
const getAnswer = async (msg, question, time, user) => {
    return new Promise(async (resolve, reject) => {
        const channel = msg.channel;
        let emb = rawEmb(msg);

        await msg.channel.send(emb.setTitle(question).setFooter("cancel, to abort | " + time + " Seconds to answer"));
        emb = rawEmb(msg);
        if (!user) user = msg.author
        const collector = channel.createMessageCollector(m => m.author.id === user.id, {
            max: 1,
            time: time * 1000,
            errors: ['time']
        });

        collector.on("collect",
            /** @param {Message} m  */
            m => {
                const cont = m.content;

                if (cont === "" || !cont) {
                    msg.channel.send(emb.setTitle("Empty Message").setColor(colors.error)).then(() => {
                        reject("Empty Message Send");

                    }).catch((e) => {
                        reject("Couldnt Send Message\n" + e);

                    });
                } else if (cont.toLowerCase().includes("cancel")) {
                    msg.channel.send(emb.setTitle("Canceld").setColor(colors.error)).then(() => {
                        reject("Action Canceld");
                    }).catch((e) => {
                        reject("Couldnt Send Message\n" + e);
                    });
                } else {
                    resolve(cont);
                }
            })

        collector.on("end", (collected) => {
            if (collected.size > 0) return; //Falls schon ne antwort kam

            msg.channel.send(emb.setTitle("Time Expired").setColor(colors.error)).then(() => {
                reject("Time expired");
            }).catch((e) => {
                reject("Couldnt Send Message\n" + e);
            });
        });
    });
}


/**
 * @param {number} xp
 * @returns {number}
 */
const calcLevel = function (xp) {
    return Math.floor(0.07 * Math.sqrt(xp));
};


const levelToXP = function (level) {
    return (level * level / 0.0049)
};

module.exports = { colors, confirmAction, rawEmb, emotes, getStats, calcLevel, getAnswer, levelToXP, money };