//table create korar jonno schema defile korbo
const mongoose= require("mongoose");

const post_schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    link:String,
    image:String,
    sequence:Number,
},{ versionKey: false })

module.exports = mongoose.model("Post", post_schema);