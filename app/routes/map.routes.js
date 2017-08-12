let authController = require("../controllers/auth.controller.js");
let mapController = require("../controllers/map.controller.js");

module.exports = function(app){
	app.use("/api/:userId", authController.check);
	app.post("/api/:userId/maps", mapController.createMap);
	app.get("/api/:userId/maps", mapController.getUserMaps);
	app.delete("/api/:userId/maps/:mapId", mapController.deleteMap);
}