const User = require("../models/User")
const jwt = require("jsonwebtoken");

exports.userLogin = async (req, res) => {
	const {email,password} = req.body

	try {
		const user = await User.findOne({email,password});
		if(!user) {
			return res.status(401).json({message: "Tài khoản hoặc mật khẩu không đúng!"})
		} else {
			const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES_IN
			  });
			res.status(200).json({message: "Đăng nhập thành công!",token})
		}

	} catch (error) {
		console.log("login error", error)
		res.status(500).json({message: "Internal server error"});
	}
}
