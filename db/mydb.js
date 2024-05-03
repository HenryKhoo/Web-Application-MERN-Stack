var mongoose = require( 'mongoose' ); 
const uri = process.env.MONGODB_URI;


const connectDB = async() =>{
    try {
        mongoose.connect(uri, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('mongoDB connected...');  
    } catch (error) {
        console.log('Mongoose default connection error: ' + err);
        process.exit(0); 
    }
}

module.exports = connectDB;
