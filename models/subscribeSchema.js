const mongoose = require('mongoose');

const subscribeSchema = new mongoose.Schema({
  
    email:{
        type: String,
        required: true
    },

});

//database name puts pluralss autmatically

const Subscribers = mongoose.model('subscribers', subscribeSchema);
module.exports = Subscribers;