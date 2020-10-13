const fs = require("fs");
const Discord = require("discord.js");
const { Message, Collection, Client, MessageEmbed } = require("discord.js");

const { colors, newEmb, rawEmb, calcLevel, emotes } = require("./commands/utilities");

const config = require("./config.json");
var { prefix, token, owner } = config;

const client = new Client();
client.config = config;
const cooldowns = new Collection();

var error_channel;
var report_channel;
error_channel = 714557180757409942;
report_channel = 753474865104683110;

//Error Handling
//==================================================================================================================================================
client.on("shardError", error => {
    console.error("A websocket connection encountered an error:", error);
});

process.on("unhandledRejection", error => {
    console.error("Unhandled promise rejection:", error);
});

process.on("warning", console.warn);
//==================================================================================================================================================
//Currency and Levelingsystem
//==================================================================================================================================================
const { Spieler, Monster, Items, Order, syncDatabase } = require('./database/dbInit');

var monster_cache = new Collection();
var item_cache = new Collection();
var player_cache = new Collection();
var order_cache = new Collection();

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
        if (!spieler) {
            spieler = await Spieler.create({ UID: id });
            player_cache.set({ UID: id }, spieler);
        }
        return spieler;
    }
});



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

Reflect.defineProperty(monster_cache, "getDungeon", {
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

//Sync
const initDatabase = async() => {
    await syncDatabase();

    try {
        for (let entr of(await Spieler.findAll())) player_cache.set(entr.UID, entr);
        for (let entr of(await Items.findAll())) item_cache.set(entr.IID, entr);
        for (let entr of(await Order.findAll())) { order_cache.set(entr.IID, entr.UID); }
        for (let entr of(await Monster.findAll())) { monster_cache.set(entr.MID, entr); }

        console.log(" > 🗸 Cached Database Entries");
    } catch (e) {
        console.log(" > ❌ Error While Caching Database")
        console.log(e);
    }
}

client.database = { player_cache, monster_cache, item_cache, order_cache };

//==================================================================================================================================================

//Initialize the Commands
client.commands = new Discord.Collection();

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

        console.log("Starting Database");
        await initDatabase();
    } catch (e) {
        console.log(e);
    }
    //console.log(await client.login(token));
}
start();

//Ready
//==================================================================================================================================================
client.on("ready", async() => {
    console.log(" >  Logged in as: " + client.user.tag);

    client.user.setStatus("idle");

    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        client.user.setActivity(activities_list[index]);
    }, 30000);


    const activities_list = [
        "Monster suchen",
        "Shop aufräumen",
        `${config.prefix}help`
    ];

    //Channel Um Fehler zu loggen
    error_channel = client.guilds.cache
        .find(g => g.id == 553942677117337600)
        .channels.cache.find(c => c.id == error_channel && c.type == "text");
    report_channel = client.guilds.cache
        .find(g => g.id == 553942677117337600)
        .channels.cache.find(c => c.id == report_channel && c.type == "text");
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
        emb.setTitle("Hi I´m Chia").setColor(colors.red)
        defaultChannel.send(emb.setDescription("**Thanks for adding me to your server UwU** \n Type -help to see my cmds \n\ni am still very new and will therefore make a few mistakes, please forgive me"))
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
    ///////////////////////////////////////////////////
    if (message.content === "!join") {
        //  client.emit("guildCreate")
        client.emit("guildCreate", message.guild);
    }
    /////////////////
    var emb = newEmb(message)
        .setColor(colors.nothing);

    let prefix = config.prefix;
    if (message.author.bot) return;

    //Levelsystem
    //==================================================================================================================================================
    let old = (await player_cache.getConfig(message.author.id)).XP; //Siehe 100 Zeilen Tiefer

    await player_cache.addXP(message.author.id, message.content.length);

    setTimeout(async() => {
        let neu = (await player_cache.getConfig(message.author.id)).XP;

        if (calcLevel(neu) > calcLevel(old)) {
            let channel = message.channel;
            if (!channel) return;
            me = message.member.toString() + " ist nun ein Level höher " + calcLevel(neu)
            let emb = new MessageEmbed().setTitle(message.guild.name).setDescription(me).setColor(colors.nothing).setFooter(message.member.displayName).setTimestamp()
            channel.send(emb).catch(console.log)

        }
    }, 1000); //Waiting for Database sync



    //==================================================================================================================================================


    if (!message.content.startsWith(prefix)) return;


    const args = message.content.slice(prefix.length).split(/ +/);
    ////leeeeeel neues prefix yk

    const commandName = args.shift().toLowerCase();

    const commandObj = client.commands.find(cmd => cmd.command.commands.includes(commandName));
    if (!commandObj) return;

    const { command, module } = commandObj;

    if (command.commands.includes("reload") && owner.includes(message.author.id)) {
        return reloadModules(args[0].toLowerCase(), message);
    }

    if (message.channel.type !== "text") {
        emb.setDescription("Ich führe keine Befehle in DMs aus qwq");
        return message.channel.send(emb);
    }


    var emb = rawEmb(message);
    if (command.needed) {
        if (command.needed == 'NSFW') {
            if (guild_config.nsfw == 0) {
                emb.setDescription(emotes.false + " **NSFW Commands sind auf diesem Server gesperrt qwq**").setColor(colors.nothing);
                return message.channel.send(emb);
            }
        } else {
            if (!(message.guild.me.hasPermission(command.needed))) {
                emb.setDescription(emotes.false + " **Mir fehlt folgende Berechtigung:** `" + command.needed).setColor(colors.nothing);
                return message.channel.send(emb);
            }
        }
    }

    var emb = rawEmb(message);
    if (command.perm) {
        if (command.perm == 'DEVELOPER') {
            if (!config.owner.includes(message.author.id)) {
                emb.setDescription("**Du bist leider kein `Developer` qwq** ").setColor(colors.nothing);
                return message.channel.send(emb);
            }
        } else {
            if (!(message.member.hasPermission(command.perm))) {
                emb.setDescription("**Dir fehltfolgende Berechtigung:,** `" + command.perm).setColor(colors.nothing);
                return message.channel.send(emb);
            }
        }
    }



    if (command.args && !args.length) {
        emb.setDescription(`Du musst Argumente angeben, <@${message.member.id}>!`);



        if (command.syntax) {
            emb.addField(`Syntax`, `\`${prefix}${command.syntax}\``)

        }

        return message.channel.send(emb);
    }


    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
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




    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        emb.setDescription(
            `Es gibt wohl noch etwas Technische Probleme mit diesem Befehl :0`
        );
        message.channel.send(emb);

        emb = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setFooter(client.user.tag, client.user.displayAvatarURL())
            .setColor(colors.nothing)
            .setTimestamp();

        emb
            .setTitle("Fehler")
            .addField("Auf:", `\`${message.guild.name}\``, true)
            .addField("In:", `\`${message.channel.name}\``, true)
            .addField("Von:", `<@${message.author.id}>`, true)
            .addField("Befehl:", `\`${message.content}\``, false)
            .addField("Fehler:", `\`${error}\``, false);

        error_channel.send(emb);
    }
});


