const { Message, TextChannel } = require('discord.js');
const { newEmb } = require('../utilities');

RegExp.escape = function (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

module.exports = {
    name: 'Clear',
    syntax: 'clear <anzahl> [autor] [suche]',
    args: true,
    description: 'Löscht Nachrichten die nicht älter als 2 Wochen sind UwU',
    commands: ['clear', 'purge', 'delete'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = newEmb(msg)
            .setTitle('Dir fehlt leider folgende Berechtigung: \`MANAGE_MESSAGES\`')

        if (!msg.member.hasPermission("MANAGE_MESSAGES"))
            return msg.channel.send(emb);

        var autor = msg.mentions.members.first();
        let anzahl = args[0]

        if (isNaN(anzahl)) return msg.channel.send(emb.setTitle('**Syntax fehler:** Deine Angabe ist keine Zahl'));
        if (!anzahl || anzahl < 1)
            return msg.channel.send(emb.setTitle("**Syntax fehler:** Du musst eine Anzahl angeben"));

        anzahl = Number(anzahl)+1;
        let search = null;

        if (args.length > 2) {
            search = new RegExp(RegExp.escape(args.slice(2).join(' ')));
        } else if (!autor && args.length > 1) {
            search = new RegExp(RegExp.escape(args.slice(1).join(' ')));
        }

        var fetched = await BigFetch(msg.channel, anzahl);

        if (autor) fetched = fetched.filter(m => m.author == autor.id);
        if (search != null) fetched = fetched.filter(m => search.test(m.content));

        BigBulkDelete(fetched, true).catch(error => {
            msg.channel.send(emb.setTitle(`**Fehler:** ${error}`));
            throw error
        }).then((count) => {
            let title = `${count} Nachrichten gelöscht`;
            if (autor) title = `${count} Nachrichten von ${autor.displayName} gelöscht`;
            emb.setTitle(title)

            if(search != null) emb.setFooter(search.source)

            msg.channel.send(emb)
        });
    }
};

/**
 * @param {TextChannel} channel 
 * @param {number} limit 
 */
async function BigFetch(channel, limit) {
    let last_id = 0;
    let messages = new Array();
    let fetched = new Array();
    let options = {};

    for (limit; limit > 0; limit -= 100) {
        options.limit = limit > 100 ? 100 : limit;
        if (last_id != 0) {
            options.before = last_id;
        } else {
            options = { limit: options.limit };
        }

        messages = (await channel.messages.fetch(options)).array();

        for (let m of messages) {
            fetched.push(m)
        }

        if (messages.length < 1) continue;
        last_id = messages[messages.length - 1].id;
    }

    return fetched;
}

/**
 * @param {Message[]} messages 
 */
async function BigBulkDelete(messages) {
    let last_id = 0;
    if (messages.length < 1) return 0;
    let channel = messages[0].channel;
    let deleted = 0;
    let limit;

    while (messages.length > 1) {
        if (messages.length > 100) {
            limit = 100;
        } else {
            limit = messages.length;
        }
        
        let size = (await channel.bulkDelete(messages.splice(0, limit), true)).size;
        if (size != undefined) deleted += size;
        
        if (messages.length < 1) continue;
        last_id = messages[messages.length - 1].id;
    }

    return deleted;
}