var nodeHtmlToImage = require('node-html-to-image');

const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/balances.sqlite');

const functions = require('../functions')

const emojis = require('./emoji');
const prefixes = require("./prefix");

const fs = require('fs')

const r = require('../Resources/rs')

const address = JSON.parse(fs.readFileSync('.//Resources/website.json')).address

const profiles = require('../Website/Modules/profiles')

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.toString().replace(new RegExp(`,`, 'g'), ``)}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.toString().replace(new RegExp(`,`, 'g'), ``)}

function profile(bot, message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["profile", "economyprofile"].includes(command)) {
        if (args[1]) arg2 = args[1]
        else arg2 = ""

        if (!args[0] || (args[0].toLowerCase() != 'global' && arg2.toLowerCase() != 'global')) {

            if (args[0] && functions.userfromarg(message, args[0]) != 'none') 
                user = functions.userfromarg(message, args[0])
            else if (arg2 != "" && functions.userfromarg(message, arg2) != 'none') 
                user = functions.userfromarg(message, args[1])
            else 
                user = message.author

            fullBalance = 0
            try{
                fullBalance += sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance
            } catch {fullBalance += 0}
            try{
                fullBalance += sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get("bank" + user.id).balance
            } catch {fullBalance += 0}
            grade = profiles.generateGuildGrade(message.guild, user, profiles.checkUser(user.id))
            return message.channel.send(
                functions.embed(`${user.username}'s economy stats for ${message.guild.name}`, `[View online profile](${address}/p/${profiles.checkUser(user.id)}/${message.guild.id})`, r.d)
                    .addField(`Value`, `${fullBalance.sep()} ${emojis.get(message.guild)}`, true)
                    .addField(`Grade`, `${grade.letter} (${grade.number})`, true)
            )
        } else {

            if (args[0] && functions.userfromarg(message, args[0]) != 'none') 
                user = functions.userfromarg(message, args[0])
            else if (arg2 != "" && functions.userfromarg(message, arg2) != 'none') 
                user = functions.userfromarg(message, args[1])
            else 
                user = message.author

            fullBalance = 0
            servers = 0

            for (item of sql.prepare(`SELECT * from sqlite_master where type='table'`).iterate()) {
                doit=false
                try{if (bot.guilds.cache.get(item["name"].replace(user.id, "").replace("balances", "")).member(user.id)) {servers++;doit=true}}catch{}
                if (item["name"].includes(user.id) && doit==true) {
                    try {balance = sql.prepare(`SELECT * FROM ${item["name"]} WHERE user = ?`).get(user.id).balance} catch {balance = 0}
                    try {balanceBank = sql.prepare(`SELECT * FROM ${item["name"]} WHERE user = ?`).get("bank" + user.id).balance} catch {balanceBank = 0}
                    fullBalance += balance;
                    fullBalance+=balanceBank;
                }
            }
            grade = profiles.generateGrade(user, profiles.checkUser(user.id))
            return message.channel.send(
                functions.embed(`${user.username}'s global economy stats`, `[View online profile](${address}/p/${profiles.checkUser(user.id)})`, r.d)
                    .addField(`Mutual Servers`, servers, true)
                    .addField(`Value`, `${fullBalance.sep()} ${emojis.get(message.guild)}`, true)
                    .addField(`Grade`, `${grade.letter} (${grade.number})`, true)
            )
        }
    }
}

module.exports.profile = profile

