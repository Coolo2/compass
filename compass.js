const Discord = require("discord.js-light");
const bot = new Discord.Client({
  cacheGuilds: true,
  cacheChannels: true,
  cacheOverwrites: false,
  cacheRoles: true,
  cacheEmojis: false,
  fetchAllMembers:true,
  cachePresences: false,
});

const fs = require('fs')
const setup = JSON.parse(fs.readFileSync('.//Resources/setup.json'))
const functions = require('./functions')

require("dotenv").config();

const maths = require('./Commands/math');
const database = require('./Commands/economy')
const economy2 = require('./Commands/economy2')
const economy3 = require('./Commands/economy3extras')
const moderation = require('./Commands/moderation')
const warns = require('./Commands/warns')
const help = require('./Commands/help')
const info = require('./Commands/info')
const apis = require('./Commands/apis')
const blocking = require('./Commands/blocking')
const prefixes = require('./Commands/prefix')
const takereplies = require('./Commands/takereplies')
const emojis = require('./Commands/emoji')
const timely = require('./Commands/timely')
const messages = require('./Commands/messages')
const cooldown = require('./Commands/cooldowns')
const returns = require('./Commands/returns')
const codes = require('./Commands/codes')
const suggest = require('./Commands/suggestion')
const profile = require('./Commands/profile')
const admin = require('./Commands/admin')

const r = require('./Resources/rs');

module.exports.bot = bot

bot.on('ready', () => {
  bot.user.setActivity(`${setup.prefix}help | ${JSON.parse(fs.readFileSync('.//Resources/website.json')).shown} | ${bot.guilds.cache.size} servers`);
  console.log(`Logged in as ${bot.user.tag}!`);
});

var nodeHtmlToImage = require('node-html-to-image');

var dir = './Website/HTML/Editor/Guilds';

bot.on('guildMemberAdd', member => {
  guild = member.guild
  f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
  if (!f[guild.id] || !f[guild.id]["join"] || f[guild.id]["join"] == "false") {return}
  else {channel = bot.channels.cache.get(f[guild.id]["join"])}
  if (f[guild.id]["joinmessage"] && f[guild.id]["joinmessage"].replace("noimg", "") != "false" && f[guild.id]["joinmessage"].startsWith("noimg")) {return channel.send(f[guild.id]["joinmessage"].split("{user}").join("<@" + member.user.id + ">").replace("noimg", "").split("{server}").join(guild.name))}
  if (f[guild.id]["joinmessage"] && f[guild.id]["joinmessage"].replace("noimg", "") != "false") {channel.send(f[guild.id]["joinmessage"].split("{user}").join("<@" + member.user.id + ">").split("{server}").join(guild.name))}
  if (fs.existsSync(dir + "/" + guild.id + '/welcome.html')) {
    html = `<body style="height:300px;width:500px;">` + fs.readFileSync(dir + "/" + guild.id + '/welcome.html', 'utf8').split("{server}").join(guild.name).split("{user}").join(member.user.username).split("{avatar}").join(member.user.displayAvatarURL())  + "</body>"
    nodeHtmlToImage({html: html,transparent:true, puppeteerArgs:{headless: false,args: ['--no-sandbox', '--disable-setuid-sandbox']}})
      .then(buffer => {
        channel.send(new Discord.MessageAttachment(buffer, 'welcome-image.png'))
      })
  }
});

bot.on('guildMemberRemove', member => {
  guild = member.guild
  f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
  if (!f[guild.id] || !f[guild.id]["leave"] || f[guild.id]["leave"] == "false") {return}
  else {channel = bot.channels.cache.get(f[guild.id]["leave"])}
  if (f[guild.id]["leavemessage"] && f[guild.id]["leavemessage"].replace("noimg", "") != "false" && f[guild.id]["leavemessage"].startsWith("noimg")) {return channel.send(f[guild.id]["leavemessage"].split("{user}").join(member.user.username).replace("noimg", "").split("{server}").join(guild.name))}
  if (f[guild.id]["leavemessage"] && f[guild.id]["leavemessage"].replace("noimg", "") != "false") {channel.send(f[guild.id]["leavemessage"].split("{user}").join(member.user.username).split("{server}").join(guild.name))}
  if (fs.existsSync(dir + "/" + guild.id + '/leave.html')) {
    html = `<body style="height:300px;width:500px;">` + fs.readFileSync(dir + "/" + guild.id + '/leave.html', 'utf8').split("{server}").join(guild.name).split("{user}").join(member.user.username).split("{avatar}").join(member.user.displayAvatarURL())  + "</body>"
    nodeHtmlToImage({html: html,transparent:true, puppeteerArgs:{headless: false,args: ['--no-sandbox', '--disable-setuid-sandbox']}})
      .then(buffer => {
        channel.send(new Discord.MessageAttachment(buffer, 'leave-image.png'))
      })
  }
});

module.exports.launchedAt = new Date()

