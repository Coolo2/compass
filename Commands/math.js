const Discord = require('discord.js-light');
const client = new Discord.Client();
const math = require('mathjs');
const functions = require('../functions')

const r = require('../Resources/rs')

function maths(command, args, message) {
    if (["math", "evaluate", "eval", "calculate", "cal", "calc"].includes(command)) {
        if (!args.length) {
            return message.channel.send(functions.error(`No arguments provided: ${require('./prefix').get(message.guild)}math [calculation]`));
        }
        var equasion = args.splice(0,500).join(" ")
        try {
            message.channel.send(functions.embed("Successfully calculated", `${equasion} = ${math.evaluate(equasion)}`, r.d));
        }
        catch {
            message.channel.send(functions.error("Invalid calculation"))
        }
    }
}

module.exports.math = maths;