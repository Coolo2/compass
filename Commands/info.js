const Discord = require('discord.js');
const functions = require('../functions')
const setup = JSON.parse(require('fs').readFileSync('./Resources/setup.json'))
const website = JSON.parse(require('fs').readFileSync('./Resources/website.json'))

const r = require('../Resources/rs');
const Compass = require('../compass');

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.split(",").join("")}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.split(",").join("")}

function botinfo(message, bot) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["info", "about", "botinfo"].includes(command)) {
        difference = (new Date - Compass.launchedAt) / 1000;
        embed = functions.embed("Info for me", "I am a bot started on July 8th 2020 by `Coolo2#5499`. I am written in node.js and python", r.d)
            .addField("Servers", (bot.guilds.cache.size).sep(), true)
            .addField("Channels", (bot.channels.cache.size).sep(), true)
            .addField("Users", (bot.users.cache.size).sep(), true)
            .addField("Uptime", readable(difference), true)
        message.channel.send(embed)
    }
}

function support(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["support", "supportserver", "website", "voteplace", "invite", "inv", "links", "link"].includes(command)) {
        message.channel.send(functions.embed(
            `My Links`, 
            `[Invite me](${setup.invite})\n[Website](${website.address})\n[Support Server](${setup.server})\n[Vote for me](${setup.dbllink})`,
            r.d
        ))
    }
}

readable = require('./cooldowns').readable

function uptime(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command=="uptime") {
        difference = (new Date - Compass.launchedAt) / 1000;
        return message.channel.send(functions.embed(`My uptime`, `I have been awake for: ${readable(difference)}`, r.d))
    }
}

module.exports.uptime = uptime
module.exports.botinfo = botinfo
module.exports.support = support