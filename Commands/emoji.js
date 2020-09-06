const Discord = require("discord.js");
const functions = require('../functions')
const setup = require('./databasesetup')

const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/emojis.sqlite');
const prefix = require('./prefix')

const r = require('../Resources/rs')

function emojis(message) {
    const args = message.content.slice(prefix1.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["emoji", 'setemoji', 'economyemoji', 'currency', 'setcurrency'].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        emoji = args.splice(0, 1).join(" ").split(" ").join("")
        if (emoji == 'reset') {
            sql.prepare(`DELETE FROM emojis where server='${message.guild.id}'`).run();
            return message.channel.send(functions.embed(`Successfully reset currency`, `Reset currency to ${get(message.guild)}`, r.s))
        }
        if (!emoji) {
            return message.channel.send(functions.embed(`Currency for ${message.guild.name}`, `The currency for ${message.guild.name} is ${get(message.guild)}\n\n**Change it with ${prefix.get(message.guild)}currency [currency to set]**!`, r.d))}
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
        setup.emojis(message.guild)
        try {
            sql.prepare(`INSERT OR REPLACE INTO emojis (server, emoji) VALUES (?, ?);`).run(message.guild.id, emoji);
        }
        catch (err) {
            console.log(err)
        }
        score = sql.prepare(`SELECT * FROM emojis WHERE server = ?`).get(message.guild.id).emoji
        message.channel.send(functions.embed(`Successfully set currency`, `Set currency for ${message.guild.name} to ${score}`, r.s))
    }
}
function get(guild) {
    setup.emojis(guild)
    try {
        return " " + sql.prepare(`SELECT * FROM emojis WHERE server = ?`).get(guild.id).emoji
    } catch {
        return " <:coin:740973567159828552>"
    }
}
module.exports.emojis = emojis
module.exports.get = get