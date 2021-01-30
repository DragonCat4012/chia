const fs = require("fs");
const mongoose = require('mongoose')
const { Message, Collection, Client, MessageEmbed } = require("discord.js");

const GuildConfigShema = require('./database/GuildShema')
const UserConfigshema = require('./database/UserShema')

const { colors, newEmb, rawEmb, calcLevel, emotes } = require("./commands/utilities");
const config = require("./config.json");
var { prefix, token, owner } = config;

const client = new Client();
client.config = config;
const cooldowns = new Collection();
var report_channel;

var now = new Date(),
    planed = new Date();

planed.setHours(21);
planed.setMinutes(38);
planed.setSeconds(20)

if (planed.getTime() < now.getTime())
    planed.setTime(planed.getTime() + 1000 * 60 * 60 * 24);

setTimeout(() => {
    setInterval(() => {
        client.database.player_cache.refillStamina()
    }, 1000 * 60 * 60 * 24);
}, planed - now)

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

const initDatabase = async() => {
    try {
        for (let entr of(await GuildConfigShema.find({}))) client.database.GuildSettingsCache.set(entr.guildID, entr);
        for (let entr of(await UserConfigShema.find({}))) client.database.UserConfigCache.set(entr.userID, entr);
        console.log(" > 🗸 Cached Database Entries");
    } catch (e) {
        console.log(" > ❌ Error While Caching Database")
        console.log(e);
    }
}

//==================================================================================================================================================
//Currency and Levelingsystem
//==================================================================================================================================================
const { Spieler, Monster, Items, Order, Settings, Dungeons, syncDatabase } = require('./database/dbInit');

var monster_cache = new Collection();
var item_cache = new Collection();
var player_cache = new Collection();
var order_cache = new Collection();
var dungeon_cache = new Collection();
var settings_cache = new Collection();

Reflect.defineProperty(settings_cache, "getConfig", {
    /**
     * @param {number} id User ID
     * @returns {Model} new User
     */
    value: async function(id) {
        var server = settings_cache.get({ GID: id });
        if (!server) server = await Settings.findOne({ where: { GID: id } });
        if (!server) {
            server = await Settings.create({ GID: id });
            settings_cache.set({ GID: id }, server);
        }
        return server;
    }
});

Reflect.defineProperty(player_cache, "addXP", {
    /**
     * @param {number} id User ID
     * @param {number} amount Amount of Cois
     * @returns {Model} new User
     */
    value: async function(id, amount) {
        let points = 0;
        if (amount) {
            points = Math.floor(Math.random() * Math.cbrt(amount) + 2);
        } else {
            points = Math.floor(Math.floor(Math.random() * (5 - 1 + 1) + 1));
        }

        //let user = new Model(); 
        let user = player_cache.get(id);
        if (!user) user = await Spieler.findOne({ where: { UID: id } });

        if (user) {
            user.XP += Number(points);
            user = await user.save();
        } else {
            user = await Spieler.create({ UID: id, XP: points });
        }

        player_cache.set(id, user);
        return user;
    }
});
Reflect.defineProperty(player_cache, "getConfig", {
    /**
     * @param {number} id User ID
     * @returns {Model} new User
     */
    value: async function(id) {
        var spieler = player_cache.get({ UID: id });
        if (!spieler) spieler = await Spieler.findOne({ where: { UID: id } });
        /*   if (!spieler) {
               spieler = await Spieler.create({ UID: id });
               player_cache.set({ UID: id }, spieler);
           }*/
        return spieler;
    }
});

Reflect.defineProperty(player_cache, "addProfile", {
    /**
     * @param {number} id User ID
     * @returns {Model} new User
     */
    value: async function(id) {
        spieler = await Spieler.create({ UID: id });
        player_cache.set({ UID: id }, spieler);
        return spieler;
    }
});

