const Discord = require("discord.js-light");
const SQLite = require("better-sqlite3");
const path = require('path')
const sql = new SQLite('./Databases/balances.sqlite');
const fetch = require("node-fetch");
const functions = require('../../functions')
var express = require('express'),
    router = express.Router();
const app = express()

String.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; String.prototype.jn = function () {return this.toString().replace(new RegExp(`,`, 'g'), ``)}
Number.prototype.sep = function() {return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}; Number.prototype.jn = function () {return this.toString().replace(new RegExp(`,`, 'g'), ``)}

const rs = require('../../Resources/rs')
const codes = require('../../Commands/codes')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const fs = require('fs');

const setup = JSON.parse(fs.readFileSync('.//Resources/setup.json'))

bot = require('../../compass').bot

const getAppCookies = (req, res) => {
    try {
        const rawCookies = req.headers.cookie.split('; ');

        const parsedCookies = {};
        rawCookies.forEach(rawCookie => {
            const parsedCookie = rawCookie.split('=');
            parsedCookies[parsedCookie[0]] = parsedCookie[1];
        });
        return parsedCookies;
    } catch (err){
        res.redirect('/login')
    }
};

const getAppCookies2 = (req, res) => {
    try {
        const rawCookies = req.headers.cookie.split('; ');

        const parsedCookies = {};
        rawCookies.forEach(rawCookie => {
            const parsedCookie = rawCookie.split('=');
            parsedCookies[parsedCookie[0]] = parsedCookie[1];
        });
        return parsedCookies;
    } catch (err){
        return undefined
    }
};

const domain = JSON.parse(fs.readFileSync('./Resources/website.json')).domain
const address = JSON.parse(fs.readFileSync('./Resources/website.json')).address
const domainall = JSON.parse(fs.readFileSync('./Resources/website.json')).domainall

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());


router.post('/p/:userid/edit/url', function (req, res) {
    profiles = JSON.parse(fs.readFileSync('./Databases/profiles.json'))
    userid = checkUser(encodeURIComponent(req.params.userid))
    if (userid in profiles) {user = profiles[userid].url} else {user = userid}
    url = req.body.url
    if (getProfiles().includes(url)) {return res.send('Taken URL')}
    if (url.split(" ").join("") == `` || url > 20) {
        res.send('Invalid URL')
    }
    else {
        finalProfile = {}
        if (profiles[userid]) {profiles[url.replace(address + "/p/", "")] = profiles[userid];delete profiles[userid];}
        else {profiles[url.replace(address + "/p/", "")] = {url:user}}
        fs.writeFileSync('./Databases/profiles.json', JSON.stringify(profiles))
        res.send('Done')
    }
})

router.post('/p/:userid/edit/description', function (req, res) {
    profiles = JSON.parse(fs.readFileSync('./Databases/profiles.json'))
    userid = checkUser(encodeURIComponent(req.params.userid))
    if (userid in profiles) {user = profiles[userid].url} else {user = userid}
    description = req.body.description
    if (description > 50) {
        res.send('Invalid Desc')
    }
    else {
        if (profiles[userid]) {profiles[userid].description = description}
        else {profiles[userid] = {description:description}}
        fs.writeFileSync('./Databases/profiles.json', JSON.stringify(profiles))
        res.send(description)
    }
})

router.get('/p/:userid/edit/setBadges', (req, res) => {
    profiles = JSON.parse(fs.readFileSync('./Databases/profiles.json'))
    userid = checkUser(encodeURIComponent(req.params.userid))
    badges = req.query.badges
    if (userid in profiles) {user = profiles[userid].url;description=profiles[userid].description} else {user = userid;description=``}
    try{id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")}catch{id=undefined}
    if (!(getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id))) {return res.redirect(address + `/p/${user}/edit`)}
    if (profiles[userid]) {profiles[userid].badges = badges.split(",");}
    else {profiles[userid] = {url:userid, badges:badges.split(",")}}
    if (badges.split(",").join("") == ``) {delete profiles[userid].badges}
    fs.writeFileSync('./Databases/profiles.json', JSON.stringify(profiles))
    return res.redirect(address + `/p/${userid}/edit`)
});

