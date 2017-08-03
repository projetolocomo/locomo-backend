let authController = require("../controllers/auth.controller.js");
let userController = require("../controllers/user.controller.js");

module.exports = function(app){
	app.post("/api/login", authController.login);
	app.post("/api/signup", userController.createAccount);
}