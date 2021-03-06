const fs = require("fs");
const mongoose = require('mongoose')
const { Message, Collection, Client, MessageEmbed } = require("discord.js");

const GuildConfigShema = require('./database/GuildShema')
const UserConfigShema = require('./database/UserShema')
const activities_list = require('./activities.json')

const { colors, rawEmb, calcLevel, emotes } = require("./commands/utilities");
const config = require("./config.json");
var { token, defaultPrefix } = config;

const client = new Client();
client.config = config;
const cooldowns = new Collection();
var report_channel;

//==================================================================================================================================================
//      Refill Stamina
//==================================================================================================================================================
var now = new Date(),
    planned = new Date();

planned.setHours(21);
planned.setMinutes(38);
planned.setSeconds(20)

if (planned.getTime() < now.getTime())
    planned.setTime(planned.getTime() + 1000 * 60 * 60 * 24);

setTimeout(() => {
    setInterval(() => {
        client.database.UserConfigCache.refillStamina()
    }, 1000 * 60 * 60 * 24);
}, planned - now)

process.on("warning", console.warn);

mongoose.connect('mongodb://localhost:27017/chia?gssapiServiceName=mongodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
}).then(() => {
    console.log("Connected to the Mongodb database");
}).catch((err) => {
    console.log("Unable to connect to the Mongodb database. Error:" + err, "error");
});

const initDatabase = async () => {
    try {
        for (let entr of (await GuildConfigShema.find({}))) client.database.GuildConfigCache.set(entr.guildID, entr);
        for (let entr of (await UserConfigShema.find({}))) client.database.UserConfigCache.set(entr.userID, entr);
        console.log(" > 🗸 Cached Database Entries");
    } catch (e) {
        console.log(" > ❌ Error While Caching Database", e)
    }
}
//==================================================================================================================================================
//Initialize the Commands
//==================================================================================================================================================
client.commands = new Collection();
const commandDirectorys = fs
    .readdirSync("./commands").map(name => "./commands/" + name).filter(path => fs.lstatSync(path).isDirectory());

for (const dir of commandDirectorys) {
    const module_name = dir.split('/')[dir.split('/').length - 1];
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

    for (let file of commandFiles) {
        const command = require(`${dir}/${file}`);
        client.commands.set(command.name, {
            command: command,
            module: module_name
        });
    }
}
//Starting the Bot
//==================================================================================================================================================
const start = async () => {
    try {
        console.log("Logging in...");
        await client.login(token).catch(e => {
            switch (e.code) {
                case 500:
                    console.log(" > ❌ Fetch Error");
                    break;
                default:
                    console.log(" > ❌ Unknown Error");
                    break;
            }
            //Preventing instant Restart
            setTimeout(() => { throw e }, 5000); //5 Second Timeout
        });
        await initDatabase();
    } catch (e) {
        console.log(e);
    }
}
start();
//==================================================================================================================================================
//Client on Ready
//==================================================================================================================================================
client.on("ready", async () => {
    console.log(" >  Logged in as: " + client.user.tag);
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        client.user.setActivity(activities_list[index]);
    }, 60000);

    report_channel = client.guilds.cache
        .find(g => g.id == 553942677117337600)
        .channels.cache.find(c => c.id == '753474865104683110' && c.type == "text");
});


//==================================================================================================================================================
//Guild Added
//==================================================================================================================================================
client.on("guildCreate", async guild => {
    let emb = rawEmb().setTitle("New Guild Joined").setDescription(`\`${guild.memberCount}\`: **${guild.name}** [${guild.id}]`)
    report_channel.send(emb.setColor(colors.success))

    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
        if (channel.type == "text" && defaultChannel == "") {
            if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        }
    })
    emb.setTitle("Hii mein Name lautet Chia")
    defaultChannel.send(emb.setDescription("**Danke das du mich auf deinen Server geholt hast** \n Nutze -help um meine Befehle zu sehen \n\nIch bin noch in der Testphase wodurch Fehler entstehen könnten qwq"))
})
//==================================================================================================================================================
//Guild Removed
//==================================================================================================================================================
client.on("guildDelete", async guild => {
    let emb = rawEmb().setTitle("Removed Guild").setDescription(`\`${guild.memberCount}\`: **${guild.name}** [${guild.id}]`)
    report_channel.send(emb.setColor(colors.error))
})
//Message
//==================================================================================================================================================
client.on("message", async message => {
    if (message.author.bot || message.channel.type == 'dm') return;
    var emb = rawEmb()
    let settings = await client.database.GuildConfigCache.getConfig(message.guild.id)
    let { prefix, levelMessage } = settings
    //==================================================================================================================================================
    //Levelsystem
    //==================================================================================================================================================
    let CachedPlayer = await client.database.UserConfigCache.getConfig(message.author.id)
    let oldLevel = CachedPlayer.xp
    let addedXp = Math.floor(Math.floor(Math.random() * (5 - 1 + 1) + 1))
    CachedPlayer.xp += addedXp
    //await CachedPlayer.save()
    if (levelMessage) {
        let newLevel = CachedPlayer.xp;

        if (calcLevel(newLevel) > calcLevel(oldLevel)) {
            let channel = message.channel;
            if (!channel) return;
            me = message.member.toString() + " ist nun ein Level höher " + calcLevel(newLevel)
            let emb = rawEmb().setTitle(message.guild.name).setDescription(me).setFooter(message.member.displayName).setTimestamp()
            channel.send(emb).catch()
        }
    }

    //==================================================================================================================================================
    let mentionedFirst = message.mentions.members.first()
    if (mentionedFirst) {
        if (mentionedFirst.id == client.user.id && !message.content.startsWith(prefix)) {
            message.channel.send(emb.setDescription("Mein Prefix ist \`" + prefix + "\`")).catch()
        }
    }
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);

    const commandName = args.shift().toLowerCase();
    const commandObj = client.commands.find(cmd => cmd.command.commands.includes(commandName));
    if (!commandObj) return;
    const { command, module } = commandObj;

    if (command.needed) {
        if (!(message.guild.me.hasPermission(command.needed))) {
            emb.setDescription("⚠️ **Mir fehlt folgende Berechtigung:** `" + command.needed).setColor(colors.error);
            return message.channel.send(emb).catch()
        }
    }

    if (command.perm) {
        if (command.perm == 'DEVELOPER') {
            if (!config.owner.includes(message.author.id)) {
                emb.setDescription("⚠️ **Du bist leider kein `Developer` qwq** ").setColor(colors.error);
                return message.channel.send(emb).catch()
            }
        } else {
            if (!(message.member.hasPermission(command.perm))) {
                emb.setDescription("⚠️ **Dir fehltfolgende Berechtigung:,** `" + command.perm).setColor(colors.error);
                return message.channel.send(emb).catch()
            }
        }
    }

    if (command.args && !args.length) {
        emb.setDescription(`⚠️ Du musst Argumente angeben, <@${message.member.id}>!`).setColor(colors.error)

        if (command.syntax) {
            emb.addField(`Syntax`, `\`${prefix}${command.syntax}\``)
        }
        return message.channel.send(emb).catch()
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 2000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            emb
                .addField("Cooldown", timeLeft.toFixed(1));
            return message.channel.send(emb).catch()
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        await command.execute(message, args, settings);
        await CachedPlayer.save();
    } catch (error) {
        console.error(error);
        emb.setDescription(
            `⚠️ Es gibt wohl noch etwas Technische Probleme mit diesem Befehl :0`
        );
        message.channel.send(emb).catch()
    }
});


module.exports = client
require('./database/request')