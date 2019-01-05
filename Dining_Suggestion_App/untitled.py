import json
import boto3
from botocore.vendored import requests
from urllib.parse import urlencode

api_key = "AIzaSyC-euld0Pxdaxf_Y4DjoUTjpuw2rwJHIL0"
query = "Movie Avengers in NewYork"
url = "https://maps.googleapis.com/maps/api/place/textsearch/json?" + urlencode({"key": api_key, "query": query})
res = requests.get(url).json