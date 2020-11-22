const Discord = require("discord.js-light");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/balances.sqlite');
const functions = require('../functions')

const cooldowns = require('./cooldowns')
const returns = require('./returns')

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.split(",").join("")}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.split(",").join("")}

const r = require('../Resources/rs')

const economy = require('./economy')

const TalkedRecentlyOther = new Set();
const TalkedRecentlyLeftOther= {}

const fs = require('fs')
const emojis = require('./emoji');
const prefixes = require("./prefix");

function startup(server, member) {
    require('./databasesetup').startup(server, member)
};

function percentage(percent, total) {
    return ((percent/ 100) * total).toFixed(2)
}
function getTimeLeft(timeout){
    return Math.round(parseFloat((timeout._idleStart + timeout._idleTimeout)/1000 - process.uptime()));
  }

function lower(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'lower') {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};

        startup(message.guild, message.author)
        choice = args[0]
        bet = args[1]
        botChoice = functions.int(1, 100)
        try {balance = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance} catch {balance = 0}
        if (!choice || !bet || isNaN(choice.jn()) || isNaN(bet.jn()) || choice > 99 || choice < 1) {return message.channel.send(functions.error(`Invalid usage, please use: ${prefixes.get(message.guild)}lower [1-99] [bet]`))}
        bet = args[1].jn()
        if (parseInt(bet) > balance) {return message.channel.send(functions.error("You cannot bet more than your cash balance"))}
        if (TalkedRecentlyOther.has(message.author.id + message.guild.id)) {
            return message.channel.send(functions.embed("You're on cooldown", "Wait " + cooldowns.readable(String(getTimeLeft(TalkedRecentlyLeftOther[message.author.id + message.guild.id]))) + " to use another economy command!", r.f));
        } else {
            TalkedRecentlyOther.add(message.author.id + message.guild.id);
            TalkedRecentlyLeftOther[message.author.id + message.guild.id] = setTimeout(() => {
                TalkedRecentlyOther.delete(message.author.id + message.guild.id);
                delete TalkedRecentlyLeftOther[message.author.id + message.guild.id]
            },   parseInt(cooldowns.get(message.guild, "other")) * 1000);
        }

        amountPlus = Math.round(parseInt(bet)*2 - percentage(parseInt(choice), parseInt(bet)*2))
        amountMinus = Math.round(parseInt(bet))
        if ( (parseInt(choice)-botChoice) > 0) {final = amountPlus}
        else {final = 0 - amountMinus}
        try {
            sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, balance + final);
        }
        catch {
            sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, final);
        }
        if (final > 0) {
            return message.channel.send(
                functions.embed(`Lower - ${message.author.username}`, ``, r.s)
                    .addField(`You won!`, `I rolled **${botChoice}**`, true)
                    .addField(`Profits`, `You got **${(amountPlus).sep()}** ${emojis.get(message.guild)}`, true)
                    .addField(`Balance`, `You are now on **${(balance + final).sep()}** ${emojis.get(message.guild)} cash`, false)
                    .setFooter(`The lower the guess, the higher the winning.`)
            )
        } else {
            return message.channel.send(
                functions.embed(`Lower - ${message.author.username}`, ``, r.f)
                    .addField(`You lost`, `I rolled **${botChoice}**`, true)
                    .addField(`Profits`, `You lost **${(amountMinus).sep()}** ${emojis.get(message.guild)}`, true)
                    .addField(`Balance`, `You are now on **${(balance + final).sep()}** ${emojis.get(message.guild)} cash`, false)
                    .setFooter(`The lower the guess, the higher the winning.`)
            )
        }
    }
}

main = require('../compass')

const setup = JSON.parse(fs.readFileSync('./Resources/setup.json'))

function vote(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'vote') {
        if (main.votes[message.author.id]) {
            counter = 0
            addto = []
            for (item of sql.prepare(`SELECT * from sqlite_master where type='table'`).iterate()) {
                if (item["name"].includes(message.author.id)) {
                    try {balance = sql.prepare(`SELECT * FROM ${item["name"]} WHERE user = ?`).get(message.author.id).balance} catch {balance = 0}
                    addto.push(item["name"])
                    counter = counter + 1
                }
            }
            addto.forEach(server => {
                sql.prepare(`INSERT OR REPLACE INTO ${server} (user, balance) VALUES (?, ?);`).run(message.author.id, balance + 2500);
            })
            delete main.votes[message.author.id]
            message.channel.send(functions.embed(`Thanks for voting!`, `Added **2,500** to your cash balance in **${counter}** server(s)! Try again in 12 hours to get more!`, r.s))
            
        } else {
            message.channel.send(functions.embed(`You haven't voted yet!`, `[Vote Here](${setup.dbllink}) for 2,500 in every server!`, r.d))
        }
    }
}

