const router = require("express").Router();
const mongoose = require('mongoose');
const multer  = require('multer');
const path = require('path');

const Post = mongoose.model("Post");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/uploads'))
    },
    filename: function (req, file, cb) {
        //cb(null, file.originalname)
        cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
  })

//var storage = multer.diskStorage({
   // destination: function (req, file, cb) {
      //cb(null, './public/uploads/')

   // },
   // filename: function (req, file, cb) {
      //cb(null, file.originalname)
    //  cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    //}
//})

var upload = multer({ storage: storage }).single('file');

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
router.post("/", upload, async (req, res) => {
    try {
        const post = new Post();
        post.title = req.body.title;
        post.content = req.body.content;
        post.link = req.body.link;
        post.image = req.file.filename;
        //post.image = req.file.path;
        //console.log(req.file);
        await post.save();
        const posts = await Post.find({})
        res.render("pages/allposts", {allposts:posts});
    } catch (error) {
        res.status(500);
    }
    res.send(req.body);
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

router.post("/edit/", async (req, res) => {
   try {
    var post_id=req.body.id;

       const post = await Post.findByIdAndUpdate({
           _id: post_id
       }, req.body,{
        new: true,
        runValidators: true
       });
       const posts = await Post.find({})
       res.render("pages/allposts", {allposts:posts});
   } catch (error) {
      res.status(500); 
   }
});

router.delete("/:postId", async (req, res) => {
    try {
        const post = await Post.findByIdAndRemove({
            _id: req.params.postId
        });
        res.send(post)
    } catch (error) {
        res.status(500); 
    }
})

module.exports = router;