function getProfiles() {
    profiles = JSON.parse(fs.readFileSync('./Databases/profiles.json'))
    arr =[];for (profile in profiles) {arr.push(profile)}
    return arr
}

function getBadgeString(user) {
    profiles = JSON.parse(fs.readFileSync('./Databases/profiles.json'))
    if (profiles[user])
        if (profiles[user]["badges"]) 
            return profiles[user].badges.join(" ")
                .replace(`owner`, `<span aria-label="Bot Owner" data-balloon-pos="up" style="cursor:auto" ><i class="fa fa-user" aria-hidden="true" style="width:25px;display: inline-block;height:25px;text-align:center;color:white;background-color:#DAA520;border-radius:30px;border:2px solid white"></i></span>`)
                .replace(`verified`, `<span aria-label="Verified Profile" data-balloon-pos="up" style="cursor:auto" ><i class="fa fa-check" aria-hidden="true" style="display: inline-block;width:25px;height:25px;text-align:center;color:white;background-color:#03b1fc;border-radius:30px;border:2px solid white"></i></span>`)
                .replace(`admin`, `<span aria-label="Bot Administrator" data-balloon-pos="up" style="cursor:auto" ><i class="fa fa-wrench" aria-hidden="true" style="display: inline-block;width:25px;height:25px;text-align:center;color:white;background-color:limegreen;border-radius:30px;border:2px solid white"></i></span>`)
    return ""
}

function getBadgeStringArray(user) {
    profiles = JSON.parse(fs.readFileSync('./Databases/profiles.json'))
    if (profiles[user])
        if (profiles[user]["badges"]) 
            return profiles[user].badges
    return []
}

function checkUser (userid) {
    profiles = JSON.parse(fs.readFileSync('./Databases/profiles.json'))
    for (profile_ in profiles) {if (profile_ == userid || profiles[profile_].url == userid) return profile_} 
    return userid
}

router.get('/profilesJSON', (req, res) => {
    res.send(getProfiles())
})

router.get('/p/:userid/edit', (req, res) => {
    profiles = JSON.parse(fs.readFileSync('./Databases/profiles.json'))
    userid = checkUser(encodeURIComponent(req.params.userid))
    if (userid in profiles) {user = profiles[userid].url;description=profiles[userid].description} else {user = userid;description=``}
    try{bot.users.cache.get(user).username}catch{return res.render(path.join(__dirname, '../HTML/Profiles/profileError.html'), {error:"Could not find that user!",address: address,status: `${address}/status`,})}
    user = bot.users.cache.get(user)
    avatar = user.displayAvatarURL() + '?size=1024'
    try{id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")}catch{id=undefined}
    if (!(getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) && user.id != id) {return res.redirect(`${address}/p/${userid}`)}
    servers = 0
    fullBalance = 0
    for (item of sql.prepare(`SELECT * from sqlite_master where type='table'`).iterate()) {
        doit=false
        try{if (bot.guilds.cache.get(item["name"].replace(user.id, "").replace("balances", "")).member(user.id)) {doit=true}}catch{}
        if (item["name"].includes(user.id) && doit==true) {
            try {balance = sql.prepare(`SELECT * FROM ${item["name"]} WHERE user = ?`).get(user.id).balance} catch {balance = 0}
            try {balanceBank = sql.prepare(`SELECT * FROM ${item["name"]} WHERE user = ?`).get("bank" + user.id).balance} catch {balanceBank = 0}
            fullBalance += balance;
            fullBalance+=balanceBank;
        }
    }
    if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id))) {setBadges = `<form action="${address}/p/${userid}/edit/setBadges" method="get"><input type="text" autocomplete="off" class="forminput" value="${getBadgeStringArray(userid).join(",")}" name="badges"><input type="submit" class="formbutton" value="Set badges"></form>`}
    else {setBadges = ``}
    bot.guilds.cache.forEach((guild) => {if (guild.member(user.id)) {servers++}})
    grade = generateGrade(user, userid)
    return res.render(path.join(__dirname, '../HTML/Profiles/profileEdit.html'), {
        name: decodeURIComponent(getAppCookies(req, res)['name']),
        id: id,
        avatarURL: avatar,
        address: address,
        status: `${address}/status`,
        username:user.username,
        tag:user.tag.split("#")[1],
        mutualServers:servers,
        fullBalance:fullBalance.sep(),
        grade:`<span style="color:${grade.color}">${grade.letter} (${grade.number})</span>`,
        badges:getBadgeString(userid),
        setBadges:setBadges
    })
});

