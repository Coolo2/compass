from discord.ext import commands 
import random

bot = commands.Bot('flushed ')

@bot.event
async def on_ready():
    print(bot.user.name + " online!")

@bot.event
async def on_message(message):
    await message.add_reaction(random.choice(['😳', '😔']))

bot.run("NzAyODgwNDk0ODk4OTA1MTE4.XqGeeA.GcPZRUeQ4RSLi47tvxQBEIWlo8o")