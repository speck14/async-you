//My initial solution, which verifies but doesn't use async.series
'use strict'
const async = require('async');
const http = require('http');
//Receive two command line arguments, containing hostname and port
const hostname = process.argv[2];
const port = process.argv[3];
//sent a POST request to url+'/users/create'
const options = {
  hostname: hostname,
  port: port,
  path: '/users/create',
  method: 'POST'
};

//Send POST request 5 times, incrementing user_id property each time (starting at 1)
async.times(5, (n, cb) => {
  let req = http.request(options, res => {
    res.on('data', chunk => {});
    res.on('end', (data) => {
      cb(null, data)
    });
    res.on('error', err => {
      cb(err)
    })
  });
   //POST body contains a JSON.stringify'ed object: {"user_id" : 1}, incremented with each post request (5 total)
  req.write(JSON.stringify({user_id: n + 1}));
  req.end();
}, (err, data) => {
  if(err) return console.error(err);
  //Once the 5 POST requests are done, send a GET request to url + '/users'
  options.path = '/users';
  options.method = 'GET';
  let getReq = http.request(options, res => {
    let body = '';
    res.on('data', chunk => {
    body += chunk.toString();
  });
  res.on('end', () => {
    //log the response body for the GET response
    console.log(body);
  });
});
  getReq.end();
});