const User = require('../models/User')
const bcrypt = require("bcryptjs");

exports.save =  async (req,res) => {
	const {email} = req.body
	const {username} = req.body
	const {password} = req.body
	const userAlready = await User.findOne({email})
	const userNameAlready = await User.findOne({username})
	try {
		if(userAlready) {
			return res.status(409).json({status: 409,message: 'Tài khoản này đã tồn tại!'}) 
		} else if(userNameAlready) {
			return res.status(409).json({status: 409,message: 'Tên tài khoản này đã bị trùng!'})
		} else {
			const hashedPassword = await bcrypt.hash(password, 10)
			const user = new User({...req.body,password:hashedPassword}) 
			user.save()
			res.status(201).json({status: 201,message: "Tạo tài khoản thành công"})
		}
			
	} catch (error) {
		return res.status(500).json({message: "Internal server error"});
	}
} 