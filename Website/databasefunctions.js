const Discord = require("discord.js-light");
const SQLite = require("better-sqlite3");
const path = require('path')
const sql = new SQLite('./Databases/balances.sqlite');
const functions = require('../functions')
var express = require('express'),
  router = express.Router();
const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const fs = require('fs')

var automatedRoutes = require('./automated');
const bodyParser = require('body-parser');
const e = require("express");
app.use(bodyParser.urlencoded({
  extended: true
}));
bot = require('../test').bot

function contents() {
  return fs.readFileSync('.//Resources/workreplies.json')
}

function startup(server, member) {
  // Check if the table "points" exists.
  const table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'balances${server.id}${member.id}';`).get();
  if (!table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare(`CREATE TABLE balances${server.id}${member.id} (user TEXT, balance INTEGER)`).run();
    // Ensure tat the "id" row is always unique and indexed.
    try {
      sql.prepare(`CREATE UNIQUE INDEX idx_balances_user ON balances${server.id}${member.id} (user);`).run();
    } catch {}
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }
  const table2 = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'workreplies';`).get();
  if (!table2['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare(`CREATE TABLE workreplies (server TEXT, data TEXT)`).run();
    // Ensure tat the "id" row is always unique and indexed.
    try {
      sql.prepare(`CREATE UNIQUE INDEX idx_servers_user ON workreplies (server);`).run();
    } catch {}
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
    sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(server.id, contents());

  }
};
const getAppCookies = (req, res) => {
  try {
    const rawCookies = req.headers.cookie.split('; ');

    const parsedCookies = {};
    rawCookies.forEach(rawCookie => {
      const parsedCookie = rawCookie.split('=');
      parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
    return parsedCookies;
  } catch {
    res.redirect('/login')
  }
};



module.exports = router;