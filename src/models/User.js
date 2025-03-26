const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	phone:  { type: String, required: true, unique: true },
	address:  { type: String, required: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	codeRef: {type: String},
	isAdmin: {type: Boolean, default: false},
	isActive: {type: Boolean, default: true},
});
 
module.exports = mongoose.model('User', userSchema)