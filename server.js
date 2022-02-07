const mongoose = require('mongoose');
const path = require('path');
const express = require("express");
const app = express();
const multer  = require('multer');
const bodyParser = require("body-parser");
const morgan = require("morgan");


app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');
//Database connection
require("./mongo");

//Models
require("./model/Post");

//Middleware
app.use(bodyParser.json())
   .use(morgan());

app.use("/posts", require("./routes/posts"))

app.get("/", async (req, res) => {
  res.render('pages/login');
});
app.get("/dashboard", async (req, res) => {
  res.render('pages/dashboard');
});





app.listen(3001, function(){
    console.log(`server is running on port 3001`);
})