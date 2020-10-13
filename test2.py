import nltk
from nltk.corpus import wordnet 



inp = "someone give me a random sentence".split(' ')
final = []

for item in inp:
    synonyms = [] 
    antonyms = [] 
    for syn in wordnet.synsets(item): 
        for l in syn.lemmas(): 
            synonyms.append(l.name()) 
            if l.antonyms(): 
                antonyms.append(l.antonyms()[0].name()) 

    try:
        final.append(antonyms[0]) 
    except:
        final.append(item)

print(" ".join(inp) + " -> " + " ".join(final))