import json, requests

if '..api..' == "dog":
    
    print(requests.get("https://dog.ceo/api/breeds/image/random").json()["message"])
