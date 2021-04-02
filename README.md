
[![Code Grade](https://www.code-inspector.com/project/18829/status/svg)](https://www.code-inspector.com/public/project/18829/dashboard)
[![Code Score](https://www.code-inspector.com/project/18829/score/svg)](https://www.code-inspector.com/public/project/18829/dashboard)

# chia
Chia ist ein kleiner RPG Bot der sich auf die lange Reise des Lebens begab. Ihr Lebenssinn besteht darin anderen Freuden zu bereiten^^ 
Basierend auf Discord.JS & mongoose
</br>


***
## Commands
</br>

### ✉️  Allgemein [6]
|  Name | Beschreibung |
| ------------- | ------------- |
| help | Zeigt dir alle Befehle |
| info | Zeigt dir Inos über mich ^^ |
| invite | Gibt den Linki mit dem du mich zu deinem server hinzufügen kannst UwU |
| start | Zeigt dir die Spieler Karte eines Läst dich dein Abenteuer mit mir starten ^^ |
| up | Bin ich online.....? |
| update | Zeigt dir meien neusten Änderungen |
</br>

### ⛩️ Dungeons [4]
|  Name | Beschreibung |
| ------------- | ------------- |
| dungeon | Zeigt dir informationen über einen Dungeon |
| dungeons | Zeigt dir alle verfügbaren Dungeons |
| explore | Kämpfe in Dungeons |
| fight | Kämpf gegen andere Spieler. Nutze "ranked" um das Ergebnis zu werten |
</br>

### 💰  Economy [14]
|  Name | Beschreibung |
| ------------- | ------------- |
| buy | Lässt dich Items kaufen |
| craft | Lässt dich Items verkaufen |
| equip | Lässt dich Items ausrüsten |
| hunt | Lässt dich Monster jagen |
| inventory | Zeigt dir das Inventar eines Spielers, nutze "full" oder "rare" für genauere Auskunft darüber. |
| items | Zeigt dir alle Items |
| leaderboard | Listet alle Spieler in einem Leaderboard auf |
| monster | Zeigt dir alle Monster |
| profile | Zeigt dir die Spieler Karte eines Spielers |
| sell | Lässt dich Items verkaufen |
| shop | Zeigt dir alle verfügbaren Items |
| transfer | Transferiert deine Coins OvO |
| weekly | Gibt dir dein wöchentliches vermögen aus OvO |
| daily | Gibt dir dein tägliches vermögen aus OvO |
| Content | content |
</br>

### ⚙️ Einstellungen [2]
|  Name | Beschreibung |
| ------------- | ------------- |
| level | Deaktiviert/Aktiviert die Level Nachricht für deinen Server |
| prefix | Ändert das Prefix für deinen Server |
</br>


***
## Support

**[![widget](https://discord.com/api/guilds/553942677117337600/widget.png?style=banner2)](https://discord.gg/Emk2udJ)**

<a href="https://top.gg/bot/744883074508259329">
    <img src="https://top.gg/api/widget/744883074508259329.svg" alt="Chia" />
</a>

***
## Run
1. Füll die config.json, die emotes in utilities.js und den moongose conenction link in der index.js mit dienen ids aus

Beispiel Config Setup

```json
{
    "owner": [
        "ownerID",
        "ownerID"
    ],
    "defaultPrefix": "--",
    "token": "YourDiscordBotToken"
}
```

Beispiel Mongoose Connection

```Javascript
mongoose.connect('mongodb://localhost:27017/chia?gssapiServiceName=mongodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
}).then(() => {
    console.log("Connected to the Mongodb database");
}).catch((err) => {
    console.log("Unable to connect to the Mongodb database. Error:" + err, "error");
});

```
2. Alle Emojis müssen selbst erstellt werden und mit namen + Id in utilities.js eingetragen werden da sie serverspezifisch sind und sonst nciht funktionieren.

Der name + id kann ermittelt werden, indem man einen Backslash vor den emoji schriebt

Beispiel:
```
\✨
```

Beispiel Emote Setup:

```javascript
const emotes = {
    shield: "<:shield:753309572055171173>",
    location: "<:location:771483527169966090>",
    wus: '<:wus:761274129583964201>',
    threatening: '<:threatening:750711786256203777>',
    cool: '<:gilgacool:754654249773957134>',
    oha: '<:0000:761274355841499207>',
    yeah: '<:yeah:768747358937808926>',

    staff: "<:staff:752248790198648852>",
    plus: "<:plus:768749896995569674>"
}
```

3. Der Bot Status kann in activities.json eingetragen werden
Beispiel Actibvity setup:

```json
[
    "Monster suchen",
    "Shop aufräumen",
    "Dungeons ordnen . . .",
    "{PREFIX}help"
]
```

```
node index.js
```
</br>


***
## Contributions 
<a href="https://github.com/DragonCat4012/chia/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DragonCat4012/chia" />
</a>

***
## Installation
```
npm i
```
</br>

***
## Dependencies
|  Package | Version |
| ------------- | ------------- |
| discord.js | ^12.5.1 |
| mongoose | ^5.11.14 |
| parse-ms | ^2.1.0 |