from discord.ext import commands 

bot = commands.Bot("h ")

@bot.event()
async def on_ready():
    await bot.get_channel(748590461622550528).send("483ruj9r845ftg")

bot.run()