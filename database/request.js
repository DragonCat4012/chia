const client = require('../index')
const { Collection } = require('discord.js')

const GuildConfigShema = require('./GuildShema')
const UserConfigShema = require('./UserShema')

var GuildConfigCache = new Collection()
var UserConfigCache = new Collection()

Reflect.defineProperty(GuildConfigCache, "getConfig", {
    /**
     * @param {number} id Guild ID
     * @returns {Model} new Model
     */
    value: async function(id) {
        var server = GuildConfigCache.get(id);
        if (!server) server = await GuildConfigShema.findOne({ where: { guildID: id } });
        if (!server) {
            server = await GuildConfigShema.create({ guildID: id });
            GuildConfigCache.set(id, server);
        }
        return server;
    }
});



client.database = { GuildSettingsCache, UserConfigCache }
module.exports = () => console.log('Database Cache setted')