const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');
var crafting = require('./craftings.json');
const shopItems = require('../../items.json')

module.exports = {
    name: 'recipes',
    syntax: 'recipes ',
    args: false,
    description: 'Zeigt dir wie du Items bauen kannst',
    type: 'ECONEMY',
    commands: ['recipes'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg).setTitle("Item Rezepte")
        let arr = []

        for (const [key, value] of Object.entries(crafting)) {
            let itemArray = []
            value.forEach(e => {
                let item = (shopItems.filter(a => a.itemID == e)).shift()
                if (item) itemArray.push(item.name)
                if (!item) itemArray.push('Not Found')
            })

            arr.push(`**${key}** \n -` + itemArray.join('\n-'))
        }
        msg.channel.send(emb.setDescription(arr.join('\n\n')))
    }
};