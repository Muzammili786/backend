const dotenv = require("dotenv").config();
const express = require('express');
const connectDB = require("./db/conn");
const app = express();
app.use(express.urlencoded())

const User = require('./model/userSchema');
connectDB();
app.use(express.json());
// we link the router files to make our route easy
app.use(require('./router/auth'));

const PORT = process.env.PORT;

// const middleware = (req,res, next)=>{
//     console.log('hello middleware');
// }

// app.get('/', (req, res) => {
//     res.send('hello world server');
// });
app.get('/main',(req, res, next) => {
    res.send('hello world middleware');
    next();
});
app.get('/login', (req, res) => {
    res.send('hello login');
});

app.get('/signup', (req, res) => {
    res.send('hello signup');
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})