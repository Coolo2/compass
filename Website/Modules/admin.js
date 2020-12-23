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
const fs = require('fs')

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
  } catch {
    res.redirect('/login')
  }
};

const domain = JSON.parse(fs.readFileSync('./Resources/website.json')).domain
const address = JSON.parse(fs.readFileSync('./Resources/website.json')).address
const domainall = JSON.parse(fs.readFileSync('./Resources/website.json')).domainall

var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.get('/admin', (req, res) => {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    if(setup.botadmins.includes(id)) {
        guild = bot.guilds.cache.get(req.params.guildid)
        member = functions.memberfromarg(guild, id)
        user = bot.users.cache.get(String(id))
        avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
        return res.render(path.join(__dirname, '../HTML/admin.html'), {
        name: decodeURIComponent(getAppCookies(req, res)['name']),
        id: id,
        avatar: `<img class="avatar" id="output" src="${avatar}">`,
        address: address,
        status: `${address}/status`,
        })
    } else {
        res.redirect('/')
    }
    
});



router.post('/admin/newIncident', function (req, res) {
    const r = fetch(`https://api.statuspage.io/v1/pages/${setup.statuspage}/incidents?api_key=${setup.statuskey}`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body:JSON.stringify(req.body)})  
        .then((res) => { 
            status = res.status; 
            return res.json() 
        })
        .then((jsonData) => {
            res.status(status)
            res.send(jsonData)
            bot.channels.cache.get(`769133398027010068`).send(`\`${jsonData.id}\``, 
                functions.embed(`New incident: ${jsonData.name}`, `Description: ${jsonData["incident_updates"][0]["body"]}`, `#FF0000`)
                    .addField(`Status`, jsonData.status, true)
                    .addField(`Impact`, jsonData.impact_override, true)
                    .setFooter(`More info at ${setup.statuslink}`)
            )
        })
        .catch((err) => {
            console.error(err);
        });
});

router.post('/admin/newSchIncident', function (req, res) {
    const r = fetch(`https://api.statuspage.io/v1/pages/${setup.statuspage}/incidents?api_key=${setup.statuskey}`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body:JSON.stringify(req.body)})  
        .then((res) => { 
            status = res.status; 
            return res.json() 
        })
        .then((jsonData) => {
            res.status(status)
            res.send(jsonData)
            bot.channels.cache.get(`769133398027010068`).send(`\`${jsonData.id}\``, 
                functions.embed(`New scheduled incident: ${jsonData.name}`, `Description: ${jsonData["incident_updates"][0]["body"]}`, `#FF0000`)
                    .addField(`Status`, jsonData.status)
                    .setFooter(`More info at ${setup.statuslink}`)
            )
        })
        .catch((err) => {
            console.error(err);
        });
});

router.delete('/admin/delIncident/:incident', function (req, res) {
    id = req.params.incident
    const r = fetch(`https://api.statuspage.io/v1/pages/${setup.statuspage}/incidents/${id}?api_key=${setup.statuskey}`, {
        method: 'DELETE', headers: {'Content-Type': 'application/json'}, body:JSON.stringify(req.body)})  
        .then((res) => { 
            status = res.status; 
            return res.json() 
        })
        .then((jsonData) => {
            res.status(status)
            res.send(jsonData)
            bot.channels.cache.get(`769133398027010068`).messages.fetch().then(messages => {
                messages.forEach(message => {
                    if (message.content.includes(jsonData.id)) {
                        message.delete()
                    }
                })
            })
        })
        .catch((err) => {
            res.status(402)
            res.send({"error":err.message})
        });
});

router.get('/admin/getIncidents', function (req, res) {
    const r = fetch(`https://api.statuspage.io/v1/pages/${setup.statuspage}/incidents?api_key=${setup.statuskey}`, {method: 'GET'})  
        .then((res) => { 
            status = res.status; 
            return res.json() 
        })
        .then((jsonData) => {
            res.status(status)
            res.send(jsonData)
        })
        .catch((err) => {
            res.status(402)
            res.send({"error":err.message})
        });
})

router.get('/admin/getComponents', function (req, res) {
    const r = fetch(`https://api.statuspage.io/v1/pages/${setup.statuspage}/components?api_key=${setup.statuskey}`, {method: 'GET'})  
        .then((res) => { 
            status = res.status; 
            return res.json() 
        })
        .then((jsonData) => {
            res.status(status)
            res.send(jsonData)
        })
        .catch((err) => {
            res.status(402)
            res.send({"error":err.message})
        });
})