Reflect.defineProperty(player_cache, "refillStamina", {
    /**
     * @param {number} id User ID
     * @returns {Model} new User
     */
    value: async function() {
        let i = 0;
        let cache = await Spieler.findAll({})

        cache.forEach(p => {
            if (p.STAMINA !== 40) {
                i++
                p.STAMINA = 40
                p.save()
            }
        })
        return i;
    }
});
//==================================================================================================================================================
Reflect.defineProperty(order_cache, "getOrder", {
    /**
     * @param {number} id Guild ID
     *  @param {number} uid Channel ID
     * @returns {Model} new User
     */
    value: async function(id, uid) {
        var order = order_cache.get({ IID: id, UID: uid })
        if (!order) order = await Order.findOne({ where: { IID: id, UID: uid } });

        else if (!order) {
            order = null;
        }
        return order;
    }
});
Reflect.defineProperty(order_cache, "setOrder", {
    /**
     * @param {number} id Guild ID
     *  @param {number} uid Channel ID
     * @returns {Model} new User
     */
    value: async function(id, uid) {
        var order = await Order.create({ IID: id, UID: uid });
        order_cache.set({ IID: id, UID: uid });
        return order;
    }
});
Reflect.defineProperty(order_cache, "deleteOrder", {
    /**
     * @param {number} id Guild ID
     *  @param {number} uid Channel ID
     * @returns {Model} new User
     */
    value: async function(id, uid) {
        order_cache.delete({ IID: id, UID: uid })
        let item = await Order.findOne({ where: { IID: id, UID: uid } })
        await Order.destroy({ where: { IID: item.IID, UID: item.UID, id: item.id } });
        return "S";

    }
});
//==================================================================================================================================================
Reflect.defineProperty(order_cache, "getInventory", {
    /**
     *  @param {number} uid Channel ID
     * @returns {Model} new User
     */
    value: async function(uid) {
        var order = order_cache.get({ UID: uid })
        if (!order) order = await Order.findAll({ where: { UID: uid } });
        else if (!order) {
            order = null;
        }
        return order;
    }
});
Reflect.defineProperty(item_cache, "getShop", {
    /**
     * @returns {Model} new User
     */
    value: async function() {
        shop = await Items.findAll({});
        return shop;
    }
});
//==================================================================================================================================================
Reflect.defineProperty(dungeon_cache, "getDungeons", {
    /**
     * @returns {Model} new User
     */
    value: async function() {
        dungeons = await Dungeons.findAll({});
        return dungeons;
    }
});
Reflect.defineProperty(dungeon_cache, "findRoom", {
    /**
     * @param {number} id Dungeon ID
     * @returns {Model} new User
     */
    value: async function(id) {
        var dungeon = dungeon_cache.get({ DID: id });
        if (!dungeon) dungeon = await Dungeons.findOne({ where: { DID: id } });
        if (!dungeon) {
            console.log("No Results by searching for dungeon")
            return false
        } else {
            return dungeon;
        }
    }
});

Reflect.defineProperty(dungeon_cache, "getRoom", {
    /**
     * @returns {Model} new User
     */
    value: async function() {
        let M = (await Dungeons.findAll({})).length;
        var size = Math.floor(Math.floor(Math.random() * (M - 0 + 1) + 0))
        if (size == 0) size = 1
        size = "" + size + ""

        var room = dungeon_cache.get({ DID: size })
        if (!room) room = await Dungeons.findOne({ where: { DID: size } });

        if (!room) console.log("No Results by searching for random Room")
        return room;
    }
});
//==================================================================================================================================================
Reflect.defineProperty(monster_cache, "getMonsters", {
    /**
     * @returns {Model} new User
     */
    value: async function() {
        dungeon = await Monster.findAll({});
        return dungeon;
    }
});
Reflect.defineProperty(monster_cache, "getConfig", {
    /**
     * @param {number} id Monster ID
     * @returns {Model} new User
     */
    value: async function(id) {
        id = "" + id + ""
        var monster = monster_cache.get({ MID: id });
        if (!monster) monster = await Monster.findOne({ where: { MID: id } });
        if (!monster) console.log("No Results by searching for monster")
        return monster;
    }
});
Reflect.defineProperty(monster_cache, "getEnemy", {
    /**
     * @returns {Model} new User
     */
    value: async function() {
        let M = (await Monster.findAll({})).length;
        var size = Math.floor(Math.floor(Math.random() * (M - 0 + 1) + 0))
        if (size == 0) size = 1
        size = "" + size + ""

        var monster = monster_cache.get({ MID: size })
        if (!monster) monster = await Monster.findOne({ where: { MID: size } });

        console.log("Gegner-ID:  " + size)
        if (!monster) console.log("No Results by searching for Enemy")
        return monster;
    }
});
//==================================================================================================================================================
Reflect.defineProperty(item_cache, "getItem", {
    /**
     * @returns {Model} new User
     */
    value: async function() {
        let t = await Items.findAll({})
        let M = t.length;
        var size = Math.floor(Math.floor(Math.random() * (M - 0 + 1) + 0))
        if (size == 0) size = 1
        size = "" + size + ""

        var item = item_cache.get({ IID: size })
        if (!item) item = await Items.findOne({ where: { IID: size } });
        if (!item) console.log("No Results by searching for random Item")
        return item;
    }
});
Reflect.defineProperty(item_cache, "getConfig", {
    /**
     * @param {number} id Item ID
     * @returns {Model} new User
     */
    value: async function(id) {
        id = "" + id + ""
        var item = item_cache.get({ IID: id });
        if (!item) item = await Items.findOne({ where: { IID: id } });
        if (!item) console.log("No Results by searching for Item:  " + id)
        return item;
    }
});

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
const start = async() => {
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
    //console.log(await client.login(token));
}
start();

