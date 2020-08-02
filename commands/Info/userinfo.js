const {Message, Discord, MessageEmbed} = require('discord.js');
const red = "0xd40202";
const { colors, confirmAction, newEmb } = require('../utilities');
//const { prefix, token, owner } = require("../config.json");

const moment = require("moment");


module.exports = {
    name: 'userinfo',
    syntax: 'userinfo <@user>',
    args: false,
    description: 'Zeigt dir Informationen zu einem Nutzer!',
    commands: ['userinfo','uinfo'],
    
    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg, args) {


        let user;
        if (msg.mentions.users.first()) {
          user = msg.mentions.users.first();
        } else {
          user = msg.author;
        }
    
        let member = msg.guild.member(user);
    
        if (user.bot === false) {
          var dot = ":x: ";
        } else {
          var dot = ":white_check_mark:";
        }
    
        if (member.premiumSince === null) {
          var boost = ":x: ";
        } else {
          var boost = ":white_check_mark:";
        }
    
        let emb = newEmb(msg)
          .setAuthor(user.tag, user.displayAvatarURL)
          .setColor(red)
    
          .addField("**Name:**", user.username, true)
          .addField(`**Tag:**`, user.discriminator, true)
          .addField("**ID:**", user.id, true)
    
          .addField(
            "**Nickname:**",
            `${member.nickname !== null ? `${member.nickname}` : "None"}`,
            true
          )
          .addField("**Status:**", `${user.presence.status}`, true)
          .addField(
            "**Game:**",
            `${user.presence.game ? user.presence.game.name : "None"}`,
            true
          )
    
          .addField(
            "**Beigetreten:**",
            `${moment.utc(member.joinedAt).format("do. MMMM. YYYY")}`,
            true
          )
          .addField("**Bot:**", dot, true)
          .addField(
            "**Erstellt:**",
            `${moment.utc(user.createdAt).format("do. MMMM. YYYY")}`,
            true
          )
    
          .addField(
            "**Roles:**",
            member.roles ? member.roles.cache.map(r => `${r}`).join(" | ") : "",
            true
          )
          .addField("**Boost:**", boost, true)
    
          .setTimestamp()
          msg.channel.send(emb);

    }
    };



  


