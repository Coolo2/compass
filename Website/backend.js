const express = require('express');
const app = express();
const fs = require('fs')
const path = require('path');
const router = express.Router();
const fetch = require('node-fetch');
const functions = require('../functions')

const {
  catchAsync
} = require('../utils');

const domain = JSON.parse(fs.readFileSync('.//Resources/website.json')).domain
const address = JSON.parse(fs.readFileSync('.//Resources/website.json')).address
const domainall = JSON.parse(fs.readFileSync('.//Resources/website.json')).domainall

const CLIENT_ID = "732208102652379187";
const CLIENT_SECRET = "Qj4t6sMoeE_ecXCWdcAQFoI7L2v2Qxak";
const redirect = encodeURIComponent(address + '/dashboard');
const redirectprofile = encodeURIComponent(address + '/saveprofile');

const redirectSUPPORT = encodeURIComponent(address + '/joinsupport');
const setup = JSON.parse(fs.readFileSync('.//Resources/setup.json'))

router.get('/', function (req, res) {
  var allguilds = bot.guilds.cache.size;
  var users1 = bot.users.cache.size;
  var channels1 = bot.channels.cache.size;
  res.render(__dirname + '/HTML/index.html', {
    servers: allguilds,
    users: users1,
    channels: channels1,
    address:address, status:`${address}/status`,
    version:setup.version
  })
});

router.get('/api', function (req, res) {
  res.send({"ERROR":"No section provided", "documentation":address + "/documentation/api"})
})

router.get('/changelogs', function (req, res) {
  res.render(path.join(__dirname + '/HTML/changelogs.html'), {
      address:address, 
      status:`${address}/status`
  });
});

router.get('/documentation', function (req, res) {
  res.render(path.join(__dirname + '/HTML/Docs/help.html'), {
      address:address, 
      status:`${address}/status`,
      prefix:setup.prefix
  });
});

router.get('/options', function (req, res) {
  try{
    id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    if(setup.botadmins.includes(id)) {adminmode=`<span></span><button id="admin" class="newButton" onclick="toggleadmin()">Toggle admin mode</button> <span style="color:white" id="adminMode">Admin mode is </span></span>`} else {adminmode=``}
  } catch{adminmode = ``}
  
  res.render(path.join(__dirname + '/HTML/options.html'), {
      address:address, 
      status:`${address}/status`,
      adminmode:adminmode
  });
});

router.get('/documentation/api', function (req, res) {
  res.render(path.join(__dirname + '/HTML/Docs/api.html'), {
      address:address, 
      status:`${address}/status`
  });
});

router.get('/join/success', (req, res, next) => {
  data = `<h2 style="color:white;text-align:center">Joined the <a href="https://discord.com/channels/732554558773133333">Support Server!</a> You may now close the tab</h2>`
  res.render(path.join(__dirname + '/HTML/custom.html'), {
      address:address, 
      status:`${address}/status`,
      data:data,
      title:"Support Server"
  });
});

router.get('/join/error', (req, res, next) => {
  data = `<h2 style="color:white;text-align:center">Error: ${req.query.e}</h2>`
  res.render(path.join(__dirname + '/HTML/custom.html'), {
      address:address, 
      status:`${address}/status`,
      data:data,
      title:"Support Server"
  });
});

