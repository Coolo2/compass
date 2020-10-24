const Discord = require("discord.js");
//const bot = require('../Compass').bot
const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/balances.sqlite');
const functions = require('../functions')
const talkedRecently = new Set();
const fs = require('fs')

const r = require('../Resources/rs')

function contents() {
    return fs.readFileSync('.//Resources/workreplies.json')
}

function startup(server, member) {
    require('./databasesetup').startup(server, member)
};

function take (bot, message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command == "loadreplies") {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
        const server = functions.decode(args.splice(0,1).join(" "))
        const guild = bot.guilds.cache.get(server)
        try {guild.name} catch {return message.channel.send(functions.error("Invalid share ID"))}
        startup(message.guild, message.author)
        startup(guild, message.author)
        try {
            replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(guild.id).data
        }
        catch {
            sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(guild.id, contents());
        }
        replies = JSON.parse(sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(guild.id).data)
        sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, JSON.stringify(replies));
        message.channel.send(functions.embed("Loaded replies from " + guild.name, `To see your new replies use **${require('./prefix').get(message.guild.id)}workreplies** or see them on the [Web dashboard](${JSON.parse(fs.readFileSync('.//Resources/website.json')).address}/app/${message.guild.id})`, r.s))
    }
}
function share (message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["sharereplies", "shareid"].includes(command)) {
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
        message.channel.send(functions.embed("How to share work replies", 
        `1. Your work reply shareID is on the [web dashboard](${JSON.parse(fs.readFileSync('.//Resources/website.json')).address}/app/${message.guild.id}) (only members with MANAGE_SERVER permissions can see this)
        
        2. Share the shareID with whoever you want to use your work replies: **?loadreplies [shareID]** or do it through the [web dashboard](${JSON.parse(fs.readFileSync('.//Resources/website.json')).address}/app/${message.guild.id})
        
        3. You should have all work replies synced! To sync again just follow step 1 and 2 again. 
        
        4. If you need any support join the [support server](https://discord.gg/fDUs68p)`, r.d))
    }
}

module.exports.take = take
module.exports.share = share