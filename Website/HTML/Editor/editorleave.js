const Discord = require('discord.js-light');

//const prefix = setup.prefix;
var fs = require('fs');

var dir = './Website/HTML/Editor/Guilds';


// Web


const express = require('express');
const app = express();
const router = express.Router();
const bot = require('../../../compass').bot
const setup = JSON.parse(fs.readFileSync('.//Resources/setup.json'))


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

app.engine('html', require('ejs').renderFile);

router.get('/app/:guildid/editor/leave', function (req, res) {
  id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    guild = bot.guilds.cache.get(req.params.guildid)
    user = bot.users.cache.get(String(id))
  if (!guild) {return res.send("invaluid guikdl")}
  in1 = 0
  li = ""
  bot.guilds.cache.forEach((guild) => {
    try {
      if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(user.id)) {
        if (guild.id == bot.guilds.cache.get(req.params.guildid).id) {style = "style='border-radius:10px'"} else {style=""}
        li = li.concat(`<div aria-label="${guild.name}" data-balloon-pos="right"><img onerror="this.src='https://i.ibb.co/Np9kNG9/noicon2.png'" class="listimg dasb" ${style} onclick="window.open('/app/${guild.id}', '_self')" id="dasb" src='${guild.iconURL()}'></div>`)
        in1 = 1
      }
    } catch {}
  })
  li = li.concat(`<div style='padding-top:60px;'></div><img class="listimg dasb" onclick="window.open('https://discord.com/api/oauth2/authorize?client_id=732208102652379187&permissions=8&scope=bot')" id="dasb" src='https://i.ibb.co/dG0x5Ch/plus2.png'>`)

  //JoinCHANNEL
  f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
  if (!f[req.params.guildid] || !f[req.params.guildid]["leave"]) {f[req.params.guildid] = {"leave":"false"}}
  displaychannel = f[req.params.guildid]["leave"]
  displaychannelid = f[req.params.guildid]["leave"]
  if (displaychannel != "false") {displaychannel = bot.channels.cache.get(displaychannel).name;readonly=""} else {if(!displaychannel) {displaychannel = "None";readonly="disabled='disabled'"} else{displaychannel = "None";readonly="disabled='disabled'"} };
  joinchannels = `<!--ignore--><select name="autorole" ${readonly} id="joinchannel_main"><option value="false">None</option>`
  guild.channels.cache.forEach(channel => {
    if (channel.type == "text") {
      if (displaychannelid == channel.id) {
        joinchannels = joinchannels.concat(`<option name="joinchannel" class='select' value="${channel.id}" selected>#${channel.name}</option>`)
      } else{
        joinchannels = joinchannels.concat(`<option name="joinchannel" class='select' value="${channel.id}">#${channel.name}</option>`)
      }
      
    }
  });joinchannels = joinchannels.concat("</select><!--ignore-->")


  avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
  if (fs.existsSync(dir + "/" + req.params.guildid + "/leave.html")){
    defaulthtml = fs.readFileSync(dir + "/" + req.params.guildid + "/leave.html", "utf8").split("{avatar}").join(user.displayAvatarURL())
  } else {defaulthtml = fs.readFileSync("./Website/HTML/Editor/Defaults/default.html", "utf8").split("{avatar}").join(user.displayAvatarURL()) }
  if (fs.existsSync(dir + "/" + req.params.guildid + "/leaveopts.html")){
    defaultopts = fs.readFileSync(dir + "/" + req.params.guildid + "/leaveopts.html", "utf8").split("<%- joinchannels %>").join(joinchannels)
  } else {defaultopts = fs.readFileSync("./Website/HTML/Editor/Defaults/defaultoptsleave.html", "utf8").split("<%- joinchannels %>").join(joinchannels) }
  if (!(getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) && !guild.member(user).hasPermission("MANAGE_GUILD")) {defaulthtml = "<h3 style='color:white'>You are missing manage server permissions to use the Editor</h3><div style='padding-bottom:1900px;'></div>";defaultopts = ""}
    res.render(__dirname + '/Defaults/editorleave.html', {guild:req.params.guildid, defaulthtml:defaulthtml, opts:defaultopts.replace("guildid", req.params.guildid), address:address,
    membersection:`<a class="section" href="${address}/app/${guild.id}/members">Members</a>`,
      worksection:`<a class="section" href="${address}/app/${guild.id}">Replies</a>`,
      optionsection:`<a class="section" href="${address}/app/${guild.id}/options">Economy opts</a>`,
      channelsection:`<a class="section" href="${address}/app/${guild.id}/channels">Channels</a>`,
      prefixsection:`<a class="section" href="${address}/app/${guild.id}/prefix">Prefix</a>`,
codesection:`<a class="section" href="${address}/app/${guild.id}/codes">Codes</a>`,
      editor:`<a class="sectionactive" href="${address}/app/${guild.id}/editor">Editor</a>`,
    address: address,
    status: `${address}/status`,
    servers: li,
    name: decodeURIComponent(getAppCookies(req, res)['name']),
    id: id,
    avatar: `<img class="avatar" id="output" src="${avatar}">`,
    guildicon: guild.iconURL() + "?size=1024",
    joinchannels:joinchannels
  })
})

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.post('/app/:guildid/render/leave', function (req, res) {
    if (!bot.guilds.cache.get(req.params.guildid)) {return res.send("ERROR - Invalid guild")}
    guild = bot.guilds.cache.get(req.params.guildid)
    id = req.body['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    user = bot.users.cache.get(String(id))
    if (!(getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) && !guild.member(user).hasPermission("MANAGE_GUILD")) {return res.redirect(address + "/app/" + req.params.guildid + "/editor/leave#main")}

    try{enabled = decodeURIComponent(req.body.enabled)
    channel = decodeURIComponent(req.body.channel)
    joinmessage = decodeURIComponent(req.body.joinmessage)
    html = decodeURIComponent(req.body.html)
    opts = decodeURIComponent(req.body.opts)}catch (err) {console.log(err)}

    f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
    if (!f[req.params.guildid]) {f[req.params.guildid] = {}}
    if (channel == "undefined" || channel == "None") {
      delete f[req.params.guildid]["leave"]
    } else {
      f[req.params.guildid]["leave"] = channel
      if (enabled == "false") {
        f[req.params.guildid]["leavemessage"] = "noimg" + joinmessage
      } else {f[req.params.guildid]["leavemessage"] = joinmessage
      }
      if (enabled == "false" && joinmessage == "false") {
        if (!f[req.params.guildid]) {f[req.params.guildid] = {}}
        delete f[req.params.guildid]["leave"]
      }
    }
    fs.writeFile("./Databases/messages.json", JSON.stringify(f), function(err) {if (err) {console.log(err)}});
  
  if (!fs.existsSync(dir + "/" + req.params.guildid)){
    fs.mkdirSync(dir + "/" + req.params.guildid);
  }
  fs.writeFileSync(dir + "/" + req.params.guildid + "/leave.html", html)
  fs.writeFileSync(dir + "/" + req.params.guildid + "/leaveopts.html", opts)
})

router.get('/app/:guildid/reset/leave', function (req, res) {
    if (!bot.guilds.cache.get(req.params.guildid)) {return res.send("ERROR - Invalid guild")}
    guild = bot.guilds.cache.get(req.params.guildid)
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    user = bot.users.cache.get(String(id))
    if (!(getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) && !guild.member(user).hasPermission("MANAGE_GUILD")) {return res.redirect(address + "/app/" + req.params.guildid + "/editor/leave#main")}
  if (!fs.existsSync(dir + "/" + req.params.guildid)){
    return res.redirect(address + "/app/" + req.params.guildid + "/editor/leave#main")
  }
  f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
  if (!f[req.params.guildid]) {f[req.params.guildid] = {}}
  delete f[req.params.guildid]["leave"]
  delete f[req.params.guildid]["leavemessage"]
  fs.writeFile("./Databases/messages.json", JSON.stringify(f), function(err) {if (err) {console.log(err)}});

  fs.unlinkSync(dir + "/" + req.params.guildid + "/leave.html")
  fs.unlinkSync(dir + "/" + req.params.guildid + "/leaveopts.html")
  try{fs.rmdirSync(dir + "/" + req.params.guildid)}catch{}
  res.redirect(address + "/app/" + req.params.guildid + "/editor/leave#main")
})

module.exports.router = router