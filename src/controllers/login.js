const User = require("../models/User")
const Users = require("../models/User")

exports.userLogin = async (req, res) => {
	const {email} = req.body

	try {
		const user = await User.findOne({email});
		if(!user) {
			return res.status(401).json({message: "Tai khoan hoac mat khau khong dung"})
		} else {
			res.status(200).json({message: "ban da tao tai khoan thanh cong!!!"})
		}

	} catch (error) {
		console.log("Loing error", error)
		res.status(500).json({message: "Internal server error"});
	}
}
