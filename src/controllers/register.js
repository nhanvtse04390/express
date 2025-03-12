const User = require('../models/User')

exports.save =  async (req,res) => {
	const user = new User(req.body) 
	const {email} = req.body
	const userAlready = await User.findOne({email})
	try {
		if(userAlready) {
			return res.status(409).json({status: 409,message: 'Tài khoản này đã tồn tại!'}) 
		} else {
			user.save()
			res.status(201).json({status: 201,message: "Tạo tài khoản thành công"})
		}
			
	} catch (error) {
		return res.status(500).json({message: "Internal server error"});
	}
} 