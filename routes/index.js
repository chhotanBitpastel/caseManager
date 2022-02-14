const router = require("express").Router();
var userModule=require('../model/admin');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');

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
  

  router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    if(err){
      res.redirect('/');
    }
  })
  res.redirect('/');
});
module.exports = router;