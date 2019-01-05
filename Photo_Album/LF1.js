'use strict';
const request = require('request');
const AWS = require('aws-sdk');
var rekognition = new AWS.Rekognition({ apiVersion: '2016-06-27', region: 'us-east-1' });


module.exports.handler = function (event, context, callback) {
	console.log('Starting the put operation');
	var s3Info = { objectKey: event.Records[0].s3.object.key,
					bucket: event.Records[0].s3.bucket.name,
					createdTimestamp: event.Records[0].eventTime,
					Labels: []
					}
	console.log(s3Info);

	var params = {
		Image: {
			S3Object: {
				Bucket: s3Info.bucket,
				Name: s3Info.objectKey,
			}
			
		},
		MaxLabels: 10,
		MinConfidence: 70
	};
	rekognition.detectLabels(params, function (err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
			console.log(data);           // successful response
			// getLabels ****************************************
			for (var i = 0; i < data.Labels.length; i++) 
				s3Info.Labels[i] = data.Labels[i].Name
			// **************************************************
            console.log(JSON.stringify(s3Info));
            // Store Document *************************************************************************************************
            var options = {
                method: 'PUT',
                // hard coded
                url: `https://vpc-newphotos-nq62zgdbngxw4fy4nico2lka6e.us-east-1.es.amazonaws.com/photos/_doc/${s3Info.createdTimestamp}`,
                qs: { pretty: '' },
                headers:
                {
                    'Postman-Token': '6349f974-ff0f-4f1c-a693-9ee0b9981742',
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json'
                },
                body: s3Info,
                json: true
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                console.log(JSON.stringify(body));
            });
            // Store Document *************************************************************************************************
		}
    });

}