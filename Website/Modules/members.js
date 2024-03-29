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

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.toString().toLowerCase().replace(new RegExp(`,`, 'g'), ``).replace(new RegExp(`k`, 'g'), `000`)}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.toString().toLowerCase().replace(new RegExp(`,`, 'g'), ``).replace(new RegExp(`k`, 'g'), `000`)}

var automatedRoutes = require('../automated');
const bodyParser = require('body-parser');
const e = require("express");
 user = require("../../Extras/balance");
app.use(bodyParser.urlencoded({
    extended: true
}));
bot = require('../../compass').bot
const setup = JSON.parse(fs.readFileSync('.//Resources/setup.json'))

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

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

router.get('/api/balance/:guildid/:memberid', (req, res, next) => {
    guild = bot.guilds.cache.get(req.params.guildid)
    member = bot.users.cache.get(req.params.memberid)
    try {member.username} catch {return res.send({"ERROR":"Invalid user"})}
    try {guild.name} catch {return res.send({"ERROR":"Invalid guild"})}
    startup(guild, member)
    try {
        score = sql.prepare(`SELECT * FROM balances${guild.id}${member.id} WHERE user = ?`).get(member.id).balance
        final = {"member":{"name":member.username, "id":member.id, "avatar_url":member.displayAvatarURL()}, "balance":score}
    } catch {
        final = {"member":{"name":member.username, "id":member.id, "avatar_url":member.displayAvatarURL()}, "balance":0}
    }
    return res.send(final)
})

router.post('/app/:guildid/:memberid/remove', (req, res, next) => {
    guild = bot.guilds.cache.get(req.params.guildid)
    user = bot.users.cache.get(req.params.memberid)
    id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    member = functions.memberfromarg(guild, id)
    if (req.body.balance.jn()=="") {return res.redirect(`${address}/app/${guild.id}/members`)}
    if (isNaN(req.body.balance.jn())) {return res.redirect(`${address}/app/${guild.id}/members`)}
    if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD") && !member.bot) {
        startup(guild, user)
        toadd = Math.floor(req.body.balance.jn())
        try {
            score = sql.prepare(`SELECT * FROM balances${guild.id}${user.id} WHERE user = ?`).get(user.id).balance
            sql.prepare(`INSERT OR REPLACE INTO balances${guild.id}${user.id} (user, balance) VALUES (?, ?);`).run(user.id, (score - toadd));
        }
        catch {
                sql.prepare(`INSERT OR REPLACE INTO balances${guild.id}${user.id} (user, balance) VALUES (?, ?);`).run(user.id, toadd);
        }
        score = sql.prepare(`SELECT * FROM balances${guild.id}${user.id} WHERE user = ?`).get(user.id).balance
        res.redirect(`${address}/app/${guild.id}/members`)
    } else {
        res.redirect(`${address}/app/${guild.id}/members`)
    }

});


router.post('/app/:guildid/:memberid/add', (req, res, next) => {
    guild = bot.guilds.cache.get(req.params.guildid)
    user = bot.users.cache.get(req.params.memberid)
    id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    member = functions.memberfromarg(guild, id)
    if (req.body.balance.jn()=="") {return res.redirect(`${address}/app/${guild.id}/members`)}
    if (isNaN(req.body.balance.jn())) {return res.redirect(`${address}/app/${guild.id}/members`)}
    if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD") && !member.bot) {
        startup(guild, user)
        toadd = Math.floor(req.body.balance.jn())
        try {
            score = sql.prepare(`SELECT * FROM balances${guild.id}${user.id} WHERE user = ?`).get(user.id).balance
            sql.prepare(`INSERT OR REPLACE INTO balances${guild.id}${user.id} (user, balance) VALUES (?, ?);`).run(user.id, (score + toadd));
        }
        catch {
                sql.prepare(`INSERT OR REPLACE INTO balances${guild.id}${user.id} (user, balance) VALUES (?, ?);`).run(user.id, toadd);
        }
        score = sql.prepare(`SELECT * FROM balances${guild.id}${user.id} WHERE user = ?`).get(user.id).balance
        res.redirect(`${address}/app/${guild.id}/members`)
    } else {
        res.redirect(`${address}/app/${guild.id}/members`)
    }
});

router.post('/app/:guildid/:memberid/set', (req, res, next) => {
    guild = bot.guilds.cache.get(req.params.guildid)
    user = bot.users.cache.get(req.params.memberid)
    id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    member = functions.memberfromarg(guild, id)
    if (req.body.balance.jn()=="") {return res.redirect(`${address}/app/${guild.id}/members`)}
    if (isNaN(req.body.balance.jn())) {return res.redirect(`${address}/app/${guild.id}/members`)}
    if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(member).hasPermission("MANAGE_GUILD") && !member.bot) {
        startup(guild, user)
        toadd = Math.floor(req.body.balance.jn())
        try {
            score = sql.prepare(`SELECT * FROM balances${guild.id}${user.id} WHERE user = ?`).get(user.id).balance
            sql.prepare(`INSERT OR REPLACE INTO balances${guild.id}${user.id} (user, balance) VALUES (?, ?);`).run(user.id, toadd);
        }
        catch {
                sql.prepare(`INSERT OR REPLACE INTO balances${guild.id}${user.id} (user, balance) VALUES (?, ?);`).run(user.id, toadd);
        }
        score = sql.prepare(`SELECT * FROM balances${guild.id}${user.id} WHERE user = ?`).get(user.id).balance
        res.redirect(`${address}/app/${guild.id}/members`)
    } else {
        res.redirect(`${address}/app/${guild.id}/members`)
    }
});

