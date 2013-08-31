var Role = require('../../models').AdminRole;
var Menu = require('../../models').AdminMenu;

exports.getRoles = function(callback) {
	Role.find().lean().exec(callback);
};

exports.getRolesAndMenus = function(callback){
	Role.find().lean().exec(function(err,roles){
		if(err){
			callback(err);
			return;
		}else{
			Menu.find().lean().exec(function(err, menus){
				var docs = {
					roles: roles,
					menus: menus
				};

				callback(err, docs);
			});
		}
	});
};

exports.newAndSave = function(id, data, callback) {
	var roleData = {
		name: data.name,
		menus: data.menus || []
	};

	if (id === null) {
		var role = new Role(roleData);
		role.save(callback);
	} else {
		Role.update({
			_id: id
		}, roleData, callback);
	}
};

exports.delete = function(id, callback) {
	Role.remove({
		_id: id
	}, callback);
};
