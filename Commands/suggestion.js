const Discord = require('discord.js-light');
const functions = require('../functions')
const setup = JSON.parse(require('fs').readFileSync('./Resources/setup.json'))
const website = JSON.parse(require('fs').readFileSync('./Resources/website.json'))

const fs = require('fs')

const r = require('../Resources/rs');

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.split(",").join("")}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.split(",").join("")}

function suggest(bot, message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["suggest", "suggest-command"].includes(command)) {
        if (args.join("") == "") {return message.channel.send(functions.error(`You did not input a suggestion`))}
        suggestions = JSON.parse(fs.readFileSync('./Databases/suggestions.json'))
        suggestions.push({user:message.author.id, suggestion:args.join(" "), verified:false, id:suggestions.length + 2})
        fs.writeFileSync('./Databases/suggestions.json', JSON.stringify(suggestions))

        message.channel.send(functions.embed(`Suggestion sent!`, `\`\`\`${args.join(" ")}\`\`\`\nThis suggestion will be spam-checked and sent in the [discord](${setup.server}) to be voted from. \nAdmins may respond to this suggestion\n**If it is good it will be added to the bot!**`, r.s))
        for (admin of setup.botadmins) {
            try{bot.users.cache.get(admin).send(`**New suggestion:** ${args.join(" ")} **(<${website.address}/admin/suggestions#suggestion${suggestions.length + 1}>)**`)}catch(err){console.log(err)}
        }
    }
}

function issue(bot, message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (["issue", "bug", "issue-report", "bug-report"].includes(command)) {
        if (args.join("") == "") {return message.channel.send(functions.error(`You did not input anthing to report`))}
        suggestions = JSON.parse(fs.readFileSync('./Databases/issues.json'))
        suggestions.push({user:message.author.id, issue:args.join(" "), id:suggestions.length + 2})
        fs.writeFileSync('./Databases/issues.json', JSON.stringify(suggestions))

        message.channel.send(functions.embed(`Issue reported!`, `\`\`\`${args.join(" ")}\`\`\`\nThe developer will look at this issue.`, r.s))
        try{bot.users.cache.get(`368071242189897728`).send(`**Issue reported:** ${args.join(" ")} **(<${website.address}/admin/issues#issue${suggestions.length + 1}>)**`)}catch(err){console.log(err)}
    }
}

module.exports.suggest = suggest
module.exports.issue = issue