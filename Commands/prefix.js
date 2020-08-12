const Discord = require("discord.js");
const functions = require('../functions')
const setup = require('./databasesetup')

const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/prefixes.sqlite');


function prefix(message) {
    prefix1 = require('./prefix').getmess(message)
    const args = message.content.slice(prefix1.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["prefix", "serverprefix", "setprefix"].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
       choice = args.splice(0, 1).join(" ")
       if (!choice) {return message.channel.send(functions.embed(`Prefix for ${message.guild.name}`, `The prefix for ${message.guild.name} is ${get(message.guild)}\n\n**Change it with ${get(message.guild)}prefix [prefix to set]**!`, "#0099ff"))}
       if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
       setup.prefixes(message.guild)
        try {
            sql.prepare(`INSERT OR REPLACE INTO prefixes (server, prefix) VALUES (?, ?);`).run(message.guild.id, choice);
        }
        catch (err) {
            console.log(err)
        }
        score = sql.prepare(`SELECT * FROM prefixes WHERE server = ?`).get(message.guild.id).prefix
        message.channel.send(functions.embed("Set prefix for " + message.guild.name, `Set the prefix for ${message.guild.name} to ${score}`, "#0099ff"))
    }
}

function get(guild) {
    try {
        final = sql.prepare(`SELECT * FROM prefixes WHERE server = ?`).get(guild.id).prefix
    } catch {
        final = "?"
    }
    return final
}
function getmess(message) {
    if (message.content.toLowerCase().startsWith("<@!732208102652379187> ")) return "<@!732208102652379187> ";
    if (message.content.toLowerCase().startsWith("<@!732208102652379187>")) return "<@!732208102652379187>";
    if (message.content.toLowerCase().startsWith("<@732208102652379187> ")) return "<@732208102652379187> ";
    if (message.content.toLowerCase().startsWith("<@732208102652379187>")) return "<@732208102652379187>";
    try {
        final = sql.prepare(`SELECT * FROM prefixes WHERE server = ?`).get(message.guild.id).prefix
        if (message.content.toLowerCase().startsWith(final + " ")) return final + " ";
        else return final
    } catch {
        if (message.content.toLowerCase().startsWith("? ")) return "? ";
        else return "?";
    }
}

module.exports.prefix = prefix
module.exports.get = get
module.exports.getmess = getmess