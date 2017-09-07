var mongoose = require('mongoose');

module.exports = function() {
  var schema = mongoose.Schema({
    name:{
      type: String,
      required: true
    },
    textualDescription:{
      type: String,
      required: false
    },
    voiceDescription:{
      type: mongoose.Schema.ObjectId,
      ref: 'File',
      required: false
    },
    creationDate:{
      type: Date,
      required: true
    },
    userId:{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    markerCount:{
      type:Number,
      required: false
    }
  });
  return mongoose.model('UserMap', schema);
}();