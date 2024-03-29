const Discord = require("discord.js-light");
const SQLite = require("better-sqlite3");
const path = require('path')
const sql = new SQLite('./Databases/cooldowns.sqlite');
const functions = require('../../functions')
var express = require('express'),
  router = express.Router();
const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const fs = require('fs')
const getprefix = require ('../../Commands/prefix')

const returns = require('../../Commands/returns')
const cooldowns = require('../../Commands/cooldowns')

var automatedRoutes = require('../automated');
const bodyParser = require('body-parser');
const e = require("express");
const databasesetup = require("../../Commands/databasesetup");
app.use(bodyParser.urlencoded({
  extended: true
}));
bot = require('../../compass').bot
const setup = JSON.parse(fs.readFileSync('.//Resources/setup.json'))

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

router.get('/api/returns/:guildid', (req, res, next) => {
    guild = bot.guilds.cache.get(req.params.guildid)
    try {guild.name} catch {return res.send({"ERROR":"Invalid guild"})}
    return res.send(
        {
            "work":{"lower":returns.get(guild, 'work')[0], "upper":returns.get(guild, 'work')[1]},
            "crime":{"lower":returns.get(guild, 'crime')[0], "upper":returns.get(guild, 'crime')[1]},
            "daily":{"lower":returns.get(guild, 'daily')[0], "upper":returns.get(guild, 'work')[1]}
        }
    )
})

router.get('/api/cooldowns/:guildid', (req, res, next) => {
    guild = bot.guilds.cache.get(req.params.guildid)
    try {guild.name} catch {return res.send({"ERROR":"Invalid guild"})}
    return res.send(
        {
            "work":cooldowns.get(guild, 'work'),
            "crime":cooldowns.get(guild, 'crime'),
            "daily":cooldowns.get(guild, 'daily')
        }
    )
})

router.get('/app/:guildid/amount/:choice', (req, res, next) => {
    guild = bot.guilds.cache.get(req.params.guildid)
    choice = req.params.choice
    id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    member = functions.memberfromarg(guild, id)
    lower = req.query.lower
    upper = req.query.upper
    if (!lower || !upper || lower=="" || upper=="" || !['work', 'daily', 'crime'].includes(choice)) {return res.redirect(`${address}/app/${guild.id}/options`)}
    
    if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
        if (isNaN(lower) || isNaN(upper)) {
            return res.redirect(`${address}/app/${guild.id}/options`)
        }

        databasesetup.returns(guild)
        try {
            sql.prepare(`INSERT OR REPLACE INTO returns${guild.id} (type, value) VALUES (?, ?);`).run(choice, lower + " " + upper);
        }
        catch (err) {
            console.log(err)
        }
      res.redirect(`${address}/app/${guild.id}/options`)
    } else {
      res.redirect(`${address}/app/${guild.id}/options`)
    }
  
  });

router.get('/app/:guildid/options', (req, res) => {
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
          li = li.concat(`<div aria-label="${guild.name}" data-balloon-pos="right"><img onerror="this.src='https://i.ibb.co/Np9kNG9/noicon2.png'" class="listimg dasb" ${style} onclick="window.open('/app/${guild.id}', '_self')" id="dasb" src='${guild.iconURL()}'></div>`)
          in1 = 1
        }
      } catch {}
    })
    if (!(getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) && !guild.member(user).hasPermission("MANAGE_GUILD")) {
        disabled = "disabled"
    } else {disabled = ""}
    prefix = require('../../Commands/prefix').get(guild)

    if (setup.botadmins.includes(id) && getAppCookies(req, res)['adminMode'] == 'on') {li = li.concat(`<div style='padding-top:60px;'></div><img class="listimg dasb" onclick="window.open('/admin/servers', '_self')" id="dasb" src='https://www.clker.com/cliparts/k/D/D/T/y/o/more-button-hi.png'>`)}
  li = li.concat(`<div style='padding-top:60px;'></div><img class="listimg dasb" onclick="window.open('https://discord.com/api/oauth2/authorize?client_id=732208102652379187&permissions=8&scope=bot')" id="dasb" src='https://i.ibb.co/dG0x5Ch/plus2.png'>`)
    avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
    if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
        data = `<h3 style="color:white;text-align:center;">Economy options for ${guild.name}</h3><br> 
        <div style="color:white">
        From <form action="/app/${guild.id}/amount/work" method="get"><input type="text" value="${returns.get(guild, 'work')[0]}" class="forminput" name="lower"/> to <input type="text" class="forminput" value="${returns.get(guild, 'work')[1]}" name="upper"/><input type="submit" class="formbutton" value="Set work return amount"/></form><br>
        From <form action="/app/${guild.id}/amount/crime" method="get"><input type="text" value="${returns.get(guild, 'crime')[0]}" class="forminput" name="lower"/> to <input type="text" class="forminput" value="${returns.get(guild, 'crime')[1]}" name="upper"/><input type="submit" class="formbutton" value="Set crime return amount"/></form><br>
        From <form action="/app/${guild.id}/amount/daily" method="get"><input type="text" value="${returns.get(guild, 'daily')[0]}" class="forminput" name="lower"/> to <input type="text" class="forminput" value="${returns.get(guild, 'daily')[1]}" name="upper"/><input type="submit" class="formbutton" value="Set daily return amount"/></form>
        </div>
         <br> ${returnvalue}`
    } else {
        data = `<h3 style="color:white;text-align:center;">Economy options for ${guild.name}</h3><br> 
        <div style="color:white">
        From <form  method="get"><input type="text" value="${returns.get(guild, 'work')[0]}" class="forminputdisabled" name="lower" disabled/> to <input type="text" class="forminputdisabled" value="${returns.get(guild, 'work')[1]}" name="upper" disabled/><input type="submit" class="formbuttondisabled" value="Set work return amount (missing perms)" disabled/></form><br>
        From <form  method="get"><input type="text" value="${returns.get(guild, 'crime')[0]}" class="forminputdisabled" name="lower" disabled/> to <input type="text" class="forminputdisabled" value="${returns.get(guild, 'crime')[1]}" name="upper" disabled/><input type="submit" class="formbuttondisabled" value="Set crime return amount (missing perms)" disabled/></form><br>
        From <form  method="get"><input type="text" value="${returns.get(guild, 'daily')[0]}" class="forminputdisabled" name="lower" disabled/> to <input type="text" class="forminputdisabled" value="${returns.get(guild, 'daily')[1]}" name="upper" disabled/><input type="submit" class="formbuttondisabled" value="Set daily return amount (missing perms)" disabled/></form>
        </div>
         <br> ${returnvalue}`
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
      worksection:`<a class="section" href="${address}/app/${guild.id}">Replies</a>`,
      optionsection:`<a class="sectionactive" href="${address}/app/${guild.id}/options">Economy opts</a>`,
      channelsection:`<a class="section" href="${address}/app/${guild.id}/channels">Channels</a>`,
      prefixsection:`<a class="section" href="${address}/app/${guild.id}/prefix">Prefix</a>`,
codesection:`<a class="section" href="${address}/app/${guild.id}/codes">Codes</a>`,
      editor:`<a class="section" href="${address}/app/${guild.id}/editor">Editor</a>`
    })
  }
});

module.exports = router;