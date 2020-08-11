const Discord = require('discord.js');
const bot = new Discord.Client();
const math = require('mathjs');
const { json } = require('body-parser');
const functions = require('../functions')

function ban(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command=="ban") {
        if (message.guild ===null){return message.channel.send("This command cannot be used in a DM channel")};
        if (args[0]) {
            user = functions.userfromarg(message, args.splice(0).join(" "))
            const member = message.guild.member(user)
            if (!member) {
                return message.channel.send(functions.error("Could not find a valid mention"))
            }
            if (message.member.hasPermission("BAN_MEMBERS")) {
                try {
                    member.ban();
                    return message.channel.send(functions.embed(`Successfully banned`, "Banned " + user.username + " successfully", `#990099`))
                } 
                catch {
                    return message.channel.send(functions.error(`I do not have permissions to ban ${user.username}`));
                }   
            }
            else {
                return message.channel.send(functions.error(`You do not have permission to ban ${user.username}`));
            }
        }
        else {
            return message.channel.send(functions.error("You did not mention anyone"));
        }
    }
}
function kick(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command=="kick") {
        if (message.guild ===null){return message.channel.send("This command cannot be used in a DM channel")};
        if (args[0]) {
            user = functions.userfromarg(message, args.splice(0).join(" "))
            const member = message.guild.member(user)
            if (!member) {
                return message.channel.send(functions.error("Could not find a valid mention"))
            }
            if (message.member.hasPermission("KICK_MEMBERS")) {
                try {
                    member.kick();
                    return message.channel.send(functions.embed(`Successfully kicked`, "Kicked " + user.username + " successfully", `#990099`))
                } 
                catch {
                    return message.channel.send(functions.error(`I do not have permissions to kick ${user.username}`));
                }   
            }
            else {
                return message.channel.send(functions.error(`You do not have permission to kick ${user.username}`));
            }
        }
        else {
            return message.channel.send(functions.error("You did not mention anyone"));
        }
    }
}

function nuke(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    amount = args.splice(0,1).join(" ")
    if (["nuke", "purge", "massdelete"].includes(command)) {
        if (message.guild ===null){return message.channel.send("This command cannot be used in a DM channel")};
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {return message.channel.send(functions.error("You are missing manage_messages permission to use this command"))}
        if (Number.isNaN(amount)) {return message.channel.send(functions.error("Input a valid number"))}
        amount = parseInt(amount) + 1
        if (amount < 2) {return message.channel.send(functions.error("I can not delete less than one message"))}
        if (amount > 100) {return message.channel.send(functions.error("I can not delete more than 99 messages"))}
        message.channel.bulkDelete(amount)
            .then(() => {
                message.channel.send("Deleted " + (amount - 1) + " messages.");
            }).catch(() => {
                return message.channel.send(functions.error("Cannot delete messages over 2 weeks old, or I do not have permission"))
            })
    
    }
}

module.exports.nuke = nuke
module.exports.ban = ban
module.exports.kick = kick