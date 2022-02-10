const mongoose = require('mongoose');
const path = require('path');
const express = require("express");
const cors = require('cors');

const multer  = require('multer');
const bodyParser = require("body-parser");
const morgan = require("morgan");
var sftpStorage = require('multer-sftp');
const app = express();

const port = process.env.PORT || 3001;

//app.use(cors()); 
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');
//Database connection
require("./mongo");

//Models
require("./model/Post");

app.use(bodyParser.urlencoded({extended: false}))
//Middleware
app.use(bodyParser.json())
   .use(morgan());

   const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };
  
  app.use(cors(corsOpts));

//mobile api route
app.use('/api', require('./api/posts'));

//web routs
app.use("/posts", require("./routes/posts"))
app.use("/", require("./routes/index"))
// app.get("/", async (req, res) => {
//   res.render('pages/login');
// });
app.get("/dashboard", async (req, res) => {
  res.render('pages/dashboard');
});





app.listen(port, function(){
    console.log(`server is running on port ${port}`);
})