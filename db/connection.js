const mongoose = require('mongoose');
require("dotenv").config();


exports.connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
    }).then(() => console.log('mongoose connect successfully'))
    .catch((err) => {
        console.log("DB Connection Failed")
        console.log(err),
        process.exit(1)
    });
}