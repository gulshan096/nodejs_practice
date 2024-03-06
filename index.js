import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
// import crud from './models/schema.js';
import route from './routes/route.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT;
const URL = process.env.MONGOURL;
console.log(URL);

mongoose.connect("mongodb+srv://devgtech2k22:Pace2024@cluster0.ucebirk.mongodb.net/crudApp01").then(() => {

    console.log("db connected successfully");
    app.listen(PORT, () => {
        console.log(`server is running on port: ${PORT}`);
    })

}).catch(error => console.log(error))

app.use("/api", route);