SlashCMDSServer = [`eject`, `binary`, `math`]
SlashCMDSGlobal = [`eject`, `binary`, `math`]

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
  messages.leave(message)
  cooldown.cooldown(message)
  database.crime(message)
  returns.returns(message)
  economy2.lower(message)
  economy2.roll(message)
  economy3.deposit(message)
  economy3.withdrawl(message)
  economy3.balance(message)
  //economy2.vote(message)
  economy2.crash(message)
  info.uptime(message)
  codes.generate(message)
  codes.redeem(message)
  codes.generateGlobal(message)
  codes.deleteCodeCommand(message)
  codes.deleteCodeGlobalCommand(message)
  suggest.suggest(bot, message)
  suggest.issue(bot, message)
  economy2.rob(bot, message)
  economy2.pay(bot, message)
  profile.profile(bot, message)
  apis.impostor(bot, message)
  apis.wide(bot, message)
  info.ping(bot, message)
  admin.getSlash(bot, message, SlashCMDSServer, SlashCMDSGlobal)
  admin.loadSlashGlobal(bot, message, SlashCMDSServer, SlashCMDSGlobal)
  admin.loadSlashServer(bot, message, SlashCMDSServer, SlashCMDSGlobal)
  admin.unloadSlashServer(bot, message, SlashCMDSServer, SlashCMDSGlobal)
});

bot.ws.on('INTERACTION_CREATE', async interaction => {
  for (cmd of SlashCMDSServer) {require(`./CommandsSlash/${cmd}`).respond(bot, interaction)}
})

bot.on("error", error => console.log(error.message));

module.exports.bot = bot

bot.login(process.env.token);

// Web initialization .

const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

const domain = JSON.parse(fs.readFileSync('.//Resources/website.json')).domain
const address = JSON.parse(fs.readFileSync('.//Resources/website.json')).address
const domainall = JSON.parse(fs.readFileSync('.//Resources/website.json')).domainall

app.engine('html', require('ejs').renderFile);
var minifyHTML = require('express-minify-html-2');

app.use(minifyHTML({
  override:      true,
  exception_url: ['/app'],
  htmlMinifier: {
      removeComments:            true,
      collapseWhitespace:        true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes:     true,
      removeEmptyAttributes:     true,
      minifyJS:                  true
  }
}));


oauth = require('./Website/oauth2/oauth')
var testRoutes = require('./Website/database');

router.get('/status', function (req, res) {
  res.render(__dirname + '/Website/HTML/status.html', {address:address, status:`${address}/status`});
})

app.use(express.static(__dirname+'/Website/static'));
app.use(express.static(__dirname+'/Databases'));

app.use('/', testRoutes);
app.use('/', require('./Website/Modules/members'));
app.use('/', require('./Website/Modules/crimereplies'));
app.use('/', require('./Website/Modules/options'));
app.use('/', require('./Website/Modules/channels'));
app.use('/', require('./Website/Modules/currency'));
app.use('/', require('./Website/Modules/prefixes'));
app.use('/', require('./Website/Modules/profiles'));
app.use('/', require('./Website/Modules/codes'));
app.use('/', require('./Website/backend'));
app.use('/', require('./Website/Modules/admin'));
app.use('/', require('./Website/HTML/Editor/editor').router);
app.use('/', require('./Website/HTML/Editor/editorleave').router);

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

votes = {}

/*router.post('/dblwebhook', function (req, res) {
  vote = req.body
  try {
    user = bot.users.cache.get(req.body.user)
    user.send(functions.embed(`Thanks for voting!`, `Thank you so much for voting for me, it helps support the bot! As a thanks, you can redeem a reward every time you vote with **^vote**`, r.s))
  } catch{}
  votes[String(vote.user)] = true
  console.log(`User with ID ${vote.user} just voted!`);
})*/

router.get('/sitemap', function (req, res) {
  res.send(`
https://compass.js.org/\n
https://compass.js.org/commands\n
https://compass.js.org/status
  `)
});

router.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/Website/HTML/404.html'));
});

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', router);
app.listen(process.env.port || 5000);

module.exports.votes = votes
module.exports.getAppCookies = getAppCookies

var os = require('os');

setTimeout(function () {
  loadData()
}, 5000);

function loadData() {
  
    f = JSON.parse(fs.readFileSync('./Databases/minute.json'))
    f2 = JSON.parse(fs.readFileSync('./Databases/day.json'))
    if (!f2[new Date().toDateString()]) {f2[new Date().toDateString()] = {"guilds":bot.guilds.cache.size, "users":bot.users.cache.size}}
    d = new Date()
    if (String(Math.ceil(d.toTimeString().split(":")[1]/5)*5).length != 2) {top = String(Math.ceil(d.toTimeString().split(":")[1]/5)*5) + "0"} else {top = String(Math.ceil(d.toTimeString().split(":")[1]/5)*5)}
    datetext = d
    f[String(datetext)] = {"users":bot.users.cache.size, "guilds":bot.guilds.cache.size, "channels":bot.channels.cache.size, "free_memory":Math.round((process.memoryUsage().heapTotal-process.memoryUsage().heapUsed)/1000000), "used_memory":Math.round(process.memoryUsage().heapUsed/1000000)}
    if (Object.keys(f).length > 288) {delete f[Object.keys(f)[0]]}
    fs.writeFileSync('./Databases/minute.json', JSON.stringify(f))
    fs.writeFileSync('./Databases/day.json', JSON.stringify(f2))
}


setInterval(function() {
    loadData()
}, 300 * 1000); 