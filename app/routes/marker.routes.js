let authController = require('../controllers/auth.controller.js');
let markerController = require('../controllers/marker.controller.js');

module.exports = function(app){
	app.use('/api/:userId', authController.check);
	app.post('/api/:userId/:mapId/markers', markerController.createMarker);
	app.get('/api/:userId/:mapId/markers', markerController.getMapMarkers);
	// app.delete("/api/:userId/maps/:mapId", markerController.deleteMap);
}