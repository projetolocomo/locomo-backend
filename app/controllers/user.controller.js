let bcrypt = require('bcrypt');
let User = require('../models/user.model.js');
let authController = require('../controllers/auth.controller.js');

module.exports.createAccount = function(req, res){
	let user = new User({
		name: req.body.name,
		age: req.body.age,
		school: req.body.school,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	});
	User.findOne({email: user.email}, function(err, obj){
		if (!obj){
			let promise = User.create(user);
			promise.then(
				function(user){
					res.status(201).json({id:user._id, name:user.name, surname:user.surname, token:authController.generateToken(user)});
				},
				function(error){
					res.status(500).json(error);
				}
			);
		} else {
			res.status(409).send("emailAlreadyTaken");
		}
	});
}