const Discord = require('discord.js');
const functions = require('../functions')

var nodeHtmlToImage = require('node-html-to-image');

var fs = require('fs');

var dir = './Website/HTML/Editor/Guilds';

function welcome(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command=="welcome") {
        f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
        if (!f[message.guild.id] || !f[message.guild.id]["join"] || f[message.guild.id] == "false") {return message.channel.send("This server has no welcome image")}
        else {channel = bot.channels.cache.get(f[message.guild.id]["join"])}
        html = `<body style="height:300px;width:500px;">` + fs.readFileSync(dir + "/" + message.guild.id + '/welcome.html', 'utf8').split("{server}").join(message.guild.name).split("{user}").join(message.author.username).split("{avatar}").join(message.author.displayAvatarURL())  + "</body>"
        message.channel.send("Fetching server welcome image! Please wait, this can take a while...")
        nodeHtmlToImage({html: html,transparent:true})
            .then(buffer => {
                channel.send(new Discord.MessageAttachment(buffer, 'welcome-image.png'))
            })
    }
}
module.exports.welcome = welcome