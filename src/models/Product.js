const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    image: {type: [String]},
    description: {type: String},
    discount: {type: Number}
});
 
module.exports = mongoose.model('Product', productSchema)