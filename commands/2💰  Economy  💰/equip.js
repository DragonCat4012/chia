const {Message} = require('discord.js');
const {rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'equip',
    syntax: 'equip <item>',
    args: false,
    description: 'Lässt dich Items ausrüsten',
    commands: ['equip'],
    
    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        user = msg.author;

        var player = await msg.client.database.player_cache.getConfig(user.id);
        let emb = rawEmb(msg).setTitle("Equip")

        var order = await msg.client.database.order_cache.getInventory(user.id)
        let arr = [];

        for( let IID of order) {
            var item = await msg.client.database.item_cache.getConfig(IID.IID);
           if(msg.content.toLowerCase().includes(item.NAME.toLowerCase()))
            arr.push(item)
         }

         item = arr[0];

        if (arr.length < 1) return msg.channel.send(emb.setTitle("Dieses Item konnte nicht gefunden werden qwq"))

        if(item.TYPE !== "SWORD" && item.TYPE !== "SHIELD") return msg.channel.send(emb.setTitle("Du kannst nur Schilder oder Schwerter ausrüsten"))

        if(item.TYPE == "SWORD") {
        
        var old = await msg.client.database.item_cache.getConfig(player.WEAPON);
        if(!old) {player.WEAPON ="0";}
        else {emb.addField("Voherige Waffe", (old.NAME+ " [" + old.ATK + "/" + old.DEV + "]"))}
        

        player.WEAPON = item.IID;
        var item = await msg.client.database.item_cache.getConfig(player.WEAPON);
        emb.addField("**Jetzige Waffe:**", (item.NAME+ " [" + item.ATK + "/" + item.DEV + "]"))
        return player.save().then(() => msg.channel.send(emb));
    
        }else if(item.TYPE == "SHIELD") {
        
        var old = await msg.client.database.item_cache.getConfig(player.SHIELD);
        if(!old) {player.SHIELD ="0";}
        else {emb.addField("Voheriges Schild", (old.NAME+ " [" + old.ATK + "/" + old.DEV + "]"))}

        player.SHIELD = item.IID;
        var item = await msg.client.database.item_cache.getConfig(player.SHIELD);
        emb.addField("**Jetziges Schild:**", (item.NAME+ " [" + item.ATK + "/" + item.DEV + "]"))
        return player.save().then(() => msg.channel.send(emb));
        }else {return msg.channel.send(emb.setTitle("Ein Fehler ist aufgetreten"))}
       
       return msg.channel.send(emb)
    
     

    }
};
