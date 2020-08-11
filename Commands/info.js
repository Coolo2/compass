const Discord = require('discord.js');
const functions = require('../functions')
const setup = JSON.parse(require('fs').readFileSync(__dirname + '../../Resources/test.json'))

function botinfo(message, bot) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command=="botinfo") {
        embed = functions.embed("Info for me", "I am a bot created on July 8th 2020 by `Coolo2#5499`. I am written in discord.js", '#990099')
            .addField("Servers", bot.guilds.cache.size, true)
            .addField("Channels", bot.channels.cache.size, true)
            .addField("Users", bot.users.cache.size, true)
        message.channel.send(embed)
    }
}
module.exports.botinfo = botinfo