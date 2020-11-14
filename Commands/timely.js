const Discord = require("discord.js-light");
const SQLite = require("better-sqlite3");

const sql = new SQLite('./Databases/balances.sqlite');
const time = new SQLite('./Databases/times.sqlite');

const returns = require('./returns')

const r = require('../Resources/rs')

const functions = require('../functions')
const fs = require('fs')
const emojis = require('./emoji');
const prefixes = require("./prefix");

const setup = require('./databasesetup')

function startup(server, member) {
    setup.startup(server, member)
};

function daily(message) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'daily') {
        setup.times(message.guild)
        startup(message.guild, message.author)
        now = new Date().toDateString()
        access = false
        prev = time.prepare(`SELECT * FROM 'times${message.guild.id}'`).get()
        
        if (prev == undefined) {
            time.prepare(`INSERT OR REPLACE into times${message.guild.id} (user, time) VALUES (?, ?)`).run(message.author.id, now) 
            access = true
        } else {
            done = false;for (item in prev) {if (prev[item] == message.author.id) done = true}
            if (done == false) {
                time.prepare(`INSERT OR REPLACE into times${message.guild.id} (user, time) VALUES (?, ?)`).run(message.author.id, now) 
                access = true
            }
        }
        final = time.prepare(`SELECT * FROM times${message.guild.id} WHERE user='${message.author.id}'`).get() 
        
        if (final.time != now) {access = true} 
        

        if (access == true) {
            toadd = functions.int(returns.get(message.guild, 'daily')[0], returns.get(message.guild, 'daily')[1]) 
            try {
                score = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance
                sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, score + toadd);
            }
            catch {
                sql.prepare(`INSERT OR REPLACE INTO balances${message.guild.id}${message.author.id} (user, balance) VALUES (?, ?);`).run(message.author.id, toadd);
            }
            score = sql.prepare(`SELECT * FROM balances${message.guild.id}${message.author.id} WHERE user = ?`).get(message.author.id).balance
            time.prepare(`INSERT OR REPLACE into times${message.guild.id} (user, time) VALUES (?, ?)`).run(message.author.id, now) 
            return message.channel.send(functions.embed(
                "You got your daily!", 
                `You completed your daily for ${message.guild.name} and got ${toadd + emojis.get(message.guild)}! You are now on ${score + emojis.get(message.guild)}!`, 
                r.s))
        } else {return message.channel.send(functions.error("You have already completed your daily today! Try again later!"))}
    }
}
module.exports.daily = daily