var Menu = require('../../models').AdminMenu;
var returnCode = require('../../configs').returnCode;

var getAllMenus = function(callback){
	Menu.find().lean().exec(callback);
};

exports.getMenus = getAllMenus;

exports.newAndSave = function(name, orderId, menus, roles, callback){
	var menuType = new Menu();

		menuType.name = name;
		menuType.orderId = orderId;
		menuType.roles = menus||[];
		menuType.menus = roles||[];

	menuType.save(function(err){
		if(err){
			callback(err, null);
		}

		getAllMenus(callback);
	});
};