const Discord = require("discord.js-light");
const SQLite = require("better-sqlite3");
const path = require('path')
const sql = new SQLite('./Databases/emojis.sqlite');
const functions = require('../../functions')
var express = require('express'),
  router = express.Router();
const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const fs = require('fs')

var automatedRoutes = require('../automated');
const bodyParser = require('body-parser');
const e = require("express");
 user = require("../../Extras/balance");
app.use(bodyParser.urlencoded({
  extended: true
}));
bot = require('../../compass').bot

function contents() {
  return fs.readFileSync('.//Resources/workreplies.json')
}

function startup(server, member) {
  require('../../Commands/databasesetup').startup(server, member)
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
const domain = JSON.parse(fs.readFileSync('./Resources/website.json')).domain
const address = JSON.parse(fs.readFileSync('./Resources/website.json')).address
const domainall = JSON.parse(fs.readFileSync('./Resources/website.json')).domainall

router.get('/api/currency/:guildid', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  try {guild.name} catch {return res.send({"ERROR":"Invalid guild"})}
  try {
    score = sql.prepare(`SELECT * FROM emojis WHERE server = ?`).get(guild.id).emoji
    final = {"currency":score}
  } catch {
    final = {"currency":"<:coin:740973567159828552>"}
  }
  return res.send(final)
})

module.exports = router;