//==================================================================================================================================================
//Ready
//==================================================================================================================================================
client.on("ready", async() => {
    console.log(" >  Logged in as: " + client.user.tag);
    client.user.setStatus("idle");

    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        client.user.setActivity(activities_list[index]);
    }, 60000);

    const activities_list = [
        "Monster suchen",
        "Shop aufräumen",
        "Dungeons ordnen . . .",
        `${config.prefix}help`
    ];

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
        emb.setTitle("Hii mein Name lautet Chia").setColor(colors.red)
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
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return

    var emb = rawEmb()
    let settings = await client.database.settings_cache.getConfig(message.guild.id)
    let prefix = settings.PREFIX

    //Levelsystem
    //==================================================================================================================================================
    let CachedPlayer = await player_cache.getConfig(message.author.id)
    if (CachedPlayer) {
        let old = CachedPlayer.XP
        await player_cache.addXP(message.author.id, message.content.length);

        let GuildLevelupMessage = await client.database.settings_cache.getConfig(message.guild.id)
        if (GuildLevelupMessage) {
            setTimeout(async() => {
                let neu = CachedPlayer.XP;

                if (calcLevel(neu) > calcLevel(old)) {
                    let channel = message.channel;
                    if (!channel) return;
                    me = message.member.toString() + " ist nun ein Level höher " + calcLevel(neu)
                    let emb = new MessageEmbed().setTitle(message.guild.name).setDescription(me).setColor(colors.nothing).setFooter(message.member.displayName).setTimestamp()
                    channel.send(emb).catch(console.log)
                }
            }, 1000); //Waiting for Database sync
        }
    }
    //==================================================================================================================================================
    let mentionedFirst = message.mentions.members.first()
    if (mentionedFirst) {
        if (mentionedFirst.id == client.user.id && !message.content.startsWith(prefix)) {
            message.channel.send("Mein Prefix ist \`" + prefix + "\`")
        }
    }
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);

    const commandName = args.shift().toLowerCase();
    const commandObj = client.commands.find(cmd => cmd.command.commands.includes(commandName));
    if (!commandObj) return;
    const { command, module } = commandObj;

    var emb = rawEmb();
    if (command.needed) {
        if (!(message.guild.me.hasPermission(command.needed))) {
            emb.setDescription("⚠️ **Mir fehlt folgende Berechtigung:** `" + command.needed).setColor(colors.error);
            return message.channel.send(emb);
        }
    }

    var emb = rawEmb();
    if (command.perm) {
        if (command.perm == 'DEVELOPER') {
            if (!config.owner.includes(message.author.id)) {
                emb.setDescription("⚠️ **Du bist leider kein `Developer` qwq** ").setColor(colors.error);
                return message.channel.send(emb);
            }
        } else {
            if (!(message.member.hasPermission(command.perm))) {
                emb.setDescription("⚠️ **Dir fehltfolgende Berechtigung:,** `" + command.perm).setColor(colors.error);
                return message.channel.send(emb);
            }
        }
    }

    if (command.args && !args.length) {
        emb.setDescription(`⚠️ Du musst Argumente angeben, <@${message.member.id}>!`).setColor(colors.error)

        if (command.syntax) {
            emb.addField(`Syntax`, `\`${prefix}${command.syntax}\``)
        }
        return message.channel.send(emb);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 2000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            emb
                .addField("Cooldown", timeLeft.toFixed(1));
            return message.channel.send(emb);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    if (command.type !== 'ALLGEMEIN' && command.type !== 'EINSTELLUNGEN') {
        let B = await client.database.player_cache.getConfig(message.author.id)
        if (!B) {
            let emb = rawEmb(message).setColor(colors.error).setDescription(`${message.author}**Du musst** \`-start\` **eingeben um dein Abenteuer mit mir zu starten ;-;**`)
            return message.channel.send(emb)
        }
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        emb.setDescription(
            `⚠️ Es gibt wohl noch etwas Technische Probleme mit diesem Befehl :0`
        );
        message.channel.send(emb)
    }
});


module.exports = client
require('./database/request')