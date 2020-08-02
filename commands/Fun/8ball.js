
const { Message } = require('discord.js');
const { newEmb } = require('../utilities');

module.exports = {
    name: '8-Ball',
    syntax: '8 ball',
    args: false,
    description: 'Wirft einen 8.ball für dich OnO',
    commands: ['8ball'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    execute(msg) {
        
        function doMagic8BallVoodoo() {
            var rand = [
              ":8ball: Absolut",
              ":8ball: Definitiv Nicht",
              ":8ball: Es ist wahr",
              ":8ball: Unmöglich",
              ":8ball: Natürlich",
              ":8ball: Ich glaube nicht",
              ":8ball: Stimmt",
              ":8ball: Das ist falsch",
              ":8ball: Das bezweifle ich sehr",
              ":8ball: Da stimme ich dir zu",
              ":8ball: Eine Quellen verweisen auf \"Nein\"",
              ":8ball: Theorien haben es bewiesen",
              ":8ball: Anwtort unklar, versuche es erneut",
              ":8ball: Vielleicht",
              ":8ball: Ich lasse dies lieber ungewiss",
              ":8ball: das kann ich nicht mit Sicherheit sagen",
              ":8ball: Konkretisiere dich und frage dann erneut"
            ];
        
            return rand[Math.floor(Math.random() * rand.length)];
          }



        

    let emb = newEmb(msg)
      .setTitle(doMagic8BallVoodoo())
      .setFooter('\u200b')
       msg.channel.send(emb)
        
    }
};