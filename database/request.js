const client = require('../index')
const { Collection, User } = require('discord.js')

const GuildConfigShema = require('./GuildShema')
const UserConfigShema = require('./UserShema')

var GuildConfigCache = new Collection()
var UserConfigCache = new Collection()

Reflect.defineProperty(GuildConfigCache, "getConfig", {
    /**
     * @param {number} id Guild ID
     * @returns {Model} new Model
     */
    value: async function (id) {
        var server = GuildConfigCache.get(id);
        if (!server) server = await GuildConfigShema.findOne({ where: { guildID: id } });
        if (!server) {
            server = await GuildConfigShema.create({ guildID: id });
            GuildConfigCache.set(id, server);
        }
        return server;
    }
});

Reflect.defineProperty(UserConfigCache, "getConfig", {
    /**
     * @param {number} id User ID
     * @returns {Model} new User
     */
    value: async function (id) {
        var user = UserConfigCache.get(id);
        if (!user) user = await UserConfigShema.findOne({ where: { userID: id } });
        if (!user) {
            user = await UserConfigShema.create({ userID: id });
            UserConfigCache.set(id, user);
        }
        return user;
    }
});

Reflect.defineProperty(UserConfigCache, "refillStamina", {
    /**
     * @param {number} id User ID
     * @returns {Model} new User
     */
    value: async function () {
        let i = 0;
        let cache = await UserConfigShema.find({})

        cache.forEach(p => {
            if (p.stamina !== 40) {
                i++
                p.stamina = 40
                p.save()
            }
        })
        return i;
    }
});

client.database = { GuildConfigCache, UserConfigCache }
module.exports = () => console.log('Database Cache setted')