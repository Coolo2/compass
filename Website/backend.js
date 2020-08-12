const express = require('express');
const app = express();
const fs = require('fs')
const path = require('path');
const router = express.Router();
const fetch = require('node-fetch');
const btoa = require('btoa');
const cookie = require('cookie')
const vhost = require("vhost");
const {
  catchAsync
} = require('../utils');
const {
  bitAnd
} = require('mathjs');

const domain = JSON.parse(fs.readFileSync('.//Resources/website.json')).domain
const address = JSON.parse(fs.readFileSync('.//Resources/website.json')).address
const domainall = JSON.parse(fs.readFileSync('.//Resources/website.json')).domainall

const CLIENT_ID = "732208102652379187";
const CLIENT_SECRET = "Qj4t6sMoeE_ecXCWdcAQFoI7L2v2Qxak";
const redirect = encodeURIComponent(address + '/dashboard');



//app.engine('html', require('ejs').renderFile);



router.get('/', function (req, res) {
  var allguilds = bot.guilds.cache.size;
  var users1 = bot.users.cache.size;
  var channels1 = bot.channels.cache.size;
  res.render(__dirname + '/HTML/index.html', {
    servers: allguilds,
    users: users1,
    channels: channels1,
    address:address, status:`${address}/status`
  })
});

router.get('/api', function (req, res) {
  res.send({"ERROR":"No section provided", "documentation":address + "/documentation/api"})
})

router.get('/about', function (req, res) {
  res.render(path.join(__dirname + '/HTML/about.html'), {
    address:address, 
    status:`${address}/status`
});
});

router.get('/changelogs', function (req, res) {
  res.render(path.join(__dirname + '/HTML/changelogs.html'), {
      address:address, 
      status:`${address}/status`
  });
});

router.get('/documentation', function (req, res) {
  res.render(path.join(__dirname + '/HTML/Docs/help.html'), {
      address:address, 
      status:`${address}/status`
  });
});

router.get('/documentation/api', function (req, res) {
  res.render(path.join(__dirname + '/HTML/Docs/api.html'), {
      address:address, 
      status:`${address}/status`
  });
});

router.get('/commands', function (req, res) {
  commands = JSON.parse(fs.readFileSync(`.//Resources/commands.json`))
  moderation = `<button style="border-top-right-radius:10px;border-top-left-radius:10px;" class="collapsible">Moderation</button><div class="content"><table><tr><th style="border-left:1px solid rgb(168, 168, 168);color:">Command</th><th>Aliases</th><th style="border-right:1px solid rgb(168, 168, 168);">Description</th></tr>`
  economy = `<button class="collapsible">Economy</button><div class="content"><table><tr><th style="border-left:1px solid rgb(168, 168, 168);color:">Command</th><th>Aliases</th><th style="border-right:1px solid rgb(168, 168, 168);">Description</th></tr>`
  fun = `<button class="collapsible">Fun</button><div class="content"><table><tr><th style="border-left:1px solid rgb(168, 168, 168);color:">Command</th><th>Aliases</th><th style="border-right:1px solid rgb(168, 168, 168);">Description</th></tr>`
  misc = `<button style="border-bottom-right-radius:10px;border-bottom-left-radius:10px;" class="collapsible">Misc</button><div class="content"><table><tr><th style="border-left:1px solid rgb(168, 168, 168);color:">Command</th><th>Aliases</th><th style="border-right:1px solid rgb(168, 168, 168);">Description</th></tr>`
  for (item in commands["Moderation"]) {
    moderation = moderation.concat(`<tr><td style="border-left:1px solid rgb(168, 168, 168);">${commands["Moderation"][item].name}</td><td>${commands["Moderation"][item].aliases.join(", ")}</td><td style="border-right:1px solid rgb(168, 168, 168);">${commands["Moderation"][item].description}</td></tr>`)
  }
  for (item in commands["Economy"]) {
    economy = economy.concat(`<tr><td style="border-left:1px solid rgb(168, 168, 168);">${commands["Economy"][item].name}</td><td>${commands["Economy"][item].aliases.join(", ")}</td><td style="border-right:1px solid rgb(168, 168, 168);">${commands["Economy"][item].description}</td></tr>`)
  }
  for (item in commands["Fun"]) {
    fun = fun.concat(`<tr><td style="border-left:1px solid rgb(168, 168, 168);">${commands["Fun"][item].name}</td><td>${commands["Fun"][item].aliases.join(", ")}</td><td style="border-right:1px solid rgb(168, 168, 168);">${commands["Fun"][item].description}</td></tr>`)
  }
  for (item in commands["Misc"]) {
    misc = misc.concat(`<tr><td style="border-left:1px solid rgb(168, 168, 168);">${commands["Misc"][item].name}</td><td>${commands["Misc"][item].aliases.join(", ")}</td><td style="border-right:1px solid rgb(168, 168, 168);">${commands["Misc"][item].description}</td></tr>`)
  }
  moderation = moderation.concat(`</table></div>`)
  economy = economy.concat(`</table></div>`)
  fun = fun.concat(`</table></div>`)
  misc = misc.concat(`</table></div>`)
  res.render(path.join(__dirname + '/HTML/commands.html'), {
      address:address, 
      status:`${address}/status`,
      data:moderation + economy + fun + misc
  });
});

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

