const Discord = require("discord.js-light");
const functions = require('../functions')
const setup = require('./databasesetup')
const getprefix = require('./prefix')

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.toString().toLowerCase().replace(new RegExp(`,`, 'g'), ``).replace(new RegExp(`k`, 'g'), `000`)}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.toString().toLowerCase().replace(new RegExp(`,`, 'g'), ``).replace(new RegExp(`k`, 'g'), `000`)}

const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/cooldowns.sqlite');
const fs = require('fs')

function get_time(data) {
    if (data.includes('.')) return undefined
    if ( (data.includes("s") && data.includes("m")) || (data.includes("h") && data.includes("m")) || (data.includes("h") && data.includes("s")) ) {
        final = 0
        data.split(" ").forEach(item => {
            if (item.includes("s")) {
                final = final + parseFloat(item.replace("s", ""))
            } else if (item.includes("m")) {
                final = final + parseFloat(item.replace("m", "")*60)
            } else if (item.includes("h")) {
                final = final + parseFloat(item.replace("h", "")*3600)
            } else {return undefined}
        })
        return final
    }
    if (data.includes("s")) {
        return data.replace("s", "")
    } else if (data.includes("m")) {
        return String(parseFloat(data.replace("m", "")*60))
    } else if (data.includes("h")) {
        return String(parseFloat(data.replace("h", "")*3600))
    } else {
        if (!isNaN(data)) {
            return data
        } else {return undefined}
        
    }
}

function readable(data) {
    d = Number(data);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
    return hDisplay + mDisplay + sDisplay; 
}

const economy = require('./economy')
const economy2 = require('./economy2');

function cooldown(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["set-cooldown", "cooldown", "setcooldown", "sc", "cooldowns"].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        choice = args[0]
        time = args.splice(1).join(" ")
        if (!time || !choice || choice != "work" && choice != "crime" && choice != "other") {
            if (economy.rl[message.author.id + message.guild.id]) {work = readable(String(economy.getTimeLeft(economy.rl[message.author.id + message.guild.id]))) + " left /"} else {work = ""}
            if (economy.rlc[message.author.id + message.guild.id]) {crime = readable(String(economy.getTimeLeft(economy.rlc[message.author.id + message.guild.id]))) + " left /"} else {crime = ""}
            if (economy2.rlo[message.author.id + message.guild.id]) {other = readable(String(economy.getTimeLeft(economy2.rlo[message.author.id + message.guild.id]))) + " left /"} else {other = ""}
            return message.channel.send(functions.embed(`Cooldowns for ${message.guild.name}`, `Work cooldown: ${work}${readable(get(message.guild, 'work'))}\nCrime cooldown: ${crime}${readable(get(message.guild, 'crime'))}\nOther cooldowns: ${other}${readable(get(message.guild, 'other'))}\n\n**Change one with \`${getprefix.get(message.guild)}set-cooldown [work/crime/other] [cooldown(s/m/h)]\`**`, "#0099ff"))
        }
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            if (economy.rl[message.author.id + message.guild.id]) {work = readable(String(economy.getTimeLeft(economy.rl[message.author.id + message.guild.id]))) + " left /"} else {work = ""}
            if (economy.rlc[message.author.id + message.guild.id]) {crime = readable(String(economy.getTimeLeft(economy.rlc[message.author.id + message.guild.id]))) + " left /"} else {crime = ""}
            if (economy2.rlo[message.author.id + message.guild.id]) {other = readable(String(economy.getTimeLeft(economy2.rlo[message.author.id + message.guild.id]))) + " left /"} else {other = ""}
            return message.channel.send(functions.embed(`Cooldowns for ${message.guild.name}`, `Work cooldown: ${work}${readable(get(message.guild, 'work'))}\nCrime cooldown: ${crime}${readable(get(message.guild, 'crime'))}\nOther cooldowns: ${other}${readable(get(message.guild, 'other'))}`, "#0099ff"))
        }
        time = time.jn()
        if (!get_time(time)) {return message.channel.send(functions.error(`Invalid command syntax, use: ${getprefix.get(message.guild)}set-cooldown [work/crime/other] [cooldown(m/s/h)]`))}
        setup.cooldowns(message.guild)
        newTime = get_time(time)
        try {
            sql.prepare(`INSERT OR REPLACE INTO cooldowns${message.guild.id} (type, value) VALUES (?, ?);`).run(choice, get_time(time));
        }
        catch {
        }
        score = sql.prepare(`SELECT * FROM cooldowns${message.guild.id} WHERE type=?`).get(choice).value
        if (choice == "work") {for (item in economy.rl) {if (item.includes(message.guild.id)) {if (Number(economy.getTimeLeft(economy.rl[item])) > newTime) {delete economy.rl[item];economy.tr.delete(item)}}  }}
        if (choice == "crime") {for (item in economy.rlc) {if (item.includes(message.guild.id)) {if (Number(economy.getTimeLeft(economy.rlc[item])) > newTime) {delete economy.rlc[item];economy.trc.delete(item)}}  }}
        if (choice == "other") {for (item in economy2.rlo) {if (item.includes(message.guild.id)) {if (Number(economy.getTimeLeft(economy2.rlo[item])) > newTime) {delete economy2.rlo[item];economy2.tro.delete(item)}}  }}
        message.channel.send(functions.embed("Set cooldown for " + message.guild.name, `Set the ${choice} cooldown for ${message.guild.name} to ${readable(score)}`, "#0099ff"))
    }
}

function get(guild, choice) {
    try {
        final = sql.prepare(`SELECT * FROM cooldowns${guild.id} WHERE type = ?`).get(choice).value
    } catch {
        if (choice == "work") {final = "1800"} 
        else if (choice == "crime") {final = "1800"}
        else if (choice == "other") {final = "5"}
    }
    return final
}

module.exports.get = get
module.exports.cooldown = cooldown
module.exports.readable = readable
module.exports.get_time = get_time