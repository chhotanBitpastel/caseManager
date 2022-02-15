const router = require("express").Router();
var userModule=require('../model/admin');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


function checkLoginUser(req,res,next){
    var userToken=localStorage.getItem('userToken');
    try {
      if(req.session.userName){
      var decoded = jwt.verify(userToken, 'loginToken');//check loginToken exist into userToken
      }else{
        res.redirect('/');
      }
    } catch(err) {
      res.redirect('/');
    }
    next();
  }

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

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
    if(req.session.userName){
      res.redirect('/dashboard');
    }else{
    res.render('pages/login', { msg:'' });
    }
  });
  router.post('/', function(req, res, next) {
    var email=req.body.username;
    var password=req.body.password;
    var checkUser=userModule.findOne({email:email});
    checkUser.exec((err, data)=>{
     if(data==null){
      res.render('pages/login', { msg:"Invalid Username and Password." });
  
     }else{
  if(err) throw err;
  var getUserID=data._id;
  var getFullname=data.fullname;
  var getPassword=data.password;
  if(bcrypt.compareSync(password,getPassword)){
    var token = jwt.sign({ userID: getUserID }, 'loginToken');//generate token
    localStorage.setItem('userToken', token); //store token
    //localStorage.setItem('loginUser', getFullname); // and store fullname also
    req.session.userName=getFullname;

    res.redirect('/dashboard');
  }else{
    res.render('pages/login', { msg:"Invalid Username and Password." });
  
  }
     }
    });
   
  });

  router.get('/signup', function(req, res, next) {
    //var loginUser=localStorage.getItem('loginUser');
    if(loginUsreq.session.userNameer){
      res.redirect('/dashboard');
    }else{
    res.render('pages/signup', { msg:'' });
    }
  });
  
  router.post('/signup', checkEmail, function(req, res, next) {
    var fullname=req.body.fullname;
    var email=req.body.email;
    var password=req.body.password;
    var cpassword=req.body.cpassword;
    if(password != cpassword){
        res.render('pages/signup', { msg:'Password not matched!' });
       
      }else{
     password =bcrypt.hashSync(req.body.password,10);

    var userDetails=new userModule({
        fullname:fullname,
      email:email,
      password:password
    });
 userDetails.save((err,doc)=>{
    if(err) throw err;
    res.render('pages/signup', { msg:'User Registerd Successfully' });
 });
}

});


router.get("/dashboard", checkLoginUser, (req, res, next) => {
    var loginUser= req.session.userName;
    res.render('pages/dashboard', {loginUser:loginUser});
  });

  router.post("/footer/", async (req, res) => {
   
    try {
      const db1 = mongoose.connection.db;

      await db1.collection('social_link').updateOne({name:"facebook"}, {$set: {link:req.body.f_link,priority: req.body.f_priority}});
      await db1.collection('social_link').updateOne({name:"instagram"}, {$set: {link:req.body.insta_link,priority: req.body.i_priority}});
      await db1.collection('social_link').updateOne({name:"linkedin"}, {$set: {link:req.body.l_link,priority: req.body.l_priority}});
      await db1.collection('footer').updateOne({uid:"1"}, {$set: {footer_text:req.body.footerText}});

      var fb_dtl= await db1.collection('social_link').findOne({name:"facebook"}); 
      var insta_dtl= await db1.collection('social_link').findOne({name:"instagram"}); 
      var lin_dtl= await db1.collection('social_link').findOne({name:"linkedin"}); 
      var footer_text= await db1.collection('footer').findOne({uid:"1"}); 

      //res.render('pages/footer', {fb_dtl:fb_dtl,insta_dtl:insta_dtl,lin_dtl:lin_dtl,footer_text:footer_text,msg:'Updated successfull.'}); 
      req.flash('message', 'Updated successfull.');
      res.redirect('/footer');
      

      } catch (error) {
        res.status(500);
      }
    
});

  router.get("/footer", checkLoginUser, async (req, res, next) => {
  
    try{
   const db = mongoose.connection.db;

   var fb_dtl= await db.collection('social_link').findOne({name:"facebook"}); 
   var insta_dtl= await db.collection('social_link').findOne({name:"instagram"}); 
   var lin_dtl= await db.collection('social_link').findOne({name:"linkedin"}); 
   var footer_text= await db.collection('footer').findOne({uid:"1"}); 

    res.render('pages/footer', {fb_dtl:fb_dtl,insta_dtl:insta_dtl,lin_dtl:lin_dtl,footer_text:footer_text,message: req.flash('message')});

    }catch (error){
      res.status(500);
    }

    // db.collection('social_link').find().toArray((err, result) => {
    //   console.log(result)
    // });
    // var fb_dtl;
    // var insta_dtl;
    // var lin_dtl;
    // var footer_text;
    

    //   db.collection('social_link').findOne({name:"facebook"}, function(err, doc) {
    //   if(err) throw err;
    //   if (doc) {
    //     fb_dtl=doc;
    //     //console.log(fb_dtl);
    //   }
    // })

    // db.collection('social_link').findOne({name:"instagram"}, function(err, doc) {
    //   if(err) throw err;
    //   if (doc) {
    //     insta_dtl=doc;
    //    // console.log(insta_dtl);
    //   }
    // })

    // db.collection('social_link').findOne({name:"linkedin"}, function(err, doc) {
    //   if(err) throw err;
    //   if (doc) {
    //     lin_dtl=doc;
    //     //console.log(lin_dtl);
    //   }
    // })

    // db.collection('footer').findOne({uid:"1"}, function(err, doc) {
    //   if(err) throw err;
    //   if (doc) {
    //     footer_text=doc;
    //     //console.log(footer_text);
    //   }
    // })

    // console.log(fb_dtl);
    // console.log(insta_dtl);
    // console.log(lin_dtl);
    // console.log(footer_text);

  //res.render('pages/footer');
});
  

  router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    if(err){
      res.redirect('/');
    }
  })
  res.redirect('/');
});
module.exports = router;