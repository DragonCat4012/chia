const { Message, MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const api_tenor = 'https://api.tenor.com/v1/search?q=' + 'SEARCH' + '&key=' + 'LIVDSRZULELA' + '&limit=20';

//const red = "0xd40202";
const colors = {
    error: 0xF91A3C,
    red: 0xd40202,
    info: 0x1AE3F9,
    success: 0x13EF8D,
    warning: 0xF9D71A,
    nothing: 0x2C2F33,
    unimportant: 0x738F8A,
nothing: 0x2C2F33

}
const emotes = {
    false: "<:false:739523416431919226>",
    true: "<:true:739523416406622258>"
   
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
        //.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setColor(colors.red);
    //.setFooter(msg.client.user.tag, msg.client.user.displayAvatarURL())
    //.setTimestamp(new Date());
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

module.exports = { colors, confirmAction, newEmb, rawEmb, getTenor, emotes };