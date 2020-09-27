const Discord = require("discord.js");
const bot = new Discord.Client();
const functions = require('../functions')

const prefixes = require('./prefix')

const fs = require('fs')

const r = require('../Resources/rs')

const address = JSON.parse(fs.readFileSync('.//Resources/website.json')).address

function help(message1) {
    const args = message1.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["help", "commands", "cmds"].includes(command)) {
        arg = args.splice(0,1)
        allcmds = functions.commandArray()
        arglower = arg.join("").toLowerCase().replace("^", "")
        done = false
        for (cmd in allcmds) {
            allcmds[cmd]["aliases"].forEach(item => {
                if (item == arglower) {
                    done = true
                    return message1.channel.send(functions.embed(`Help for ${cmd} (${allcmds[cmd]["section"]})`, "", r.d)
                        .addField(`Usage`, allcmds[cmd]["usage"].replace("[prefix]", prefixes.get(message1.guild)))
                        .addField(`Description`, allcmds[cmd]["description"])
                        .addField(`Aliases`, allcmds[cmd]["aliases"].join(", "))
                        .addField(`Permissions`, allcmds[cmd]["permissions"])
                    )
                }
            }) 
        }
        if (done == true) {return}
        if (arglower in allcmds) {
            return message1.channel.send(functions.embed(`Help for ${arg.join("")} (${allcmds[arglower]["section"]})`, "", r.d)
                .addField(`Usage`, allcmds[arglower]["usage"].replace("[prefix]", prefixes.get(message1.guild)))
                .addField(`Description`, allcmds[arglower]["description"])
                .addField(`Aliases`, allcmds[arglower]["aliases"].join(", "))
                .addField(`Permissions`, allcmds[arglower]["permissions"])
            )
        }
        const filter = (reaction, user) => {
            return ["⏪", "⏩"].includes(reaction.emoji.name)  && user.id === message1.author.id;
        };
        let page = JSON.parse(require('fs').readFileSync('./Resources/commands.json')).pages[arg.join(" ").toLowerCase()]
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
                        message.edit(functions.embed(`Help page ${page} - Moderation`, functions.GetHelp(message.guild, 'Moderation') + `\n\nType **${prefixes.get(message1.guild)}help [command]** to get more information on a command`, r.d))
                    }
                    if (page == 2) {
                        message.edit(functions.embed(`Help page ${page} - Economy Games`, functions.GetHelp(message.guild, 'EconomyGames') + `\n\nType **${prefixes.get(message1.guild)}help [command]** to get more information on a command`, r.d))
                    }
                    if (page == 3) {
                        message.edit(functions.embed(`Help page ${page} - Economy Opts`, functions.GetHelp(message.guild, 'EconomyOpts') + `\n\nType **${prefixes.get(message1.guild)}help [command]** to get more information on a command`, r.d))
                    }
                    if (page == 4) {
                        message.edit(functions.embed(`Help page ${page} - Fun`, functions.GetHelp(message.guild, 'Fun') + `\n\nType **${prefixes.get(message1.guild)}help [command]** to get more information on a command`, r.d))
                    }
                    if (page == 5) {
                        message.edit(functions.embed(`Help page ${page} - Misc`, functions.GetHelp(message.guild, 'Misc') + `\n\nType **${prefixes.get(message1.guild)}help [command]** to get more information on a command`, r.d))
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
                            page = 5
                        }
                    }
                    if (reaction.emoji.name == "⏩") {
                        page = page + 1
                        if (page > 5) {
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