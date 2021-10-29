//Gets URL from file (path to file given as command line argument), performs get request, logs body of response
'use strict'
const fs = require('fs')
const http = require('http');
const async= require('async');
const path = process.argv[2];
//get URL from file
const getURL = function(cb) {
  fs.readFile(path, 'utf-8', (err, data) => {
    if(err) return cb(err);
    cb(null, data);
  })
};
//Perform http.get request on URL, and return the response body
const getResponseBody = function (data, cb) {
  let body = '';
    http.get(data, (res) => {
      res.on('data', (chunk) => {
        body += chunk.toString();
      });
      res.on('end', () => {
        cb(null, body)
      });
      }).on('error', (err) => {
        cb(err)
    });
};
//asynchronously call getURL and getResponseBody, console.log response body
async.waterfall([
    getURL,
    getResponseBody
], function cb(err, result) {
  if(err) return console.error(error);
  return console.log(result)
});