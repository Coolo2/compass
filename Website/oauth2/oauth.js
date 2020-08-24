const fetch = require("node-fetch");

const fs = require('fs')

const domain = JSON.parse(fs.readFileSync('.//Resources/website.json')).domain
const address = JSON.parse(fs.readFileSync('.//Resources/website.json')).address
const domainall = JSON.parse(fs.readFileSync('.//Resources/website.json')).domainall

async function get_user_info(json) {
    const fetchDiscordUserInfo = await fetch('http://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${json.access_token}`,
        }
    });
    return await fetchDiscordUserInfo.json()
}

function data(CLIENT_ID, CLIENT_SECRET, code) {
    return {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': address + "/dashboard",
        'scope': 'identify'
    }
}

function joindata(CLIENT_ID, CLIENT_SECRET, code) {
    return {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': address + "/joinsupport",
        'scope': 'guilds.join%20identify'
    }
}

function encode(obj) {
    let string = "";

    for (const [key, value] of Object.entries(obj)) {
        if (!value) continue;
        string += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
    return string.substring(1);
}
async function response(params) {
    return await fetch(`https://discord.com/api/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    });
}

async function join(json) {
    userINFO = await get_user_info(json)
    console.log(await userINFO.id)
    const fetchDiscordUserInfo = await fetch('http://discord.com/api/guilds/732554558773133333/members/' + await userINFO.id, {
        method: 'PUT',
        headers: {
            Authorization: `Bot ${json.token}`,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            access_token:json.access_token, 
            roles:["740945609028010045"]
        })
    });
    console.log(await fetchDiscordUserInfo)
    try{await fetchDiscordUserInfo.json();return true} catch {return false}
}

module.exports.get_user_info = get_user_info
module.exports.data = data
module.exports.encode = encode
module.exports.response = response
module.exports.joindata = joindata
module.exports.join = join