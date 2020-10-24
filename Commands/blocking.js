const Discord = require('discord.js');
const functions = require('../functions')
const fs = require('fs')
const setup = JSON.parse(fs.readFileSync('./Resources/setup.json'))

const r = require('../Resources/rs')

function block(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["block", "disable"].includes(command)) {
        if (message.guild ===null){return message.channel.send("This command cannot be used in a DM channel")};
        if (!message.member.hasPermission("MANAGE_CHANNELS")) {return message.channel.send(functions.error("You are missing manage_channels permission to use this command"))}
        let channel = functions.channelfromarg(message.guild, args.splice(0,100).join(" "))
        if (channel == "none") return message.channel.send(functions.error("You must input a valid channel"))
        blocked = JSON.parse(fs.readFileSync('.//Databases/blocked.json'))
        blocked.channels[blocked.channels.length] = channel.id
        fs.writeFile("./Databases/blocked.json", JSON.stringify(blocked), function(err) {
            if (err) {message.channel.send(functions.error("Unknown error: " + err.message))}
        });
        message.channel.send("Successfully blocked!")
    }
}

function removeAllElements(array, elem) {
    var index = array.indexOf(elem);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
    }
}

function unblock(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["unblock", "enable"].includes(command)) {
        if (message.guild ===null){return message.channel.send("This command cannot be used in a DM channel")};
        if (!message.member.hasPermission("MANAGE_CHANNELS")) {return message.channel.send(functions.error("You are missing manage_channels permission to use this command"))}
        let channel = functions.channelfromarg(message.guild, args.splice(0,100).join(" "))
        if (channel == "none") return message.channel.send(functions.error("You must input a valid channel"))
        blocked = JSON.parse(fs.readFileSync('.//Databases/blocked.json'))
        if (!blocked.channels.includes(channel.id)) {return message.channel.send(functions.error("This channel is not disabled"))}
        removeAllElements(blocked.channels, channel.id)
        fs.writeFile("./Databases/blocked.json", JSON.stringify(blocked), function(err) {
            if (err) {return message.channel.send(functions.error("Unknown error: " + err.message))}
        });
        message.channel.send("Successfully enabled!")
    }
}

module.exports.block = block
module.exports.unblock = unblock