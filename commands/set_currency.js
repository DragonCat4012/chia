const { Message } = require("discord.js");
const { colors, confirmAction, newEmb } = require("../utilities");
const { Users, ItemList, Inventories, currency } = require("../index");

module.exports = {
  name: "Set Currency",
  syntax: "set-currency {@user} {amount}",
  args: true,
  description: "Sets the Currency of someone",
  commands: ["set-currency", "set-c"],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg, args) {
    const transferAmount = args.find(arg => !/<@!?\d+>/g.test(arg));
    const transferTarget = msg.mentions.users.first() || msg.author;

    currency.add(transferTarget.id, transferAmount);

    return msg.channel.send(
      `Successfully transferred ${transferAmount}💰 to ${
        transferTarget.tag
      }. Your current balance is ${currency.getBalance(msg.author.id)}💰`
    );
  }
};
