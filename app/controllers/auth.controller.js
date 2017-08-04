let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let User = require('../models/user.model.js');

let secret = '2B671F3ECEE7BBCD79DFE60DB8ED369BE57DA1D7D8EA1AED416D9DDA2FD2EABF';

module.exports.login = function(req, res){
	User.findOne({email:req.body.email}, function(err, user){
		if (!user){
			res.status(401).send("notFound");
		} else {
			if (!bcrypt.compareSync(req.body.password, user.password)) {
				res.status(401).send("passwordsMismatch");
			} else {
				res.status(201).json({id:user._id, name:user.name, token:jwt.sign({_id:user._id}, secret)});
			}
		}
	});
}

module.exports.generateToken = function(user){
	return jwt.sign({_id:user._id}, secret);
}

module.exports.check = function(req, res, next){
	jwt.verify(req.query.token, secret, function(err, decoded) {
		if (err) {
			res.status(401).json({error: "notAuthenticated"});
		}
		next();
	});
}