oauth = require('./oauth2/oauth')
router.get('/dashboard', catchAsync(async (req, res) => {
  if (!req.query.code) {
    res.redirect("/")
  }
  else {
  const code = req.query.code;
  const data = oauth.data(CLIENT_ID, CLIENT_SECRET, code)

  params = oauth.encode(data)
  responses = await oauth.response(params)
  json = await responses.json()
  userinfo = await oauth.get_user_info(json)
  res.cookie('user', "5468631284719832746189768653" + userinfo.id + "5468631284719832746189768653", {maxAge: 31556952000})
  res.cookie('name', userinfo.username, {maxAge: 31556952000})
  res.cookie('avatar', userinfo.avatar, {maxAge: 31556952000})
  res.redirect('/app')
  }
}));
var testRoutes = require('./database');

router.get('/redirect', (req, res) => {
  res.render(__dirname + '/HTML/redirect.html', {url:address})
})

router.get('/app', (req, res) => {
  try {
    id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    try {
      user = bot.users.cache.get(String(id))
      user.name
      place = '/HTML/dashboard.html'
    } catch {
      if (isNaN(id) == false) {
        user = {"name":getAppCookies(req, res)['name'],"id":getAppCookies(req, res)['id']}
        place = '/HTML/dashboardexcept.html'
        }
    }
  } catch {
    res.redirect('/login')
  }
  in1 = 0
  li = ""
  bot.guilds.cache.forEach((guild) => {
    try {
      if (guild.member(user.id)) {
        if (guild.id == bot.guilds.cache.get(req.params.guildid).id) {style = "style='border-radius:10px'"} else {style=""}
          li = li.concat(`<img onerror="this.src='https://i.ibb.co/zHmYPLq/noicon.png'" class="listimg dasb" ${style} onclick="window.open('/app/${guild.id}', '_self')" id="dasb" src='${guild.iconURL()}' title='${guild.name}'>`)
        in1 = 1
      }
    } catch {}
  })
  li = li.concat(`<div style='padding-top:60px;'></div><img class="listimg dasb" onclick="window.open('https://discord.com/api/oauth2/authorize?client_id=732208102652379187&permissions=8&scope=bot')" id="dasb" src='https://i.ibb.co/dG0x5Ch/plus2.png'>`)
  avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
    res.render(__dirname + place, {
      servers: li,
      name: decodeURIComponent(getAppCookies(req, res)['name']),
      id: id,
      avatar: `<img class="avatar" id="output" src="${avatar}">`,
      address:address, 
      status:`${address}/status`
    });
  
  
})
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




module.exports = router