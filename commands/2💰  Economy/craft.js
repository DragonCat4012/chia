const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');
var crafting = require('./craftings.json');
const shopItems = require('../../items.json')

module.exports = {
    name: 'craft',
    syntax: 'craft <item>',
    args: true,
    description: 'Lässt dich Items zusammen bauen',
    type: 'ECONEMY',
    commands: ['craft'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        var userProfile = await msg.client.database.UserConfigCache.getConfig(msg.author.id);
        let oldItems = userProfile.items.toObject()
        let name = (args[0]).toLowerCase()
        let emb = rawEmb(msg).setTitle("Item Craften")
            /*
                    oldItems.push(shopItems[0])
                    userProfile.items = oldItems

                    await userProfile.save()
                    return
            */
        let obj = crafting.hasOwnProperty(name);
        if (!obj) return msg.channel.send(emb.setDescription("Dieses Item kann nicht gecraftet werden qwq").setColor(colors.error))
        let newItem = shopItems.filter(e => e.name.toLowerCase() == name.toLowerCase())

        let text = "";
        let itemFailed = false
        let materials = []
        materials = crafting[name] //(2) ['ItemTest', 'myNewItem']

        materials.forEach(element => {
            // element = element.toLowerCase()
            text += ("> " + element + "\n")
            let needItem = (oldItems.filter(item => item.name == element)).shift()
            let itemIndex = oldItems.indexOf(needItem)
            if (itemIndex == -1) {
                itemFailed = true
                emb.addField("Item Fehlt:", element)
            }
        })

        if (itemFailed) return msg.channel.send(emb.setColor(colors.error))

        materials.forEach(element => {
            let needItem = (oldItems.filter(item => item.name == element)).shift()
            let itemIndex = oldItems.indexOf(needItem)
            delete oldItems[itemIndex]
        })

        newItem = newItem.shift()
        oldItems.push(newItem)
        userProfile.items = oldItems;

        await userProfile.save()
        msg.channel.send(emb.setDescription(text += `\n User Item hinzufügen: \n  ${newItem.name}`))
    }
};