const Discord = require('discord.js');
const functions = require('../functions')

var nodeHtmlToImage = require('node-html-to-image');

var fs = require('fs');

var dir = './Website/HTML/Editor/Guilds';

function welcome(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command=="welcome") {
        html = `<body style="height:300px;width:500px;">` + fs.readFileSync(dir + "/" + message.guild.id + '/welcome.html', 'utf8').split("{server}").join(message.guild.name).split("{user}").join(message.author.username).split("{avatar}").join(message.author.displayAvatarURL())  + "</body>"
        message.channel.send("Fetching server welcome image! Please wait...")
        nodeHtmlToImage({html: html,transparent:true})
            .then(buffer => {
                message.channel.send(new Discord.MessageAttachment(buffer, 'welcome-image.png'))
            })
    }
}
module.exports.welcome = welcome