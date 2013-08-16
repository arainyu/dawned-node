var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AdminUserSchema = new Schema({
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
	role: {
		type: Schema.Types.ObjectId,
		ref: 'AdminRole'
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
	}
});

var AdminRoleSchema = new Schema({
	name: {
		type: String,
		unique: true
	},
	updateDate: {
		type: Date,
		default: Date.now
	},

	menus: [{
		type: Schema.Types.ObjectId,
		ref: 'AdminMenu'
	}]
});

var AdminMenuSubSchema = new Schema({
	name: {
		type: String
	},
	url: {
		type: String,
	},
	type: {
		type: Schema.Types.ObjectId
	},
	params: {
		type: String
	},
	orderId: {
		type: Number,
		index: true
	},

	updateDate: {
		type: Date,
		default: Date.now
	}
});

var AdminMenuSchema = new Schema({
	name: {
		type: String,
		unique: true
	},
	orderId: {
		type: Number,
		index: true
	},
	menus: [ AdminMenuSubSchema ],
	updateDate: {
		type: Date,
		default: Date.now
	}
});


mongoose.model('AdminUser', AdminUserSchema);
mongoose.model('AdminRole', AdminRoleSchema);
mongoose.model('AdminMenu', AdminMenuSchema);