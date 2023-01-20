const mongoose = require('mongoose');
const express = require('express');
const serverRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('../db/conn');
const ContactMessage = require('../models/contactSchema');
const Subscribers = require('../models/subscribeSchema');
const Admin = require('../models/adminSchema');

serverRouter.get('/', (req, res) => {
    res.send(`hello world from router js`);
});

//Subscribe Email

serverRouter.post('/subscribe', async (req, res)=>{
    const{email}= req.body;

    if (!email) {
        return res.status(422).json({error: "Its Required"})
    }

    try{
        const alreadySubscribed = await Subscribers.findOne({email: email});

        if (alreadySubscribed){
            return res.status(422).json({error: "You are our existing subscriber"});
        }

        const PixSubscriber = new Subscribers({email});

        await PixSubscriber.save();
        res.status(201).json({ message: "Subscribed Successfully"});
    } catch(err){
        console.log(err);
    }
});

//Contact-route
serverRouter.post('/contact', async (req, res) => {
    const { name, email, mobile, message } = req.body;

    if (!name || !email || !mobile || !message) {
        return res.status(422).json({ error: "Its Required" });
    }

    try {

        const alreadyMessaged = await ContactMessage.findOne({ email: email, mobile: mobile });

        if (alreadyMessaged) {
            return res.status(422).json({ error: "You have already queried" });
        }

        const contact = new ContactMessage({ name, email, mobile, message });

        await contact.save();
        res.status(201).json({ message: "Query Send Succesfully" });

        // if(newMessage){
        //     res.status(201).json({message: "Query send Succesfully"});
        // } else{
        //     res.status(500).json({error:"Failed to send query"})
        // }

    } catch (err) {
        console.log(err);
    }
});

// Admin Register
serverRouter.post('/admin_register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Field Required" });
    }
    try {
        const adminExist = await Admin.findOne({ email: email });
        if (adminExist) {
            return res.status(422).json({ error: "Admin already Exist" });
        }

        const RegAdmin = new Admin({ name, email, password });

        // password secure

        await RegAdmin.save();
        res.status(201).json({ message: "Admin register Suucesfully" });
    } catch (err) {
        console.log(err);
    }
});

// Admin login route

serverRouter.post('/admin_login', async (req, res) => {
    // console.log(req.body);
    // res.json({message: "ho gya"});
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please Fill the login credentials" })
        }

        const adminlogin = await Admin.findOne({ email: email });
        // console.log(adminlogin);
        if (adminlogin){
            const passMatch = await bcrypt.compare(password, adminlogin.password);

            // token generation
            const token = await adminlogin.generateAuthtoken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires:new Date(Date.now()+ 3600000),
                httpOnly: true

            });

        if (!passMatch) {
            res.status(400).json({ error: "Invalid Credentials" });
        } else {
            res.json({ message: "Admin Login Succesfull" });
        }

        }else{
            res.status(400).json({ error: "invalid Credentials" });
        }

    } catch (err) {
        console.log(err);
    }
})

module.exports = serverRouter;