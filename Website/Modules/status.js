const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const path = require('path')
const sql = new SQLite('./Databases/balances.sqlite');
const fetch = require("node-fetch");
const functions = require('../../functions')
var express = require('express'),
  router = express.Router();
const app = express()

const r = require('../../Resources/rs')

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

module.exports = router;