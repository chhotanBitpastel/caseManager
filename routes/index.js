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
    req.session.adminId=getUserID;
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
    
    res.render('pages/dashboard', {menu:'dashboard'});
  });

  router.post("/footer/", async (req, res) => {
   
    try {
      const db1 = mongoose.connection.db;

      await db1.collection('social_link').updateOne({name:"facebook"}, {$set: {link:req.body.f_link,priority: req.body.f_priority}});
      await db1.collection('social_link').updateOne({name:"instagram"}, {$set: {link:req.body.insta_link,priority: req.body.i_priority}});
      await db1.collection('social_link').updateOne({name:"linkedin"}, {$set: {link:req.body.l_link,priority: req.body.l_priority}});

      await db1.collection('social_link').updateOne({name:"twitter"}, {$set: {link:req.body.t_link,priority: req.body.t_priority}});
      await db1.collection('social_link').updateOne({name:"github"}, {$set: {link:req.body.g_link,priority: req.body.g_priority}});
      await db1.collection('social_link').updateOne({name:"dribbble"}, {$set: {link:req.body.d_link,priority: req.body.d_priority}});
      await db1.collection('social_link').updateOne({name:"behance"}, {$set: {link:req.body.b_link,priority: req.body.b_priority}});
      
      
      await db1.collection('footer').updateOne({uid:"1"}, {$set: {footer_text:req.body.footerText}});

      //res.render('pages/footer', {fb_dtl:fb_dtl,insta_dtl:insta_dtl,lin_dtl:lin_dtl,footer_text:footer_text,msg:'Updated successfull.'}); 
      req.flash('message', 'Successfully updated');
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
   
   var twit_dtl= await db.collection('social_link').findOne({name:"twitter"});
   var git_dtl= await db.collection('social_link').findOne({name:"github"});
   var dri_dtl= await db.collection('social_link').findOne({name:"dribbble"});
   var beh_dtl= await db.collection('social_link').findOne({name:"behance"});
   var footer_text= await db.collection('footer').findOne({uid:"1"}); 
    res.render('pages/footer', {twit_dtl:twit_dtl,git_dtl:git_dtl,dri_dtl:dri_dtl,beh_dtl:beh_dtl,fb_dtl:fb_dtl,insta_dtl:insta_dtl,lin_dtl:lin_dtl,footer_text:footer_text,menu:'footer',message: req.flash('message')});

    }catch (error){
      res.status(500);
    }

    //   db.collection('social_link').findOne({name:"facebook"}, function(err, doc) {
    //   if(err) throw err;
    //   if (doc) {
    //     fb_dtl=doc;
    //     //console.log(fb_dtl);
    //   }
    // })

});

router.get("/change-password", (req, res, next) => {
 // var loginUser= req.session.userName;
  res.render('pages/change_password', {menu:'dashboard',message: req.flash('message')});
});

router.post('/change-password/', async function(req, res) {

  var adminid= req.session.adminId;
  
  var admin_dtl= await userModule.findOne({_id:adminid});
  //console.log(admin_dtl);
  var prev_password=admin_dtl.password;

  var old_password=req.body.old_password;
  var new_password=req.body.new_password;

 
   if(bcrypt.compareSync(old_password,prev_password)){
   
      password =bcrypt.hashSync(req.body.new_password,10);

      userModule.findByIdAndUpdate(adminid, {password :password}, function(err){
      if(err) throw err;
    
      req.flash('message', 'Password Updated successfully.');
      res.redirect('/change-password');
     });  
     }else{
      req.flash('message', 'Old password is wrong!');
      res.redirect('/change-password');
    }

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