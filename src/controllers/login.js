const User = require("../models/User")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.userLogin = async (req, res) => {
	const {email,password} = req.body

	try {
		const user = await User.findOne({email});
		if(!user) {
			return res.status(401).json({status: 401,message: "Tài khoản hoặc mật khẩu không đúng!"})
		} else {
			const isMatch = await bcrypt.compare(password,user.password)
			if(isMatch) {
				const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_IN
				  });
				res.status(200).json({status: 401,message: "Đăng nhập thành công!",token})
			} else {
				return res.status(401).json({status: 401,message: "Tài khoản hoặc mật khẩu không đúng!"})
			}
		}

	} catch (error) {
		console.log("login error", error)
		res.status(500).json({message: "Internal server error"});
	}
}
