var Menu = require('../../models').AdminMenu;
var returnCode = require('../../configs').returnCode;

var getAllMenus = function(callback) {
	Menu.find().lean().exec(callback);
};

var returnMenus = function(err, callback) {
	if (err) {
		callback(err, null);
		return;
	}

	getAllMenus(callback);
};

exports.getMenus = function(callback) {
	Menu.find().lean().exec(callback);
};

exports.newAndSaveMenuType = function(id, data, callback) {
	var menu = {
		name: data.name,
		orderId: data.orderId || 0
	};

	if (id === null) {
		var menuType = new Menu(menu);
		menuType.save(callback);
	} else {
		Menu.update({
			_id: data._id
		}, menu, callback);
	}
};

exports.delete = function(id, callback) {
	Menu.remove({
		_id: id
	}, callback);
};

exports.newAndSaveMenu = function(id, data, callback) {
	Menu.findById(data.type, function(err, doc) {
		if (err) {
			callback(err, null);
			return;
		}

		var menu = {
			name: data.name,
			url: data.url,
			params: data.params,
			orderId: data.orderId,
			type: data.type
		};

		if (id === null) {
			doc.menus.push(menu);
			menu._id = doc.menus[0]._id;
		} else {
			doc.menus.id(data._id).set(menu);
			menu._id = data._id;
		}

		doc.save(function(err){
			callback(err, menu);
		});
	});
};

exports.deleteMenu = function(type, id, callback) {
	Menu.findById(type, function(err, doc) {
		if (err) {
			callback(err, null);
			return;
		}

		doc.menus.id(id).remove();
		doc.save(callback);
	});
};