multipliers = [1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6, 4.8, 5.0]

multipliers_js = {
    1:[1.2, 1.4, 1.6, 1.8],
    2:[1.2, 1.4, 1.6, 1.8],
    3:[2.0, 2.2, 2.4, 2.6],
    4:[2.0, 2.2, 2.4, 2.6],
    5:[2.8, 3.0, 3.2, 3.4],
    6:[3.6, 3.8, 4.0, 4.2],
    7:[4.4, 4.6, 4.8, 5.0]
}

function generate(message, multiplier, profit) {
    return functions.embed(`Crash - ${message.author.username}`, ``, r.s)
        .addField(`Multiplier`, `${multiplier}x`, true)
        .addField(`Profit`, `${profit} ${emojis.get(message.guild)}`, true)
}

crashIntervals = {}
crashCounters = {}
crashMsg = {}
crashBet = {}

async function crash(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'crash') {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        bet = args[0]
        if (!bet || isNaN(bet.jn()) && !bet.includes(".")) {return message.channel.send(functions.error(`Invalid usage, use: ${prefixes.get(message.guild)}crash [bet]`))}
        crashBet[message.author.id] = bet.jn()
        try {balance = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance} catch {balance = 0}
        if (crashBet[message.author.id] > balance) {return message.channel.send(functions.error("You can not bet more than you have in cash."))}
        embed = generate(message, 1.0, 0)    
        
        therandom = functions.int(1, 7) 
        theEnd = functions.randomchoice(multipliers_js[therandom])
        if (functions.int(1, 6) == 2) {theEnd = 1.2}
        
        crashMsg[message.author.id] = await message.channel.send(`Use **${prefixes.get(message.guild)}stop** to stop`, embed)
        crashCounters[message.author.id] = 0
        crashIntervals[message.author.id] = setInterval(() => {
            if (multipliers[crashCounters[message.author.id]] == theEnd) {try {sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, balance - parseInt(bet));} catch{message.channel.send(`Error adding balance: please join <${setup.server}> for support`)};crashMsg[message.author.id].edit(`Crashed!`, functions.embed(`Crash - ${message.author.username}`, ``, r.f).addField(`Crashed at`, `${multipliers[crashCounters[message.author.id]]}x`, true).addField(`Profit`, `-${(parseInt(crashBet[message.author.id])).sep()} ${emojis.get(message.guild)}`, true).addField(`Your balance`, `You are now on ${(balance - parseInt(bet)).sep()} ${emojis.get(message.guild)}`));interval=crashIntervals[message.author.id];delete crashBet[message.author.id];delete crashMsg[message.author.id];delete crashCounters[message.author.id];delete crashIntervals[message.author.id];clearInterval(interval);}
            else {
                crashMsg[message.author.id].edit(`Use **${prefixes.get(message.guild)}stop** to stop`, generate(message, multipliers[crashCounters[message.author.id]], (Math.round(parseInt(crashBet[message.author.id]) * multipliers[crashCounters[message.author.id]]) - parseInt(crashBet[message.author.id])).sep() ))
                crashCounters[message.author.id] = crashCounters[message.author.id] + 1
            }
        }, 2000)
        
    }
    else if (command == 'stop' && crashBet[message.author.id]) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        stopped = multipliers[crashCounters[message.author.id]-1]
        try {balance = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance} catch {balance = 0}
        try {sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, balance + Math.round(parseInt(crashBet[message.author.id]) * stopped) - parseInt(crashBet[message.author.id]))} catch{message.channel.send(`Error adding balance: please join <${setup.server}> for support`)}
        crashMsg[message.author.id].edit(
            `~~Use **${prefixes.get(message.guild)}stop** to stop~~`, functions.embed(`Crash - ${message.author.username}`, ``, r.s).addField(`Stopped at`, `${stopped}x`, true).addField(`Profit`, `${(Math.round(parseInt(crashBet[message.author.id]) * stopped) - parseInt(crashBet[message.author.id])).sep()} ${emojis.get(message.guild)}`, true).addField(`Your balance`, `You are now on ${balance + Math.round(parseInt(crashBet[message.author.id]) * stopped) - parseInt(crashBet[message.author.id])} ${emojis.get(message.guild)}`)
        )
        interval=crashIntervals[message.author.id];delete crashBet[message.author.id];delete crashMsg[message.author.id];delete crashCounters[message.author.id];delete crashIntervals[message.author.id];
        clearInterval(interval);
    }
}

