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

        let obj = crafting.hasOwnProperty(name);
        if (!obj) return msg.channel.send(emb.setDescription("Dieses Item kann nicht gecraftet werden qwq").setColor(colors.error))
        let newItem = (shopItems.filter(e => e.name.toLowerCase() == name.toLowerCase())).shift()

        let text = "";
        let itemFailed = false
        let materials = []
        materials = crafting[name] //(2) [1, 2]

        materials.forEach(element => {
            let item = (shopItems.filter(a => a.itemID == element)).shift()
            text += ("> " + item.name + "\n")
            let itemIndex = oldItems.indexOf(item)
            if (itemIndex == -1) {
                itemFailed = true
                emb.addField("Item Fehlt:", `${item.name } [${item.itemID}]`)
            }
        })

        if (itemFailed) return msg.channel.send(emb.setColor(colors.error))

        materials.forEach(element => {
            let needItem = (oldItems.filter(item => item.itemID == element)).shift()
            let itemIndex = oldItems.indexOf(needItem)

            itemIndex > -1 ? oldItems.splice(itemIndex, 1) : false
        })

        oldItems.push(newItem)
        userProfile.items = oldItems;

        await userProfile.save()
        msg.channel.send(emb.setDescription(text += `\n User Item hinzufügen: \n  ${newItem.name}`))
    }
};