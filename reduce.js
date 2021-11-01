/* 
  Write a program that will receive a URL as the first command line
  argument.

  To this URL, for each of the values in the following array, send a GET
  request using http.get with a query parameter named number set at the
  proper value:

     ['one', 'two', 'three']

  Each time, convert the response body to Number and add it to the previous
  value. console.log the final reduced value.
*/

'use strict'
const async = require('async');
const http = require('http');

const url = process.argv[2];
const queryArray = ['one', 'two', 'three'];

async.reduce(queryArray, 0, (memo, number, cb) => {
  //URL with a query parameter of 'number', and value of array position
  let queryURL = `${url}?number=${number}`;
  //body will be a number
  let body = 0;
  http.get(queryURL, res => {
    res.on('data', chunk => {
      //convert response body to a number
      body = Number(chunk.toString());
    })
    res.on('end', () => {
      //add response body to memo, the value of the reduce
      cb(null, memo + body);
    })
  }).on('error', (err) => {
    cb(err)
  })
}, (err, result) => {
  if(err) return console.error(err);
  return console.log(result);
})

