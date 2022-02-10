//table create korar jonno schema defile korbo
const mongoose= require("mongoose");

const admin_schema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
       
    },
    password: {
        type: String,
        require: true
    },
    added_date: {
        type: Date,
        default: Date.now
    }
},{ versionKey: false })

module.exports = mongoose.model("Admin", admin_schema);