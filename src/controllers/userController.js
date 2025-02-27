const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json({message: err.message})
	}
};

exports.createUser = async (req, res) => {
	const user = new User(req.body);
	try {
		const savedUser = await user.save();
		res.status(201).json(savedUser);
	} catch (err) {
		res.status(400).json({message: err.message})
	}
}