const Discord = require('discord.js-light');
const functions = require('../functions')

var nodeHtmlToImage = require('node-html-to-image');

var fs = require('fs');

const r = require('../Resources/rs')

var dir = './Website/HTML/Editor/Guilds';

function welcome(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["welcome", "welcome-image", "welcome-message"].includes(command)) {
        guild = message.guild
        member = guild.member(message.author)
        f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
        if (!f[message.guild.id] || !f[message.guild.id]["join"] || f[message.guild.id]["join"] == "false") {return message.channel.send("This server has no welcome message/image")}
        else {channel = bot.channels.cache.get(f[message.guild.id]["join"])}
        if (f[guild.id]["joinmessage"] && f[guild.id]["joinmessage"].replace("noimg", "") != "false" && f[guild.id]["joinmessage"].startsWith("noimg")) {return channel.send(f[guild.id]["joinmessage"].split("{user}").join("<@" + member.user.id + ">").replace("noimg", "").split("{server}").join(message.guild.name))}
        if (f[guild.id]["joinmessage"] && f[guild.id]["joinmessage"].replace("noimg", "") != "false") {channel.send(f[guild.id]["joinmessage"].split("{user}").join("<@" + member.user.id + ">").split("{server}").join(message.guild.name))}
        if (fs.existsSync(dir + "/" + message.guild.id + '/welcome.html')) {
            html = `<body style="height:300px;width:500px;">` + fs.readFileSync(dir + "/" + message.guild.id + '/welcome.html', 'utf8').split("{server}").join(message.guild.name).split("{user}").join(message.author.username).split("{avatar}").join(message.author.displayAvatarURL())  + "</body>"
            message.channel.send("Fetching server welcome image! Please wait, this can take a while...")
            nodeHtmlToImage({html: html,transparent:true, puppeteerArgs:{headless: false,args: ['--no-sandbox', '--disable-setuid-sandbox']}})
                .then(buffer => {
                    channel.send(new Discord.MessageAttachment(buffer, 'welcome-image.png'))
                })
        }
        
    }
}

function leave(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["leave-message", "leave-image", "leave"].includes(command)) {
        guild = message.guild
        member = guild.member(message.author)
        f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
        if (!f[message.guild.id] || !f[message.guild.id]["leave"] || f[message.guild.id]["leave"] == "false") {return message.channel.send("This server has no leave message/image")}
        else {channel = bot.channels.cache.get(f[message.guild.id]["leave"])}
        if (f[guild.id]["leavemessage"] && f[guild.id]["leavemessage"].replace("noimg", "") != "false" && f[guild.id]["leavemessage"].startsWith("noimg")) {return channel.send(f[guild.id]["leavemessage"].split("{user}").join(member.user.username).split("{server}").join(message.guild.name).replace("noimg", ""))}
        if (f[guild.id]["leavemessage"] && f[guild.id]["leavemessage"].replace("noimg", "") != "false") {channel.send(f[guild.id]["leavemessage"].split("{user}").join(member.user.username).split("{server}").join(message.guild.name))}
        if (fs.existsSync(dir + "/" + message.guild.id + '/leave.html')) {
            html = `<body style="height:300px;width:500px;">` + fs.readFileSync(dir + "/" + message.guild.id + '/leave.html', 'utf8').split("{server}").join(message.guild.name).split("{user}").join(message.author.username).split("{avatar}").join(message.author.displayAvatarURL())  + "</body>"
            message.channel.send("Fetching server leave image! Please wait, this can take a while...")
            nodeHtmlToImage({html: html,transparent:true, puppeteerArgs:{headless: false,args: ['--no-sandbox', '--disable-setuid-sandbox']}})
                .then(buffer => {
                    channel.send(new Discord.MessageAttachment(buffer, 'leave-image.png'))
                })
        }
        
    }
}


module.exports.welcome = welcome
module.exports.leave = leave