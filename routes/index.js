const router = require("express").Router();
//const mongoose = require('mongoose');
//const path = require('path');
var userModule=require('../model/admin');

function checkEmail(req,res,next){
    var email=req.body.email;
    var checkexitemail=userModule.findOne({email:email});
    checkexitemail.exec((err,data)=>{
   if(err) throw err;
   if(data){
    
  return res.render('pages/signup', { msg:'Email Already Exit' });
  
   }
   next();
    });
  }

router.get('/', function(req, res, next) {
    //var loginUser=localStorage.getItem('loginUser');
    var loginUser=false;
    if(loginUser){
      res.redirect('/dashboard');
    }else{
    res.render('pages/login', { msg:'' });
    }
  });
  router.post('/', function(req, res, next) {
    var username=req.body.uname;
    var password=req.body.password;
    var checkUser=userModule.findOne({username:username});
    checkUser.exec((err, data)=>{
     if(data==null){
      res.render('pages/login', { msg:"Invalid Username and Password." });
  
     }else{
  if(err) throw err;
  var getUserID=data._id;
  var getPassword=data.password;
  if(bcrypt.compareSync(password,getPassword)){
    var token = jwt.sign({ userID: getUserID }, 'loginToken');
    localStorage.setItem('userToken', token);
    localStorage.setItem('loginUser', username);
    res.redirect('/dashboard');
  }else{
    res.render('index', { title: 'Password Management System', msg:"Invalid Username and Password." });
  
  }
     }
    });
   
  });

  router.get('/signup', function(req, res, next) {
    //var loginUser=localStorage.getItem('loginUser');
    var loginUser=false;
    if(loginUser){
      res.redirect('/dashboard');
    }else{
    res.render('pages/signup', { msg:'' });
    }
  });
  
  router.post('/signup',function(req, res, next) {
    var fullname=req.body.fullname;
    var email=req.body.email;
    var password=req.body.password;
    var cpassword=req.body.cpassword;

//password =bcrypt.hashSync(req.body.password,10);

    var userDetails=new userModule({
        fullname:fullname,
      email:email,
      password:password
    });
 userDetails.save((err,doc)=>{
    if(err) throw err;
    res.render('pages/signup', { msg:'User Registerd Successfully' });
    
 });


});


  router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});
module.exports = router;