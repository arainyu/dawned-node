var Role = require('../../models').AdminRole;
var Menu = require('../../models').AdminMenu;
var User = require('../../models').AdminUser;
exports.getUsers = function(callback) {
	User.find().lean().exec(callback);
};
exports.getUsersAndRoles = function(callback) {
	User.find().populate('role').lean().exec(function(err, users) {
		if (err) {
			callback(err);
			return;
		} else {
			Role.find().lean().exec(function(err, roles) {
				var docs = {
					roles: roles,
					users: users
				};
				callback(err, docs);
			});
		}
	});
};
exports.newAndSave = function(id, data, callback) {
	var userData = {
		name: data.name,
		email: data.email,
		role: data.role,
		lastLogin: data.lastLogin,
		updateDate: new Date()
	};
	if (id === null) {
		userData.loginName = data.loginName;
		userData.password = data.password;
		var user = new User(userData);
		user.save(function(err, docs) {
			if (err) {
				callback(err, docs);
				return;
			}
			docs.populate('role', callback);
		});
	} else {
		User.findById(id, function(err, doc) {
			if (err) {
				callback(err, null);
				return;
			}
			if (data.password !== '') {
				userData.password = data.password;
			}
			doc.set(userData);
			doc.save(function(err, docs) {
				if (err) {
					callback(err, docs);
					return;
				}
				docs.populate('role', callback);
			});
		});
	}
};
exports.delete = function(id, callback) {
	User.remove({
		_id: id
	}, callback);
};
exports.login = function(loginName, password, ip, callback) {
	var self = this;
	var hadHandleError = function(err, doc, callback) {
		if (err || !doc) {
			callback(err, doc);
			return true;
		}
		return false;
	};
	User.findOne({
		loginName: loginName,
		password: password
	}).exec(function(err, doc) {
		if (hadHandleError(err, doc, callback)) return;

		doc._doc.lastLogin = {
			ip: ip,
			date: new Date()
		};

		doc.save(function(err, user) {

			if (hadHandleError(err, user, callback)) return;

			Role.findOne({
				_id: user.role
			}).populate('menus').exec(function(err, role) {

				if (hadHandleError(err, user, callback)) return;

				user = user.toObject();
				user.role = role;
				callback(null, user);

			});
		});
	});
};