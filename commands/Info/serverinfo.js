const { Message } = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');
const { red, error, info, success, unimportant, nothing, warning } = colors
//const { prefix, token, owner } = require("../config.json");

const moment = require("moment");

module.exports = {
  name: 'serverinfo',
  syntax: 'serverinfo',
  args: false,
  description: 'Zeigt dir Informationen zum Server!',
  commands: ['serverinfo', 'sinfo'],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg) {
    let verifLevels = [
      "NONE",
      "LOW",
      "MEDIUM",
      "HIGH",
      "VERY_HIGH",
      "(╯°□°）╯︵  ┻━┻",
      "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
    ];
    let user = msg.author;
    let g = msg.guild;
    let mods = new Array();
    g.members.cache.forEach(m => {
      if (m.permissions.has('ADMINISTRATOR') && !m.user.bot) {
        mods.push(m);
      }
    });

    let on = new Array();

    msg.guild.members.cache.forEach(m => {
      if (
        ["online", "dnd", "idle"].includes(m.presence.status) &&
        !m.user.bot
      ) {
        on.push(m);
      }
    });

    let on_s = "";
    if (on.length > 0) {
      if (on.length > 3) {
        on_s = on.length;
      } else {
        on_s = on.map(m => `<@${m.id}>`).join(" | ");
      }
    } else {
      on_s = "Niemand";
    }

    let roles = msg.guild.roles.cache;
    let roles_s = "";
    if (roles.size > 0) {
      if (roles.size > 10) {
        roles = roles.array().slice(0, 10);
        roles_s =
          roles
            //.map(r => (r.mentionable ? `<@&${r.id}>` : "`" + r.name + "`"))
            .map(r => "<@&"+r.id+">")
            .join(" | ") + " **. . .**";

      } else {
        roles_s = roles.map(m => `<&${m.id}>`).join(" | ");
      }
    } else {
      roles_s = "Keine";
    }

    if (g.verified === "true") { v = ":white_check_mark:" } else { v = ":x:" }
    if (g.widgetEnabled === "true") { w = ":white_check_mark:" } else { w = ":x:" }
    if (!g.widgetChannel) { wc = ":x:" }

    let emb = newEmb(msg)
      .setAuthor(g.name, user.displayAvatarURL)
      .setTitle(g.name)
      .setColor(red)

      .addField("**Acronym:**", `${g.nameAcronym}`, true)
      .addField("**Owner:**", `${g.owner.user.tag}`, true)
      .addField("**ID:**", `${g.id}`, true)

      .addField("**Text Channel:**", `${g.channels.cache.size}`, true)
      .addField("**Nutzer:**", `${msg.guild.members.cache.size}`, true)
      .addField(
        "**davon Menschen:**",
        ` ${g.members.cache.filter(member => !member.user.bot).size}`,
        true
      )

      .addField(
        "**Bots:**",
        `${g.members.cache.filter(member => member.user.bot).size}`,
        true
      )
      .addField(
        "**Moderatoren:**",
        mods.length > 0 ? mods.map(m => `<@${m.id}>`).join(" | ") : "keine",
        true
      )
      .addField("**Online:**", on_s, true)

      .addField(
        "**Vc Channel:**",
        g.channels.cache.filter(ch => ch.type == "voice").size,
        true
      )
      .addField(
        "**Kategorien:**",
        g.channels.cache.filter(ch => ch.type == "category").size,
        true
      )
      .addField(
        "**AFK Channel:**",
        msg.guild.afkChannelID != null
          ? "`" + msg.guild.afkChannel.name + "`"
          : "Keiner",
        true
      )

      .addField(
        "**Creation Date:**",
        `${msg.channel.guild.createdAt.toUTCString().substr(0, 16)} `,
        true
      )
      .addField(
        "**Verification Level:**",
        g.verificationLevel,
        true
      )
      .addField("**Boosttier:**", "`" + g.premiumTier + "`", true)

      .addField("**Rollen:**", roles_s, true)

      .addField("**Verifiziert:**", v, true)
      .addField("**Widget Aktiviert:**", w, true)
      .addField("**Widget Channel:**", wc, true)
      .setTimestamp();
    msg.channel.send(emb);
  }

};