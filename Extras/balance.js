const SQLite = require("better-sqlite3");
const sql = new SQLite('./Databases/balances.sqlite');
const functions = require('../functions')

function user(guild, user) {
    try {
        score = sql.prepare(`SELECT * FROM balances${guild.id}${user.id} WHERE user = ?`).get(user.id).balance
    } catch{
        score = 0
    }
    return score
}

module.exports.user = user