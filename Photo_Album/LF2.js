'use strict'
const AWS = require('aws-sdk');
AWS.config.apiVersions = {
    lexruntime: '2016-11-28',
};
var lexruntime = new AWS.LexRuntime();
var request = require("request");

module.exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    var text = event.params;
    var params = {
        botName: 'Photos',
        botAlias: 'Abc',
        inputText: text,
        userId: 'user'
    };
    lexruntime.postText(params, function (err, data) {
        console.log('fuckyou');
        if (err) {
            var response = {
                        statusCode: 403,
                        headers:{
          "X-Requested-With": '*',
          "Access-Control-Allow-Headers": 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Origin": '*',
          "Access-Control-Allow-Methods": 'POST, GET, OPTIONS'
        },
                        body: {
                            message: "I want to fuck you"
                        },
                        isBase64Encoded: false
                    };
            callback(null, response);
        }  else {
            var photosA = data["slots"]["photosA"];
            var photosB = data["slots"]["photosB"];
            // if (photosB == "no" || photosB == "No" || photosB == "Nope" || photosB == "Nothing" || photosB == "nothing" || photosB == "nope") 
            if (photosB == null) {
                var options = {
                    method: 'GET',
                    url: 'https://vpc-newphotos-nq62zgdbngxw4fy4nico2lka6e.us-east-1.es.amazonaws.com/photos/_search',
                    qs: { pretty: '' },
                    headers:
                    {
                        'Postman-Token': 'cc6ea88d-fe27-456a-b6d5-6db9cab01f22',
                        'cache-control': 'no-cache',
                        'Content-Type': 'application/json'
                    },
                    body: { query: { bool: { must: [{ match: { Labels: photosA } }] } } },
                    json: true
                };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    console.log(body);
                     var itemImages = [];
                    var numOfResult = body.hits.total;
                    var results = body.hits.hits;
                    for (var i = 0; i < numOfResult; i++) {
                        itemImages[i] = {}
                        itemImages[i].url = `https://s3.amazonaws.com/${results[i]._source.bucket}/${results[i]._source.objectKey}`;
                        itemImages[i].labels = results[i]._source.Labels;
                    }
                    var response = {
                        statusCode: 200,
                        headers:{
          "X-Requested-With": '*',
          "Access-Control-Allow-Headers": 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Origin": '*',
          "Access-Control-Allow-Methods": 'POST, GET, OPTIONS'
        },
                        body: {results:itemImages},
                        isBase64Encoded: false
                    }
                    
                    callback(null, response);
                });
            }
            else {
                var options = {
                    method: 'GET',
                    url: 'https://vpc-newphotos-nq62zgdbngxw4fy4nico2lka6e.us-east-1.es.amazonaws.com/photos/_search',
                    qs: { pretty: '' },
                    headers:
                    {
                        'Postman-Token': 'cc6ea88d-fe27-456a-b6d5-6db9cab01f22',
                        'cache-control': 'no-cache',
                        'Content-Type': 'application/json'
                    },
                    body: { query: { bool: { must: [{ match: { Labels: photosA } }, { match: { Labels: photosB } }] } } },
                    json: true
                };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    console.log(body)
                    var itemImages = [];
                    var numOfResult = body.hits.total;
                    var results = body.hits.hits;
                    for (var i = 0; i < numOfResult; i++) {
                        itemImages[i] = {}
                        itemImages[i].url = `https://s3.amazonaws.com/${results[i]._source.bucket}/${results[i]._source.objectKey}`;
                        itemImages[i].labels = results[i]._source.Labels;
                    }
                    var response = {
                        statusCode: 200,
                        headers:{
          "X-Requested-With": '*',
          "Access-Control-Allow-Headers": 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Origin": '*',
          "Access-Control-Allow-Methods": 'POST, GET, OPTIONS'
        },
                        body: {results:itemImages},
                        isBase64Encoded: false
                    }
                    
                    callback(null, response);
                });
            }
        }

    }
    )

}