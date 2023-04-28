require('dotenv').config();
const mongoose = require('mongoose');
const db = process.env.MONGODB_URI;
// console.log(db)
const config = require('config');
// const db = config.get('mongoURI');
// console.log('db: ', db);
// Connect Database
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