router.get('/commands', function (req, res) {
  commands = JSON.parse(fs.readFileSync(`.//Resources/commands.json`))
  moderation = `<button style="border-top-right-radius:10px;border-top-left-radius:10px;" class="collapsible">Moderation</button><div class="content"><table><tr><th style="border-left:1px solid rgb(168, 168, 168);color:">Command</th><th>Aliases</th><th style="border-right:1px solid rgb(168, 168, 168);">Description</th></tr>`
  economy = `<button class="collapsible">Economy Games</button><div class="content"><table><tr><th style="border-left:1px solid rgb(168, 168, 168);color:">Command</th><th>Aliases</th><th style="border-right:1px solid rgb(168, 168, 168);">Description</th></tr>`
  economyo = `<button class="collapsible">Economy Opts</button><div class="content"><table><tr><th style="border-left:1px solid rgb(168, 168, 168);color:">Command</th><th>Aliases</th><th style="border-right:1px solid rgb(168, 168, 168);">Description</th></tr>`
  fun = `<button class="collapsible">Fun</button><div class="content"><table><tr><th style="border-left:1px solid rgb(168, 168, 168);color:">Command</th><th>Aliases</th><th style="border-right:1px solid rgb(168, 168, 168);">Description</th></tr>`
  misc = `<button style="border-bottom-right-radius:10px;border-bottom-left-radius:10px;" class="collapsible">Misc</button><div class="content"><table><tr><th style="border-left:1px solid rgb(168, 168, 168);color:">Command</th><th>Aliases</th><th style="border-right:1px solid rgb(168, 168, 168);">Description</th></tr>`
  for (item in commands["Moderation"]) {
    moderation = moderation.concat(`<tr><td style="border-left:1px solid rgb(168, 168, 168);">${commands["Moderation"][item].name}</td><td>${commands["Moderation"][item].aliases.join(", ")}</td><td style="border-right:1px solid rgb(168, 168, 168);">${commands["Moderation"][item].description}</td></tr>`)
  }
  for (item in commands["EconomyGames"]) {
    economy = economy.concat(`<tr><td style="border-left:1px solid rgb(168, 168, 168);">${commands["EconomyGames"][item].name}</td><td>${commands["EconomyGames"][item].aliases.join(", ")}</td><td style="border-right:1px solid rgb(168, 168, 168);">${commands["EconomyGames"][item].description}</td></tr>`)
  }
  for (item in commands["EconomyOpts"]) {
    economyo = economyo.concat(`<tr><td style="border-left:1px solid rgb(168, 168, 168);">${commands["EconomyOpts"][item].name}</td><td>${commands["EconomyOpts"][item].aliases.join(", ")}</td><td style="border-right:1px solid rgb(168, 168, 168);">${commands["EconomyOpts"][item].description}</td></tr>`)
  }
  for (item in commands["Fun"]) {
    fun = fun.concat(`<tr><td style="border-left:1px solid rgb(168, 168, 168);">${commands["Fun"][item].name}</td><td>${commands["Fun"][item].aliases.join(", ")}</td><td style="border-right:1px solid rgb(168, 168, 168);">${commands["Fun"][item].description}</td></tr>`)
  }
  for (item in commands["Misc"]) {
    misc = misc.concat(`<tr><td style="border-left:1px solid rgb(168, 168, 168);">${commands["Misc"][item].name}</td><td>${commands["Misc"][item].aliases.join(", ")}</td><td style="border-right:1px solid rgb(168, 168, 168);">${commands["Misc"][item].description}</td></tr>`)
  }
  moderation = moderation.concat(`</table></div>`)
  economy = economy.concat(`</table></div>`)
  economyo = economyo.concat(`</table></div>`)
  fun = fun.concat(`</table></div>`)
  misc = misc.concat(`</table></div>`)
  res.render(path.join(__dirname + '/HTML/commands.html'), {
      address:address, 
      status:`${address}/status`,
      data:moderation + economy + economyo + fun + misc
  });
});

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&prompt=none&redirect_uri=${redirect}`);
});

router.get('/profilelogin', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&prompt=none&redirect_uri=${redirectprofile}`);
});

