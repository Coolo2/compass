const Discord = require("discord.js-light");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/balances.sqlite');
const functions = require('../functions')

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.toString().toLowerCase().replace(new RegExp(`,`, 'g'), ``).replace(new RegExp(`k`, 'g'), `000`)}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.toString().toLowerCase().replace(new RegExp(`,`, 'g'), ``).replace(new RegExp(`k`, 'g'), `000`)}

const fs = require('fs')
const emojis = require('./emoji');
const prefixes = require("./prefix");

const r = require('../Resources/rs');
const { sep } = require("path");

function contents() {
    return fs.readFileSync('.//Resources/workreplies.json')
}
function crimecontents() {
    return fs.readFileSync('.//Resources/crimereplies.json')
}
function startup(server, member) {
    require('./databasesetup').startup(server, member)
};

function deposit(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['dep', 'deposit', 'd'].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        amount = args[0]
        if (amount != "all" && (!amount || isNaN(amount.jn()) ) ) {return message.channel.send(functions.error(`Invalid command syntax, use ${prefixes.get(message.guild)}deposit [amount/all]`))}
        amount = args[0].jn()
        try {balance = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance} catch {balance = 0}
        try {bank = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get("bank" + message.author.id).balance} catch {bank = 0}
        if (Math.floor(amount) > balance) {return message.channel.send(functions.error("You can not deposit more than you have in cash"))}
        if (amount == "all") {amount = String(balance)}
        if (amount == "0" || Math.floor(amount) < 0) {return message.channel.send(functions.error("You can't deposit anything lower than 1"))}
        sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, (balance - parseInt(amount)));
        sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run("bank" + message.author.id, bank + parseInt(amount));
        return message.channel.send(functions.embed("Success", `Deposited **${amount.sep()}** ${emojis.get(message.guild)} to your bank`, r.s))
    }
}

function withdrawl(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['withdraw', 'with', 'w'].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        amount = args[0]
        if (amount != "all" && (!amount || isNaN(amount.jn()) ) ) {return message.channel.send(functions.error(`Invalid command syntax, use ${prefixes.get(message.guild)}withdraw [amount/all]`))}
        amount = args[0].jn()
        try {balance = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance} catch {balance = 0}
        try {bank = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get("bank" + message.author.id).balance} catch {bank = 0}
        if (Math.floor(amount) > bank) {return message.channel.send(functions.error("You can not withdraw more than you have in bank"))}
        if (amount == "all") {amount = String(bank)}
        if (amount == "0" || Math.floor(amount) < 0) {return message.channel.send(functions.error("You can't withdraw anything less than 1"))}
        sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, balance + parseInt(amount));
        sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run("bank" + message.author.id, (bank - parseInt(amount)));
        return message.channel.send(functions.embed("Success", `Withdrew **${amount.sep()}** ${emojis.get(message.guild)} to cash`, r.s))
    }
}

function balance(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['balance', 'bal', 'credits'].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        let user = functions.userfromarg(message, args.splice(0,100).join(" "))
        if (user=="none"){
            try{
                score = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance
            } catch {score = 0}
            try{
                scorebank = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get("bank" + message.author.id).balance
            } catch {scorebank = 0}
            message.channel.send(functions.embed(`Your balance`, `[Your profile](${JSON.parse(fs.readFileSync('./Resources/website.json')).address + '/p/' + require('../Website/Modules/profiles').checkUser(message.author.id) + '/' + message.guild.id})`, r.d)
                .addField(`Cash`, `${score.sep()}${emojis.get(message.guild)}`, true)
                .addField(`Bank`, `${scorebank.sep()}${emojis.get(message.guild)}`, true)
                .addField(`Total`, `${(scorebank + score).sep()}${emojis.get(message.guild)}`, true)
            )
        }
        else {
            try {
                score = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance
            } catch {score = 0}
            try{
                scorebank = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get("bank" + user.id).balance
            } catch {scorebank = 0}
            message.channel.send(functions.embed(`${user.username}'s balance`, `[${user.username}'s profile](${JSON.parse(fs.readFileSync('./Resources/website.json')).address + '/p/' + require('../Website/Modules/profiles').checkUser(user.id) + '/' + message.guild.id})`, r.d)
                .addField(`Cash`, `${score.sep()}${emojis.get(message.guild)}`, true)
                .addField(`Bank`, `${scorebank.sep()}${emojis.get(message.guild)}`, true)
                .addField(`Total`, `${(scorebank + score).sep()}${emojis.get(message.guild)}`, true)
            )
        }

    }
};

module.exports.deposit = deposit
module.exports.withdrawl = withdrawl
module.exports.balance = balance