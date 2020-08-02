const { Message } = require("discord.js");
const { colors, confirmAction, newEmb } = require("../utilities");
const { Users, ItemList, Inventories, currency } = require("../index");

module.exports = {
  name: "Transfer",
  syntax: "transfer {@user} {amount}",
  args: true,
  description: "Transfers Money from your account to ur friends account uwu",
  commands: ["transfer", "pay"],

  /**
   *@document
   * @this
   * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
   * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
   */
  execute(msg, args) {
    var member = msg.member;

    const currentAmount = currency.getBalance(member.id);

    const transferAmount = args.find(arg => !/<@!?\d+>/g.test(arg));
    const transferTarget = msg.mentions.users.first();

    if (!transferAmount || isNaN(transferAmount))
      return msg.channel.send(`Sorry ${msg.author}, that's an invalid amount.`);
    if (transferAmount > currentAmount)
      return msg.channel.send(
        `Sorry ${msg.author}, you only have ${currentAmount}.`
      );
    if (transferAmount <= 0)
      return msg.channel.send(
        `Please enter an amount greater than zero, ${msg.author}.`
      );

    currency.add(msg.author.id, -transferAmount);
    currency.add(transferTarget.id, transferAmount);

    return msg.channel.send(
      `Successfully transferred ${transferAmount}💰 to ${
        transferTarget.tag
      }. Your current balance is ${currency.getBalance(msg.author.id)}💰`
    );
  }
};
