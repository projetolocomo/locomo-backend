var mongoose = require('mongoose');

module.exports = function() {
	var schema = mongoose.Schema({
        name:{
			type: String,
			required: true
		},
        description:{
            type: String,
            required: false
        },
        creationDate:{
            type: Date,
            required: false
        },
        creatorId:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: false
        }
    });
	return mongoose.model('Map', schema);
}();