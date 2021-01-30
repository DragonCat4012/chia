const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');

module.exports = {
    name: 'dungeons',
    syntax: 'dungeons',
    args: false,
    description: 'Zeigt dir alle verfügbaren Dungeons',
    cooldown: 5,
    type: 'DUNGEONS',
    commands: ['dungeons'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg).setTitle("Dungeons")
        let player = await msg.client.database.UserConfigCache.getConfig(msg.author.id)
        var dungeons = await msg.client.database.dungeon_cache.getDungeons();
        arr = []

        for (let D of dungeons) {
            let line = (D.LINE).replace(/H/i, "♻️").replace(/E/i, "🎁").replace(/[0-9]/g, "🔸")
            let ti;
            if (player.DUNGEON == D.DID) { ti = emotes.location + "**" + D.NAME + "**" } else {
                ti = "**" + D.NAME + "**"
                ti = `**${D.NAME}** [${D.DID}]`
            }
            let obj = {
                title: ti,
                value: line
            }
            arr.push(obj)
        }

        let m;
        let i = 0
        for (obj of arr) {
            if (i == 24) {
                i = 1
                m = true;
                msg.channel.send(emb)
            }
            emb.addField(obj.title, obj.value)
            i += 1
        }

        if (!m) msg.channel.send(emb)
    }
};