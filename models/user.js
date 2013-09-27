var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: {
		type: String,
		index: true
	},
	loginName: {
		type: String,
		unique: true
	},
	password: {
		type: String
	},
	email: {
		type: String,
		unique: true
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	},
	lastLogin: {
		date: {
			type: Date,
			default: Date.now
		},
		ip: String
	},

	url: {
		type: String
	},
	profileImageUrl: {
		type: String
	},
	location: {
		type: String
	},
	signature: {
		type: String
	},
	profile: {
		type: String
	},
	weibo: {
		type: String
	},
	avatar: {
		type: String
	},

	score: {
		type: Number,
		default: 0
	},
	topicCount: {
		type: Number,
		default: 0
	},
	replyCount: {
		type: Number,
		default: 0
	},
	followerCount: {
		type: Number,
		default: 0
	},
	followingCount: {
		type: Number,
		default: 0
	},
	collectTagCount: {
		type: Number,
		default: 0
	},
	collectTopicCount: {
		type: Number,
		default: 0
	},

});
mongoose.model('User', UserSchema);