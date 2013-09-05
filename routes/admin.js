var Menu = require('../controllers/admin/menu');
var Role = require('../controllers/admin/role');
var User = require('../controllers/admin/user');
var utils = require('../common/utils');
var rest = require('../common/rest');
var returnCode = require('../configs').returnCode;

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

exports..post.login = function(req, res) {
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

exports.users = function(req, res) {
	User.getUsersAndRoles(function(err, data) {
		if (err) {
			res.render('backend/admin/users', {
				title: '加载错误',
				roles: null,
				users: null
			});
		} else {
			res.render('backend/admin/users', {
				title: '管理员管理',
				roles: data.roles,
				users: data.users
			});
		}
	});
};

exports.roles = function(req, res) {
	Role.getRolesAndMenus(function(err, data) {
		if (err) {
			res.render('backend/admin/roles', {
				title: '加载错误',
				roles: null,
				menus: null
			});
		} else {
			res.render('backend/admin/roles', {
				title: '角色管理',
				roles: data.roles,
				menus: data.menus
			});
		}
	});
};
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


/* api */
exports.api = {
	menu: utils.extend({}, rest.API),
	menutype: utils.extend({}, rest.API),
	role: utils.extend({}, rest.API),
	user: utils.extend({}, rest.API)
};

/* user api */
exports.api.user.post = function(req, res) {
	var result = new rest.ApiResultModel(res, rest.method.POST);
	var acceptable = result.checkAcceptable(req.body.name === "" || req.body.password === "");
	
	if (acceptable) {
		req.body.password = utils.md5(req.body.password);

		User.newAndSave(null, req.body, function(err, data) {
			result.responseAPI.call(result, err, data);
		});
	}
};

exports.api.user.put = function(req, res) {

	var result = new rest.ApiResultModel(res, rest.method.PUT);
	var acceptable = result.checkAcceptable(!req.params.id);

	if (acceptable) {
		req.body.password = req.body.password !== "" ? utils.md5(req.body.password) : '';

		User.newAndSave(req.params.id, req.body, function(err, data) {
			result.responseAPI.call(result, err, data, 200);
		});
	}
};

exports.api.user.delete = function(req, res) {

	var result = new rest.ApiResultModel(res, rest.method.DELETE);
	var id = req.params.id;
	var acceptable = result.checkAcceptable(!id);

	if (acceptable) {
		User.delete(id, function(err, data) {
			result.responseAPI.call(result, err, data);
		});
	}
};

/* role api */
exports.api.role.post = function(req, res) {
	var result = new rest.ApiResultModel(res, rest.method.POST);

	Role.newAndSave(null, req.body, function(err, data) {
		result.responseAPI.call(result, err, data);
	});
};

exports.api.role.put = function(req, res) {

	var result = new rest.ApiResultModel(res, rest.method.PUT);
	var acceptable = result.checkAcceptable(!req.params.id);

	if (acceptable) {
		Role.newAndSave(req.params.id, req.body, function(err, data) {
			result.responseAPI.call(result, err, data, 200);
		});
	}
};

exports.api.role.delete = function(req, res) {

	var result = new rest.ApiResultModel(res, rest.method.DELETE);
	var id = req.params.id;
	var acceptable = result.checkAcceptable(!id);

	if (acceptable) {
		Role.delete(id, function(err, data) {
			result.responseAPI.call(result, err, data);
		});
	}
};

/* menu api */
exports.api.menutype.post = function(req, res) {
	var result = new rest.ApiResultModel(res, rest.method.POST);

	Menu.newAndSaveMenuType(null, req.body, function(err, data) {
		result.responseAPI.call(result, err, data);
	});
};

exports.api.menutype.put = function(req, res) {

	var result = new rest.ApiResultModel(res, rest.method.PUT);
	var acceptable = result.checkAcceptable(!req.params.id);

	if (acceptable) {
		Menu.newAndSaveMenuType(req.params.id, req.body, function(err, data) {
			result.responseAPI.call(result, err, data);
		});
	}
};

exports.api.menutype.delete = function(req, res) {

	var result = new rest.ApiResultModel(res, rest.method.DELETE);
	var id = req.params.id;
	var acceptable = result.checkAcceptable(!id);

	if (acceptable) {
		Menu.delete(id, function(err, data) {
			result.responseAPI.call(result, err, data);
		});
	}
};

exports.api.menu.post = function(req, res) {

	var result = new rest.ApiResultModel(res, rest.method.POST);

	Menu.newAndSaveMenu(null, req.body, function(err, data) {
		result.responseAPI.call(result, err, data);
	});
};

exports.api.menu.put = function(req, res) {

	var result = new rest.ApiResultModel(res, rest.method.PUT);
	var acceptable = result.checkAcceptable(!req.params.id);

	if (acceptable) {
		Menu.newAndSaveMenu(req.params.id, req.body, function(err, data) {
			result.responseAPI.call(result, err, data);
		});
	}
};

exports.api.menu.delete = function(req, res) {

	var result = new rest.ApiResultModel(res, rest.method.DELETE);
	var type = req.body.type || false;
	var id = req.params.id;
	var acceptable = result.checkAcceptable(!id || !type);

	if (acceptable) {
		Menu.deleteMenu(type, id, function(err, data) {
			result.responseAPI.call(result, err, data);
		});
	}
};