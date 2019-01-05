import json
import boto3
from botocore.vendored import requests
from urllib.parse import urlencode

def lambda_handler(event, context):
    # TODO implement
    sqs = boto3.client("sqs")
    queue_url = "https://sqs.us-east-1.amazonaws.com/825989821720/test"
    
    response = sqs.receive_message(
        QueueUrl = queue_url,
        AttributeNames = ["SentTimeStamp"],
        MaxNumberOfMessages = 1,
        MessageAttributeNames=['All'],
        VisibilityTimeout = 0,
        WaitTimeSeconds = 0
    )
    if not 'Messages' in response.keys():
        return {'Processed and deleted message: ' : None}
    '''
    {'Messages': [{'MessageId': '8ee3da92-57b5-4ba1-b737-aa946255679c',     
                   'ReceiptHandle': 'AQEBjirnLLTInAkmUNAsZ6/V0mdR4ODBztVbWRq6yEJokSy8HwvPJ5/fqEQmYHQAuX1igwSKnR1LKKbgevaMl0U30fc98xbad83WJPKnvi4KZRBxMh2kw7qWOURmRdVPY4uv0z1ZspLHR2TenVXzyWtaNyp405oQNWzzQYoHJMiPkEgwfP4ImW5EvE5sTHwUV0S5TZChN+3dODMfrAts5lJli4qErIZEo8tMahFPGb03ClkeE6EUIWVpdSTP2O3Img/Fl72zwYL1yQnUd56typVAcG5TNkn4CoWiZKs1VdAtMuky3bfbbanon26io0eSAK7WjNz8Kq3Vg+SsPbdviHXD1C29wy6KhWMpkDnuaTvpMQ+5QGj0nTeh/MRenKbVt3q6', 
                   'MD5OfBody': 'a37b9bb537368bf9200ff758c1fca918', 
                   'Body': '{"Cuisine": "Chinese", "Telephone": "2092971336", "People": "2", "Time": "19:00", "Date": "2018-11-10", "Location": "New York"}'}], 
    'ResponseMetadata': {'RequestId': '73fc1601-1e77-5d24-870a-42603b92a37f', 'HTTPStatusCode': 200, 'HTTPHeaders': {'x-amzn-requestid': '73fc1601-1e77-5d24-870a-42603b92a37f', 'date': 'Sat, 10 Nov 2018 18:29:57 GMT', 'content-type': 'text/xml', 'content-length': '1074'}, 'RetryAttempts': 0}}
    '''
    message = response["Messages"][0]
    message_body = json.loads(message["Body"])
    
    api_key = "AIzaSyC-euld0Pxdaxf_Y4DjoUTjpuw2rwJHIL0"
    query = message_body["Cuisine"] + " restaurant in " + message_body["Location"] + " for " +  message_body["People"] + " people" + " at " + message_body["Time"] 
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json?" + urlencode({"key": api_key, "query": query})
    res = requests.get(url).json()
    restaurants = []
    for restaurant in res["results"]:
        restaurants.append({"name": restaurant['name'], "address": restaurant["formatted_address"]})
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Dining')
    response = table.put_item(
        Item={
            "ID":response["ResponseMetadata"]["RequestId"],
            "PhoneNumber":message_body["Telephone"],
            "Location":message_body["Location"],
            "Cusine":message_body["Cuisine"],
            "NumberofPeople":message_body["People"],
            "Time":message_body["Time"],
            "Date":message_body["Date"],
            "data":restaurants
        }
    )
    msg = 'Restaurant name: ' + restaurants[0]['name'] +'; Address: ' + restaurants[0]['address']
    client = boto3.client("sns")
    res = client.publish(
        PhoneNumber = "+1" + message_body["Telephone"],
        Message = msg
    )
    
    sqs.delete_message(
        QueueUrl = queue_url,
        ReceiptHandle = message["ReceiptHandle"]
    )
    
    return {"Sent SNS": res}
