var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AdminUserSchema = new Schema({
	name: { type: String, index: true },
	loginName: { type: String, unique: true },
	password: { type: String },
	email: { type: String, unique: true },
	role: { type: Schema.Types.ObjectId, ref: 'AdminRole'},
	createDate: { type: Date, default: Date.now },
	updateDate: { type: Date, default: Date.now },
	lastLogin: {
		date: { type: Date, default: Date.now },
		ip: String
	}
});

var AdminRoleSchema = new Schema({
	name: { type: String, unique: true },
	createDate: { type: Date, default: Date.now },
	updateDate: { type: Date, default: Date.now },

	users: [{ type: Schema.Types.ObjectId, ref: 'AdminUser' }]
});

var AdminMenuSchema = new Schema({
	name: { type: String, unique: true },
	roles: [{ type: Schema.Types.ObjectId, ref: 'AdminRole' }],
	orderId: {type: Number, index: true},
	menus: [{
		_id: { type: Schema.Types.ObjectId},
		name: { type: String },
		url: { type: String,},
		params: { type: String},
		roles: [{ type: Schema.Types.ObjectId, ref: 'AdminRole' }],
		orderId: {type: Number, index: true},

		createDate: { type: Date, default: Date.now },
		updateDate: { type: Date, default: Date.now }
	}],
	createDate: { type: Date, default: Date.now },
	updateDate: { type: Date, default: Date.now }
});

mongoose.model('AdminUser', AdminUserSchema);
mongoose.model('AdminRole', AdminRoleSchema);
mongoose.model('AdminMenu', AdminMenuSchema);