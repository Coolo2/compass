const functions = require('../functions')

module.exports.command = {
    "name": "binary",
    "description": "Convert text to binary, and binary to text.",
    "options": [
        {
            "name": "text",
            "description": "The text or binary to be converted",
            "type": 3,
            "required": true
        }
    ]
}

function textToBin(text) {
    var length = text.length,
        output = [];
    for (var i = 0;i < length; i++) {
      var bin = text[i].charCodeAt().toString(2);
      output.push(Array(8-bin.length+1).join("0") + bin);
    } 
    return output.join(" ");
}

function binToText(str) {
    str = str.replace(/\s+/g, '');
    str = str.match(/.{1,8}/g).join(" ");
    var newBinary = str.split(" ");
    var binaryCode = [];
    for (i = 0; i < newBinary.length; i++) {
        binaryCode.push(String.fromCharCode(parseInt(newBinary[i], 2)));
    }
    return binaryCode.join("");
}

module.exports.respond = function (bot, interaction) {
    if (interaction.data.name == 'binary') {
        str = interaction.data.options[0].value
        str2 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV;'\\[],./<>?:\"|{}-=_+!@#$%^&*()23456789"
        verdict = false
        for (var i = 0; i < str2.length; i++) {
            if (str.includes(str2.charAt(i))) {
                verdict = true
            } else {if (verdict == true) {} else {verdict = false}}
        }
        if (verdict == true) {result=textToBin(str)} else {result = binToText(str)}
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
                embeds: [
                            functions.embed("Converted!", result + "\n\n`You can input ascii or text to be converted, it will detect which it is`", Math.floor(Math.random() * 16777214) + 1)
                        ]
                    } 
                }
            }
        )
    }
}