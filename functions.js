const Discord = require("discord.js-light");
const bot = new Discord.Client({cacheGuilds: true,cacheChannels: true,cacheOverwrites: false,cacheRoles: false,cacheEmojis: false,fetchAllMembers:true,cachePresences: false});

const prefixes = require('./Commands/prefix')

const r = require('./Resources/rs')

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

function CreateEmbed(title, description, color) {
	const exampleEmbed = new Discord.MessageEmbed()
		.setColor(color)
		.setTitle(title)
		.setDescription(description)
		.setTimestamp()
	return exampleEmbed
}

function ErrorEmbed(error) {
	const exampleEmbed = new Discord.MessageEmbed()
		.setColor(r.f)
		.setTitle("Seems like you ran into an error")
		.setDescription("```" + error + "```")
		.setTimestamp()
	return exampleEmbed
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
  }

function randomchoice(choices) {
	var index = Math.floor(Math.random() * choices.length);
	return choices[index];
}
function userfromarg(message, args) { 
	try {
		return message.guild.members.cache.find(member => member.user.username === args).user
	} catch {
		try {
			return message.guild.members.cache.find(member => member.user.id === args).user
		}
		catch {
			if (!message.mentions.users.first()) {
				return "none"
			}
			else {
				return message.mentions.users.first()
			}
		} 
	}
}
function memberfromarg(guild, args) { 
	try {
		return guild.members.cache.find(member => member.user.username === args).user
	} catch {
		try {
			return guild.members.cache.find(member => member.user.id === args).user
		}
		catch {
			return "none"
		} 
	}
}
const fs = require('fs')
function GetHelp(guild, section) {
	helpjson = JSON.parse(fs.readFileSync('./Resources/commands.json'))
	returnvalue = ""
	for (k in helpjson[section]) {
		var obj = helpjson[section][k]
		returnvalue = returnvalue.concat(`** ${obj.usage.replace("[prefix]", require('.//Commands/prefix').get(guild))}**\n`)
	}
	return returnvalue
}
function channelfromarg(guild, args) { 
	try {
		channel = guild.channels.cache.find(channel => channel.name === args)
		channel.name
		return channel
	} catch {
		try {
			channel = guild.channels.cache.find(channel => channel.id === args.split("<").join("").split(">").join("").split("#").join("").split("!").join(""))
			channel.name
			return channel
		}
		catch {
			return "none"
		} 
	}
}
function checkchannel(message) {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();
	helpjson = JSON.parse(require('fs').readFileSync('./Resources/commands.json'))
	returnvalue = false
	for (section in helpjson) {
		for (k in helpjson[section]) {
			if (k == command) {
				returnvalue = true
			}
		}
	}
	if (JSON.parse(fs.readFileSync('.//Databases/blocked.json'))["channels"].includes(message.channel.id) && !(message.content.startsWith(prefix + "enable") || message.content.startsWith(prefix + "unblock"))) {
    if (returnvalue) {
      if (message.member.hasPermission("MANAGE_CHANNELS")) {
		message.channel.send(`This channel is disabled! You can not use commands here, maybe try another channel or enable it using **${prefixes.get(message.guild)}enable <#${message.channel.id}>**`).then(msg => {msg.delete({ timeout: 5000 })})
        return true
      } else {
		message.channel.send(`This channel is disabled! You can not use commands here, maybe try another channel?`).then(msg => {msg.delete({ timeout: 5000 })})
        return true
      };
    } else return true
  }
}

function commandArray() {
	helpjson = JSON.parse(require('fs').readFileSync('./Resources/commands.json'))
	json1 = {}
	for (section in helpjson) {
		if (section != "pages") {
			for (k in helpjson[section]) {
				json1[k] = {section:section, description:helpjson[section][k]["description"], aliases:helpjson[section][k]["aliases"], permissions:helpjson[section][k]["permissions"], usage:helpjson[section][k]["usage"]}
			}
		}
	}
	return json1
}

function encode(string) {
	return Buffer.from(string).toString('base64');
}
function decode(encoded) {
	return Buffer.from(encoded, 'base64').toString('ascii')
}

function randomcommandusage() {
	random1 = 'pages'
	while (random1 == "pages") {
		random1 = randomchoice(Object.keys(JSON.parse(fs.readFileSync(__dirname + '/Resources/commands.json'))))
	}
	random2 = randomchoice(Object.keys(JSON.parse(fs.readFileSync(__dirname + '/Resources/commands.json'))[random1]))
	return JSON.parse(fs.readFileSync(__dirname + '/Resources/commands.json'))[random1][random2].usage
}

module.exports.checkchannel = checkchannel
module.exports.userfrommention = getUserFromMention
module.exports.embed = CreateEmbed
module.exports.int = getRndInteger
module.exports.randomchoice = randomchoice
module.exports.userfromarg = userfromarg
module.exports.GetHelp = GetHelp
module.exports.error = ErrorEmbed
module.exports.memberfromarg = memberfromarg
module.exports.channelfromarg = channelfromarg
module.exports.randomcommandusage = randomcommandusage
module.exports.encode = encode 
module.exports.decode = decode
module.exports.commandArray = commandArray