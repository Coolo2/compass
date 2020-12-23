const Discord = require("discord.js-light");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/balances.sqlite');
const functions = require('../functions')

const r = require('../Resources/rs')

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.toString().replace(new RegExp(`,`, 'g'), ``)}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.toString().replace(new RegExp(`,`, 'g'), ``)}

const cooldowns = require('./cooldowns')
const returns = require('./returns')

const talkedRecently = new Set();
const talkedRecentlyLeft = {}

const talkedRecentlyCrime = new Set();
const talkedRecentlyLeftCrime = {}

const fs = require('fs')
const emojis = require('./emoji');
const prefixes = require("./prefix");

function contents() {
    return fs.readFileSync('.//Resources/workreplies.json')
}

function crimecontents() {
    return fs.readFileSync('.//Resources/crimereplies.json')
}

function startup(server, member) {
    require('./databasesetup').startup(server, member)
};


function add(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    const member = args.splice(0,1).join(" ")
    amount = args.splice(0).join(" ")
    if (['addmoney', 'add-money'].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
        user = functions.userfromarg(message, member)
        if (user=="none") {return message.channel.send(functions.error("Could not find a user."))}
        if (user.bot) {return message.channel.send(functions.error("Can't add money to a bot"))}
        if (!amount) {return message.channel.send(functions.error("No amount to add inputted"))}
        amount = amount.jn()
        startup(message.guild, user)
        toadd = parseInt(amount)
        try {
            score = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance
            sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${user.id} (user, balance) VALUES (${user.id}, ${score + toadd});`).run();
        }
        catch (err) {
            console.log(err)
            sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${user.id} (user, balance) VALUES (?, ?);`).run(user.id, toadd);
        }
        score = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance

        message.channel.send(functions.embed(`Successfully added money`, `Added ${amount.sep()} to ${user.username}'s balance. They are now on ${score.sep()}${emojis.get(message.guild)}`, r.s))
    }
}
function remove(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    const member = args.splice(0,1).join(" ")
    amount = args.splice(0).join(" ")
    if (['removemoney', 'remove-money'].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
        user = functions.userfromarg(message, member)
        if (user=="none") {return message.channel.send(functions.error("Could not find a user."))}
        if (user.bot) {return message.channel.send(functions.error("Can't add money to a bot"))}
        if (!amount) {return message.channel.send(functions.error("No amount to remove inputted"))}
        amount = amount.jn()
        startup(message.guild, user)
        toadd = parseInt(amount)
        try {
            score = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance
            sql.prepare(`REPLACE INTO balances${message.guild.id}${user.id} (user, balance) VALUES (${user.id}, ${score - toadd});`).run();
        }
        catch {
            sql.prepare(`INSERT INTO balances${message.guild.id}${user.id} (user, balance) VALUES (?, ?);`).run(user.id, 0-toadd);
        }
        score = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance

        message.channel.send(functions.embed(`Successfully removed money`, `Removed ${amount.sep()} from ${user.username}'s balance. They are now on ${score.sep()}${emojis.get(message.guild)}`, r.s))
    }
}

function getTimeLeft(timeout){
    return Math.round(parseFloat((timeout._idleStart + timeout._idleTimeout)/1000 - process.uptime()));
  }

function work(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'work') {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        if (talkedRecently.has(message.author.id + message.guild.id)) {
            return message.channel.send(functions.embed("You're on cooldown", "Wait " + cooldowns.readable(String(getTimeLeft(talkedRecentlyLeft[message.author.id + message.guild.id]))) + " to work again!", r.f));
        } else {
            talkedRecently.add(message.author.id + message.guild.id);
            talkedRecentlyLeft[message.author.id + message.guild.id] = setTimeout(() => {
                talkedRecently.delete(message.author.id + message.guild.id);
                delete talkedRecentlyLeft[message.author.id + message.guild.id]
            },   parseInt(cooldowns.get(message.guild, "work")) * 1000);
        }
        
        toadd = functions.int(returns.get(message.guild, 'work')[0], returns.get(message.guild, 'work')[1]) 
        try {
            score = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance
            sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, score + toadd);
        }
        catch {
            sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, toadd);
        }
        score = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance
        try {
            replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data
        }
        catch {
            sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, contents());
        }
        replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data

        const keys = Object.keys(JSON.parse(replies))
        const randIndex = Math.floor(Math.random() * keys.length)
        const randKey = keys[randIndex]
        const final = JSON.parse(replies)[randKey]
        message.channel.send(functions.embed("You got paid!", String(final).replace("{amount}", toadd.sep() + `${emojis.get(message.guild)}`).replace("{balance}", score.sep() + `${emojis.get(message.guild)}`), r.s))
    }
};