router.get('/loginswitch', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get('/supportserver', function (req, res) {
  res.redirect(setup.server)
})

router.get('/invite', function (req, res) {
  res.redirect(setup.invite)
})


router.get('/supportserverswitch', function (req, res) {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=guilds.join&redirect_uri=${redirectSUPPORT}`)
})
const os = require('os')
router.get('/stats', function(req, res) {
  res.render(path.join(__dirname + '/HTML/stats.html'), {
    address:address, 
    status:`${address}/status`,
    servers:fs.readFileSync('./Databases/minute.json'),
    serversday:fs.readFileSync('./Databases/day.json'),
    stats_guilds:bot.guilds.cache.size,
    stats_users:bot.users.cache.size,
    title:"Stats",
    allmem:Math.round(os.totalmem()/1000)
});
})

router.get('/saveprofile', catchAsync(async (req, res) => {
  if (!req.query.code) {
    res.redirect("/")
  }
  else {
  const code = req.query.code;
  const data = oauth.dataprofile(CLIENT_ID, CLIENT_SECRET, code)

  params = oauth.encode(data)
  responses = await oauth.response(params)
  json = await responses.json()
  userinfo = await oauth.get_user_info(json)
  res.cookie('user', "5468631284719832746189768653" + userinfo.id + "5468631284719832746189768653", {maxAge: 31556952000})
  res.cookie('name', userinfo.username, {maxAge: 31556952000})
  res.cookie('avatar', userinfo.avatar, {maxAge: 31556952000})
  res.redirect('/p')
  }
}));

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

router.get('/joinsupport', async function (req, res) {
  const code = req.query.code;
  const data = oauth.joindata(CLIENT_ID, CLIENT_SECRET, code)

  params = oauth.encode(data)
  responses = await oauth.response(params)
  json1 = await responses.json()
  
  result = await oauth.join({
    token:setup.token,
    access_token:json1.access_token
  })
  if (await result == true) {
    res.redirect('/join/success')
  } else {res.redirect('/join/error?e=You%20are%20already%20in%20the%20support%20server%20or%20an%20error%20occured%20while%20trying%20to%20add%20you.%20%0A%3Cbr%3E%0ATry%20%3Ca%20style%3D%22color%3A%23c9c9c9%22%20href%3D%22https%3A%2F%2Fdiscord.gg%2FfDUs68p%22%3Ethe%20server%20invite%3C%2Fa%3E%20or%0A%3Cbr%3E%0ATry%20%3Ca%20style%3D%22color%3A%23c9c9c9%22%20href%3D%22%2Fsupportserverswitch%22%3Eanother%20account%3C%2Fa%3E')}
  
});

var testRoutes = require('./database');
const { bot } = require('../compass');

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
        } else {res.redirect('/login')}
    }
  } catch {
    res.redirect('/login')
  }
  if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id))) {admin = `<a class="h" href="${address}/admin">Admin</a></li>`} else {admin = ``}
  in1 = 0
  li = ""
  bot.guilds.cache.forEach((guild) => {
    try {
      if (guild.member(user.id)) {
        li = li.concat(`<div aria-label="${guild.name}" data-balloon-pos="right"><img onerror="this.src='https://i.ibb.co/Np9kNG9/noicon2.png'" class="listimg dasb" onclick="window.open('/app/${guild.id}', '_self')" id="dasb" src='${guild.iconURL()}'></div>`)
        in1 = 1
      }
    } catch {}
  })
  if (setup.botadmins.includes(id) && getAppCookies(req, res)['adminMode'] == 'on') {li = li.concat(`<div style='padding-top:60px;'></div><img class="listimg dasb" onclick="window.open('/admin/servers', '_self')" id="dasb" src='https://www.clker.com/cliparts/k/D/D/T/y/o/more-button-hi.png'>`)}
  li = li.concat(`<div style='padding-top:60px;'></div><img class="listimg dasb" onclick="window.open('https://discord.com/api/oauth2/authorize?client_id=732208102652379187&permissions=8&scope=bot')" id="dasb" src='https://i.ibb.co/dG0x5Ch/plus2.png'>`)
  avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
    res.render(__dirname + place, {
      servers: li,
      name: decodeURIComponent(getAppCookies(req, res)['name']),
      id: id,
      avatar: `<img class="avatar" id="output" src="${avatar}">`,
      address:address, 
      status:`${address}/status`,
      admin:admin
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