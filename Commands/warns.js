const r = require('../Resources/rs')
const Discord = require('discord.js');
const bot = new Discord.Client();
const functions = require('../functions')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/warns.sqlite');

function onready(table1) {
    // H.
    const table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'id${table1}';`).get();
    if (!table['count(*)']) {
      // If the table isn't there, create it and setup the database correctly.
      sql.prepare(`CREATE TABLE id${table1} (id INTEGER, user TEXT, reason TEXT)`).run();
      // Ensure that the "id" row is always unique and indexed.
      sql.prepare(`CREATE UNIQUE INDEX idx_warns_id ON id${table1} (id);`).run();
      sql.pragma("synchronous = 1");
      sql.pragma("journal_mode = wal");
    }
};


function warn(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (command=="warn") {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        guildid = message.guild.id
        onready(guildid)
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.channel.send(functions.error("You are missing manage message permissions to use this command"))
        }
        if (!args[0]) {
            return message.channel.send(functions.error(`No user input found: ${require('./prefix').get(message.guild)}warn [user] *[reason]`))
        }
        user = functions.userfromarg(message, args.splice(0,1).join(" "))
        let reason = args.splice(0).join(" ")
        const warnid = functions.int(1, 10000)
        if (reason=="") {
            reason = "none"
        }
        if (user=="none"){
            return message.channel.send(functions.error("Could not find user."))
        }
        sql.prepare(`INSERT OR REPLACE INTO id${message.guild.id} (id, user, reason) VALUES (?, ?, ?);`).run(warnid, user.id, reason);
        message.channel.send(functions.embed(`Successfully warned ${user.username}`, `Reason: ${reason}`, r.s).setFooter(`Warn id: ${warnid}`))
    }
}

function warns(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command=="warns") {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        onready(message.guild.id)
        if (!args[0]) {
            const embed = functions.embed(`Server warns`, `Here are the warns for ${message.guild.name}`, r.d);
            for (const all of sql.prepare(`SELECT * from id${message.guild.id}`).iterate()) {
                let {guild} = message;
                function check(user, what) {
                    if (user.user.id == what) {
                        embed.addField(`ID ${all.id} : ${user.user.username}`, `${all.reason}`, false)
                    }
                }
                guild.members.cache.forEach(member => check(member, all.user)); 
            }
            message.channel.send(embed)
        }
        else {
            search = args.splice(0,1000).join(" ")
            userobj = functions.userfromarg(message, search)
            if (userobj == "none") {
                return message.channel.send(functions.error(`No user found from '${search}'`))
            }
            
            const embed = functions.embed(`Member warns`, `Here are the warns for ${userobj.username}`, r.d);
            for (const all of sql.prepare(`SELECT * from id${message.guild.id} where user = ?`).iterate(userobj.id)) {
                let {guild} = message;
                function check(user, what) {
                    if (user.user.id == what) {
                        embed.addField(`ID ${all.id} : ${user.user.username}`, `${all.reason}`, false)
                    }
                }
                guild.members.cache.forEach(member => check(member, all.user)); 
            }
            message.channel.send(embed)
        }
    }
}

function delwarn(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    const warnid = args.splice(0,1).join(" ")
    const member = args.splice(0).join(" ")
    if (command=="delwarn") {
        if (message.guild ===null){return message.channel.send(functions.error("This command cannot be used in a DM channel"))};
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.channel.send(functions.error("You are missing manage message permissions to use this command"))
        }
        if (!warnid) {
            return message.channel.send(functions.error(`Missing argument (warn id): ${prefix}delwarn [warnID/all] *[user]`))
        }
        if (warnid=="all") {
            if (!member=="") {
                user = functions.userfromarg(message, member)
                const filter = m => m.author.id ===  message.author.id;
                message.channel.send(`Are you sure you want to delete all warns for **${user.username}**? Type **yes** or **no**`).then(() => {
                    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                        .then(collected => {
                            try {
                                if (collected.first().content.toLowerCase() == "yes") {
                                    sql.prepare(`DELETE FROM id${message.guild.id} where user = ${user.id}`).run();
                                    return message.channel.send(`Deleted all warns for **${user.username}**`)
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
                const filter = m => m.author.id ===  message.author.id;
                message.channel.send(`Are you sure you want to delete all warns for **${message.guild.name}**? Type **yes** or **no**`).then(() => {
                    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                        .then(collected => {
                            try {
                                if (collected.first().content.toLowerCase() == "yes") {
                                    sql.prepare(`DELETE FROM id${message.guild.id}`).run();
                                    return message.channel.send("Deleted all warns")
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
            }
        
        else {
            function doit(search) {
                var array = []
                it = sql.prepare(`SELECT * FROM id${message.guild.id} WHERE id LIKE '%${search}%'`).get()
                try {
                    array.push(String(it.id))
                } catch {}
                return array
                
            }
            if (doit(warnid).includes(warnid)) {
                sql.prepare(`DELETE FROM id${message.guild.id} WHERE id = ${warnid};`).run();
                message.channel.send("Removed warn id " + warnid)
            }
            else {
                message.channel.send(functions.error("Could not find warn for id " + warnid))
            }
        }
    }
}

module.exports.warn = warn 
module.exports.delwarn = delwarn 
module.exports.warns = warns 