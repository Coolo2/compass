const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite(__dirname + '../../Databases/balances.sqlite');
const functions = require('../functions')
const talkedRecently = new Set();
const fs = require('fs')
const emojis = require('./emoji');
const { table } = require("console");
const prefixes = require("./prefix");

function contents() {
    return fs.readFileSync('.//Resources/workreplies.json')
}

function startup(server, member) {
    require('./databasesetup').startup(server, member)
};


function add(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    const member = args.splice(0,1).join(" ")
    const amount = args.splice(0).join(" ")
    if (command === 'addmoney') {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
        user = functions.userfromarg(message, member)
        if (user=="none") {return message.channel.send(functions.error("Could not find a user."))}
        if (user.bot) {return message.channel.send(functions.error("Can't add money to a bot"))}
        if (!amount) {return message.channel.send(functions.error("No amount to add inputted"))}
        startup(message.guild, user)
        toadd = parseInt(amount)
        try {
            score = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance
            sql.prepare(`REPLACE INTO balances${message.guild.id}${user.id} (user, balance) VALUES (${user.id}, ${score + toadd});`).run();
        }
        catch (err) {
            console.log(err)
            sql.prepare(`INSERT INTO balances${message.guild.id}${user.id} (user, balance) VALUES (?, ?);`).run(user.id, toadd);
        }
        score = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance

        message.channel.send(functions.embed(`Successfully added money`, `Added ${amount} to ${user.username}'s balance. They are now on ${score}${emojis.get(message.guild)}`, `#990099`))
    }
}
function remove(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    const member = args.splice(0,1).join(" ")
    const amount = args.splice(0).join(" ")
    if (command === 'removemoney') {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
        user = functions.userfromarg(message, member)
        if (user=="none") {return message.channel.send(functions.error("Could not find a user."))}
        if (user.bot) {return message.channel.send(functions.error("Can't add money to a bot"))}
        if (!amount) {return message.channel.send(functions.error("No amount to remove inputted"))}
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

        message.channel.send(functions.embed(`Successfully removed money`, `Removed ${amount} to ${user.username}'s balance. They are now on ${score}${emojis.get(message.guild)}`, `#990099`))
    }
}

function work(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();


    if (command === 'work') {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        if (talkedRecently.has(message.author.id + message.guild.id)) {
            return message.channel.send("man can u just wait smh");
        } else {

        talkedRecently.add(message.author.id + message.guild.id);
        setTimeout(() => {
            talkedRecently.delete(message.author.id + message.guild.id);
        }, 60000);
        }
        toadd = functions.int(1, 100) 
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
        message.channel.send(functions.embed("You got paid!", String(final).replace("{amount}", toadd + `${emojis.get(message.guild)}`).replace("{balance}", score + `${emojis.get(message.guild)}`), '#00FF00'))

    }
};

function balance(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['balance', 'bal', 'credits'].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        let user = functions.userfromarg(message, args.splice(0,100).join(" "))
        if (user=="none"){
            try{
                score = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance
            } catch (err) {
                score = 0
                console.log(err.message)
            }
            message.channel.send(functions.embed(`Your balance`, `You are on ${score}${emojis.get(message.guild)}`, '#990099'))
        }
        else {
            try {
                score = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance
            } catch (err){
                console.log(err.message)
                score = 0
            }
            message.channel.send(functions.embed(`${user.username}'s balance`, `${user.username} is on ${score}${emojis.get(message.guild)}`, '#990099'))
        }

    }
};

function workreplies(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (['workreplies', 'wps'].includes(command)) {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        try {
            replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data
        }
        catch {
            sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, contents());
        }
        replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data
        returnvalue = ""
        for (k in JSON.parse(replies)) {
            var obj = JSON.parse(replies)[k]
            returnvalue = returnvalue.concat(`**ID ${k}** - ${obj}\n`)
        }
        if (message.member.hasPermission("MANAGE_GUILD")) {
            message.channel.send(functions.embed(`Work replies for ${message.guild.name}`, returnvalue, '#990099')
                .addField("Edit them with:", `
                1. The [Web dashboard](${JSON.parse(fs.readFileSync('.//Resources/website.json')).address}/app/${message.guild.id})
                2. **${prefix}addreply [reply]**
                3. **${prefix}removereply [reply]**
                `)
            )
        } else {
            message.channel.send(functions.embed(`Work replies for ${message.guild.name}`, returnvalue, '#990099'))
        }
        
    }
}

