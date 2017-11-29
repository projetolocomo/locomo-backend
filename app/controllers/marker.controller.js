let UserMap = require('../models/map.model.js');
let Marker = require('../models/marker.model.js');
let File = require('../models/file.model.js');

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
	);
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
	);
}

module.exports.deleteMarker = function(req, res){
	let markerID = req.body._id;
	let mapID = req.body.properties.mapId;
	let userID = req.params.userID;
	let savedMarker = Marker.findOne({_id:markerID}).exec().then(
		function(marker){
			if (marker.properties.pictureId){
				File.findByIdAndRemove({_id:marker.properties.pictureId}).exec();
			}
			if (marker.properties.voiceDescriptionId){
				File.findByIdAndRemove({_id:marker.properties.voiceDescriptionId}).exec();
			}
			Marker.findByIdAndRemove({_id:marker._id}).exec().then(
				function(success){
					UserMap.findByIdAndUpdate(mapID, {$inc: {markerCount:-1}}).exec();
					res.status(200).json({"ok":"removed successfully"});
				},
				function(error){
				  res.status(500).json(error);
				}
			)
		},
		function(error){
			res.status(500).json(error);
		}
	)
}