const fs = require('fs')
const setup = JSON.parse(fs.readFileSync('./Resources/setup.json'))

function getSlash(bot, message, SlashCMDSServer, SlashCMDSGlobal) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['slashget', 'slash-get', 'getslash', 'get-slash'].includes(command) && setup.botadmins.includes(message.author.id)) {
        bot.api.applications(bot.user.id).commands.get()
            .then(cmds => {all = ``;for (cmd of cmds) {all = all + `\n\`${cmd.name}\` - ${cmd.id}`};message.channel.send(all) })
    }
}

function loadSlashGlobal(bot, message, SlashCMDSServer, SlashCMDSGlobal) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['slashloadglobal', 'slash-load-global', 'loadglboalslash', 'load-global-slash'].includes(command) && setup.botadmins.includes(message.author.id)) {
        for (cmd of SlashCMDSGlobal) {
            try{bot.api.applications(bot.user.id).commands.post({data: require(`..//CommandsSlash/${cmd}`).command})} catch (err) {console.log(err)}
        }
        bot.api.applications(bot.user.id).commands.get()
            .then(cmds => {all = ``;for (cmd of cmds) {all = all + `\n\`${cmd.name}\` - ${cmd.id}`};message.channel.send(all) })
    }
}

function loadSlashServer(bot, message, SlashCMDSServer, SlashCMDSGlobal) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['slashloadserver', 'slash-load-server', 'loadserverslash', 'load-server-slash'].includes(command) && setup.botadmins.includes(message.author.id)) {
        for (cmd of SlashCMDSServer) {
            try{bot.api.applications(bot.user.id).guilds(`732554558773133333`).commands.post({data: require(`..//CommandsSlash/${cmd}`).command})} catch (err) {console.log(err)}
        }
        bot.api.applications(bot.user.id).guilds(`732554558773133333`).commands.get()
            .then(cmds => {all = ``;for (cmd of cmds) {all = all + `\n\`${cmd.name}\` - ${cmd.id}`};message.channel.send(all) })
    }
}

function unloadSlashServer(bot, message, SlashCMDSServer, SlashCMDSGlobal) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['slashunloadserver', 'slash-unload-server', 'unloadserverslash', 'unload-server-slash'].includes(command) && setup.botadmins.includes(message.author.id)) {
        bot.api.applications(bot.user.id).guilds(`732554558773133333`).commands.get()
            .then(cmds => {all = ``;for (cmd of cmds) {bot.api.applications(bot.user.id).guilds(`732554558773133333`).commands(cmd.id).delete();all = all + `\n\`${cmd.name}\` - ${cmd.id}`};message.channel.send(all) })
    }
}

module.exports.getSlash = getSlash
module.exports.loadSlashGlobal = loadSlashGlobal
module.exports.loadSlashServer = loadSlashServer
module.exports.unloadSlashServer = unloadSlashServer