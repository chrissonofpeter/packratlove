// main node resources
const http = require('http');
const url = require('url');
const express = require("express");
const app = express();
var router = express.Router();


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


var multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files");
    },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${+new Date()}.jpg`);
    }
  });


// https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
const upload = multer({ storage });


router.get("/", async (req, res, next) => {
  console.log("get was called");
  });


router.post("/", async (req, res, next) => {
  console.log("post was called");
  });
 
  
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const { name, document } = req.body;
  console.log("put to id called");
  });
   

module.exports = router;
