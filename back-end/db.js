const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/notesdb';


const dbConnection = async () => {
    try {
       await mongoose.connect(mongoURI, () => {
            console.log("Connected to mongo successfully")
        })
    } catch (error) {
        console.log(mongoURI)
    }
}

module.exports = dbConnection;