const Discord = require("discord.js-light");
const SQLite = require("better-sqlite3");
const path = require('path')
const sql = new SQLite('./Databases/balances.sqlite');
const functions = require('../../functions')
var express = require('express'),
  router = express.Router();
const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const fs = require('fs')

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.split(",").join("")}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.split(",").join("")}

const codes = require('../../Commands/codes')

var automatedRoutes = require('../automated');
const bodyParser = require('body-parser');
const e = require("express");
 user = require("../../Extras/balance");
app.use(bodyParser.urlencoded({
  extended: true
}));
bot = require('../../compass').bot
const setup = JSON.parse(fs.readFileSync('.//Resources/setup.json'))

function contents() {
  return fs.readFileSync('.//Resources/workreplies.json')
}

function startup(server, member) {
  require('../../Commands/databasesetup').startup(server, member)
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

function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str) && !isNaN(parseFloat(str)) 
  }

router.get('/app/:guildid/deleteCode/:code', (req, res) => {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    guild = bot.guilds.cache.get(req.params.guildid)
    if (!(getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) && !guild.member(member).hasPermission("MANAGE_GUILD")) {return res.redirect(`/app/${guild.id}`)}
    code = req.params.code
    try{codes.deleteCode(guild, code)}catch{}
    res.redirect(`/app/${guild.id}/codes`)
})

router.get('/app/:guildid/generateCode', (req, res) => {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    guild = bot.guilds.cache.get(req.params.guildid)
    if (!(getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) && !guild.member(member).hasPermission("MANAGE_GUILD")) {return res.redirect(`/app/${guild.id}/codes`)}
    value = req.query.value
    if (!isNumeric(value.jn())) {return res.redirect(`/app/${guild.id}/codes`)}
    try{codes.generateServerCode(guild, value.jn())}catch(err){console.log(err)}
    res.redirect(`/app/${guild.id}/codes`)
})


router.get('/app/:guildid/codes', (req, res) => {
  if (req.params.guildid) {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    guild = bot.guilds.cache.get(req.params.guildid)
    member = functions.memberfromarg(guild, id)
    user = bot.users.cache.get(String(id))
    startup(guild, user)
    final = ``
    guildCodes = codes.getCodes(guild)
    for (code in guildCodes) {
        if (!(getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) && !guild.member(user).hasPermission("MANAGE_GUILD")) {
            disabled = "disabled"
        } else {disabled = ``}
        if (disabled == 'disabled') {final = final.concat(`<div class="members" id="code${code}"><b>Code: [missing perms]</b> - Value: ${guildCodes[code].sep()}<span style="padding-left:30px;"> <button class="formbutton${disabled}" onclick="window.open('${address}/app/${guild.id}/deleteCode/${code}', '_self')" ${disabled}>Delete code</button></span></div><div style="padding:10px;"></div>`)}
        else {final = final.concat(`<div class="members" id="code${code}"><b>Code: ${code}</b> - Value: ${guildCodes[code].sep()}<span style="padding-left:30px;"> <button class="formbutton${disabled}" onclick="window.open('${address}/app/${guild.id}/deleteCode/${code}', '_self')" ${disabled}>Delete code</button></span></div><div style="padding:10px;"></div>`)}
    }
    in1 = 0
    returnvalue = final
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
    avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
    if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
        data = `<div style="color:white"><h3 style="color:white;text-align:center;">Codes for  ${guild.name}</h3> <br> <center>Generate code <form action="${address}/app/${guild.id}/generateCode" method="get"><input type="text" class="forminput" name="value" /><input type="submit" class="formbutton" value="Code value"/></form></center></div> <br> ${returnvalue}`
    } else {
        data = `<div style="color:white"><h3 style="color:white;text-align:center;">Codes for ${guild.name}</h3> <br> <center>Generate code <form method="get"><input type="text" class="forminputdisabled" name="value" disabled/><input type="submit" class="formbuttondisabled" value="Code value (missing permissions)" disabled/></form></center></div> <br> ${returnvalue}`
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
      optionsection:`<a class="section" href="${address}/app/${guild.id}/options">Economy opts</a>`,
      channelsection:`<a class="section" href="${address}/app/${guild.id}/channels">Channels</a>`,
      prefixsection:`<a class="section" href="${address}/app/${guild.id}/prefix">Prefix</a>`,
      codesection:`<a class="sectionactive" href="${address}/app/${guild.id}/codes">Codes</a>`,
      editor:`<a class="section" href="${address}/app/${guild.id}/editor">Editor</a>`
    })
  }
});



module.exports = router;