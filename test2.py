from discordwebhook import create

while True:

    webhook = create.Webhook("https://discord.com/api/webhooks/770346461182296131/dug_mrn8flAk0QEmYVLDAjqJs7m7Kmfe_HGgerqJ8jy8ZtFfruWJmYkZBQjh2OTWk1JJ")

    webhook.avatar_url("https://cdn.discordapp.com/avatars/520187313884495872/f6d8361b2de0b71c60c7e63b1695f348.webp?size=1024")

    webhook.send(message=input(">>> "), username="dathommiebacon")