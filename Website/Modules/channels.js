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

var automatedRoutes = require('../automated');
const bodyParser = require('body-parser');
const e = require("express");
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

router.get('/app/:guildid/:channelid/block', (req, res, next) => {
  guild = bot.guilds.cache.get(req.params.guildid)
  channel = bot.channels.cache.get(req.params.channelid)
  id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
  member = functions.memberfromarg(guild, id)
  if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_CHANNELS")) {
    guild.channels.cache.forEach(channel1 => {
      if (channel1.type == "text" && channel1.id == req.params.channelid) {
        blocked = JSON.parse(fs.readFileSync('.//Databases/blocked.json'))
        blocked.channels[blocked.channels.length] = channel.id
        fs.writeFile("./Databases/blocked.json", JSON.stringify(blocked), function(err) {
            if (err) {}
        });
        return res.redirect(`${address}/app/${guild.id}/channels`)
      }
    })
    
  } else {return res.redirect(`${address}/app/${guild.id}/channels`)}

});

function removeAllElements(array, elem) {
    var index = array.indexOf(elem);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
    }
}

router.get('/app/:guildid/:channelid/unblock', (req, res, next) => {
    guild = bot.guilds.cache.get(req.params.guildid)
    channel = bot.channels.cache.get(req.params.channelid)
    id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    member = functions.memberfromarg(guild, id)
    if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_CHANNELS")) {
        guild.channels.cache.forEach(channel1 => {
          if (channel1.type == "text" && channel1.id == req.params.channelid) {
            blocked = JSON.parse(fs.readFileSync('.//Databases/blocked.json'))
            if (!blocked.channels.includes(channel.id)) {res.redirect(`${address}/app/${guild.id}/channels`)}
            removeAllElements(blocked.channels, channel.id)
            fs.writeFile("./Databases/blocked.json", JSON.stringify(blocked), function(err) {
                if (err) {}
            });
          }
        })
      return res.redirect(`${address}/app/${guild.id}/channels`)
    } else {return res.redirect(`${address}/app/${guild.id}/channels`)}
  
  });

router.get('/app/:guildid/channels', (req, res) => {
  if (req.params.guildid) {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    guild = bot.guilds.cache.get(req.params.guildid)
    member = functions.memberfromarg(guild, id)
    user = bot.users.cache.get(String(id))
    startup(guild, user)
    returnvalue = ""
    blocked = JSON.parse(fs.readFileSync('.//Databases/blocked.json'))
    guild.channels.cache.forEach(channel => {
        if (channel.type == "text") {
        disabled = ""
        if (!(getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) && !guild.member(user).hasPermission("MANAGE_GUILD")) {
          disabled = "disabled"
        }
        if (blocked.channels.includes(channel.id)) {
            returnvalue = returnvalue.concat(`<div class="members"><b>Channel:</b> #${channel.name}<span style="padding-left:30px;"> </span><button class="formbutton${disabled}" onclick="window.open('/app/${guild.id}/${channel.id}/unblock', '_self')" ${disabled}/>Unblock Channel</button></div><div style="padding:10px;"></div>`)
        } else {
            returnvalue = returnvalue.concat(`<div class="members"><b>Channel: </b>#${channel.name}<span style="padding-left:30px;"> </span><button class="formbutton${disabled}" onclick="window.open('/app/${guild.id}/${channel.id}/block', '_self')" ${disabled}/>Block Channel</button></div><div style="padding:10px;"></div>`)
        }
    }
    })
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
    if (setup.botadmins.includes(id) && getAppCookies(req, res)['adminMode'] == 'on') {li = li.concat(`<div style='padding-top:60px;'></div><img class="listimg dasb" onclick="window.open('/admin/servers', '_self')" id="dasb" src='https://www.clker.com/cliparts/k/D/D/T/y/o/more-button-hi.png'>`)}
  li = li.concat(`<div style='padding-top:60px;'></div><img class="listimg dasb" onclick="window.open('https://discord.com/api/oauth2/authorize?client_id=732208102652379187&permissions=8&scope=bot')" id="dasb" src='https://i.ibb.co/dG0x5Ch/plus2.png'>`)
    avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
    if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD")) {
      data = `<h3 style="color:white;text-align:center;">Channels for ${guild.name}</h3> <br> ${returnvalue}`
    } else {
      data = `<h3 style="color:white;text-align:center;">Channels for ${guild.name}</h3> <br> ${returnvalue}`
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
      
      channelsection:`<a class="sectionactive" href="${address}/app/${guild.id}/channels">Channels</a>`,
      prefixsection:`<a class="section" href="${address}/app/${guild.id}/prefix">Prefix</a>`,
codesection:`<a class="section" href="${address}/app/${guild.id}/codes">Codes</a>`,
      editor:`<a class="section" href="${address}/app/${guild.id}/editor">Editor</a>`
    })
  }
});



module.exports = router;