function crime(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'crime') {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        if (talkedRecentlyCrime.has(message.author.id + message.guild.id)) {
            return message.channel.send(functions.embed("You're on cooldown", "Wait " + cooldowns.readable(String(getTimeLeft(talkedRecentlyLeftCrime[message.author.id + message.guild.id]))) + " to attempt a crime again!", r.f));
        } else {
            talkedRecentlyCrime.add(message.author.id + message.guild.id);
            talkedRecentlyLeftCrime[message.author.id + message.guild.id] = setTimeout(() => {
                talkedRecentlyCrime.delete(message.author.id + message.guild.id);
                delete talkedRecentlyLeftCrime[message.author.id + message.guild.id]
            },   parseInt(cooldowns.get(message.guild, "crime")) * 1000);
        }
        toadd = functions.int(returns.get(message.guild, 'crime')[0], returns.get(message.guild, 'crime')[1]) 
        try {
            score = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance
            sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, score + toadd);
        }
        catch {
            sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, toadd);
        }
        score = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance
        try {
            replies = sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(message.guild.id).data
        }
        catch {
            sql.prepare(`INSERT OR REPLACE INTO crimereplies (server, data) VALUES (?, ?);`).run(message.guild.id, crimecontents());
        }
        replies = sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(message.guild.id).data

        if (toadd >0) {
            const keys = Object.keys(JSON.parse(replies)["pay"])
            const randIndex = Math.floor(Math.random() * keys.length)
            const randKey = keys[randIndex]
            const final = JSON.parse(replies)["pay"][randKey]
            message.channel.send(functions.embed("You got paid!", String(final).replace("{amount}", toadd.sep() + `${emojis.get(message.guild)}`).replace("{balance}", score.sep() + `${emojis.get(message.guild)}`), r.s))
        } else {
            const keys = Object.keys(JSON.parse(replies)["fine"])
            const randIndex = Math.floor(Math.random() * keys.length)
            const randKey = keys[randIndex]
            const final = JSON.parse(replies)["fine"][randKey]
            message.channel.send(functions.embed("You got fined", String(final).replace("{amount}", (toadd/-1).sep() + `${emojis.get(message.guild)}`).replace("{balance}", score.sep() + `${emojis.get(message.guild)}`), r.f))
        }
    }
};

module.exports.rl = talkedRecentlyLeft
module.exports.rlc = talkedRecentlyLeftCrime
module.exports.trc = talkedRecentlyCrime
module.exports.tr = talkedRecently
module.exports.getTimeLeft = getTimeLeft

function workreplies(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['replies', 'rs'].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        if (message.member.hasPermission("MANAGE_GUILD")) {
        message.channel.send(functions.embed(`Replies for ${message.guild.name}`, `View your replies at the [Web dashboard](${JSON.parse(fs.readFileSync('.//Resources/website.json')).address}/app/${message.guild.id})`, r.d)
            .addField("Edit them with:", `
            1. The [Web dashboard](${JSON.parse(fs.readFileSync('.//Resources/website.json')).address}/app/${message.guild.id})
            2. **${prefix}addreply [reply]**
            3. **${prefix}removereply [reply]**
            `))
        } else {
            message.channel.send(functions.embed(`Work replies for ${message.guild.name}`, `View your replies at the [Web dashboard](${JSON.parse(fs.readFileSync('.//Resources/website.json')).address}/app/${message.guild.id})`, r.d))
        }
        
    }
}

