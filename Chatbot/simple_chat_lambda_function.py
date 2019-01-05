import json
import time
import random

def lambda_handler(event, context):
    # chat
    text = event['text']
    
    greetings = ['Hello', 'hello', 'Hi', 'hi']
    hobbies = ['movies', 'music', 'fantasy', 'games', 'video']
    emotions = ['sad', 'happy', 'love']
    dislikes = ['exam', 'homework', 'midterm']
    
    message = [None] * 5
    message[0] = "I'm a chat bot!"
    message[1] = "My NLP function is not ready yet."
    message[2] = "Sorry, I cannot help you for now."
    message[3] = "Are you a chat bot? Let's be friends!"
    message[4] = "Did you just say '" + text + "'?"
    
    reply = None
    for word in text.split(' '):
        if word in greetings:
            reply = "Hi, nice to meet you!"
        elif word in hobbies:
            reply = "Yeah, we need some fun in life."
        elif word in emotions:
            reply = "I think I know how it feels...though you may not believe me:)"
        elif word in dislikes:
            reply = "That's awful!"
        
    if not reply:
        reply = random.choice(message)
            
    
    current_time = time.localtime()
    now = time.strftime('%m-%d-%Y %H:%M:%S', current_time)
    
    response = {
        "message": reply,
        "time": now
    }
    
    return {
        "statusCode": 200,
        "body": json.dumps(response)
    }
