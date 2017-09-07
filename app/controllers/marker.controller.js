let UserMap = require('../models/map.model.js');
let Marker = require('../models/marker.model.js');

module.exports.createMarker = function(req, res){
	console.log(req.body);
	let type = req.body.type;
	let name = req.body.properties.name;
	let textualDescription = req.body.properties.textualDescription;
	let voiceDescriptionId = req.body.properties.voiceDescriptionId;
	let pictureId = req.body.properties.pictureId;
	let mapId = req.params.mapId;
	let coordinates = req.body.geometry.coordinates;
	let marker = new Marker({
		type: type,
		properties:{
			name: name,
			textualDescription: textualDescription,
			voiceDescriptionId: voiceDescriptionId,
			pictureId: pictureId,
			mapId: mapId
		},
		geometry:{
			coordinates: coordinates
		}
	});
	let MarkerCreation = Marker.create(marker).then(
		function(marker){
			UserMap.findOneAndUpdate({_id:mapId}, {$inc:{markerCount:1}}, {upsert:true}).exec();
			res.status(201).json(marker);
		},
		function(error){
			res.status(500).json(error);
		}
	)
}

module.exports.getMapMarkers = function(req, res){
	let mapId = req.params.mapId;
	Marker.find({'properties.mapId':mapId}).exec().then(
		function(markers){
			res.status(200).json(markers);
		},
		function(error){
			res.status(500).json(error);
		}
	)
}