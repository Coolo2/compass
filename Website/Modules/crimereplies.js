const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const path = require('path')
const fs = require('fs')
const sql = new SQLite('./Databases/balances.sqlite');
const sqlc = new SQLite('./Databases/cooldowns.sqlite');
const functions = require('../../functions')
var express = require('express'),
  router = express.Router();
const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const cooldowns = require('../../Commands/cooldowns')

var automatedRoutes = require('../automated');
const bodyParser = require('body-parser');
const e = require("express");
app.use(bodyParser.urlencoded({
  extended: true
}));
bot = require('../../compass').bot

function contents() {
  return fs.readFileSync('.//Resources/workreplies.json')
}

function crimecontents() {
  return fs.readFileSync('.//Resources/crimereplies.json')
}

const databasesetup = require('../../Commands/databasesetup')
const setup = JSON.parse(fs.readFileSync('.//Resources/setup.json'))

function startup(server, member) {
  databasesetup.startup(server, member)
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
const domain = JSON.parse(fs.readFileSync('.//Resources/website.json')).domain
const address = JSON.parse(fs.readFileSync('.//Resources/website.json')).address
const domainall = JSON.parse(fs.readFileSync('.//Resources/website.json')).domainall

router.get('/api/crimereplies/:guildid', (req, res, next) => {
    guild = bot.guilds.cache.get(req.params.guildid)
    member = bot.users.cache.get("368071242189897728")
    try {guild.name} catch {return res.send({"ERROR":"Invalid guild"})}
    try {
      replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(guild.id).data
    } catch {
      sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(guild.id, contents());
    }
    replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(guild.id).data
    returnarray = []
    for (k in JSON.parse(replies)) {
      var obj = JSON.parse(replies)[k]
      returnarray.push({"id":k, "reply":obj})
    }
    return res.send(returnarray)
})

router.get('/app/:guildid/addcrime-pay', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  reply = req.query.replydata
  if (reply=="") {return res.redirect(`${address}/app/${guild.id}/crime`)}
  if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
    replyid = functions.int(1, 99999)
    replies = JSON.parse(sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(guild.id).data)
    replies["pay"][String(replyid)] = reply
    sql.prepare(`UPDATE crimereplies SET data = ? WHERE server = '${guild.id}' `).run(JSON.stringify(replies));
    res.redirect(`${address}/app/${guild.id}/crime`)
  } else {
    res.redirect(`${address}/app/${guild.id}/crime`)
  }
});

router.get('/app/:guildid/addcrime-fine', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  reply = req.query.replydata
  if (reply=="") {return res.redirect(`${address}/app/${guild.id}/crime`)}
  if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
    replyid = functions.int(1, 99999)
    replies = JSON.parse(sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(guild.id).data)
    replies["fine"][String(replyid)] = reply
    sql.prepare(`UPDATE crimereplies SET data = ? WHERE server = '${guild.id}' `).run(JSON.stringify(replies));
    res.redirect(`${address}/app/${guild.id}/crime`)
  } else {
    res.redirect(`${address}/app/${guild.id}/crime`)
  }
});

router.get('/app/:guildid/setcrime', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  thecooldown = req.query.replydata
  if (thecooldown=="") {return res.redirect(`${address}/app/${guild.id}/crime`)}
  if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
    databasesetup.cooldowns(guild)
    try {
        sqlc.prepare(`INSERT OR REPLACE INTO cooldowns${guild.id} (type, value) VALUES (?, ?);`).run("crime", cooldowns.get_time(thecooldown));
    }
    catch (err) {console.log(err.message)}
    res.redirect(`${address}/app/${guild.id}/crime`)
  } else {
    res.redirect(`${address}/app/${guild.id}/crime`)
  }
});

router.get('/app/:guildid/resetcrime', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
    startup(guild, member)
    sql.prepare(`INSERT OR REPLACE INTO crimereplies (server, data) VALUES (?, ?);`).run(guild.id, JSON.stringify(JSON.parse(fs.readFileSync('.//Resources/crimereplies.json'))));
    res.redirect(`${address}/app/${guild.id}/crime`)
  } else {
    res.redirect(`${address}/app/${guild.id}/crime`)
  }
});

