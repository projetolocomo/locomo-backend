var mongoose = require('mongoose');

module.exports = function() {
  var schema = mongoose.Schema({
    type:{
      type: String,
      default: "Point",
      required: false
    },
    properties:{
      name:{ 
        type: String,
        required: true
      },
      textualDescription:{
        type: String,
        required: false 
      },
      voiceDescriptionId:{
        type: mongoose.Schema.ObjectId,
        ref: 'File',
        required: false
      },
      pictureId:{
        type: mongoose.Schema.ObjectId,
        ref: 'File',
        required: false
      },
      mapId:{
        type: mongoose.Schema.ObjectId,
        ref: 'UserMap',
        required: true
      },
      creationDate:{
        type: Date,
        default: Date.now,
        required: false
      }
    },
    geometry:{
      coordinates:{ 
        type: [Number],
        required: true
      }
    }
  });
  return mongoose.model('Marker', schema);
}();