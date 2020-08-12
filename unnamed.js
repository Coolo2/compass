const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs')
const setup = JSON.parse(fs.readFileSync('.//Resources/test.json'))
const functions = require('./functions')

const maths = require('./Commands/math');
const database = require('./Commands/economy')
const moderation = require('./Commands/moderation')
const warns = require('./Commands/warns')
const help = require('./Commands/help')
const info = require('./Commands/info')
const apis = require('./Commands/apis')
const blocking = require('.//Commands/blocking')
const prefixes = require('.//Commands/prefix')
const takereplies = require('.//Commands/takereplies')
const emojis = require('.//Commands/emoji')

module.exports.bot = bot

bot.on('ready', () => {
  bot.user.setActivity(`?help | ${JSON.parse(fs.readFileSync('.//Resources/website.json')).domainall} | ${bot.guilds.cache.size} servers`);
  console.log(`Logged in as ${bot.user.tag}!`);
});

//const prefix = setup.prefix;

bot.on('message', message => {
  if (message.author.bot) return
  prefix = prefixes.getmess(message)
  if (!message.content.toLowerCase().startsWith(prefix.toLowerCase()) ) return;
  if (functions.checkchannel(message)) {return}
  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();
  maths.math(command, args, message)
  database.work(message)
  database.balance(message)
  moderation.ban(message)
  moderation.kick(message)
  warns.warn(message)
  warns.warns(message)
  warns.delwarn(message)
  help.help(message)
  info.botinfo(message, bot)
  apis.dog(message)
  database.workreplies(message)
  database.addreply(message)
  database.removereply(message)
  database.add(message)
  database.remove(message)
  database.leaderboards(message)
  blocking.block(message)
  blocking.unblock(message)
  moderation.nuke(message)
  prefixes.prefix(message)
  takereplies.take(bot, message)
  takereplies.share(message)
  emojis.emojis(message)
  apis.meme(message)
  apis.ascii(message)
});

bot.on("error", error => console.log(error));

module.exports.bot = bot

bot.login(setup.token);



const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

const domain = JSON.parse(fs.readFileSync('.//Resources/website.json')).domain
const address = JSON.parse(fs.readFileSync('.//Resources/website.json')).address
const domainall = JSON.parse(fs.readFileSync('.//Resources/website.json')).domainall

app.engine('html', require('ejs').renderFile);

oauth = require('./Website/oauth2/oauth')
var testRoutes = require('./Website/database');

router.get('/status', function (req, res) {
  res.render(__dirname + '/Website/HTML/status.html', {address:address, status:`${address}/status`});
})

app.use(express.static(__dirname+'/Website/static'));

app.use('/', testRoutes);
app.use('/', require('./Website/Modules/members'));
app.use('/', require('./Website/Modules/channels'));
app.use('/', require('./Website/Modules/currency'));
app.use('/', require('./Website/Modules/prefixes'));
app.use('/', require('./Website/backend'));


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

app.use((err, req, res, next) => {
  switch (err.message) {
    default:
      return res.status(500).send({
        status: 'ERROR',
        error: err.message,
      });
  }
});
router.get('/api/*', function (req, res) {
  res.send({"ERROR":"Invalid URL"})
});

router.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/Website/HTML/404.html'));
});

module.exports.getAppCookies = getAppCookies

app.use('/', router);
app.listen(process.env.port || 5000);

//