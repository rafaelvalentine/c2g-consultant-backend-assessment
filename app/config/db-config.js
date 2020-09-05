import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config()

mongoose.Promise = global.Promise

const db_url = process.env.MONGODB_URI;
const db = mongoose.connection

db.on('error', () => {
    console.log('> error occured from the database')
})
db.once('open', () => {
    console.log('> successfully opened the database')
})
export default () =>
mongoose.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})