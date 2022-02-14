const mongoose = require('mongoose');
require("dotenv").config();
//const uri= process.env.MONGOURI
//mongoose.Promise= global.Promise;
mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`connection successfull`);
}).catch((err) => console.log(err));

module.exports = mongoose;