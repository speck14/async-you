//times.js rewritten to reflect the official solution, using async.series and async.times
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

async.series(
  {
    //Send POST request 5 times, incrementing user_id property each time (starting at 1)
    post: cb => {
      async.times(5, (n, next) => {
        //n is the iteration index (0-4 in this case),  we want to add users starting with an index of 0
        let postData = JSON.stringify({'user_id' : n+1});
        let postReq = http.request(options, res => {
          //We don't care about the data portion of the response
          res.on('data', chunk => {});
          //calls async.times callback function
          res.on('end', () => {
            next();
          });
          res.on('error', err => {
            next(err)
          })
        })
        //sends the above JSON stringified object with the request
        postReq.write(postData);
        postReq.end();
      }, //async.times callback function (called next above), which calls async.series callback function  (cb) 
      err => {
        if(err) return cb(err);
        cb(null);
      })
    },
    users: cb => {
      //changes the options above to a GET request, and the path specified in the instructions
      options.path = '/users';
      options.method = 'GET';
      let getReq = http.request(options, res => {
        let body = '';
        res.on('data', chunk => {
          body += chunk.toString();
        });
        res.on('end', () => {
          cb(null, body);
        }).on('error', err => {
          cb(err)
        });
      });
        getReq.end();
    }
  },
  (err, data) => {
    if(err) console.error(err);
    console.log(data.users);
  }
)