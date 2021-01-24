const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    type: {type:String},
    src: {type:String},
    price: {type:Number}
});

mongoose.model('Product', productSchema);