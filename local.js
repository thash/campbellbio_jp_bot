'use strict';
let fs = require('fs');
let AWS = require("aws-sdk");
let kms = new AWS.KMS({'region': 'ap-northeast-1'});
let Twitter = require('twitter');

var encrypted = fs.readFileSync('./encrypted-credentials');
kms.decrypt({CiphertextBlob: encrypted}, (err, data) => {
  if (err) {
    console.log(err, err.stack);
    // context.fail('failed');
  } else {
    var decrypted = data['Plaintext'].toString();
    //  console.log(decrypted);
    var obj = {};
    decrypted.split(',').forEach((item) => {
      var pair = item.split(':');
      obj[pair[0]] = pair[1];
    });

    var client = new Twitter({
      consumer_key: obj.consumer_key,
        consumer_secret: obj.consumer_secret,
        access_token_key: obj.access_token_key,
        access_token_secret: obj.access_token_secret
    });

    var json = JSON.parse(fs.readFileSync("./tw.json", 'utf8'));
    // media_ids should be separated by comma
    client.post('statuses/update', {status: json['tweet'], media_ids: json['media_ids']},  (err, tweet, response) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        // console.log(tweet);
        console.log(response['body']);
        console.log('--- body');
        console.log(JSON.parse(response['body'])['entities']);
        console.log('--- body > entities');
        console.log(JSON.parse(response['body'])['entities']['media']);
        console.log('--- body > entities > media');
        console.log(JSON.parse(response['body'])['entities']['media'][0]['display_url']);
        console.log('--- body > entities > media > 0 > display_url');
        console.log(JSON.parse(response['body'])['entities']['media'][0]['display_url'].replace(/\\/,''));
        console.log('--- body > entities > media > 0 > display_url.replace');
      }
    });
  }
});
