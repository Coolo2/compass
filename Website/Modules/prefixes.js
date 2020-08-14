const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const path = require('path')
const sql = new SQLite(__dirname + '../../../Databases/prefixes.sqlite');
const functions = require('../../functions')
var express = require('express'),
  router = express.Router();
const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const fs = require('fs')
const getprefix = require ('../../Commands/prefix')

var automatedRoutes = require('../automated');
const bodyParser = require('body-parser');
const e = require("express");
const { prefixes } = require("../../Commands/databasesetup");
app.use(bodyParser.urlencoded({
  extended: true
}));
bot = require('../../unnamed').bot

function contents() {
  return fs.readFileSync('.//Resources/workreplies.json')
}

function startup(server, member) {
  require('../../Commands/databasesetup').prefixes(server)
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

router.get('/api/prefix/:guildid', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  try {guild.name} catch {return res.send({"ERROR":"Invalid guild"})}
  return res.send({"prefix":getprefix.get(guild)})
})

router.get('/app/:guildid/changeprefix', (req, res, next) => {
    guild = bot.guilds.cache.get(req.params.guildid)
    id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    member = functions.memberfromarg(guild, id)
    if (guild.member(member).hasPermission("MANAGE_GUILD")) {
        startup(guild, member)
        prefix = req.query.replydata.split(" ")[0]
        if (prefix == "") {return res.redirect(`${address}/app/${guild.id}/prefix`)}
        try {
            sql.prepare(`INSERT OR REPLACE INTO prefixes (server, prefix) VALUES (?, ?);`).run(guild.id, prefix);
        }
        catch (err) {
            console.log(err)
        }
        score = sql.prepare(`SELECT * FROM prefixes WHERE server = ?`).get(guild.id).prefix
        return res.redirect(`${address}/app/${guild.id}/prefix`)
    } else {return res.redirect(`${address}/app/${guild.id}/prefix`)}
  
  });

router.get('/app/:guildid/prefix', (req, res) => {
  if (req.params.guildid) {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    guild = bot.guilds.cache.get(req.params.guildid)
    member = functions.memberfromarg(guild, id)
    user = bot.users.cache.get(String(id))
    startup(guild, user)
    returnvalue = ""
    in1 = 0
    li = ""
    bot.guilds.cache.forEach((guild) => {
      try {
        if (guild.member(user.id)) {
          if (guild.id == bot.guilds.cache.get(req.params.guildid).id) {style = "style='border-radius:10px'"} else {style=""}
          li = li.concat(`<img onerror="this.src='https://i.ibb.co/Np9kNG9/noicon2.png'" class="listimg dasb" ${style} onclick="window.open('/app/${guild.id}', '_self')" id="dasb" src='${guild.iconURL()}' title='${guild.name}'>`)
          in1 = 1
        }
      } catch {}
    })
    if (!guild.member(user).hasPermission("MANAGE_GUILD")) {
        disabled = "disabled"
    } else {disabled = ""}
    prefix = require('../../Commands/prefix').get(guild)
    returnvalue = returnvalue.concat(`<div class="members"><b>${guild.name}</b>'s prefix: <span style="padding-left:30px;"> </span>  <form action="/app/${guild.id}/changeprefix" method="get"><input type="text" class="forminput${disabled}" autocomplete="off" placeholder="${prefix}" name="replydata" ${disabled}/><input type="submit" class="formbutton${disabled}" value="Change" ${disabled}/></form>  </div><div style="padding:10px;"></div>`)

    li = li.concat(`<div style='padding-top:60px;'></div><img class="listimg dasb" onclick="window.open('https://discord.com/api/oauth2/authorize?client_id=732208102652379187&permissions=8&scope=bot')" id="dasb" src='https://i.ibb.co/dG0x5Ch/plus2.png'>`)
    avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
    example = functions.randomcommandusage().replace("[prefix]", prefix)
    if (guild.member(member).hasPermission("MANAGE_GUILD")) {
      data = `<h3 style="color:white;text-align:center;">Prefix for ${guild.name}</h3> <br> <p style="margin-left:150px;margin-right:100px;color:white;text-align:center;font-size:20px;">Prefixes are what you add to use a command, so the bot can detect what messages are for commands. You can use <span style="background-color:#323844">[prefix][command]</span> or <span style="background-color:#323844">[prefix][space][command]</span> or <span style="background-color:#323844">[botmention]command</span></p><p style="color:white;text-align:center;font-size:20px;"><b>Exmaple:</b> ${example}</p><br> ${returnvalue}`
    } else {
      data = `<h3 style="color:white;text-align:center;">Prefix for ${guild.name}</h3> <br> <p style="margin-left:150px;margin-right:100px;color:white;text-align:center;font-size:20px;">Prefixes are what you add to use a command, so the bot can detect what messages are for commands. You can use <span style="background-color:#323844">[prefix][command]</span> or <span style="background-color:#323844">[prefix][space][command]</span> or <span style="background-color:#323844">[botmention]command</span></p><p style="color:white;text-align:center;font-size:20px;"><b>Exmaple:</b> ${example}</p><br>${returnvalue}`
    }
    return res.render(path.join(__dirname, '../HTML/dashboardguild.html'), {
      servers: li,
      name: decodeURIComponent(getAppCookies(req, res)['name']),
      id: id,
      avatar: `<img class="avatar" id="output" src="${avatar}">`,
      address: address,
      status: `${address}/status`,
      data: data,
      membersection:`<a class="section" href="${address}/app/${guild.id}/members">Members</a>`,
      worksection:`<a class="section" href="${address}/app/${guild.id}">Work replies</a>`,
      channelsection:`<a class="section" href="${address}/app/${guild.id}/channels">Channels</a>`,
      prefixsection:`<a class="sectionactive" href="${address}/app/${guild.id}/prefix">Prefix</a>`,
      editor:`<a class="section" href="${address}/app/${guild.id}/editor/join">JM Editor</a>`
    })
  }
});



module.exports = router;