function syncStatus() {
    const r = fetch(`https://api.statuspage.io/v1/pages/${setup.statuspage}/components?api_key=${setup.statuskey}`, {method: 'GET'})  
        .then((res) => { 
            status = res.status; 
            return res.json() 
        })
        .then((jsonData) => {
            bot.channels.cache.get(`769133398027010068`).messages.fetch().then(messages => {
                messages.forEach(message => {
                    if (message.id == `770266108275982379`) {
                        message.edit(null, 
                            functions.embed(`Status`, ``, rs.d)
                                .addField(`Website`, jsonData[0].status.split("_").join(" ").replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()), true)
                                .addField(`Bot`, jsonData[1].status.split("_").join(" ").replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()), true)
                                .setFooter(`More info at ${setup.statuslink}`)
                        )
                    }
                })
            })
        })
        .catch((err) => {
            res.status(402)
            res.send({"error":err.message})
        });
    
}

router.put('/admin/updateComponent/:component', function (req, res) {
    id = req.params.component
    const r = fetch(`https://api.statuspage.io/v1/pages/${setup.statuspage}/components/${id}/?api_key=${setup.statuskey}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body:JSON.stringify(req.body)})  
        .then((res) => { 
            status = res.status; 
            return res.json() 
        })
        .then((jsonData) => {
            res.status(status)
            res.send(jsonData)
            syncStatus()
        })
        .catch((err) => {
            res.status(402)
            res.send({"error":err.message})
        });
})

router.put('/admin/updateIncident/:incident', function (req, res) {
    id = req.params.incident
    const r = fetch(`https://api.statuspage.io/v1/pages/${setup.statuspage}/incidents/${id}/?api_key=${setup.statuskey}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body:JSON.stringify(req.body)})  
        .then((res) => { 
            status = res.status; 
            return res.json() 
        })
        .then((jsonData) => {
            res.status(status)
            res.send(jsonData)
            if (jsonData.status == "resolved") {
                bot.channels.cache.get(`769133398027010068`).messages.fetch().then(messages => {
                    messages.forEach(message => {
                        if (message.content.includes(jsonData.id)) {
                            return message.delete()
                        }
                    })
                })
            }
            bot.channels.cache.get(`769133398027010068`).messages.fetch().then(messages => {
                messages.forEach(message => {
                    if (message.content.includes(jsonData.id)) {
                        message.edit(`\`${jsonData.id}\``, 
                            functions.embed(`Updated incident: ${jsonData.name}`, `Description: ${jsonData["incident_updates"][0]["body"]}`, `#FF0000`)
                                .addField(`Status`, jsonData.status, true)
                                .addField(`Impact`, jsonData.impact_override, true)
                                .setFooter(`More info at ${setup.statuslink}`)
                        )
                    }
                })
            })
        })
        .catch((err) => {
            res.status(402)
            res.send({"error":err.message})
        });
})

router.get('/admin/delete/:type/:suggestionID', (req, res) => {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    if(!setup.botadmins.includes(id)) { return res.redirect(`/`)}
    suggestionID = req.params.suggestionID 
    type = req.params.type
    suggestions = JSON.parse(fs.readFileSync(`./Databases/${type}s.json`))
    for (suggestion of suggestions) {
        if (suggestion.id == suggestionID) {
            removeAllElements(suggestions, suggestion)
            fs.writeFileSync(`./Databases/${type}s.json`, JSON.stringify(suggestions))
        }
    }
    res.redirect(`/admin/${type}s`)
})

function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str) && !isNaN(parseFloat(str)) 
  }

router.get('/admin/deleteGlobalCode/:code', (req, res) => {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    if(!setup.botadmins.includes(id)) { return res.redirect(`/`)}
    code = req.params.code
    try{codes.deleteGlobal(code)}catch{}
    res.redirect(`/admin/globalCodes`)
})

router.get('/admin/generateGlobalCode', (req, res) => {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    if(!setup.botadmins.includes(id)) { return res.redirect(`/`)}
    value = req.query.value
    if (!isNumeric(value.jn())) {return res.redirect(`/admin/globalCodes`)}
    try{codes.generateGlobalCode(value.jn())}catch(err){console.log(err)}
    res.redirect(`/admin/globalCodes`)
})