router.get('/app/:guildid/clearcrime', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
    startup(guild, member)
    sql.prepare(`INSERT OR REPLACE INTO crimereplies (server, data) VALUES (?, ?);`).run(guild.id, `{"pay":{}, "fine":{}}`);
    res.redirect(`${address}/app/${guild.id}/crime`)
  } else {
    res.redirect(`${address}/app/${guild.id}/crime`)
  }
});

router.get('/app/:guildid/deletecrime-pay/:replyid', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  replyid = req.params.replyid
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
    replies = JSON.parse(sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(guild.id).data)
    if (replies["pay"].hasOwnProperty(String(replyid))) {
      delete replies["pay"][String(replyid)]
      sql.prepare(`UPDATE crimereplies SET data = ? WHERE server = '${guild.id}' `).run(JSON.stringify(replies));
      res.redirect(`${address}/app/${guild.id}/crime`)
    } else {
      res.redirect(`${address}/app/${guild.id}/crime`)
    }
  } else {
    res.redirect(`${address}/app/${guild.id}/crime`)
  }
});

router.get('/app/:guildid/deletecrime-fine/:replyid', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  replyid = req.params.replyid
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
    replies = JSON.parse(sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(guild.id).data)
    if (replies["fine"].hasOwnProperty(String(replyid))) {
      delete replies["fine"][String(replyid)]
      sql.prepare(`UPDATE crimereplies SET data = ? WHERE server = '${guild.id}' `).run(JSON.stringify(replies));
      res.redirect(`${address}/app/${guild.id}/crime`)
    } else {
      res.redirect(`${address}/app/${guild.id}/crime`)
    }
  } else {
    res.redirect(`${address}/app/${guild.id}/crime`)
  }
});