function generateGrade(user, userid) {
    grade = 0
    gradeMore = {}
    issueJSON = JSON.parse(fs.readFileSync('./Databases/issues.json')) 
    profileJSON = JSON.parse(fs.readFileSync('./Databases/profiles.json')) 
    suggestionJSON = JSON.parse(fs.readFileSync('./Databases/suggestions.json')) 
    for (suggestion of suggestionJSON) {if (suggestion["user"] == user.id) {grade+=0.5} }
    for (issue of issueJSON) {if (issue["user"] == user.id) {grade+=0.5} }
    bot.guilds.cache.forEach((guild) => {if (guild.member(user.id)) {
        bal = require('../../Extras/balance').user(guild, user)
        if (bal > 1000000) {grade+=1.5} 
        else if (bal > 100000) {grade+=1} 
        else if (bal > 10000) {grade+=0.4} 
        else if (bal > 5000) {grade+=0.2} 
        grade+=0.5
    }})
    if (getBadgeStringArray(userid).length >= 1) {grade+=1;}
    if (getBadgeStringArray(userid).length >= 2) {grade+=1.5;}
    if (grade > 9) {gradeMore = {color:'', letter:'', number:grade}}
    else if (grade > 8) {gradeMore = {color:'#0f8200', letter:'A++', number:grade}}
    else if (grade > 7) {gradeMore = {color:'#17c700', letter:'A+', number:grade}}
    else if (grade > 6) {gradeMore = {color:'#7bc700', letter:'A', number:grade}}
    else if (grade > 5) {gradeMore = {color:'#81cc00', letter:'A-', number:grade}}
    else if (grade > 4) {gradeMore = {color:'#8bcc00', letter:'B+', number:grade}}
    else if (grade > 3) {gradeMore = {color:'#9ccc00', letter:'B', number:grade}}
    else if (grade > 2) {gradeMore = {color:'#b4cc00', letter:'B', number:grade}}
    else if (grade > 1) {gradeMore = {color:'#eba500', letter:'C', number:grade}}
    else if (grade > 0) {gradeMore = {color:'#eb0000', letter:'F', number:grade}}
    return gradeMore
}

function generateGuildGrade(guild, user, userid) {
    grade = 0
    gradeMore = {}
    issueJSON = JSON.parse(fs.readFileSync('./Databases/issues.json')) 
    profileJSON = JSON.parse(fs.readFileSync('./Databases/profiles.json')) 
    suggestionJSON = JSON.parse(fs.readFileSync('./Databases/suggestions.json')) 
    for (suggestion of suggestionJSON) {if (suggestion["user"] == user.id) {grade+=0.1} }
    for (issue of issueJSON) {if (issue["user"] == user.id) {grade+=0.1} }

    bal = require('../../Extras/balance').user(guild, user)
    if (bal > 1000000) {grade+=5} 
    else if (bal > 100000) {grade+=4} 
    else if (bal > 10000) {grade+=3} 
    else if (bal > 5000) {grade+=2} 
    else if (bal > 1000) {grade+=1} 
    else if (bal > 500) {grade+=0.5} 
    grade+=0.5

    if (getBadgeStringArray(userid).length >= 1) {grade+=0.5;}
    if (getBadgeStringArray(userid).length >= 2) {grade+=1;}
    if (grade > 9) {gradeMore = {color:'', letter:'', number:grade}}
    else if (grade > 8) {gradeMore = {color:'#0f8200', letter:'A++', number:grade}}
    else if (grade > 7) {gradeMore = {color:'#17c700', letter:'A+', number:grade}}
    else if (grade > 6) {gradeMore = {color:'#7bc700', letter:'A', number:grade}}
    else if (grade > 5) {gradeMore = {color:'#81cc00', letter:'A-', number:grade}}
    else if (grade > 4) {gradeMore = {color:'#8bcc00', letter:'B+', number:grade}}
    else if (grade > 3) {gradeMore = {color:'#9ccc00', letter:'B', number:grade}}
    else if (grade > 2) {gradeMore = {color:'#b4cc00', letter:'B', number:grade}}
    else if (grade > 1) {gradeMore = {color:'#eba500', letter:'C', number:grade}}
    else if (grade > 0) {gradeMore = {color:'#eb0000', letter:'F', number:grade}}
    return gradeMore
}