router.get('/admin/verify/:suggestionID', (req, res) => {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    if(!setup.botadmins.includes(id)) { return res.redirect(`/`)}
    suggestionID = req.params.suggestionID 
    suggestions = JSON.parse(fs.readFileSync('./Databases/suggestions.json'))
    for (suggestion of suggestions) {
        if (suggestion.id == suggestionID && suggestion.verified == false) {
            try {from = "from " + bot.users.cache.get(suggestion.user).username } catch{from = ``}
            message = bot.channels.cache.get(`770289538954035251`).send(functions.embed(`New suggestion ${from}`, suggestion.suggestion, rs.d))
                .then(function(message) {message.react("👍").then(() => message.react('👎'))})
            try {
                 bot.users.cache.get(user).send(`**Your suggestion, **${suggestion.suggestion}**, was verified to be voted on in the discord server. If people want it, it may be added to the bot!**`)
            } catch {}
            final = suggestion 
            final[`verified`] = true
            suggestions[suggestions.indexOf(suggestion)] = final
            fs.writeFileSync('./Databases/suggestions.json', JSON.stringify(suggestions))
            res.redirect(`/admin/suggestions`)
        }
    }
})

router.get('/admin/dm/:type/:user', (req, res) => {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    if(!setup.botadmins.includes(id)) { return res.redirect(`/`)}
    user = req.params.user
    type = req.params.type
    suggestions = JSON.parse(fs.readFileSync('./Databases/suggestions.json'))
    try {
        bot.users.cache.get(user).send(`**Message from Bot Admin in relation to a ${type}:** ${req.query.dmContent}`)
    } catch {}
    res.redirect(`/admin/${type}s`)
})

function removeAllElements(array, elem) {
    var index = array.indexOf(elem);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
    }
}

router.get('/admin/suggestions', (req, res) => {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    if(setup.botadmins.includes(id)) {
        guild = bot.guilds.cache.get(req.params.guildid)
        member = functions.memberfromarg(guild, id)
        user = bot.users.cache.get(String(id))
        avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
        suggestions = JSON.parse(fs.readFileSync('./Databases/suggestions.json')).reverse()
        finalHTML = `<div class="dataSection" style="color:white;position:absolute;box-shadow: 0px 0px 20px 6px #00000050;border-radius:10px;background-color:#1C1F26;min-width:95%;margin-top:5%;margin-right:2%;margin-left:2%;top:0;max-width:90%;padding:10px;padding-bottom:1000px;">`
        for (suggestion of suggestions) {
            if (suggestion[`verified`] == false) {
                finalHTML = finalHTML.concat(`<div class="members" id="suggestion${suggestion.id}"><b>User: ${bot.users.cache.get(suggestion.user).username}</b> - Suggestion: ${suggestion.suggestion} <span style="padding-left:30px;"> </span><button class="formbutton" onclick="window.open('${address}/admin/verify/${suggestion.id}', '_self')">Verify suggestion</button><button class="formbutton" onclick="window.open('${address}/admin/delete/suggestion/${suggestion.id}', '_self')">Delete suggestion</button><form action="${address}/admin/dm/suggestion/${suggestion.user}" method="get"><input type="text" class="forminput" name="dmContent" /><input type="submit" class="formbutton" value="Respond"/></form></div><div style="padding:10px;"></div>`)
            } else {
                finalHTML = finalHTML.concat(`<div class="members" id="suggestion${suggestion.id}"><b>User: ${bot.users.cache.get(suggestion.user).username}</b> - Suggestion: ${suggestion.suggestion} (verified) <span style="padding-left:30px;"> </span><button class="formbuttondisabled">Verify suggestion</button><button class="formbutton" onclick="window.open('${address}/admin/delete/suggestion/${suggestion.id}', '_self')">Delete suggestion</button><form action="${address}/admin/dm/suggestion/${suggestion.user}" method="get"><input type="text" class="forminput" name="dmContent" /><input type="submit" class="formbutton" value="Respond"/></form></div><div style="padding:10px;"></div>`)
            }
            
        }
        finalHTML = finalHTML + `</div>`
        return res.render(path.join(__dirname, '../HTML/suggestions.html'), {
            name: decodeURIComponent(getAppCookies(req, res)['name']),
            id: id,
            avatar: `<img class="avatar" id="output" src="${avatar}">`,
            address:address, 
            status:`${address}/status`,
            data:finalHTML,
            title:"Suggestions",
            suggestions:`<a class="sectionactive" href="${address}/admin/suggestions">Suggestions</a>`,
            issues:`<a class="section" href="${address}/admin/issues">Issues</a>`,
            codes:`<a class="section" href="${address}/admin/globalCodes">Global codes</a>`
        })
    } else {
        res.redirect('/')
    }
});

