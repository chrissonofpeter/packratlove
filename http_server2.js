// main node resources
const http = require("http");
const mysql = require("mysql");
const url = require("url");
const express = require("express");
const app = express();
const uuid = require('uuid');

// check to see if module is available before loadingß
// https://stackoverflow.com/questions/11600684/check-if-a-node-js-module-is-available

// mongo DB resources
//const mongo = require('mongodb');
//const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const MongoUrl = "mongodb://localhost:27017/";


// provide access to filesystem
const fs = require('fs'); //require filesystem module


// *************************************
// NODE SERVER REQUEST / RESPONSE
// const hostname = '127.0.0.1';
   const hostname = 'localhost';
   const port = 3000;
   var str;
   var myURL;
// *************************************

// https://socket.io/get-started/chat
// https://expressjs.com/en/guide/routing.html


var cb0 = function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
  res.write('----------------------------<br>');
  res.write('req.url: ');
  str = req.url;
  res.write(str+"<br>")

  next();
}

var cb1 = function (req, res, next) {
  res.write('----------------------------<br>');
  res.write('Full URL: ');
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.write(fullUrl+"<br>");
  myURL = new URL(fullUrl);
  res.write('myURL.pathname: ');
  res.write(myURL.pathname+"<br>");
  
  next();
}

var cb2 = function (req, res, next) {
  res.write('----------------------------<br>');
  
  // https://stackoverflow.com/questions/10183291/how-to-get-the-full-url-in-express
  // https://stackoverflow.com/questions/18931452/node-js-get-path-from-the-request
  // https://nodejs.org/api/url.html#url_url_origin
  // https://www.freecodecamp.org/news/simple-chat-application-in-node-js-using-express-mongoose-and-socket-io-ee62d94f5804/

  res.write("req.protocol="+req.protocol+"<br>");
  res.write("myURL.search="+myURL.search+"<br>");
  res.write("req.get('host')="+req.get('host')+"<br>");
  res.write("originalUrl="+req.originalUrl+"<br>");

  next();
}





