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

exports.newAndSaveMenuType = function(data, callback) {
	var menu = {
		name: data.name,
		orderId: data.orderId || 0
	};

	if (data._id === "") {
		var menuType = new Menu(data);
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

exports.newAndSaveMenu = function(data, callback) {
	Menu.findById(data.type, function(err, doc) {
		if (err) {
			returnMenus.call(null, err, callback);
			return;
		}

		var menu = {
			name: data.name,
			url: data.url,
			params: data.params,
			orderId: data.orderId,
			type: data.type
		};

		if (data._id == "") {
			doc.menus.push(menu);
			doc.save(function(err) {
				returnMenus.call(null, err, callback);
			});
		} else {
			doc.menus.id(data._id).set(menu);
			doc.save(function(err) {
				returnMenus.call(null, err, callback);
			});
		}
	});
};

exports.deleteMenu = function(type, id, callback) {
	Menu.findById(type, function(err, doc) {
		if (err) {
			returnMenus.call(null, err, callback);
			return;
		}

		doc.menus.id(id).remove();
		doc.save(function(err) {
			returnMenus.call(null, err, callback);
		});
	});
};