import requests

r = requests.get('https://cdn.discordapp.com/attachments/752075872537935923/752080391791181884/deletes.json', allow_redirects=True)

open('deletes.json', 'wb').write(r.content)