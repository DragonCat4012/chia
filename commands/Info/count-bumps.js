const Discord = require("discord.js");
const { colors, newEmb, confirmAction } = require("../utilities.js");

var disboard_id = 302050872383242240;
var oneWeek = new Date(7 * 24 * 60 * 60 * 1000);
var beforeOneWeek = new Date(new Date() - oneWeek);

module.exports = {
  name: "count-bumps",
  syntax: "count-bumps",
  args: false,
  description: "Zählt alle Disboard Bumps der letzten Woche in diesem Channel",
  commands: ["count-bumps", "bumps"],
  /**
   *@document
   * @this
   * @param {Discord.Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute: async (msg, args) => {
    var channel = msg.channel;

    var emb = newEmb(msg);

    let force = false;
    if (args[0] && ["true", "force"].includes(args[0].toLowerCase())) {
      force = true;
    }

    var pinned = await channel.messages.fetchPinned();
    var bumps = new Discord.Collection();

    if (pinned.array().length > 0 && !force) {
      bumps = await fetchDisboardBumps(channel, pinned.first().id, 1000);
      emb.setTitle("Bumps seit der letzten angepinnten nachricht");
    } else {
      bumps = await fetchDisboardBumps(channel, null, 1000);
      emb.setTitle("Bumps seit einer Woche");
    }
    
    if (bumps.array().length < 1) {
      return channel.send(
        emb.setTitle("Keine Bumps gefunden").setColor(colors.error)
      );
    }

    bumps = bumps.sort((a, b) => b - a);

    emb.setDescription("");
    for (let id of bumps) {
      emb.setDescription(
        emb.description +
          `\`${id[1] < 10 ? " " + id[1] : id[1]}\` **-** <@${id[0]}>\n`
      );
    }
    emb.setDescription(emb.description.slice(0, emb.description.length - 1));
    emb.setColor(colors.info);

    channel.send(emb);
  }
};

async function fetchDisboardBumps(channel, id, limit) {
  var bumps = new Discord.Collection();

  if (id == null) {
    let last_id = 0;
    let messages;
    let options = {};

    for (limit; limit > 0; limit -= 100) {
      options.limit = limit > 100 ? 100 : limit;
      if (last_id != 0) {
        options.before = last_id;
      } else {
        options = { limit: options.limit };
      }

      messages = await channel.messages.fetch(options);
      if (!messages.last()) continue;
      last_id = messages.last().id;

      messages = messages.filter(
        m => validDisboardMessage(m) && m.createdAt < beforeOneWeek
      );

      for (let m of messages) {
        let e = m[1].embeds[0];
        let user_id = e.description.slice(2, 20);

        if (bumps.get(user_id)) {
          bumps.set(user_id, bumps.get(user_id) + 1);
        } else {
          bumps.set(user_id, 1);
        }
      }
    }
  } else {
    let last_id = id;
    let messages;
    let options = {};

    for (limit; limit > 0; limit -= 100) {
      options.limit = limit > 100 ? 100 : limit;
      options.after = last_id;

      messages = await channel.messages.fetch(options);
      if (!messages.first()) continue;
      last_id = messages.first().id;

      messages = messages.filter(m => validDisboardMessage(m));

      for (let m of messages) {
        let e = m[1].embeds[0];
        let user_id = e.description.slice(2, 20);

        if (bumps.get(user_id)) {
          bumps.set(user_id, bumps.get(user_id) + 1);
        } else {
          bumps.set(user_id, 1);
        }
      }
    }
  }
  return bumps;
}

function validDisboardMessage(m) {
  if (m.author.id != disboard_id) return false;
  let description = m.embeds[0].description;
  
  return (
    m.author.id == disboard_id &&
    description.includes(":thumbsup:") &&
    description.startsWith("<@")
  );
}
