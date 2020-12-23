const functions = require('../functions')

module.exports.command = {
    "name": "eject",
    "description": "Among us eject someone!",
    "options": [
        {
            "name": "user",
            "description": "The user to eject",
            "type": 3,
            "required": false
        },
        {
            "name": "color",
            "description": "The color of the among us character",
            "type": 3,
            "required": false,
            "choices": [
                {"name": "Red", "value": "red"},
                {"name": "White", "value": "white"},
                {"name": "Purple", "value": "purple"},
                {"name": "Pink", "value": "pink"},
                {"name": "Orange", "value": "orange"},
                {"name": "Lime", "value": "lime"},
                {"name": "Cyan", "value": "cyan"},
                {"name": "Blue", "value": "blue"},
                {"name": "Brown", "value": "brown"},
                {"name": "Black", "value": "black"}
            ]
        },
        {
            "name": "is_impostor",
            "description": "Whether the image shows the user as an impostor or not.",
            "type": 5,
            "required": false
        }
    ]
}

colornames = {
    "aqua": 65535,
    "black": 0,
    "blue": 255,
    "brown": 10824234,
    "cyan": 65535,
    "green": 32768,
    "lime": 65280,
    "magenta": 16711935,
    "orange": 16753920,
    "pink": 16761035,
    "purple": 8388736,
    "red": 16711680,
    "white": 16777215,
    "yellow": 16776960,
}

function HEXToVBColor(rrggbb) {
    var bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
    return parseInt(bbggrr, 16);
}

module.exports.respond = function (bot, interaction) {
    if (interaction.data.name == 'eject') {
        colors = [`blue`, `black`, `brown`, `cyan`, `darkgreen`, `lime`, `orange`, `pink`, `purple`, `white`, `yellow`, `red`]
        booleans = [`true`, `false`]
        isImpostor = functions.randomchoice(booleans)
        crewmate = functions.randomchoice(colors)
        username = interaction.member.user.username

        if (interaction.data.options) {
            if (interaction.data.options[1]) 
                crewmate = interaction.data.options[1].value.toLowerCase()
            if (interaction.data.options[2]) 
                isImpostor = interaction.data.options[2].value
            if (interaction.data.options[0]) 
                username = interaction.data.options[0].value
        }
        
        if (username.includes(`<@!`)) {
            try{
                username = username.replace(`<@!` + username.match(new RegExp(`<@!` + "(.*)" + `>`))[1] + `>`,functions.userfromarg(bot.channels.cache.get(interaction.channel_id), username.match(new RegExp(`<@!` + "(.*)" + `>`))[1]).username)
            } catch {}
        } 
        else if (username.includes(`<@`)) {
            try{
                username = username.replace(`<@` + username.match(new RegExp(`<@` + "(.*)" + `>`))[1] + `>`, bot.guilds.cache.get(interaction.guild_id).members.cache.get(username.match(new RegExp(`<@` + "(.*)" + `>`))[1]).user.username)
            } catch {}
        }

        if (colornames[crewmate]) 
            colorHex = colornames[crewmate]
        else 
            colorHex = Math.floor(Math.random() * 16777214) + 1
        
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
                embeds: [
                            functions.embed(``, "", colorHex, true)
                                .setImage(`https://vacefron.nl/api/ejected?name=${encodeURIComponent(username)}&impostor=${encodeURIComponent(isImpostor)}&crewmate=${encodeURIComponent(crewmate)}`)
                        ]
                    } 
                }
            }
        )

    }
}