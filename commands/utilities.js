const { Message, MessageEmbed } = require("discord.js");
const fs = require("fs")

const fetch = require("node-fetch");
const api_tenor = 'https://api.tenor.com/v1/search?q=' + 'SEARCH' + '&key=' + 'LIVDSRZULELA' + '&limit=20';

const colors = {
    error: 0xF91A3C,
    blue: 0x93a7cf,
    red: 0x3a3fe4,
    info: 0x1AE3F9,
    success: 0x13EF8D,
    warning: 0xF9D71A,
    nothing: 0x303136,
    unimportant: 0x738F8A
}
const emotes = {
    false: "<:false:740942401413185656>",
    true: "<:true:740942401161527426>",
    mobile: "<:mobile:741225706843013122>",
    bot: "<:Clyde:741225707203592232>",
    desktop: "<:desktop:741225709351206993>",
    coin: "<:coin:743414375255113739>",
    shield: "<:shield:753309572055171173>"

}

const money = {
    daily: 200,
    weekly: 1200,
    monthly: 3600,
}


/**
 * @callback MessageAction
 * @param {Message} m the Message from the Confirmation Embed
 * @returns {void}
*/

/**
 * A simple Framework for a Action Confirm
 * @param {Message} msg Message from the Command
 * @param {string} text Text for the Embed
 * @param {MessageAction} confim Action executed when confirmed
 * @param {MessageAction} cancel Action executed when canceld
 */

const confirmAction = (msg, text, confim, cancel) => {
    var emb = newEmb(msg);

    emb.setTitle('Bestätigung').setDescription(text)

    msg.channel.send(emb).then(async message => {
        emb = newEmb(msg);

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
const newEmb = (msg) => {
    return new MessageEmbed()
        .setColor(colors.red)
        .setFooter(msg.client.user.tag, msg.client.user.displayAvatarURL())
        .setTimestamp(new Date());
}

/**
 * @param {Message} msg 
 * @returns {MessageEmbed} a clean Embed
 */
const rawEmb = (msg) => {
    return new MessageEmbed()
        .setColor(colors.blue);
}

/**
 * @param {Message} msg 
 * @returns {MessageEmbed} a clean Embed
 */
const emptyEmb = (msg) => {
    return new MessageEmbed()
        .setColor(colors.nothing);

}

/**
 * @param {string} search Wonach du suchen willst
 * @returns {string|null}
 */
async function getTenor(search) {
    const body = await (fetch(api_tenor.replace('SEARCH', search.replace(/ +/, '+'))).then(res => res.json()));
    if (!body.results) return null;
    if (!body.results[0]) return null;

    let { results } = body;

    var rnd_gif_obj = results[Math.floor(Math.random() * results.length)];

    if (!rnd_gif_obj.media) return null;
    if (!rnd_gif_obj.media[0]) return null;

    let url = rnd_gif_obj.media[0].gif.url;

    return url;
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

        await msg.channel.send(emb.setTitle(question).setColor(colors.info).setFooter("cancel, to abort | " + time + " Seconds to answer"));
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
    return Math.floor(((1 * xp) ^ (3 / 5)) / 750);
};


module.exports = { colors, confirmAction, newEmb, rawEmb, getTenor, emotes, getStats, calcLevel, getAnswer, money };