function rob(bot, message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["rob", "steal"].includes(command)) {
        userArgs = args.splice(0,100).join(" ")
        let user = functions.userfromarg(message, userArgs)
        if (userArgs == "") {return message.channel.send(functions.error(`You need to input a user to rob! ${prefixes.get(message.guild)}rob [user]`))}
        if (user=="none") {return message.channel.send(functions.error("Unknown user!"))}
        if (user.id == message.author.id) {return message.channel.send(functions.error(`You can not rob yourself!`))}
        startup(message.guild, message.author)
        startup(message.guild, user)
        try{
            score = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance;
        } catch {score = 0}
        try{
            scoreOther = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance;
        } catch {scoreOther = 0}
        if (!scoreOther || scoreOther == 0) {return message.channel.send(functions.error(`${user.username} has no money in cash!`))}
        if (scoreOther < 5) {return message.channel.send(functions.error(`${user.username} does not have enough money for you to rob!`))}

        if (economy.trc.has(message.author.id + message.guild.id)) {
            return message.channel.send(functions.embed("You're on cooldown", "Wait " + cooldowns.readable(String(getTimeLeft(economy.rlc[message.author.id + message.guild.id]))) + " to attempt a rob again!", r.f));
        } else {
            economy.trc.add(message.author.id + message.guild.id);
            economy.rlc[message.author.id + message.guild.id] = setTimeout(() => {
                economy.trc.delete(message.author.id + message.guild.id);
                delete economy.rlc[message.author.id + message.guild.id]
            },   parseInt(cooldowns.get(message.guild, "crime")) * 1000);
        }
        choice = functions.int(0,2)
        if (choice == 1) { //Success
            amount = Math.round((functions.int(15,41)/100) * scoreOther)
            sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, score + parseInt(amount));
            sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${user.id} (user, balance) VALUES (?, ?);`).run(user.id, scoreOther - parseInt(amount));
            return message.channel.send(functions.embed(`Successfully robbed ${user.username}`, `Robbed **${amount.sep()} ${emojis.get(message.guild)}** from **${user.username}**!`, r.s))
        } else {
            amount = Math.round((functions.int(100,1000)))
            sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, score - parseInt(amount));
            return message.channel.send(functions.embed(`You were fined!`, `You were caught and fined **${amount.sep()} ${emojis.get(message.guild)}**.`, r.f))
        }
    }
}

function pay(bot, message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["pay", "transfer", "give"].includes(command)) {
        userArgs = args.splice(0,1).join(" ")
        amount = args.splice(0,100).join(" ")
        let user = functions.userfromarg(message, userArgs)
        if (userArgs == "") {return message.channel.send(functions.error(`You need to input a user to pay! ${prefixes.get(message.guild)}pay [user] [amount]`))}
        if (user=="none") {return message.channel.send(functions.error("Unknown user!"))}
        if (user.id == message.author.id) {return message.channel.send(functions.error(`You can not pay yourself!`))}
        if (!amount || isNaN(amount.jn())) {return message.channel.send(functions.error(`Missing or invalid amount`))}
        amount = Math.floor(amount).jn()
        if (amount < 1) {return message.channel.send(functions.error(`You can't pay less than 0!`))}
        startup(message.guild, message.author)
        startup(message.guild, user)
        try{
            score = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance;
        } catch {score = 0}
        try{
            scoreOther = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance;
        } catch {scoreOther = 0}
        if (amount > Number(score)) {return message.channel.send(functions.error(`You can't pay more than you have in cash!`))}
        sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, score - parseInt(amount));
        sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${user.id} (user, balance) VALUES (?, ?);`).run(user.id, scoreOther + parseInt(amount));
        return message.channel.send(functions.embed(`Successfully paid ${user.username}`, `Paid **${amount.sep()} ${emojis.get(message.guild)}** to **${user.username}**!`, r.s))
    }
}

module.exports.crash = crash
module.exports.rlo = TalkedRecentlyLeftOther
module.exports.tro = TalkedRecentlyOther
module.exports.vote = vote
module.exports.lower = lower
module.exports.rob = rob
module.exports.pay = pay