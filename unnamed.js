const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs')
const setup = JSON.parse(fs.readFileSync('.//Resources/test.json'))
const functions = require('./functions')

const DBL = require('dblapi.js');
const dbl = new DBL(setup.dbl, { webhookPort: 3000, webhookAuth: 'password' });

const maths = require('./Commands/math');
const database = require('./Commands/economy')
const economy2 = require('./Commands/economy2')
const economy3 = require('./Commands/economy3extras')
const moderation = require('./Commands/moderation')
const warns = require('./Commands/warns')
const help = require('./Commands/help')
const info = require('./Commands/info')
const apis = require('./Commands/apis')
const blocking = require('.//Commands/blocking')
const prefixes = require('.//Commands/prefix')
const takereplies = require('.//Commands/takereplies')
const emojis = require('.//Commands/emoji')
const timely = require('.//Commands/timely')
const messages = require('.//Commands/messages')
const cooldown = require('.//Commands/cooldowns')
const returns = require('.//Commands/returns')


module.exports.bot = bot

bot.on('ready', () => {
  bot.user.setActivity(`^help | ${JSON.parse(fs.readFileSync('.//Resources/website.json')).domainall} | ${bot.guilds.cache.size} servers`);
  console.log(`Logged in as ${bot.user.tag}!`);
});

//const prefix = setup.prefix;

var nodeHtmlToImage = require('node-html-to-image');

var dir = './Website/HTML/Editor/Guilds';

bot.on('guildMemberAdd', member => {
  guild = member.guild
  f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
  if (!f[guild.id] || !f[guild.id]["join"] || f[guild.id]["join"] == "false") {return}
  else {channel = bot.channels.cache.get(f[guild.id]["join"])}
  if (f[guild.id]["joinmessage"] && f[guild.id]["joinmessage"].replace("noimg", "") != "false" && f[guild.id]["joinmessage"].startsWith("noimg")) {return channel.send(f[guild.id]["joinmessage"].split("{user}").join("<@" + member.user.id + ">").replace("noimg", ""))}
  if (f[guild.id]["joinmessage"] && f[guild.id]["joinmessage"].replace("noimg", "") != "false") {channel.send(f[guild.id]["joinmessage"].split("{user}").join("<@" + member.user.id + ">"))}
  if (fs.existsSync(dir + "/" + guild.id + '/welcome.html')) {
    html = `<body style="height:300px;width:500px;">` + fs.readFileSync(dir + "/" + guild.id + '/welcome.html', 'utf8').split("{server}").join(guild.name).split("{user}").join(member.user.username).split("{avatar}").join(member.user.displayAvatarURL())  + "</body>"
    nodeHtmlToImage({html: html,transparent:true})
      .then(buffer => {
        channel.send(new Discord.MessageAttachment(buffer, 'welcome-image.png'))
      })
  }
});

bot.on('message', message => {
  if (message.author.bot) return
  prefix = prefixes.getmess(message)
  if (!message.content.toLowerCase().startsWith(prefix.toLowerCase()) ) return;
  if (functions.checkchannel(message)) {return}
  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();
  maths.math(command, args, message)
  database.work(message)
  moderation.ban(message)
  moderation.kick(message)
  warns.warn(message)
  warns.warns(message)
  warns.delwarn(message)
  help.help(message)
  info.botinfo(message, bot)
  info.support(message)
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
  timely.daily(message)
  messages.welcome(message)
  cooldown.cooldown(message)
  database.crime(message)
  returns.returns(message)
  economy2.lower(message)
  economy3.deposit(message)
  economy3.withdrawl(message)
  economy3.balance(message)
  economy2.vote(message)
  economy2.crash(message)
});

bot.on("error", error => console.log(error.message));

module.exports.bot = bot

bot.login(setup.token);

// Web initialization .

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
app.use('/', require('./Website/Modules/crimereplies'));
app.use('/', require('./Website/Modules/options'));
app.use('/', require('./Website/Modules/channels'));
app.use('/', require('./Website/Modules/currency'));
app.use('/', require('./Website/Modules/prefixes'));
app.use('/', require('./Website/backend'));
app.use('/', require('./Website/HTML/Editor/editor').router);


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

app.use('/', router);
app.listen(process.env.port || 5000);

//DBL

votes = {}

dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

dbl.webhook.on('vote', vote => {
  votes[String(vote.user)] = true
  console.log(`User with ID ${vote.user} just voted!`);
});

module.exports.votes = votes
module.exports.getAppCookies = getAppCookies