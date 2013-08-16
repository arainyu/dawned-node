var Menu = require('../controllers/admin/menu');
var utils = require('../common/utils');
var returnCode = require('../configs').returnCode;

var getResJson = function(err, docs) {
	if (err) {
		var msg = err.message || err;
		return utils.returnValue(returnCode.DB_ERROR, null, "数据库错误，操作失败！")
	} else {
		return utils.returnValue(returnCode.OK, (docs || null), "操作成功!");
	}
};

exports.index = function(req, res) {
	res.render('backend/admin/index', {
		title: '后台管理'
	});
};

exports.login = function(req, res) {
	res.render('backend/admin/login', {
		title: '管理员登录'
	});
};

exports.regist = function(req, res) {
	res.render('backend/admin/regist', {
		title: '管理员注册'
	});
};

exports.forgetpwd = function(req, res) {
	res.render('backend/admin/forgetpwd', {
		title: '忘记密码'
	});
};

exports.roles = function(req, res) {
	res.render('backend/admin/roles', {
		title: '角色管理'
	});
};

/*
	menus routes
*/
exports.menus = function(req, res) {
	Menu.getMenus(function(err, docs) {
		if (err) {
			res.render('backend/admin/menus', {
				title: '加载错误',
				menuData: null
			});
		}
		res.render('backend/admin/menus', {
			title: '菜单管理',
			menuData: docs
		});
	});
};

exports.menus.editMenuType = function(req, res) {
	//req.accepts('application/json');

	Menu.newAndSaveMenuType(req.body, function(err) {
		res.json(getResJson(err));
	});
};

exports.menus.deleteMenuType = function(req, res) {
	//req.accepts('application/json');

	var id = req.body.id || "";

	if (id == "") {
		res.json(getResJson("操作失误，不能删除该项。"));
		return;
	}

	Menu.delete(id, function(err) {
		res.json(getResJson(err));
	});
};

exports.menus.deleteMenu = function(req, res) {
	var id = req.body.id || "";
	var type = req.body.type || "";

	if (id == "" || type == "") {
		res.json(getResJson("操作失误，不能删除该项。"));
		return;
	}

	Menu.deleteMenu(type, id, function(err, docs) {
		res.json(getResJson(err));
	});
};

exports.menus.editMenu = function(req, res) {
	Menu.newAndSaveMenu(req.body, function(err) {
		res.json(getResJson(err));
	});
}