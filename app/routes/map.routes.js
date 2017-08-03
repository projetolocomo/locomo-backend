let authController = require("../controllers/auth.controller.js");
let mapController = require("../controllers/map.controller.js");

module.exports = function(app){
	app.use("/", authController.check);
	// app.post("/api/signup", mapController.createAccount);
}