//==================================================================================================================================================
/**
 * @param {string} argument
 * @param {Message} msg
 */
const reloadModules = async function(argument, msg) {
    const commandDirectorys = fs
        .readdirSync("./commands").map(name => "./commands/" + name).filter(path => fs.lstatSync(path).isDirectory());

    let text = "**LOAD MODULES**";
    msg = await msg.channel.send(text);
    var module_count = 0;

    if (argument.includes('/')) {
        let dir = './commands/' + argument.split('/')[0];
        let module_name = argument.split('/')[0];
        let file = argument.split('/')[1];

        if (!commandDirectorys.includes(dir)) return msg.channel.send('Modul nicht gefunden ;-;');

        let files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
        if (!files.map(name => name.split('.')[0]).includes(file)) return msg.channel.send('Befehl nicht gefunden ;-;');

        let path = `${dir}/${file}`;

        try {
            delete require.cache[require.resolve(path)];
            const newCommand = require(path);

            client.commands.set(newCommand.name, {
                command: newCommand,
                module: module_name
            });

            module_count++;
            text += `\n **>** \`${module_name}/${newCommand.name}\``;
            return msg.edit(text);
        } catch (error) {
            console.log(error);
            return msg.channel.send(`Beim neuladen von \`${newCommand.name}\` ist ein Fehler aufgetreten:\n\`${error.message}\``);
        }
    } else if (commandDirectorys.includes('./commands/' + argument)) {
        let dir = './commands/' + argument.split('/')[0];
        let file = argument.split('/')[1];

        if (!commandDirectorys.includes(dir)) return msg.channel.send('Modul nicht gefunden ;-;');

        commandDirectorys = new Array();
        commandDirectorys[0] = dir;
    }

    for (const dir of commandDirectorys) {
        const module_name = dir.split('/').reverse()[0];
        const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

        for (let file of commandFiles) {
            let path = `${dir}/${file}`;

            try {
                delete require.cache[require.resolve(path)];
                const newCommand = require(path);

                client.commands.set(newCommand.name, {
                    command: newCommand,
                    module: module_name
                });

                module_count++;
                text += `\n **>** \`${module_name}/${newCommand.name}\``;
                //msg.edit(text);
            } catch (error) {
                console.log(error);
                msg.channel.send(`Beim neuladen von \`${newCommand.name}\` ist ein Fehler aufgetreten:\n\`${error.message}\``);
            }
        }
    }

    msg.edit("Es wurden `" + module_count + "` Module neu geladen uwu");
}