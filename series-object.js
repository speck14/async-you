/* Challenge:
  Write a program that will receive two URLs as the first and second
  command-line arguments.

  Using http.get, create a GET request to these URLs and pass the response
  body to the callback.

  Pass in an object of task functions, using the property names requestOne
  and requestTwo, to async.series.

  console.log the results in the callback for series when all the task
  functions have completed.
*/
'use strict'
const http = require('http');
const async = require('async');

const firstURL = process.argv[2];
const secondURL = process.argv[3];

//pull out getBody's functionality so it doesn't need to be duplicated
const getBody = (url, cb) => {
  let body = '';
  http.get(url, (res) => {
    res.on('data', (chunk) => {
      body += chunk.toString();
    });
    res.on('end', () => {
      cb(null, body)
    });
  }).on('error', (err) => {
    cb(err)
  })
};

async.series({
  /*calling getBody with arguments doesn't work in async.series, so instead bind getBody to the arguments to be passed in,
  async provides the callback. null for "this", because we don't need to change the this value of either function */
  requestOne: getBody.bind(null, firstURL),
  requestTwo: getBody.bind(null, secondURL)
}, function (err, data) {
  if(err) return console.err(err);
  return console.log(data);
})




/*My original solution, duplicating getBody's functionality
async.series({
  requestOne: function (cb) {
    let body = '';
    http.get(firstURL, (res) => {
      res.on('data', (chunk) => {
        body += chunk.toString();
      });
      res.on('end', () => {
        cb(null, body)
      });
    }).on('error', (err) => {
      cb(err)
    })
  },
  requestTwo: function (cb) {
    let body = '';
    http.get(secondURL, (res) => {
      res.on('data', (chunk) => {
        body += chunk.toString();
      });
      res.on('end', () => {
        cb(null, body)
      });
    }).on('error', (err) => {
      cb(err)
    })
  }
}, (err, data) => {
  if(err) return console.err(err);
  return console.log(data);
});
*/