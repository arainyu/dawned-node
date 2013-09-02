var Role = require('../../models').AdminRole;
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
		loginName: data.loginName,
		password: data.password,
		email: data.email,
		role: data.role,
		lastLogin: data.lastLogin,
		updateDate: new Date()
	};


	if (id === null) {
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