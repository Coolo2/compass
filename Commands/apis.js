const Discord = require("discord.js");
const bot = new Discord.Client();
const functions = require('../functions')
const request = require('request')
const fetch = require('node-fetch');
PythonShell = require('python-shell').PythonShell;
const fs = require('fs')

string1 = fs.readFileSync('.//PythonMOD/apifetch.py','utf8')
file = fs.readFileSync('.//PythonMOD/ascii.py', 'utf8')

function dog(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["dog", "randomdog", "randomdogpicture"].includes(command)) {
        PythonShell.runString(string1.replace('..api..',"dog"), null, function (err, results) {
            const exampleEmbed = new Discord.MessageEmbed().setColor(Math.floor(Math.random() * 16777214) + 1).setTitle("Woof!").setTimestamp().setImage(results[0])
            message.channel.send(exampleEmbed)
        });
        
        
    }
}
function meme(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["meme", "randommeme", "randomreddit"].includes(command)) {
        
        fetch('https://api.reddit.com/r/memes/random')
            .then(response => response.json())
            .then(data => {
                console.log()
                message.channel.send( functions.embed(data[0]["data"]["children"][0]["data"]["title"], "", Math.floor(Math.random() * 16777214) + 1).setImage(data[0]["data"]["children"][0]["data"]["url"]) )
            })
            .catch(err => console.log(err))
        
    }
}
function ascii(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["ascii", "binary", "asciibinary"].includes(command)) {
        PythonShell.runString(file.replace('..args..',args.join(" ")), null, function (err, results) {
            message.channel.send(functions.embed("Converted!", results + "\n\n`You can input ascii or text to be converted, it will detect which it is`", Math.floor(Math.random() * 16777214) + 1));
        });
    }
}

module.exports.meme = meme
module.exports.dog = dog
module.exports.ascii = ascii