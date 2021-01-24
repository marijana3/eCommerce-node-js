const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique : true,
        required: true,
        dropDups: true
    },
    username:{
        type: String,
        unique : true,
        required: true,
        dropDups: true
    },
    password:{
        type: String,
        required: true
    },
    admin:{
        type: Number,
        default: 0
    }
});

mongoose.model('User', userSchema);