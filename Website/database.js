const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const path = require('path')
const fs = require('fs')
const sql = new SQLite('./Databases/balances.sqlite');
const functions = require('../functions')
var express = require('express'),
  router = express.Router();
const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var automatedRoutes = require('./automated');
const bodyParser = require('body-parser');
const e = require("express");
const { from } = require("form-data");
app.use(bodyParser.urlencoded({
  extended: true
}));
bot = require('../unnamed').bot

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
const domain = JSON.parse(fs.readFileSync('.//Resources/website.json')).domain
const address = JSON.parse(fs.readFileSync('.//Resources/website.json')).address
const domainall = JSON.parse(fs.readFileSync('.//Resources/website.json')).domainall

router.get('/api/workreplies/:guildid', (req, res, next) => {
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

router.get('/app/:guildid/add', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  reply = req.query.replydata
  if (reply=="") {return res.redirect(`${address}/app/${guild.id}`)}
  if (guild.member(member).hasPermission("MANAGE_GUILD")) {
    replyid = functions.int(1, 99999)
    replies = JSON.parse(sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(guild.id).data)
    replies[String(replyid)] = reply
    sql.prepare(`UPDATE workreplies SET data = ? WHERE server = '${guild.id}' `).run(JSON.stringify(replies));
    res.redirect(`${address}/app/${guild.id}`)
  } else {
    res.redirect(`${address}/app/${guild.id}`)
  }

});

router.get('/app/:guildid/help', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  if (guild.member(member).hasPermission("MANAGE_GUILD")) {
      data = `<span><img src="https://i.ibb.co/w0cmcqY/help.png">
      <div style="position:absolute;left:1100px;top:350px;transform: translate(-50%, -50%);z-index:10;"><a onselectstart="return false" class="button link" href="${address}/app/${guild.id}">Back</a></span>`
      res.render(path.join(__dirname + '/HTML/custom.html'), {
          address:address, 
          status:`${address}/status`,
          data:data,
          title:"Dashboard help"
      });
  } else {}

});

router.get('/app/:guildid/load', (req, res, next) => {
  to = bot.guilds.cache.get(req.params.guildid)
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(to, id)
  if (req.query.replydata=="") {return res.redirect(`${address}/app/${to.id}`)}
  from1 = functions.decode(req.query.replydata.split(" ")[0])
  if (to.member(member).hasPermission("MANAGE_GUILD")) {
    if (from1==undefined) {return res.redirect(`${address}/app/${to.id}`)}
    from1 = bot.guilds.cache.get(from1)
    try {from1.name} catch {return res.redirect(`${address}/app/${to.id}`)}
    startup(to, member)
    startup(from1, member)
    try {
        replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(from1.id).data
    }
    catch {
        sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(from1.id, contents());
    }
    replies = JSON.parse(sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(from1.id).data)
    sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(to.id, JSON.stringify(replies));
    res.redirect(`${address}/app/${to.id}`)
  } else {
    res.redirect(`${address}/app/${to.id}`)
  }
});

router.get('/app/:guildid/reset', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  if (guild.member(member).hasPermission("MANAGE_GUILD")) {
    startup(guild, member)
    sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(guild.id, JSON.stringify(JSON.parse(fs.readFileSync('.//Resources/workreplies.json'))));
    res.redirect(`${address}/app/${guild.id}`)
  } else {
    res.redirect(`${address}/app/${guild.id}`)
  }
});

router.get('/app/:guildid/clear', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  if (guild.member(member).hasPermission("MANAGE_GUILD")) {
    startup(guild, member)
    sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(guild.id, '{}');
    res.redirect(`${address}/app/${guild.id}`)
  } else {
    res.redirect(`${address}/app/${guild.id}`)
  }
});

router.get('/app/:guildid/delete/:replyid', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  replyid = req.params.replyid
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  if (guild.member(member).hasPermission("MANAGE_GUILD")) {
    replies = JSON.parse(sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(guild.id).data)
    if (replies.hasOwnProperty(String(replyid))) {
      delete replies[String(replyid)]
      sql.prepare(`UPDATE workreplies SET data = ? WHERE server = '${guild.id}' `).run(JSON.stringify(replies));
      res.redirect(`${address}/app/${guild.id}`)
    } else {
      res.redirect(`${address}/app/${guild.id}`)
    }
  } else {
    res.redirect(`${address}/app/${guild.id}`)
  }
});

