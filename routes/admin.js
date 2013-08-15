
var Menu = require('../controllers/admin/menu');
var utils = require('../common/utils');
var returnCode = require('../configs').returnCode;

exports.index = function(req, res){
  res.render('backend/admin/index', { title: '后台管理' });
};

exports.login = function(req, res){
  res.render('backend/admin/login', { title: '管理员登录' });
};

exports.regist = function(req, res){
  res.render('backend/admin/regist', { title: '管理员注册' });
};

exports.forgetpwd = function(req, res){
  res.render('backend/admin/forgetpwd', { title: '忘记密码' });
};

exports.roles = function(req, res){
  res.render('backend/admin/roles', { title: '角色管理' });
};

/*
	menus routes
*/
exports.menus = function(req, res){
	Menu.getMenus(function(err, docs){
		if(err){
			res.render('backend/admin/menus', { title: '加载错误', menuData: null });
		}
		res.render('backend/admin/menus', { title: '菜单管理', menuData: docs });
	});
};

exports.menus.editMenuType = function(req, res){
	req.accepts('application/json');

	var menu = {
		name: req.body.name,
		orderId: req.body.orderId,
		roles: req.body.roles||[],
		menus: req.body.menus||[]
	};

	if(req.body.id==""){
		Menu.newAndSave(menu.name, menu.orderId, menu.roles, menu.menus, function(err, docs){
			if(err){
				res.json(utils.returnValue(returnCode.DB_ERROR, null, "保存失败，数据库错误。"));
			}

			res.json(utils.returnValue(returnCode.OK, docs, "保存成功。"))
		});
	}
}