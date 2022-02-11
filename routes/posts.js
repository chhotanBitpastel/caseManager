const router = require("express").Router();
const mongoose = require('mongoose');
const multer  = require('multer');
const path = require('path');
var sftpStorage = require('multer-sftp')

const Post = mongoose.model("Post");

//exports.newFileUpload =  function(req , res , next){  
// var storage = sftpStorage({
//     sftp: {
//       host: '208.109.73.6',
//       port: 22,
//       username: 'ktewe1al45z5',
//       password: '9xfY]0Qw'
//     },
//     destination: function (req, file, cb) {
//       cb(null, '/public_html/mi/chhotan/images/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
 // })
//   upload(req,res,function(err){
//     logger.debug(JSON.stringify(req.body));
//           logger.debug(JSON.stringify(req.files));
//       if(err){
//            logger.debug("Error Occured", JSON.stringify(err));
//            res.json({error_code:1,err_desc:err});
//       } else{
//            logger.debug("Files uploaded successfully");
//           res.json({error_code:0,err_desc:null});
//       }
//   });
//}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/uploads'))
    },
    filename: function (req, file, cb) {
        //cb(null, file.originalname)
        cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
  })

//   let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '../../../../../http://bitpastel.io/mi/chhotan/images/')
  
//      },
//     filename: function (req, file, cb) {
//         //cb(null, file.originalname)
//         cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname))
//     }
//   })

  

//var storage = multer.diskStorage({
   // destination: function (req, file, cb) {
      //cb(null, './public/uploads/')

   // },
   // filename: function (req, file, cb) {
      //cb(null, file.originalname)
    //  cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    //}
//})

//var upload = multer({ storage: storage }).single('file');
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 8 * 1000000, // 8 MB in bytes
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/webp') cb(new Error("IMG_EXT_UNSUPPORTED"), false);
        else cb(null, true);
    },
});

//fetch all data
router.get("/", async (req, res) => {
    try{
        const posts = await Post.find({})
        //res.send(posts);
        res.render('pages/allposts',{allposts:posts});
    } catch(error){
      res.status(500);
    }
});

//view page
router.get("/addpost", async (req, res) => {
    res.render('pages/postadd');
});

//Add data
router.post("/", upload.single('file'), async (req, res) => {
    try {
        const post = new Post();
        post.title = req.body.title;
        post.content = req.body.content;
        post.link = req.body.link;
        post.image = req.file.filename;
        //post.image = req.file.path;
       // console.log(req.file);
        await post.save();
       // res.send(req.body);
        res.redirect('/posts')
    } catch (error) {
        res.status(500);
    }
    //res.send(req.body);
});

//fetch one record
router.get("/:postId", async (req, res) => {
    try {
        const singlepost = await Post.findOne({_id: req.params.postId})
        res.render("pages/postedit", {singlepost:singlepost})
    } catch (error) {
        res.status(500);
    }
});

router.post("/edit/", upload.single('file'), function(req, res){
   
    if(req.file){
    var filename=req.file.filename;
    }else{
     var filename=req.body.oldfile;
    }
    Post.findByIdAndUpdate(req.body.id, {
        title : req.body.title,
        content : req.body.content,
        link : req.body.link,
        image : filename,
    }, function(err){
       if(err){
        res.redirect('/posts/'+req.body.id)
       }else{
       res.redirect('/posts')
       
       }
    });  
    
});
// update.exec(function(err, data){
//     if(err) throw err;

// })

router.get("/delete/:postId", async (req, res) => {
        try {
            const post = await Post.findByIdAndRemove({
                _id: req.params.postId
            });
            res.redirect('/posts')
        } catch (error) {
            res.status(500); 
        }
    });

// router.delete("/:postId", async (req, res) => {
//     try {
//         const post = await Post.findByIdAndRemove({
//             _id: req.params.postId
//         });
//         res.send(post)
//     } catch (error) {
//         res.status(500); 
//     }
// })

module.exports = router;