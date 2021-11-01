'use strict'
const http = require('http');
const async = require('async');

const urlArray = process.argv.slice(2);
//async.map(iterable, asyncFuncToApplyToEach, cb)
async.map(urlArray, (url, cb) => {
  let body = [];
  http.get(url, res => {
    res.on('data', chunk => {
      body += chunk.toString();
    });
    res.on('end', () => {
      return cb(null, body)
    });
  }).on('error', err => cb(err))
}, (err, data) => {
  if(err) return console.error(err);
  return console.log(data);
})