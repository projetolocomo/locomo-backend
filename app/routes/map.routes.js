let authController = require("../controllers/auth.controller.js");
let mapController = require("../controllers/map.controller.js");

module.exports = function(app){
	app.use("/api/:userId", authController.check);
	app.post("/api/:userId/maps", mapController.createMap); //create and update a map
	app.get("/api/:userId/maps", mapController.getUserMaps);
	app.delete("/api/:userId/maps", mapController.deleteMap); //the map id is not sent with the url, but with the body 
}