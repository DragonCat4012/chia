const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');
var crafting = require('./craftings.json');


module.exports = {
    name: 'craft',
    syntax: 'craft <item>',
    args: true,
    description: 'Lässt dich Items verkaufen',
    commands: ['craft'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        user = msg.author;
        let name = (args.join(" ")).toLowerCase()

        let emb = rawEmb(msg).setTitle("Item Craften")
        var shop = await msg.client.database.item_cache.getShop()

        let obj = crafting.hasOwnProperty(name);

        if (obj) {
            msg.channel.send(`Item **[${name}]** can be crafted`)
        } else {
            return msg.channel.send(emb.setDescription("Dieses Item kann nicht gecraftet werden qwq"))
        }

        let arr = [];
        let mat = [];
        let text = "";
        let materials = crafting[name]
        let x = materials[0]
        var order = await msg.client.database.order_cache.getInventory(user.id)

        for (let IID of shop) {
            var item = await msg.client.database.item_cache.getConfig(IID.IID);
            if (item.NAME.toLowerCase().includes(name))
                arr.push(item)
        }

        item = arr[0]

        for (i in materials) {
            x = materials[i];
            var M = await msg.client.database.item_cache.getConfig(x);
            mat.push(M)
            text += ("> " + M.NAME + "\n")

            let N = await msg.client.database.order_cache.getOrder(x, user.id);
            console.log(N)
            if (!N) {
                emb.addField("Fehlt:", M.NAME)
                return msg.channel.send(emb)
            }
        }

        for (i in materials) {

            x = materials[i];
            var M = await msg.client.database.item_cache.getConfig(x);
            order = (await msg.client.database.order_cache.deleteOrder(M.IID, user.id))
            text += ("> " + M.NAME + "\n")
        }
        msg.channel.send(emb.setDescription(text))
        await msg.client.database.order_cache.setOrder(item.IID, user.id)

        return msg.channel.send("User Item hinzufügen: \n" + item.NAME)


        //  }



        return
        for (let IID of shop) {
            var item = await msg.client.database.item_cache.getConfig(IID.IID);
            if (name.includes(item.NAME.toLowerCase()))
                arr.push(item)
        }
        item = arr[0];
        msg.channel.send("> " + item.NAME)


        /*
                for (let IID of order) {
                    var item = await msg.client.database.item_cache.getConfig(IID.IID);
                    if (crafting.hasOwnProperty(item.NAME.toLowerCase()))
                        crafting = crafting.Stringify(item.NAME.toLowerCase());
                    arr.push(item)
                    console.log(crafting)
                }
                */

        return

        item = await msg.client.database.item_cache.getConfig(item.IID)


        order = (await msg.client.database.order_cache.deleteOrder(item.IID, user.id))
        //await order.save()

        return msg.channel.send(emb)



    }
};
