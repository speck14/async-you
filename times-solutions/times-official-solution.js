/* Official solution from GitHub, DOESN'T pass:
"use strict";
const { get, request } = require("http");
const async = require("async");
const { pipeline } = require("stream");
const concat = require("concat-stream");

//use async.series, pass in an Object
async.series(
  {
    //one task function: using async.times to send POST request, using http.request
    create: function (done) {
      async.times(
        5,
        function (n, next) {
          //_addUser function defined below (hoisted)
          _addUser(++n, next);
        },
        function (err) {
          if (err) return done(err);
          done(null);
        }
      );
    },
    users: function (done) {
      const opts = {
        hostname: process.argv[2],
        port: process.argv[3],
        pathname: "/users",
      };
      get(opts, (res) => {
        res.setEncoding("utf-8");
        pipeline(
          res,
          concat((data) => {
            done(null, data);
          }),
          (err) => {
            if (err) return done(err);
          }
        );
      }).on("error", done);
    },
  },
  function (err, results) {
    if (err) return console.error(err);
    console.log(results.users);
  }
);

function _addUser(user_id, next) {
  const postData = JSON.stringify({ user_id });
  const opts = {
    hostname: process.argv[2],
    port: process.argv[3],
    pathname: "/users/create",
    method: "POST",
    headers: {
      "Content-Length": postData.length,
    },
  };
  const req = request(opts, (res) => {
    res
      .on("data", (chunk) => {})
      .on("end", () => {
        next(null, "created");
      })
      .on("error", next);
  }).on("error", next);
  req.write(postData);
  req.end();
} */

//Solution that the CLI gives once you pass, this one does verify:
var http = require('http')
, qs = require('querystring')
, async = require('async')
, hostname = process.argv[2]
, port = process.argv[3]
, url = 'http://' +  hostname + ':' + port;

async.series({
post: function(done){
  async.times(5, function(n, next){
    _addUser(++n, function(err){
      next(err);
    });
  }, function next(err){
    if (err) return done(err);
    done(null, 'saved');
  });
},

get: function(done){
  http.get(url + '/users', function(res){
    var body = "";
    res.on('data', function(chunk){
      body += chunk.toString();
    });

    res.on('end', function(){
      done(null, body);
    });
  }).on('error', done);
}

}, function done(err, result){
if (err) return console.log(err);
console.log(result.get);
});


function _addUser(user_id, next){
var postdata = JSON.stringify({'user_id': user_id}),
opts = {
  hostname: hostname,
  port: port,
  path: '/users/create',
  method: 'POST',
  headers: {
    'Content-Length': postdata.length
  }
};

var req = http.request(opts, function(res){
  res.on('data', function(chunk){})

  res.on('end', function(){
    next();
  });
});

req.on('error', function(err){
  next(err);
});

req.write(postdata);
req.end();
}