router.get('/p/:userid/:guildid', (req, res) => {
    profiles = JSON.parse(fs.readFileSync('./Databases/profiles.json'))
    userid = checkUser(encodeURIComponent(req.params.userid))
    try {guild = bot.guilds.cache.get(req.params.guildid)} catch{return res.redirect(address + '/p/' + req.params.userid)}
    if (userid in profiles) {user = profiles[userid].url;description=profiles[userid].description} else {user = userid;description=``}
    try{bot.users.cache.get(user).username}catch{return res.render(path.join(__dirname, '../HTML/Profiles/profileError.html'), {error:"Could not find that user!",address: address,status: `${address}/status`,})}
    user = bot.users.cache.get(user)
    if (!guild.member(user)) {return res.redirect(address + '/p/' + req.params.userid)}
    avatar = user.displayAvatarURL() + '?size=1024'
    try{id = getAppCookies2(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")}catch{id=undefined}
    loggedUser = bot.users.cache.get(id)
    fullBalance = 0
    try{
        fullBalance += sql.prepare(`SELECT * FROM balances${guild.id}${user.id} WHERE user = ?`).get(user.id).balance
    } catch {fullBalance += 0}
    try{
        fullBalance += sql.prepare(`SELECT * FROM balances${guild.id}${user.id} WHERE user = ?`).get("bank" + user.id).balance
    } catch {fullBalance += 0}
    if ((getAppCookies(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || user.id == id) {editButton = `<i class="fa fa-pencil" aria-hidden="true" onmouseover="this.style.color='white'" onmouseout="this.style.color='#9FA6B2'" onclick="window.open('${address}/p/${userid}/edit', '_self')" style="margin-right:30px;margin-top:30px;cursor:pointer;color:#9FA6B2;float:right"></i>`} else {editButton=``}
    grade = generateGuildGrade(guild, user, userid)
    serverlist = ``
    tag='____'
    bot.guilds.cache.forEach((guild) => {if (guild.member(user.id)) {
        if((getAppCookies2(req, res)['adminMode'] == 'on' && setup.botadmins.includes(id)) || guild.member(loggedUser)) {
            tag=user.tag.split("#")[1]
            serverlist = serverlist + `<div aria-label="Select Server" data-balloon-pos="down" onclick="window.open('/p/${userid}/${guild.id}', '_self')" onmouseover="this.style.backgroundColor='#2C2F33'" onmouseout="this.style.backgroundColor=''" style="border-radius:10px"><span style="display: inline-block;"><img onerror="this.src='https://i.ibb.co/Np9kNG9/noicon2.png'" class="listimg dasb" src='${guild.iconURL()}'></span><span style="display: inline-block;vertical-align:top;margin-left:5px;margin-top:10px;color:white">${guild.name}</span></div>`
        } 
    }});
    if (serverlist == `` && !loggedUser) {serverlist = `<p style="color:white;padding:20px">You must be <a href='/login'>logged in</a> and in a mutual server with ${user.username} to see ${user.username}'s servers!</p>`} else if (serverlist == ``) {serverlist = `<p style="color:white;padding:20px">You aren't in any mutual servers with ${user.username}</p>`}
    return res.render(path.join(__dirname, '../HTML/Profiles/profileGuild.html'), {
        name: decodeURIComponent(getAppCookies(req, res)['name']),
        tag:tag,
        id: id,
        avatarURL: avatar,
        address: address,
        status: `${address}/status`,
        username:user.username,
        tag:user.tag.split("#")[1],
        fullBalance:fullBalance.sep(),
        grade:`<span style="color:${grade.color}">${grade.letter} (${grade.number})</span>`,
        editButton:editButton,
        description:description,
        badges:getBadgeString(userid),
        guildIconURL:guild.iconURL(),
        guildName:guild.name,
        userid:userid,
        serverlist:serverlist
    })
});

router.get('/p/:userid', (req, res) => {
    profiles = JSON.parse(fs.readFileSync('./Databases/profiles.json'))
    userid = checkUser(encodeURIComponent(req.params.userid))
    if (userid in profiles) {user = profiles[userid].url;description=profiles[userid].description} else {user = userid;description=``}
    try{bot.users.cache.get(user).username}catch{return res.render(path.join(__dirname, '../HTML/Profiles/profileError.html'), {error:"Could not find that user!",address: address,status: `${address}/status`,})}
    user = bot.users.cache.get(user)
    avatar = user.displayAvatarURL() + '?size=1024'
    try{id = getAppCookies2(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")}catch{id=undefined}
    loggedUser = bot.users.cache.get(id)
    servers = 0
    fullBalance = 0
    for (item of sql.prepare(`SELECT * from sqlite_master where type='table'`).iterate()) {
        doit=false
        try{if (bot.guilds.cache.get(item["name"].replace(user.id, "").replace("balances", "")).member(user.id)) {doit=true}}catch{}
        if (item["name"].includes(user.id) && doit==true) {
            try {balance = sql.prepare(`SELECT * FROM ${item["name"]} WHERE user = ?`).get(user.id).balance} catch {balance = 0}
            try {balanceBank = sql.prepare(`SELECT * FROM ${item["name"]} WHERE user = ?`).get("bank" + user.id).balance} catch {balanceBank = 0}
            fullBalance += balance;
            fullBalance+=balanceBank;
        }
    }
    tag='____'
    serverlist = ``
    try{adminMode = getAppCookies2(req, res)['adminMode']} catch{adminMode = 'off'}

    try{if ((adminMode == 'on' && setup.botadmins.includes(id)) || user.id == id) {editButton = `<i class="fa fa-pencil" aria-hidden="true" onmouseover="this.style.color='white'" onmouseout="this.style.color='#9FA6B2'" onclick="window.open('${address}/p/${userid}/edit', '_self')" style="margin-right:30px;margin-top:30px;cursor:pointer;color:#9FA6B2;float:right"></i>`} else {editButton=``}}catch{editButton=``}
    bot.guilds.cache.forEach((guild) => {if (guild.member(user.id)) {
        servers++;if((adminMode == 'on' && setup.botadmins.includes(id)) || guild.member(loggedUser)) {
            tag=user.tag.split("#")[1]
            serverlist = serverlist + `<div aria-label="Select Server" data-balloon-pos="down" onclick="window.open('/p/${userid}/${guild.id}', '_self')" onmouseover="this.style.backgroundColor='#2C2F33'" onmouseout="this.style.backgroundColor=''" style="border-radius:10px"><span style="display: inline-block;"><img onerror="this.src='https://i.ibb.co/Np9kNG9/noicon2.png'" class="listimg dasb" src='${guild.iconURL()}'></span><span style="display: inline-block;vertical-align:top;margin-left:5px;margin-top:10px;color:white">${guild.name}</span></div>`
        } 
    }});
    if (serverlist == `` && !loggedUser) {serverlist = `<p style="color:white;padding:20px">You must be <a href='/login'>logged in</a> and in a mutual server with ${user.username} to see ${user.username}'s servers!</p>`} else if (serverlist == ``) {serverlist = `<p style="color:white;padding:20px">You aren't in any mutual servers with ${user.username}</p>`}
    
    grade = generateGrade(user, userid)
    try {username = getAppCookies2(req, res)['name']} catch {username = 'None'}
    return res.render(path.join(__dirname, '../HTML/Profiles/profile.html'), {
        name: decodeURIComponent(username),
        id: id,
        avatarURL: avatar,
        address: address,
        status: `${address}/status`,
        username:user.username,
        tag:tag,
        mutualServers:servers,
        fullBalance:fullBalance.sep(),
        grade:`<span style="color:${grade.color}">${grade.letter} (${grade.number})</span>`,
        editButton:editButton,
        description:description,
        badges:getBadgeString(userid),
        serverlist:serverlist
    })
});

router.get('/p', (req, res) => {
    profiles = JSON.parse(fs.readFileSync('./Databases/profiles.json'))
    try{id = getAppCookies2(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")}catch{id=undefined}
    var shuffled = bot.users.cache.array().sort(function(){return .5 - Math.random()});
    var selected=shuffled.slice(0,50);
    randomIDS = [id]
    for (user_ of selected) {if (!user_.bot && user_.id != id) randomIDS.push(user_.id)}
    data = ``

    data = data + `<table width="100%" height="350px"><tr>`;counter=0

    for (id_ of randomIDS) {
        if (counter == 4) {data = data + `</tr></table><table width="100%" height="350px"><tr>`;counter=0}
        try{user = bot.users.cache.get(id_)
            userid = checkUser(encodeURIComponent(user.id))
            fullBalance = 0
            for (item of sql.prepare(`SELECT * from sqlite_master where type='table'`).iterate()) {
                doit=false;
                try{if (bot.guilds.cache.get(item["name"].replace(user.id, "").replace("balances", "")).member(user.id)) {doit=true}}catch{}
                if (item["name"].includes(user.id) && doit==true) {
                    try {balance = sql.prepare(`SELECT * FROM ${item["name"]} WHERE user = ?`).get(user.id).balance} catch {balance = 0}
                    try {balanceBank = sql.prepare(`SELECT * FROM ${item["name"]} WHERE user = ?`).get("bank" + user.id).balance} catch {balanceBank = 0}
                    fullBalance += balance;
                    fullBalance+=balanceBank;
                }
            }
            if (fullBalance>5) {
                data+=`<td style="padding:5px;" width="${functions.int(13,30)}%"><span class="profileoption" style="float:top;cursor:pointer;height:90%;width:90%;margin-left:5%" onclick="window.open('/p/${checkUser(user.id)}', '_self')">
                <div class="profileoptionimage" style="background-position:center;min-height:60%;background-image: url(${user.displayAvatarURL() + '?size=1024'});background-size:100%;"><br></div>
                    <center>
                        <span style="color:white;display: inline-block;vertical-align:top;padding-top:10px">${user.username}</span>
                        <span style="display: inline-block;vertical-align:top;padding:4px 0px 5px 0px">${getBadgeString(userid).split(`style="cursor:auto"`).join(``)}
                        </span>
                    </center>
                </span>
            </span></td>`;counter++;
            }
        } catch{}
    }
    data = data + `</tr></table>`
    
    if (id!=undefined) {avatar=`<img class="avatar" id="output" src="https://cdn.discordapp.com/avatars/${id}/${getAppCookies2(req, res)['avatar']}.png?size=1024">`;name = decodeURIComponent(getAppCookies(req, res)['name'])} else {avatar=`<p>NoAv</p>`;name = "None"}
    return res.render(path.join(__dirname, '../HTML/Profiles/profiles.html'), {
        name: name,
        avatar:avatar,
        id: id,
        address: address,
        status: `${address}/status`,
        table:data
    })
});

module.exports = router;
module.exports.checkUser = checkUser;
module.exports.generateGrade = generateGrade
module.exports.generateGuildGrade = generateGuildGrade