function addreply(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'addreply') {
        section = args[0]
        reply= args.splice(1).join(" ")


        if (reply.length > 1000) {
            return message.channel.send(functions.error("Work replies have a max character limit of 1000."))
        }
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }

        if (!["work", "crime-pay", "crime-fine"].includes(section)) {return}
        
        if (["crime-pay", "crime-fine"].includes(section)) {part = "crime"} else {part = "work"}
        if (!reply) {return functions.embed("Add reply", `${prefixes.get(message.guild.id)}addreply [work/crime-pay/crime-fine] [reply]`, r.d)}
        section = section.replace("crime-", "")

        replyid = functions.int(1, 99999) 
        if (part == "work") {
            try {
                replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data
            }
            catch {
                sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, contents());
            }
            replies = JSON.parse(sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data)
            replies[String(replyid)] = reply
            sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?)`).run(message.guild.id, JSON.stringify(replies));
        } else {
            try {
                replies = sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(message.guild.id).data
            }
            catch {
                sql.prepare(`INSERT OR REPLACE INTO crimereplies (server, data) VALUES (?, ?);`).run(message.guild.id, crimecontents());
            }
            replies = JSON.parse(sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(message.guild.id).data)
            replies[section][String(replyid)] = reply
            sql.prepare(`INSERT OR REPLACE INTO crimereplies (server, data) VALUES (?, ?)`).run(message.guild.id, JSON.stringify(replies));
        }
        message.channel.send(functions.embed(`Added ${section} reply!`, String(reply).replace("{amount}", "100" + `${emojis.get(message.guild)}`).replace("{balance}", "100" + `${emojis.get(message.guild)}`), r.s))

    }
};
function removereply(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['removereply', 'deletereply', 'delreply'].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
        section = args[0]
        if (!["work", "crime-pay", "crime-fine"].includes(section)) {return}
        replyid = args.splice(1).join(" ")
        if (["crime-pay", "crime-fine"].includes(section)) {part = "crime"} else {part = "work"}
        if (!replyid) {return functions.embed("Remove reply", `${prefixes.get(message.guild.id)}removereply [work/crime-pay/crime-fine] [replyID]`, r.d)}
        section = section.replace("crime-", "")
        if (replyid == "all") {
            const filter = m => m.author.id ===  message.author.id;
            message.channel.send(`Are you sure you want to remove all work replies for **${message.guild.name}**? Type **yes** or **no**`).then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    try {
                        if (collected.first().content.toLowerCase() == "yes") {
                            if (part == "work") {
                                try {
                                    replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data
                                }
                                catch {
                                    sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, contents());
                                }
                                sql.prepare(`UPDATE workreplies SET data = '{}' WHERE server = '${message.guild.id}' `).run();
                                
                            } else {
                                try {
                                    replies = sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(message.guild.id).data
                                }
                                catch {
                                    sql.prepare(`INSERT OR REPLACE INTO crimereplies (server, data) VALUES (?, ?);`).run(message.guild.id, crimecontents());
                                }
                                sql.prepare(`UPDATE crimereplies SET data = '{"pay":{},"fine":{}}' WHERE server = '${message.guild.id}' `).run();
                            }
                            return message.channel.send(`Deleted all ${part} replies`)
                           
                        }
                        else {
                            return message.channel.send("Cancelled command")
                        }
                    } catch (err) {
                        console.log(err)
                    }
                    
                })
                .catch(collected => {
                    return message.channel.send("Timed out")
                });
            })
        }
        else {
            if (part == "crime") {
                try {
                    replies = sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(message.guild.id).data
                }
                catch {
                    sql.prepare(`INSERT OR REPLACE INTO crimereplies (server, data) VALUES (?, ?);`).run(message.guild.id, contents());
                }
                replies = JSON.parse(sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(message.guild.id).data)
                if (replies[section].hasOwnProperty(String(replyid))) {
                    delete replies[section][String(replyid)]
                    sql.prepare(`INSERT OR REPLACE INTO crimereplies (server, data) VALUES (?, ?);`).run(message.guild.id, JSON.stringify(replies));
                    message.channel.send(functions.embed("Removed crime reply!", `Removed crime reply with id **${replyid}**`, r.s))
                }
                else {
                    message.channel.send(functions.error("Could not find crime reply ID " + replyid))
                }
            } else {
                try {
                    replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data
                }
                catch {
                    sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, contents());
                }
                replies = JSON.parse(sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data)
                if (replies.hasOwnProperty(String(replyid))) {
                    delete replies[String(replyid)]
                    sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, JSON.stringify(replies));
                    message.channel.send(functions.embed("Removed work reply!", `Removed work reply with id **${replyid}**`, r.s))
                }
                else {
                    message.channel.send(functions.error("Could not find work reply ID " + replyid))
                }
            }
            
        }
    

    }
};

function leaderboards(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['leaderboards', 'leaders', 'lb', 'leaderboard', 'lbs'].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        final = []
        finalj = {}
        for (tables of sql.prepare("select name from sqlite_master where type='table'").iterate()) {
            if (tables.name.replace("balances", "").startsWith(message.guild.id)) {
                try{user = message.guild.members.cache.find(member => member.user.id === tables.name.replace(message.guild.id, "").replace("balances", "")).user
                try {score = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance} catch {score=0}
                try {scorebank = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get("bank" + user.id).balance} catch {scorebank=0}
                if (score + scorebank != 0) {
                    finalj[score + scorebank] = {username:user.username,id:user.id}
                    final.push(score + scorebank)
                }
            }catch{}
            }
        }
        final.sort(function(a, b) {
            return a - b;
        });
        final.reverse()
        lb = ""
        counter = 0
        final.forEach(item => {
            counter = counter + 1
            lb = lb.concat(counter + `. **[${finalj[item].username}](${JSON.parse(fs.readFileSync('./Resources/website.json')).address + '/p/' + require('../Website/Modules/profiles').checkUser(finalj[item].id) + '/' + message.guild.id})**: ` + item.sep() + " " + emojis.get(message.guild) + "\n")
        })
        if (lb == "") {return message.channel.send(functions.embed("Leaderboard for " + message.guild.name, "*Its feeling kinda empty in here! Check out economy commands with **" + prefixes.get(message.guild) + "help economy**!*", r.d))}
        message.channel.send(functions.embed("Leaderboard for " + message.guild.name, lb, r.d))
    }
}
module.exports.leaderboards = leaderboards
module.exports.work = work
module.exports.workreplies = workreplies
module.exports.addreply = addreply
module.exports.removereply = removereply
module.exports.add = add
module.exports.startup = startup
module.exports.remove = remove
module.exports.crime = crime