router.get('/admin/globalCodes', (req, res) => {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    if(setup.botadmins.includes(id)) {
        guild = bot.guilds.cache.get(req.params.guildid)
        member = functions.memberfromarg(guild, id)
        user = bot.users.cache.get(String(id))
        avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
        suggestions = JSON.parse(fs.readFileSync('./Databases/issues.json')).reverse()
        finalHTML = `<div class="dataSection" style="color:white;position:absolute;box-shadow: 0px 0px 20px 6px #00000050;border-radius:10px;background-color:#1C1F26;min-width:95%;margin-top:5%;margin-right:2%;margin-left:2%;top:0;max-width:90%;padding:10px;padding-bottom:1000px;"><center>Generate code <form action="${address}/admin/generateGlobalCode" method="get"><input type="text" class="forminput" name="value" /><input type="submit" class="formbutton" value="Code value"/></form></center>`
        allCodes = codes.getGlobalCodes()
        for (code in allCodes) {
            finalHTML = finalHTML.concat(`<div class="members" id="code${code}"><b>Code: ${code}</b> - Value: ${allCodes[code].sep()}<span style="padding-left:30px;"> <button class="formbutton" onclick="window.open('${address}/admin/deleteGlobalCode/${code}', '_self')">Delete code</button></span></div><div style="padding:10px;"></div>`)
            
        }
        finalHTML = finalHTML + `</div>`
        return res.render(path.join(__dirname, '../HTML/suggestions.html'), {
            name: decodeURIComponent(getAppCookies(req, res)['name']),
            id: id,
            avatar: `<img class="avatar" id="output" src="${avatar}">`,
            address:address, 
            status:`${address}/status`,
            data:finalHTML,
            title:"Suggestions",
            suggestions:`<a class="section" href="${address}/admin/suggestions">Suggestions</a>`,
            issues:`<a class="section" href="${address}/admin/issues">Issues</a>`,
            codes:`<a class="sectionactive" href="${address}/admin/globalCodes">Global codes</a>`
        })
    } else {
        res.redirect('/')
    }
});

router.get('/admin/issues', (req, res) => {
    id = id = getAppCookies(req, res)['user'].replace("5468631284719832746189768653", "").replace("5468631284719832746189768653", "")
    if(setup.botadmins.includes(id)) {
        guild = bot.guilds.cache.get(req.params.guildid)
        member = functions.memberfromarg(guild, id)
        user = bot.users.cache.get(String(id))
        avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + getAppCookies(req, res)['avatar'] + ".png?size=1024"
        suggestions = JSON.parse(fs.readFileSync('./Databases/issues.json')).reverse()
        finalHTML = `<div class="dataSection" style="color:white;position:absolute;box-shadow: 0px 0px 20px 6px #00000050;border-radius:10px;background-color:#1C1F26;min-width:95%;margin-top:5%;margin-right:2%;margin-left:2%;top:0;max-width:90%;padding:10px;padding-bottom:1000px;">`
        for (suggestion of suggestions) {
            finalHTML = finalHTML.concat(`<div class="members" id="issue${suggestion.id}"><b>User: ${bot.users.cache.get(suggestion.user).username}</b> - Issue: ${suggestion.issue}<span style="padding-left:30px;"> </span><button class="formbutton" onclick="window.open('${address}/admin/delete/issue/${suggestion.id}', '_self')">Delete issue</button><form action="${address}/admin/dm/issue/${suggestion.user}" method="get"><input type="text" class="forminput" name="dmContent" /><input type="submit" class="formbutton" value="Respond"/></form></div><div style="padding:10px;"></div>`)
            
        }
        finalHTML = finalHTML + `</div>`
        return res.render(path.join(__dirname, '../HTML/suggestions.html'), {
            name: decodeURIComponent(getAppCookies(req, res)['name']),
            id: id,
            avatar: `<img class="avatar" id="output" src="${avatar}">`,
            address:address, 
            status:`${address}/status`,
            data:finalHTML,
            title:"Suggestions",
            suggestions:`<a class="section" href="${address}/admin/suggestions">Suggestions</a>`,
            issues:`<a class="sectionactive" href="${address}/admin/issues">Issues</a>`,
            codes:`<a class="section" href="${address}/admin/globalCodes">Global codes</a>`
        })
    } else {
        res.redirect('/')
    }
});

module.exports = router;