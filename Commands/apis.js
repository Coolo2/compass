const functions = require('../functions')
const fetch = require('node-fetch');
const fs = require('fs')

const r = require('../Resources/rs')

function textToBin(text) {
    var length = text.length,
        output = [];
    for (var i = 0;i < length; i++) {
      var bin = text[i].charCodeAt().toString(2);
      output.push(Array(8-bin.length+1).join("0") + bin);
    } 
    return output.join(" ");
}

function binToText(str) {
    str = str.replace(/\s+/g, '');
    str = str.match(/.{1,8}/g).join(" ");
    var newBinary = str.split(" ");
    var binaryCode = [];
    for (i = 0; i < newBinary.length; i++) {
        binaryCode.push(String.fromCharCode(parseInt(newBinary[i], 2)));
    }
    return binaryCode.join("");
}

colornames = {
    "aqua": "#00ffff",
    "black": "#000000",
    "blue": "#0000ff",
    "brown": "#a52a2a",
    "cyan": "#00ffff",
    "green": "#008000",
    "lime": "#00ff00",
    "magenta": "#ff00ff",
    "orange": "#ffa500",
    "pink": "#ffc0cb",
    "purple": "#800080",
    "red": "#ff0000",
    "white": "#ffffff",
    "yellow": "#ffff00",
}

function wide (bot, message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["wide", "widen"].includes(command)) {
        image = message.author.displayAvatarURL()
        if (functions.userfromarg(message, args.join(""))) {
            try{image = functions.userfromarg(message, args.join("")).displayAvatarURL()}catch{}
        }
        message.channel.send(functions.embed(``, "", Math.floor(Math.random() * 16777214) + 1, true)
            .setImage(`https://vacefron.nl/api/wide?image=${encodeURIComponent(image)}`)
        ) 
    }
}

function impostor(bot, message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["eject", "impostor"].includes(command)) {
        colors = [`blue`, `black`, `brown`, `cyan`, `darkgreen`, `lime`, `orange`, `pink`, `purple`, `white`, `yellow`, `red`]
        booleans = [`true`, `false`]
        isImpostor = functions.randomchoice(booleans)
        crewmate = functions.randomchoice(colors)
        joinedargs = args.join(" ")
        if (joinedargs != ``) {
            for (argument of args) {
                if (argument.includes(`crewmate=`)) {
                    if (!colors.includes(argument.toLowerCase().replace(`crewmate=`, ``))) 
                        return message.channel.send(functions.error(`Invalid crewmate color! You must choose from:\n${colors.join(', ')}`))
                    crewmate = argument.toLowerCase().replace(`crewmate=`, ``)
                }
                if (argument.includes(`color=`)) {
                    if (!colors.includes(argument.toLowerCase().replace(`color=`, ``))) 
                        return message.channel.send(functions.error(`Invalid crewmate color! You must choose from:\n${colors.join(', ')}`))
                    crewmate = argument.toLowerCase().replace(`color=`, ``)
                }
                if (argument.includes(`colour=`)) {
                    if (!colors.includes(argument.toLowerCase().replace(`colour=`, ``))) 
                        return message.channel.send(functions.error(`Invalid crewmate color! You must choose from:\n${colors.join(', ')}`))
                    crewmate = argument.toLowerCase().replace(`colour=`, ``)
                }
                if (argument.toLowerCase().includes(`impostor`)) {
                    if (!booleans.includes(argument.toLowerCase().replace(`impostor=`, ``))) {
                        return message.channel.send(functions.error(`Impostor must be either true or false.`))
                    }
                    isImpostor = argument.toLowerCase().replace(`impostor=`, ``)
                }
            }
        }

        username = joinedargs
            .replace(` color=${crewmate}`, ``).replace(`color=${crewmate} `, ``)
            .replace(` colour=${crewmate}`, ``).replace(`colour=${crewmate} `, ``)
            .replace(` crewmate=${crewmate}`, ``).replace(`crewmate=${crewmate} `, ``)
            .replace(` impostor=${isImpostor}`, ``).replace(`impostor=${isImpostor} `, ``)
        
        if (username.split(` `).join(``) == ``) 
            username = message.author.username
        
        if (username.includes(`<@!`)) {
            try{
                username = username.replace(`<@!` + username.match(new RegExp(`<@!` + "(.*)" + `>`))[1] + `>`,functions.userfromarg(message, username.match(new RegExp(`<@!` + "(.*)" + `>`))[1]).username)
            } catch {}
        } 
        else if (username.includes(`<@`)) {
            try{
                username = username.replace(`<@` + username.match(new RegExp(`<@` + "(.*)" + `>`))[1] + `>`, message.guild.members.cache.get(username.match(new RegExp(`<@` + "(.*)" + `>`))[1]).user.username)
            } catch {}
        }

        if (colornames[crewmate]) 
            colorHex = colornames[crewmate]
        else 
            colorHex = Math.floor(Math.random() * 16777214) + 1
        
        message.channel.send(functions.embed(``, "", colorHex, true)
            .setImage(`https://vacefron.nl/api/ejected?name=${encodeURIComponent(username)}&impostor=${encodeURIComponent(isImpostor)}&crewmate=${encodeURIComponent(crewmate)}`)
        )  
    }
}

function dog(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["dog", "randomdog", "randomdogpicture"].includes(command)) {
        fetch('https://dog.ceo/api/breeds/image/random')
            .then(response => response.json())
            .then(data => {
                message.channel.send(functions.embed(``, "", Math.floor(Math.random() * 16777214) + 1).setImage(data["message"]))
            })
            .catch(err => console.log(err))    
    }
}

function meme(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["meme", "randommeme", "randomreddit"].includes(command)) {
        
        fetch('https://api.reddit.com/r/memes/random')
            .then(response => response.json())
            .then(data => {
                message.channel.send( functions.embed(data[0]["data"]["children"][0]["data"]["title"], "", Math.floor(Math.random() * 16777214) + 1, true)
                    .setImage(data[0]["data"]["children"][0]["data"]["url"])
                    .setFooter(`u/${data[0]["data"]["children"][0]["data"]["author"]} | 👍:${data[0]["data"]["children"][0]["data"]["ups"]}`)
                )
            })
            .catch(err => console.log(err))
        
    }
}

function ascii(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["ascii", "binary", "asciibinary"].includes(command)) {
        str = args.join(" ")
        str2 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV;'\\[],./<>?:\"|{}-=_+!@#$%^&*()23456789"
        verdict = false
        for (var i = 0; i < str2.length; i++) {
            if (str.includes(str2.charAt(i))) {
                verdict = true
            } else {if (verdict == true) {} else {verdict = false}}
        }
        if (verdict == true) {result=textToBin(str)} else {result = binToText(str)}
        message.channel.send(functions.embed("Converted!", result + "\n\n`You can input " + command + " or text to be converted, it will detect which it is`", Math.floor(Math.random() * 16777214) + 1));
    }
}

module.exports.meme = meme
module.exports.dog = dog
module.exports.ascii = ascii
module.exports.impostor = impostor
module.exports.wide = wide