router.get('/app/:guildid/members', (req, res) => {
    if (req.params.guildid) {
        id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
        guild = bot.guilds.cache.get(req.params.guildid)
        member = functions.memberfromarg(guild, id)
        user = bot.users.cache.get(String(id))
        startup(guild, user)
        humans = ""
        bots = ""
        guild.members.cache.forEach(member => {
                disabled = ""
                if (!(getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) && !guild.member(user).hasPermission("MANAGE_GUILD") || member.user.bot) {
                    disabled = "disabled"
                }
                if (!member.user.bot) {
                        humans = humans.concat(`<div class="members"><img src='${member.user.displayAvatarURL()}' width='50px' height='50px' style='border-radius:50px;top:50px;'><b>Member: <span onmouseover="this.style.color='#9FA6B2'" aria-label="View ${member.user.username}'s profile" data-balloon-pos="up" onmouseout="this.style.color='white'" style="cursor:pointer;text-decoration:underline" onclick='window.open("${address}/p/${require('./profiles').checkUser(member.user.id)}/${guild.id}", "_self")'>${member.user.username}</span></b> - Balance: ${require('../../Extras/balance').user(guild, member.user).sep()}<span style="padding-left:30px;"> </span><form action="${member.id}/add" method="post"><input type="text" autocomplete="off" class="forminput${disabled}" name="balance" ${disabled}/><input type="submit" class="formbutton${disabled}" value="Add money" ${disabled}/></form><form action="${member.id}/remove" method="post"><input type="text" autocomplete="off" class="forminput${disabled}" name="balance" ${disabled}/><input type="submit" class="formbutton${disabled}" value="Remove money" ${disabled}/></form><form action="${member.id}/set" method="post"><input type="text" autocomplete="off" class="forminput${disabled}" name="balance" ${disabled}/><input type="submit" class="formbutton${disabled}" value="Set balance" ${disabled}/></form></div><div style="padding:10px;"></div>`)
                } else {
                    bots = bots.concat(`<div class="members"><img src='${member.user.displayAvatarURL()}' width='50px' height='50px' style='border-radius:50px;top:50px;'><b>Bot: ${member.user.username}</b> - Balance: ${require('../../Extras/balance').user(guild, member.user).sep()}<span style="padding-left:30px;"> </span><form action="${member.id}/add" method="get"><input type="text" autocomplete="off" class="forminput${disabled}" name="balance" ${disabled}/><input type="submit" class="formbutton${disabled}" value="Add money" ${disabled}/></form><form action="${member.id}/remove" method="get"><input type="text" autocomplete="off" class="forminput${disabled}" name="balance" ${disabled}/><input type="submit" class="formbutton${disabled}" value="Remove money" ${disabled}/></form><form action="${member.id}/set" method="get"><input type="text" autocomplete="off" class="forminput${disabled}" name="balance" ${disabled}/><input type="submit" class="formbutton${disabled}" value="Set balance" ${disabled}/></form></div><div style="padding:10px;"></div>`)
            }
        })
        returnvalue = humans + bots
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
            data = `<h3 style="color:white;text-align:center;">Members for ${guild.name}</h3> <br> ${returnvalue}`
        } else {
            data = `<h3 style="color:white;text-align:center;">Members for ${guild.name}</h3> <br> ${returnvalue}`
        }
        return res.render(path.join(__dirname, '../HTML/dashboardguild.html'), {
            servers: li,
            name: decodeURIComponent(getAppCookies(req, res)['name']),
            id: id,
            avatar: `<img class="avatar" id="output" src="${avatar}">`,
            address: address,
            status: `${address}/status`,
            data: data,
            membersection:`<a class="sectionactive" href="${address}/app/${guild.id}/members">Members</a>`,
            worksection:`<a class="section" href="${address}/app/${guild.id}">Replies</a>`,
            optionsection:`<a class="section" href="${address}/app/${guild.id}/options">Economy opts</a>`,
            channelsection:`<a class="section" href="${address}/app/${guild.id}/channels">Channels</a>`,
            prefixsection:`<a class="section" href="${address}/app/${guild.id}/prefix">Prefix</a>`,
codesection:`<a class="section" href="${address}/app/${guild.id}/codes">Codes</a>`,
            editor:`<a class="section" href="${address}/app/${guild.id}/editor">Editor</a>`
        })
    }
});



module.exports = router;