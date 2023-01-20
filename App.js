const dotenv = require('dotenv')
const mongoose = require('mongoose');
const express = require('express');
const app = express();

dotenv.config({path:'./config.env'});

//link database connection
require('./db/conn')

app.use(express.json());

//link router for route page
app.use(require('./router/auth'));

const PORT = process.env.PORT;


const middleware = (req, res, next) => {
    console.log(`hello from middleware`);
    next();
}

app.get('/', (req, res) => {
    res.send(`hello world from the server`);
});

app.get('/about', middleware, (req, res) => {
    res.send(`hello from about`);
    res.send(`hello about from server`);
});

app.get('/contact', (req, res) => {
    res.send(`hello from contact`);
});

app.get('/admin_login', (req, res) => {
    res.send(`hello from admin login page`);
});

app.get('/admin_register', (req, res)=>{
    res.send(`hello from admin register`)
});

app.get('/subscribe', (req, res)=>{
    res.send(`hello from subscribe`)
})


app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
})