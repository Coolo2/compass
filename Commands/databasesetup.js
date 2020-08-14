const Discord = require("discord.js");
const bot = new Discord.Client();
const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/balances.sqlite');
const functions = require('../functions')
const talkedRecently = new Set();
const fs = require('fs')

function contents() {
    return fs.readFileSync('.//Resources/workreplies.json')
}

function startup(server, member) {
    const table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'balances${server.id}${member.id}';`).get();
    if (!table['count(*)']) {
        sql.prepare(`CREATE TABLE balances${server.id}${member.id} (user TEXT, balance INTEGER)`).run();
        try {
        sql.prepare(`CREATE UNIQUE INDEX idx_balances_user_${member.id} ON balances${server.id}${member.id} (user);`).run();
        } catch{}
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    const table2 = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'workreplies';`).get();
    if (!table2['count(*)']) {
        sql.prepare(`CREATE TABLE workreplies (server TEXT, data TEXT)`).run();
        try {
        sql.prepare(`CREATE UNIQUE INDEX idx_servers_user ON workreplies (server);`).run();
        } catch{}
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
        sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(server.id, contents());
        
    }
};

const pfx = new SQLite('./Databases/prefixes.sqlite');
function prefixes(server) {
    const table = pfx.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'prefixes';`).get();
    if (!table['count(*)']) {
        pfx.prepare(`CREATE TABLE prefixes (server TEXT, prefix TEXT)`).run();
        try {
        pfx.prepare(`CREATE UNIQUE INDEX idx_prefixes_server ON prefixes (server);`).run();
        } catch{}
        pfx.pragma("synchronous = 1");
        pfx.pragma("journal_mode = wal");
    }
};
const emo = new SQLite('./Databases/emojis.sqlite');
function emojis(server) {
    const table = emo.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'emojis';`).get();
    if (!table['count(*)']) {
        emo.prepare(`CREATE TABLE emojis (server TEXT, emoji TEXT)`).run();
        try {
        emo.prepare(`CREATE UNIQUE INDEX idx_emojis_server ON emojis (server);`).run();
        } catch{}
        emo.pragma("synchronous = 1");
        emo.pragma("journal_mode = wal");
    }
};

const time = new SQLite('./Databases/times.sqlite');
function times(guild) {
    const table = time.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'times${guild.id}';`).get();
    if (!table['count(*)']) {
        time.prepare(`CREATE TABLE times${guild.id} (user TEXT, time TEXT)`).run();
        try {
        time.prepare(`CREATE UNIQUE INDEX idx_times_${guild.id} ON times${guild.id} (user);`).run();
        } catch{}
        time.pragma("synchronous = 1");
        time.pragma("journal_mode = wal");
    }
};

module.exports.startup = startup
module.exports.prefixes = prefixes
module.exports.emojis = emojis
module.exports.times = times