const Discord = require("discord.js");
const bot = new Discord.Client();
const functions = require('../functions')

const fs = require('fs')

const r = require('../Resources/rs')

const address = JSON.parse(fs.readFileSync('.//Resources/website.json')).address

function help(message1) {
    const args = message1.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["help", "commands", "cmds"].includes(command)) {
        const filter = (reaction, user) => {
            return ["⏪", "⏩"].includes(reaction.emoji.name)  && user.id === message1.author.id;
        };
        let page = JSON.parse(require('fs').readFileSync('./Resources/commands.json')).pages[args.splice(0,1).join(" ").toLowerCase()]
        if (!page) {
            page = 0
        }
        it = message1.channel.send(functions.embed(`Help page ${page} - Introduction`, "Fetching help...", r.d))
            .then(function (message) {
                message.react("⏪")
                    .then(() => message.react("⏩"))
                function getpage(message, page){
                    if (page == 0) {
                        message.edit(functions.embed(`Help page ${page} - Introduction`, `Use the emojis to navigate around help - or see the [Web commands](${address}/commands).\nUnNamed is an advanced and deeply customizable economy and moderation bot.`, r.d))
                    }
                    if (page == 1) {
                        message.edit(functions.embed(`Help page ${page} - Moderation`, functions.GetHelp(message.guild, 'Moderation'), r.d))
                    }
                    if (page == 2) {
                        message.edit(functions.embed(`Help page ${page} - Economy`, functions.GetHelp(message.guild, 'Economy'), r.d))
                    }
                    if (page == 3) {
                        message.edit(functions.embed(`Help page ${page} - Fun`, functions.GetHelp(message.guild, 'Fun'), r.d))
                    }
                    if (page == 4) {
                        message.edit(functions.embed(`Help page ${page} - Misc`, functions.GetHelp(message.guild, 'Misc'), r.d))
                    }
                }
                const collector = message.createReactionCollector(filter, { time: 60000 });
                getpage(message, page)
                collector.on('collect', (reaction, user) => {
                    const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
                    for (const reaction of userReactions.values()) {
                        reaction.users.remove(user.id);       
                    }
                    if (reaction.emoji.name == "⏪") {
                        page = page - 1
                        if (page < 1) {
                            page = 4
                        }
                    }
                    if (reaction.emoji.name == "⏩") {
                        page = page + 1
                        if (page > 4) {
                            page = 1
                        }
                    }
                    getpage(message, page)
                });
                
                collector.on('end', collected => {
                    message.edit("Help timed out - Reactions will no longer work")
                });
            }).catch(function(err) {console.log(err.message)});
        
    }
}

module.exports.help = help