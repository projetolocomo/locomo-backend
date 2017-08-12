var mongoose = require('mongoose');

module.exports = function() {
  var schema = mongoose.Schema({
    filename:{
      type: String,
      required: true
    },
    contentType:{
      type: String,
      required: false
    },
    creationDate:{
      type: Date,
      required: true
    },
    binaryData:{
      type: Buffer,
      required: true
    },
    audioDuration:{
      type: Number,
      required: false
    }
  });
  return mongoose.model('File', schema);
}();