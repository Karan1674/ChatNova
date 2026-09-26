const mongoose = require("mongoose");

async function connectDb(){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("Error in MongoDB", error);
    }
}

module.exports = connectDb;