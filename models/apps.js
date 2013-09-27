var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
	name: {
		type: String,
		index: true
	},
	domain: {
		type: String
	},
	route:{
		type: String
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	},
	info: {
		logo: {
			type: String
		},
		description: {
			type: String
		},
		key: {
			type: String
		}
	},
	userCount: {
		type: Number
	}
});
mongoose.model('Application', ApplicationSchema);