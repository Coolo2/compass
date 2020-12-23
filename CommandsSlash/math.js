const math = require('mathjs');
const functions = require('../functions')
const r = require('../Resources/rs')

module.exports.command = {
    "name": "math",
    "description": "Evaluate a math equation",
    "options": [
        {
            "name": "equation",
            "description": "The equasion to be evaluated",
            "type": 3,
            "required": true
        }
    ]
}

module.exports.respond = function (bot, interaction) {
    if (interaction.data.name == 'math') {
        try {
           embed = functions.embed("Successfully calculated", `${interaction.data.options[0].value} = ${math.evaluate(interaction.data.options[0].value)}`, r.d)
        }
        catch {
            embed = functions.error("Invalid calculation")
        }

        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
                embeds: [
                            embed
                        ]
                    } 
                }
            }
        )
    }
}