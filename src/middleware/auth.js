const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '')
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

		if (!user) {
			throw new Error()
		}
		req.token = token
		req.user = user
		next()
		console.log(decoded._id)
		console.log(token)
		console.log(user)
	} catch (e) {
		res.status(404).send({ Error: 'Please Authenticate' })
	}
	//console.log('Auth middleware')
	//next()
}

module.exports = auth
