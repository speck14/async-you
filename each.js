/*
  Create a program that will receive two URLs as the first and second
  command-line arguments.

  Then using http.get, create two GET requests, one to each URL, and
  console.log any errors.
  */
'use strict'
const http = require('http');
const async = require('async');

const urlList = [process.argv[2], process.argv[3]]
 //async.each(iterable, asyncFuncToEachItemInIterable, callback)
async.each(urlList, (url, cb) => {
  http.get(url, res => {
    res.on('data', chunk => {});
    res.on('end', () => cb(null))
    res.on('error', err => cb(err))
  })
}, err => console.error(err))