"""from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer

def textblob_Sentiment(text):
    print("Starting TextBlob Sentiment Analysis")
    
    score =  TextBlob(text, analyzer=NaiveBayesAnalyzer()).sentiment
    return score

input_sen = str(input("Enter Text: "))
print(" ")
score = textblob_Sentiment(input_sen)
print("Score: ", score)"""

from textblob import Blobber
from textblob.sentiments import NaiveBayesAnalyzer
tb = Blobber(analyzer=NaiveBayesAnalyzer())

print(tb("sentence you want to test").sentiment)