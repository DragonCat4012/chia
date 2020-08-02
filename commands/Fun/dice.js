
const { Message } = require('discord.js');
const { colors, confirmAction, newEmb } = require('../utilities');

module.exports = {
    name: 'Dice Roll',
    syntax: 'dice [dice sides] [count]',
    args: false,
    description: 'Würfelt mit belibiger nazahl von Seiten',
    commands: ['dice','roll'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg, args) {
        let emb = newEmb(msg)

        let result_arr = [];
        let sides = 6;
        let count = 1;
    
        if (args.length > 1) {
          sides = args[0];
          count = args[1];
        } else if (args.length > 0) {
          sides = args[0];
        }
    
        if (sides > 100 || count > 100) {
          sides %= 100;
          sides < 6 ? (sides = 6) : null;
    
          count %= 100;
          count < 1 ? (count = 1) : null;
    
          message.channel.send(
            `Deine angaben übertrafen meine Leistung. Hier eine Alternative Auswahl für dich:\n` +
            `\n**Seiten:** \`${sides}\`` +
            `\n**Würfe:**  \`${count}\``
          );
        }
    
        let diceRoll;
        for (let i = 0; i < count; i++) {
          diceRoll = Math.floor(Math.random() * sides) + 1;
          result_arr.push(`**${i + 1}** - \`${diceRoll}\``);
        }
    
        let result = result_arr.join("\n");
        if (!result) result = "Ungültige Argumente";
    
          emb.setTitle(":game_die: Ergebnis :game_die:")
          .setFooter("Seiten: " + sides + " Würfe: " + count)
          .setDescription(
            result.length > 1024 ? "Zu viele Zeichen für dieses Embed" : result
          );





            msg.channel.send(emb)
       
    }
};