router.get('/app/:guildid/crime', (req, res) => {
  if (req.params.guildid) {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    guild = bot.guilds.cache.get(req.params.guildid)
    member = functions.memberfromarg(guild, id)
    user = bot.users.cache.get(String(id))
    startup(guild, user)
    try {
      replies = sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(guild.id).data
    } catch {
      sql.prepare(`INSERT OR REPLACE INTO crimereplies (server, data) VALUES (?, ?);`).run(guild.id, crimecontents());
    }
    replies = sql.prepare(`SELECT * FROM crimereplies WHERE server = ?`).get(guild.id).data
    returnvalue = "<div style='padding-bottom:50px;'></div>"
    returnvalue = returnvalue.concat(`<p style="color:white">Pay replies</p>`)
    for (k in JSON.parse(replies)["pay"]) {
      var obj = JSON.parse(replies)["pay"][k]
      if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
        returnvalue = returnvalue.concat(`<div class="members"><b>ID ${k}</b> - ${obj}<div style="padding-right:50px"></div><button class="formbutton" onclick="window.open('/app/${guild.id}/deletecrime-pay/${k}', '_self')">Delete</button></div><div style="padding:10px;"></div>`)
      } else {
        returnvalue = returnvalue.concat(`<div class="members"><b>ID ${k}</b> - ${obj}<div style="padding-right:50px"></div><button class="formbuttondisabled" disabled>Delete (missing perms)</button></div><div style="padding:10px;"></div>`)
      }
    }
    returnvalue = returnvalue.concat(`<p style="color:white">Fine replies</p>`)
    for (k in JSON.parse(replies)["fine"]) {
      var obj = JSON.parse(replies)["fine"][k]
      if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
        returnvalue = returnvalue.concat(`<div class="members"><b>ID ${k}</b> - ${obj}<div style="padding-right:50px"></div><button class="formbutton" onclick="window.open('/app/${guild.id}/deletecrime-fine/${k}', '_self')">Delete</button></div><div style="padding:10px;"></div>`)
      } else {
        returnvalue = returnvalue.concat(`<div class="members"><b>ID ${k}</b> - ${obj}<div style="padding-right:50px"></div><button class="formbuttondisabled" disabled>Delete (missing perms)</button></div><div style="padding:10px;"></div>`)
      }
    }
    in1 = 0
    li = ""
    bot.guilds.cache.forEach((guild) => {
      try {
        if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(user.id)) {
          if (guild.id == bot.guilds.cache.get(req.params.guildid).id) {style = "style='border-radius:10px'"} else {style=""}
          li = li.concat(`<img onerror="this.src='https://i.ibb.co/Np9kNG9/noicon2.png'" class="listimg dasb" ${style} onclick="window.open('/app/${guild.id}', '_self')" id="dasb" src='${guild.iconURL()}' title='${guild.name}'>`)
          in1 = 1
        }
      } catch {}
    })
    li = li.concat(`<div style='padding-top:60px;'></div><img class="listimg dasb" onclick="window.open('https://discord.com/api/oauth2/authorize?client_id=732208102652379187&permissions=8&scope=bot')" id="dasb" src='https://i.ibb.co/dG0x5Ch/plus2.png'>`)
    avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
    if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
      data = `<h3 style="color:white;text-align:center;">Crime replies for ${guild.name} <i class="fa fa-info-circle" onclick="window.open('${address}/app/${guild.id}/help', '_self')" style="cursor:pointer"></i></h3><center>
      <form action="/app/${guild.id}/addcrime-pay" method="get"><input type="text" class="forminput" name="replydata"/><input type="submit" class="formbutton" value="Add crime pay reply" /></form>
      <form action="/app/${guild.id}/addcrime-fine" method="get"><input type="text" class="forminput" name="replydata"/><input type="submit" class="formbutton" value="Add crime fine reply" /></form>
      <div>
      <form action="/app/${guild.id}/setcrime" method="get"><input type="text" class="forminput" placeholder="${cooldowns.readable(cooldowns.get(guild, 'crime'))}" name="replydata"/><input type="submit" class="formbutton" value="Set crime cooldown" /></form>
      </div>
      <div style="text-align:center">
      <button class="formbutton" style="background-color:red" onclick="window.open('/app/${guild.id}/resetcrime', '_self')">Reset crime replies to default</button>
      <button class="formbutton" style="background-color:red" onclick="window.open('/app/${guild.id}/clearcrime', '_self')">Clear crime replies</button>
      </div>
      <br>
      ${returnvalue}`
    } else {
      data = `<h3 style="color:white;text-align:center;">Crime replies for ${guild.name}</h3><center>
      <form action="/app/${guild.id}/addcrime-pay" method="get"><input type="text" class="forminputdisabled" name="replydata" disabled/><input type="submit" class="formbuttondisabled" value="Add crime pay reply (missing perms)" disabled/></form>
      <form action="/app/${guild.id}/addcrime-fine" method="get"><input type="text" class="forminputdisabled" name="replydata" disabled/><input type="submit" class="formbuttondisabled" value="Add crime fine reply (missing perms)" disabled/></form>
      <div>
      <form action="/app/${guild.id}/setcrime" method="get"><input type="text" class="forminputdisabled" placeholder="${cooldowns.readable(cooldowns.get(guild, 'crime'))}" name="replydata" disabled/><input type="submit" class="formbuttondisabled" value="Set crime cooldown" disabled/></form>
      </div>
      <div style="text-align:center">
      <button class="formbuttondisabled">Reset crime replies to default (missing permissions)</button>
      <button class="formbuttondisabled">Clear crime replies (missing permissions)</button>
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
      worksection:`<a class="sectionactive" href="${address}/app/${guild.id}">Replies</a>`,
      optionsection:`<a class="section" href="${address}/app/${guild.id}/options">Economy opts</a>`,
      channelsection:`<a class="section" href="${address}/app/${guild.id}/channels">Channels</a>`,
      prefixsection:`<a class="section" href="${address}/app/${guild.id}/prefix">Prefix</a>`,
      editor:`<a class="section" href="${address}/app/${guild.id}/editor">Editor</a>`
    })
  }
});



module.exports = router;