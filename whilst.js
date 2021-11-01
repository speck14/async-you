/* 
Write a program that will receive a single command line argument to a URL.

  Using async.whilst and http.get, send GET requests to this URL until the
  response body contains the string "meerkat".

  console.log the amount of GET requests needed to retrieve the "meerkat"
  string.
*/
'use strict'

const async = require('async');
const http = require('http');
const url = process.argv[2];

let count = 0;
let reqBody = '';

async.whilst(
  function test(cb) {
    cb(null, !reqBody.includes('meerkat'));
  },
  function iter(callback) {
    let body = '';
    http.get(url, res => {
      count ++;
      res.on('data', chunk => {
        body += chunk.toString();
      });
      res.on('end', () => {
        reqBody = body;
        callback();
      }).on('error', err => {
        callback(err);
      });
    })
  },
  (err) => {
    if(err) return console.error(err);
    console.log(count)
  });