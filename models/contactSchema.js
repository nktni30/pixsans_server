const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true
    },
    message:{
        type: String,
        required: true
    }
});

//database name puts pluralss autmatically

const ContactMessage = mongoose.model('contactmessage', contactSchema);
module.exports = ContactMessage;