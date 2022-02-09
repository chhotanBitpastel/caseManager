const router = require("express").Router();
const bodyParser = require("body-parser");
const Post = require("../model/Post");


router.get("/all-posts", async (req, res) => {
    try{
        const posts = await Post.find({},{'title':1,'content':1,'link':1,'image':1,'_id':0});
        //const posts = await Post.find({'write where condition'}, {_id :1, which field require})
        res.send(posts);
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