const Discord = require('discord.js');

//const prefix = setup.prefix;
var fs = require('fs');

var dir = './Website/HTML/Editor/Guilds';


// Web


const express = require('express');
const app = express();
const router = express.Router();
const bot = require('../../../unnamed').bot



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

router.get('/app/:guildid/editor/join', function (req, res) {
  id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    guild = bot.guilds.cache.get(req.params.guildid)
    user = bot.users.cache.get(String(id))
  if (!guild) {return res.send("invaluid guikdl")}
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

  //JoinCHANNEL
  f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
  if (!f[req.params.guildid] || !f[req.params.guildid]["join"]) {f[req.params.guildid] = {"join":"false"}}
  displaychannel = f[req.params.guildid]["join"]
  displaychannelid = f[req.params.guildid]["join"]
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
  if (fs.existsSync(dir + "/" + req.params.guildid + "/welcome.html")){
    defaulthtml = fs.readFileSync(dir + "/" + req.params.guildid + "/welcome.html", "utf8").split("{avatar}").join(user.displayAvatarURL())
  } else {defaulthtml = fs.readFileSync("./Website/HTML/Editor/Defaults/default.html", "utf8").split("{avatar}").join(user.displayAvatarURL()) }
  if (fs.existsSync(dir + "/" + req.params.guildid + "/welcomeopts.html")){
    defaultopts = fs.readFileSync(dir + "/" + req.params.guildid + "/welcomeopts.html", "utf8").split("<%- joinchannels %>").join(joinchannels)
  } else {defaultopts = fs.readFileSync("./Website/HTML/Editor/Defaults/defaultopts.html", "utf8").split("<%- joinchannels %>").join(joinchannels) }
    res.render(__dirname + '/Defaults/editor.html', {guild:req.params.guildid, defaulthtml:defaulthtml, opts:defaultopts.replace("guildid", req.params.guildid), address:address,
    membersection:`<a class="section" href="${address}/app/${guild.id}/members">Members</a>`,
    worksection:`<a class="section" href="${address}/app/${guild.id}">Work replies</a>`,
    channelsection:`<a class="section" href="${address}/app/${guild.id}/channels">Channels</a>`,
    prefixsection:`<a class="section" href="${address}/app/${guild.id}/prefix">Prefix</a>`,
    editor:`<a class="sectionactive" href="${address}/app/${guild.id}/editor/join">JM Editor</a>`,
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

router.get('/app/:guildid/editor/render/join', function (req, res) {
    if (!bot.guilds.cache.get(req.params.guildid)) {return res.send("invaluid guikdl")}
  if (req.query.enabled == "true") {
    
    f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
    if (!f[req.params.guildid]) {f[req.params.guildid] = {}}
    if (req.query.channel == "undefined" || req.query.channel == "None") {
      delete f[req.params.guildid]["join"]
    } else {
      f[req.params.guildid]["join"] = req.query.channel
    }
    fs.writeFile("./Databases/messages.json", JSON.stringify(f), function(err) {if (err) {console.log(err)}});
  } else {
    f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
    if (!f[req.params.guildid]) {f[req.params.guildid] = {}}
    delete f[req.params.guildid]["join"]
    fs.writeFile("./Databases/messages.json", JSON.stringify(f), function(err) {if (err) {console.log(err)}});
  }
  if (!fs.existsSync(dir + "/" + req.params.guildid)){
    fs.mkdirSync(dir + "/" + req.params.guildid);
  }
  fs.writeFileSync(dir + "/" + req.params.guildid + "/welcome.html", req.query.html)
  fs.writeFileSync(dir + "/" + req.params.guildid + "/welcomeopts.html", req.query.opts)
  res.redirect(address + "/app/" + req.params.guildid + "/editor/join#main")
})

router.get('/app/:guildid/reset/join', function (req, res) {
    if (!bot.guilds.cache.get(req.params.guildid)) {return res.send("invaluid guikdl")}
  if (!fs.existsSync(dir + "/" + req.params.guildid)){
    return res.redirect(address + "/app/" + req.params.guildid + "/editor/join#main")
  }
  f = JSON.parse(fs.readFileSync('.//Databases/messages.json'))
  if (!f[req.params.guildid]) {f[req.params.guildid] = {}}
  delete f[req.params.guildid]["join"]
  fs.writeFile("./Databases/messages.json", JSON.stringify(f), function(err) {if (err) {console.log(err)}});

  fs.unlinkSync(dir + "/" + req.params.guildid + "/welcome.html")
  fs.unlinkSync(dir + "/" + req.params.guildid + "/welcomeopts.html")
  fs.rmdirSync(dir + "/" + req.params.guildid)
  res.redirect(address + "/app/" + req.params.guildid + "/editor/join#main")
})

module.exports.router = router