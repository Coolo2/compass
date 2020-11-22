const Discord = require("discord.js-light");
const functions = require('../functions')
const databasesetup = require('./databasesetup')
const prefixes = require('./prefix')

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.split(",").join("")}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.split(",").join("")}

const SQLite = require("better-sqlite3");
const fs = require('fs')

const setup = JSON.parse(fs.readFileSync('./Resources/setup.json'))

const economy = require('./economy')
const sql = new SQLite('./Databases/balances.sqlite');

const emojis = require('./emoji');

const r = require('../Resources/rs');
const { isInteger } = require("mathjs");

function startup(server, member) {
    require('./databasesetup').startup(server, member)
};

function serverGenerate(guild, amount) {
    codes = JSON.parse(fs.readFileSync('./Databases/codes.json'))
    var length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        if (!String(i/4).includes(".") && i!=0) {retVal += "-"}
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    if (!codes[guild.id]) {codes[guild.id] = {}}
    codes[guild.id][retVal] = amount
    fs.writeFileSync('./Databases/codes.json', JSON.stringify(codes))
    return retVal;
}

function globalGenerate(amount) {
    codes = JSON.parse(fs.readFileSync('./Databases/codes.json'))
    var length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        if (!String(i/4).includes(".") && i!=0) {retVal += "-"}
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    if (!codes["global"]) {codes["global"] = {}}
    codes["global"][retVal] = amount
    fs.writeFileSync('./Databases/codes.json', JSON.stringify(codes))
    return retVal;
}

function checkAddRemove(message, code) {
    codes = JSON.parse(fs.readFileSync('./Databases/codes.json'))
    if (codes["global"][code]) {
        try {balance = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance} catch {balance = 0}
        try {sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, balance + codes["global"][code])} catch{message.channel.send(`Error adding balance: please join <${setup.server}> for support`)}
        amount = codes["global"][code]
        delete codes["global"][code]
        fs.writeFileSync('./Databases/codes.json', JSON.stringify(codes))
        return {code:code, amount:amount, balance:balance + amount}
    }
    else if (codes[message.guild.id] && codes[message.guild.id][code]) {
        try {balance = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance} catch {balance = 0}
        try {sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, balance + codes[message.guild.id][code])} catch{message.channel.send(`Error adding balance: please join <${setup.server}> for support`)}
        amount = codes[message.guild.id][code]
        delete codes[message.guild.id][code]
        fs.writeFileSync('./Databases/codes.json', JSON.stringify(codes))
        return {code:code, amount:amount, balance:balance + amount}
    } 
    else {return false}
}

function deleteCode(guild, code) {
    codes = JSON.parse(fs.readFileSync('./Databases/codes.json'))
    if (codes[guild.id][code]) {
        delete codes[guild.id][code]
        fs.writeFileSync('./Databases/codes.json', JSON.stringify(codes))
        return {code:code}
    }
    else {return false}
}

function deleteGlobal(code) {
    codes = JSON.parse(fs.readFileSync('./Databases/codes.json'))
    if (codes["global"][code]) {
        delete codes["global"][code]
        fs.writeFileSync('./Databases/codes.json', JSON.stringify(codes))
        return {code:code}
    }
    else {return false}
}


function generate(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["generate", "generate-code", "generatecode"].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
        amount = args[0]
        if (!amount || !isInteger(amount.jn())) {return message.channel.send(functions.error(`Invalid usage, use: ${prefixes.get(message.guild)}generate [code value]`))}
        amount = args[0].jn()
        serverGenerate(message.guild, parseInt(amount))
        message.channel.send(functions.embed(`Generated code`, `Generated code worth ${amount.sep()} ${emojis.get(message.guild)}. (Find it on the [web dashboard](${JSON.parse(fs.readFileSync('.//Resources/website.json')).address}/app/${message.guild.id}/codes)) \n\nRedeem it with **${prefixes.get(message.guild)}redeem [code]**`, r.s))
    }
}

function deleteCodeCommand(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["deletecode", "delete", "delete-code"].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
        code = args[0]
        if (!code) {return message.channel.send(functions.error(`Invalid usage, use: ${prefixes.get(message.guild)}delete-code [code]`))}
        final = deleteCode(message.guild, code)
        if (!final) {return message.channel.send(functions.error(`Invalid code (XXXX-XXXX-XXXX)`))}
        if (final["code"]) {return message.channel.send(functions.embed(`Deleted`, `Deleted code ${final["code"]}!`, r.s))}
    }
}

function deleteCodeGlobalCommand(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["deleteglobalcode", "deleteglobal", "delete-global", "delete-global-code"].includes(command)) {
        if (!setup.botadmins.includes(message.author.id)) {return message.channel.send(functions.error("You do not have permissions to do this"))}
        code = args[0]
        if (!code) {return message.channel.send(functions.error(`Invalid usage, use: ${prefixes.get(message.guild)}delete-global-code [code]`))}
        final = deleteGlobal(code)
        if (!final) {return message.channel.send(functions.error(`Invalid code (XXXX-XXXX-XXXX)`))}
        if (final["code"]) {return message.channel.send(functions.embed(`Deleted`, `Deleted code ${final["code"]}!`, r.s))}
    }
}

function generateGlobal(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["generateglobal", "generate-global"].includes(command)) {
        if (!setup.botadmins.includes(message.author.id)) {return message.channel.send(functions.error("You do not have permissions to do this"))}
        amount = args[0]
        if (!amount || !isInteger(amount.jn())) {return message.channel.send(functions.error(`Invalid usage, use: ${prefixes.get(message.guild)}generate-global [code value]`))}
        amount = args[0].jn()
        globalGenerate(parseInt(amount))
        message.channel.send(functions.embed(`Generated code`, `Generated code worth ${amount.sep()} ${emojis.get(message.guild)}. (Find it on the [admin page](${JSON.parse(fs.readFileSync('.//Resources/website.json')).address}/admin/globalCodes)) \n\nRedeem it with **${prefixes.get(message.guild)}redeem [code]**`, r.s))
    }
}

function redeem(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["redeem", "redeem-code", "redeemcode"].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        code = args.splice(0,500).join("")
        if (!code) {return message.channel.send(functions.error(`Invalid usage, use: ${prefixes.get(message.guild)}redeem [code]`))}
        startup(message.guild, message.author)
        final = checkAddRemove(message, code)
        if (!final) {return message.channel.send(functions.error(`Invalid code (XXXX-XXXX-XXXX)`))}
        if (final["amount"]) {return message.channel.send(functions.embed(`Redeemed`, `Redeemed code ${final["code"]} and got ${final["amount"].sep()} ${emojis.get(message.guild)}! You are now on ${final["balance"].sep()} ${emojis.get(message.guild)}`, r.s))}
    }
}

function getCodes(guild) {
    try{return JSON.parse(fs.readFileSync('./Databases/codes.json'))[guild.id]}
    catch {return {}}
}

function getGlobalCodes() {
    try{return JSON.parse(fs.readFileSync('./Databases/codes.json'))["global"]}
    catch {return {}}
}

module.exports.getGlobalCodes = getGlobalCodes
module.exports.deleteGlobal = deleteGlobal
module.exports.deleteCode = deleteCode
module.exports.getCodes = getCodes
module.exports.generate = generate
module.exports.redeem = redeem
module.exports.generateGlobalCode = globalGenerate
module.exports.generateServerCode = serverGenerate
module.exports.generateGlobal = generateGlobal
module.exports.deleteCodeCommand = deleteCodeCommand
module.exports.deleteCodeGlobalCommand = deleteCodeGlobalCommand