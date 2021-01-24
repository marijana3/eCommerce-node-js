const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    userID: {type:String},
    timestamp: {
        type: Date,
        default: Date.now
    },
    total: {type: Number}
});

mongoose.model('Order', orderSchema);