let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let User = require('../models/user.model.js');
let sensitiveData = require('../../sensitive-data.js');

module.exports.login = function(req, res){
	User.findOne({email:req.body.email}, function(err, user){
		if (!user){
			res.status(401).send("notFound");
		} else {
			if (!bcrypt.compareSync(req.body.password, user.password)) {
				res.status(401).send("passwordsMismatch");
			} else {
				res.status(201).json({id:user._id, name:user.name, token:jwt.sign({_id:user._id}, sensitiveData.authenticationSecret)});
			}
		}
	});
}

module.exports.generateToken = function(user){
	return jwt.sign({_id:user._id}, sensitiveData.authenticationSecret);
}

//ID é enviado por parâmetro!!!
module.exports.check = function(req, res, next){
	jwt.verify(req.query.token, sensitiveData.authenticationSecret, function(err, decodedToken){
		if (decodedToken) {
			if (decodedToken._id == req.params.userId){
				next();
			} else {
				res.status(401).send("notAuthorized");
			}
		} else {
			res.status(401).send("notAuthenticated");
		}
	});
}