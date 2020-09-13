const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'monster',
    syntax: 'monster',
    args: false,
    description: 'Zeigt dir alle Monster',
    commands: ['monster', 'm'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        var dungeon = await msg.client.database.monster_cache.getDungeon();
        let emb = rawEmb(msg).setTitle("[ATK/DEF] HP Monster ")

        text = ""
        for (let MID of dungeon) {
            var monster = await msg.client.database.monster_cache.getConfig(MID.MID);
            if (!monster) console.log("Failure by detecting monster")
            if (monster.RARE == "1") {
                text = (text + `**${monster.id} -** [${monster.ATK}/${monster.DEV}] ❤️ ${monster.HP} ⭐ **${monster.NAME}**\n`)
            }
            else if (monster.RARE == "2") {
                text = (text + `**${monster.id} -** [${monster.ATK}/${monster.DEV}] ❤️ ${monster.HP} ⭐⭐ **${monster.NAME}**\n`)
            }
            else if (monster.RARE == "3") {
                text = (text + `**${monster.id} -** [${monster.ATK}/${monster.DEV}] ❤️ ${monster.HP} ⭐⭐⭐ **${monster.NAME}**\n`)
            }
            else if (monster.RARE == "4") {
                text = (text + `**${monster.id} -** [${monster.ATK}/${monster.DEV}] ❤️ ${monster.HP} 🌟 **${monster.NAME}**\n`)
            }
            else {
                text = (text + `**${monster.id} -** [${monster.ATK}/${monster.DEV}] ❤️ ${monster.HP} 🌟🌟 **${monster.NAME}**\n`)
            }
        }
        emb.setDescription(text)
        msg.channel.send(emb)
    }
};