router.get('/app/:guildid', (req, res) => {
  if (req.params.guildid) {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    guild = bot.guilds.cache.get(req.params.guildid)
    member = functions.memberfromarg(guild, id)
    user = bot.users.cache.get(String(id))
    try {startup(guild, user)} catch {}
    try {
      replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(guild.id).data
    } catch {
      sql.prepare(`INSERT OR REPLACE INTO workreplies (server, data) VALUES (?, ?);`).run(guild.id, contents());
    }
    replies = sql.prepare(`SELECT * FROM workreplies WHERE server = ?`).get(guild.id).data
    returnvalue = "<div style='padding-bottom:50px;'></div>"
    for (k in JSON.parse(replies)) {
      var obj = JSON.parse(replies)[k]
      if (guild.member(member).hasPermission("MANAGE_GUILD")) {
        returnvalue = returnvalue.concat(`<div class="members"><b>ID ${k}</b> - ${obj}<div style="padding-right:50px"></div><button class="formbutton" onclick="window.open('/app/${guild.id}/delete/${k}', '_self')">Delete</button></div><div style="padding:10px;"></div>`)
      } else {
        returnvalue = returnvalue.concat(`<div class="members"><b>ID ${k}</b> - ${obj}<div style="padding-right:50px"></div><button class="formbuttondisabled" disabled>Delete (missing perms)</button></div><div style="padding:10px;"></div>`)
      }
    }
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
    li = li.concat(`<div style='padding-top:60px;'></div><img class="listimg dasb" onclick="window.open('https://discord.com/api/oauth2/authorize?client_id=732208102652379187&permissions=8&scope=bot')" id="dasb" src='https://i.ibb.co/dG0x5Ch/plus2.png'>`)
    avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
    if (guild.member(member).hasPermission("MANAGE_GUILD")) {
      data = `<h3 style="color:white;text-align:center;">Work replies for ${guild.name} <i class="fa fa-info-circle" onclick="window.open('${address}/app/${guild.id}/help', '_self')" style="cursor:pointer"></i></h3><center>
      <p style="color:white;margin-left:100px;margin-right:100px;text-align:center">Your work reply share ID is <b>${functions.encode(guild.id)}</b> - Giving this lets others use/load your work replies! (only people with manage guild permissions can see this)</p>
      <form action="${guild.id}/add" method="get"><input type="text" class="forminput" name="replydata"/><input type="submit" class="formbutton" value="Add work reply" /></form>
      <form action="${guild.id}/load" method="get"><input type="text" class="forminput" name="replydata"/><input type="submit" class="formbutton" value="Load work replies from ShareID (clears current)"/></form></center> 
      <div style="text-align:center">
      <button class="formbutton" style="background-color:red" onclick="window.open('/app/${guild.id}/reset', '_self')">Reset work replies to default</button>
      <button class="formbutton" style="background-color:red" onclick="window.open('/app/${guild.id}/clear', '_self')">Clear work replies</button>
      </div>
      <br>
      ${returnvalue}`
    } else {
      data = `<h3 style="color:white;text-align:center;">Work replies for ${guild.name}</h3><center><form action="${guild.id}/add" method="get"><input type="text" class="forminputdisabled" name="replydata" disabled/><input type="submit" class="formbuttondisabled" value="Add work reply (missing perms)" disabled/></form>
      <form action="${guild.id}/load" method="get"><input type="text" class="forminputdisabled" name="replydata" disabled/><input type="submit" class="formbuttondisabled" value="Load work replies from ShareID (missing perms)" disabled/></form></center> 
      <div style="text-align:center">
      <button class="formbuttondisabled">Reset work replies to default (missing permissions)</button>
      <button class="formbuttondisabled">Clear work replies (missing permissions)</button>
      </div>
      <br> ${returnvalue}`
    }
    return res.render(__dirname + '/HTML/dashboardguild.html', {
      servers: li,
      name: decodeURIComponent(getAppCookies(req, res)['name']),
      id: id,
      avatar: `<img class="avatar" id="output" src="${avatar}">`,
      address: address,
      status: `${address}/status`,
      data: data,
      membersection:`<a class="section" href="${address}/app/${guild.id}/members">Members</a>`,
      worksection:`<a class="sectionactive" href="${address}/app/${guild.id}">Work replies</a>`,
      channelsection:`<a class="section" href="${address}/app/${guild.id}/channels">Channels</a>`,
      prefixsection:`<a class="section" href="${address}/app/${guild.id}/prefix">Prefix</a>`,
      editor:`<a class="section" href="${address}/app/${guild.id}/editor/join">JM Editor</a>`
    })
  }
});



module.exports = router;