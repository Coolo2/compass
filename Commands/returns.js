const Discord = require("discord.js-light");
const functions = require('../functions')
const setup = require('./databasesetup')
const getprefix = require('./prefix')

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.toString().toLowerCase().replace(new RegExp(`,`, 'g'), ``).replace(new RegExp(`k`, 'g'), `000`)}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.toString().toLowerCase().replace(new RegExp(`,`, 'g'), ``).replace(new RegExp(`k`, 'g'), `000`)}

const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/cooldowns.sqlite');
const fs = require('fs')

const economy = require('./economy')

const r = require('../Resources/rs');

function returns(message) {
    const args = message.content.slice(prefix.length).replace(" - ", " ").split(' ');
    const command = args.shift().toLowerCase();
    if (["returnamounts", "return-amounts", "return", "returns", "set-return"].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        choice = args[0]
        allAmounts = args.splice(1)
        lower = allAmounts[0]
        upper = allAmounts[1]
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.embed(`Return amounts for ${message.guild.name}`, `Work return: ${getraw(message.guild, 'work')}\nCrime return: ${getraw(message.guild, 'crime')}\nDaily return: ${getraw(message.guild, 'daily')}`, r.d))
        }
        if (!lower || !upper || !choice || !['work', 'crime', 'daily'].includes(choice)) {
            return message.channel.send(functions.embed(`Return amounts for ${message.guild.name}`, `Work return: ${getraw(message.guild, 'work')}\nCrime return: ${getraw(message.guild, 'crime')}\nDaily return: ${getraw(message.guild, 'daily')}\n\n**Change one with ${getprefix.get(message.guild)}set-return [command] [amount(lower) [amount(upper)]**`, r.d))
        }
        lower = allAmounts[0].jn()
        upper = allAmounts[1].jn()
        if (isNaN(lower) || isNaN(upper)) {
            return message.channel.send(functions.error(`Invalid numbers: ${getprefix.get(message.guild)}set-return [command] [amount(lower) [amount(upper)]`))
        }
        setup.returns(message.guild)
        try {
            sql.prepare(`INSERT OR REPLACE INTO returns${message.guild.id} (type, value) VALUES (?, ?);`).run(choice, lower + " " + upper);
        }
        catch (err) {
            console.log(err)
        }
        score = sql.prepare(`SELECT * FROM returns${message.guild.id} WHERE type=?`).get(choice).value
        message.channel.send(functions.embed("Set return amount for " + message.guild.name, `Set the ${choice} return amount for ${message.guild.name} to ${score.sep()}`, r.s))
    }
}

function get(guild, choice) {
    try {
        final1 = sql.prepare(`SELECT * FROM returns${guild.id} WHERE type = ?`).get(choice).value
    } catch {
        if (choice == "work") {final1 = "1 100"} 
        else if (choice == "crime") {final1 = "-500 1000"}
        else if (choice == "daily") {final1 = "500 2000"}
    }
    return [parseInt(String(final1).split(" ")[0]), parseInt(String(final1).split(" ")[1])]
}

function getraw(guild, choice) {
    try {
        final = sql.prepare(`SELECT * FROM returns${guild.id} WHERE type = ?`).get(choice).value
    } catch {
        if (choice == "work") {final = "1 100"} 
        else if (choice == "crime") {final = "-500 1000"}
        else if (choice == "daily") {final = "500 2000"}
    }
    return final
}


module.exports.get = get
module.exports.returns = returns
module.exports.getraw = getraw