function addreply(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    const reply = args.splice(0).join(" ")
    
    if (command === 'addreply') {
        if (reply.length > 1000) {
            return message.channel.send(functions.error("Work replies have a max character limit of 1000."))
        }
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        startup(message.guild, message.author)
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            return message.channel.send(functions.error("You are missing manage server permissions to use this command"))
        }
        replyid = functions.int(1, 99999) 
        try {
            replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data
        }
        catch {
            sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, contents());
        }
        replies = JSON.parse(sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data)
        replies[String(replyid)] = reply
        sql.prepare(`UPDATE workreplies SET data = '${JSON.stringify(replies)}' WHERE server = '${message.guild.id}' `).run();
        message.channel.send(functions.embed("Added work!", String(reply).replace("{amount}", "100" + `${emojis.get(message.guild)}`).replace("{balance}", "100" + `${emojis.get(message.guild)}`), '#00FF00'))

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
        replyid = args.splice(0).join(" ")
        if (replyid == "all") {
            const filter = m => m.author.id ===  message.author.id;
            message.channel.send(`Are you sure you want to remove all work replies for **${message.guild.name}**? Type **yes** or **no**`).then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    try {
                        if (collected.first().content.toLowerCase() == "yes") {
                            try {
                                replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data
                            }
                            catch {
                                sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, contents());
                            }
                            sql.prepare(`UPDATE workreplies SET data = '{}' WHERE server = '${message.guild.id}' `).run();
                            return message.channel.send("Deleted all work replies")
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
            if (!replyid) {
                const filter = m => m.author.id ===  message.author.id;
                message.channel.send(`What work reply would you like to delete? Type the response here or type cancel to cancel:`).then(() => {
                message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                    .then(collected => {
                        try {
                            if (["cancel", "stop"].includes(collected.first().content.toLowerCase())) {
                                return message.channel.send("Cancelled command")
                            }
                            else {
                                if (collected.first().content.toLowerCase() == "all") {
                                    try {
                                        replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data
                                    }
                                    catch {
                                        sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, contents());
                                    }
                                    sql.prepare(`UPDATE workreplies SET data = '{}' WHERE server = '${message.guild.id}' `).run();
                                    return message.channel.send("Deleted all work replies")
                                }
                                replyid = collected.first().content.toLowerCase().match(/\d+/)[0]
                                try {
                                    replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data
                                }
                                catch {
                                    sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, contents());
                                }
                                replies = JSON.parse(sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data)
                                if (replies.hasOwnProperty(String(replyid))) {
                                    delete replies[String(replyid)]
                                    sql.prepare(`UPDATE workreplies SET data = '${JSON.stringify(replies)}' WHERE server = '${message.guild.id}' `).run();
                                    message.channel.send(functions.embed("Removed work reply!", `Removed work reply with id **${replyid}**`, '#00FF00'))
                                }
                                else {
                                    message.channel.send(functions.error("Could not find work reply ID " + replyid))
                                }
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
                try {
                    replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data
                }
                catch {
                    sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(message.guild.id, contents());
                }
                replies = JSON.parse(sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(message.guild.id).data)
                if (replies.hasOwnProperty(String(replyid))) {
                    delete replies[String(replyid)]
                    sql.prepare(`UPDATE workreplies SET data = '${JSON.stringify(replies)}' WHERE server = '${message.guild.id}' `).run();
                    message.channel.send(functions.embed("Removed work reply!", `Removed work reply with id **${replyid}**`, '#00FF00'))
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
    if (['leaderboards', 'leaders', 'lb'].includes(command)) {
        final = []
        finalj = {}
        for (tables of sql.prepare("select name from sqlite_master where type='table'").iterate()) {
            if (tables.name.replace("balances", "").startsWith(message.guild.id)) {
                user = message.guild.members.cache.find(member => member.user.id === tables.name.replace(message.guild.id, "").replace("balances", "")).user
                try {
                    score = sql.prepare(`SELECT * FROM balances${message.guild.id}${user.id} WHERE user = ?`).get(user.id).balance
                } catch {}
                if (score == 0) return
                finalj[score] = user.username
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
            lb = lb.concat(counter + ". **" + finalj[item] + "**: " + item + "\n")
        })
        if (lb == "") {return message.channel.send(functions.embed("Leaderboard for " + message.guild.name, "*Its feeling kinda empty in here! Check out economy commands with **" + prefixes.get(message.guild) + "help economy**!*", `#990099`))}
        message.channel.send(functions.embed("Leaderboard for " + message.guild.name, lb, `#990099`))
    }
}
module.exports.leaderboards = leaderboards
module.exports.balance = balance
module.exports.work = work
module.exports.workreplies = workreplies
module.exports.addreply = addreply
module.exports.removereply = removereply
module.exports.add = add
module.exports.startup = startup
module.exports.remove = remove