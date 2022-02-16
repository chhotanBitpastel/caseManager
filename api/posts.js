const router = require("express").Router();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Post = require("../model/Post");


router.get("/all-posts", async (req, res) => {
    try{
        const posts = await Post.find({},{'title':1,'content':1,'link':1,'image':1}).sort({sequence: 1});
        //const posts = await Post.find({'write where condition'}, {_id :1, which field require})
        res.send(posts);
    } catch(error){
      res.status(500);
    }
});

router.get("/footer_details", async (req, res) => {
    try{

        var footers={};
        const db1 = mongoose.connection.db;

    //   await  db1.collection('social_link').find({link :{$ne:''}}).sort({priority: 1}).toArray(function(err, results){
            
    //     footers['links']=results;
    //     //footers['footer_text']= "Copyright © 2022 All Right Reserved.";
    //     var foot= db1.collection('footer').findOne({uid:"1"}); 
    //      footers['footer_text']=foot.footer_text;

    //    res.send(footers);
    //     });
        
        var links= await  db1.collection('social_link').find({link :{$ne:''}}).sort({priority: 1}).toArray();
        var footer_text= await db1.collection('footer').findOne({uid:"1"}); 
        footers['links']=links;
        footers['footer_text']= footer_text.footer_text;

        res.send(footers);
        
    } catch(error){
      res.status(500);
    }
});



router.post("/add-post", async (req, res) => {
    try {
   const post = new Post();
   post.title = req.body.title;
   post.content = req.body.content;
   post.link = req.body.link;
   
   await post.save();
     
    res.send("Successfully save data");
} catch (error) {
    res.status(500);
}

res.send(req.body);       
    
});


module.exports = router;