/**
 * Module dependencies.
 */

var express = require('express'),
	configs = require('./configs'),
	routes = require('./routes'),
	user = require('./routes/user'),
	admin = require('./routes/admin'),
	http = require('http'),
	path = require('path');

var app = express();
var adminAPI = ['menu', 'menutype', 'role', 'user'];
var getDefaultApiUrl = function(moduleName, type) {
	var _default = '/' + type + '/api/' + moduleName;
	var _bringId = _default + '/:id';

	return {
		getById: _bringId,
		getAll: _default,
		search: _default + '/search/',
		post: _default,
		put: _bringId,
		delete: _bringId
	};
};

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(function(req, res, next) {
		res.locals.csrf = req.session ? req.session._csrf : '';
		res.locals.req = req;
		res.locals.session = req.session;
		next();
	});
	app.use(app.router);
	app.use(require('less-middleware')({
		src: __dirname + '/public'
	}));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});


app.all("*", function(req, res, next) {
	var path = req.path;
	var adminApiRegex = /^\/admin\/api\/([^\/\?]*)/;
	var adminReg = /^\/admin\/([^\/\?]*)/;
	var loginReg = /^(login|logout|regist|forgetpwd|api)[\/\?]?[\w]*/

	if (adminApiRegex.test(path) && !loginReg.test(RegExp.$1)) {
		console.log(loginReg.test(RegExp.$1));
		console.log(RegExp.$1);
		admin.api.checkAuth(req, res, next);
		return;
	}
	if (adminReg.test(path) && !loginReg.test(RegExp.$1)) {
			console.log(RegExp.$1);
			admin.checkAuth(req, res, next);
			return;
	}

	next();
});


app.get('/', routes.index);
app.get('/admin/index', admin.index);
app.get('/admin/users', admin.users);
app.get('/admin/login', admin.login);
app.get('/admin/logout', admin.logout);
app.get('/admin/regist', admin.regist);
app.get('/admin/forgetpwd', admin.forgetpwd);
app.get('/admin/roles', admin.roles);
app.get('/admin/menus', admin.menus);

console.log()

adminAPI.forEach(function(item, index) {
	var defaultApiUrl = getDefaultApiUrl(item, 'admin');

	app.get(defaultApiUrl.getById, admin.api[item].getById);
	app.get(defaultApiUrl.getAll, admin.api[item].getAll);
	app.get(defaultApiUrl.search, admin.api[item].search);
	app.post(defaultApiUrl.post, admin.api[item].post);
	app.put(defaultApiUrl.put, admin.api[item].put);
	app.delete(defaultApiUrl.delete, admin.api[item].delete);
});
app.post('/admin/api/login', admin.api.user.login);


/*
app.post('/admin/menus/editMenuType', admin.menus.editMenuType);
app.post('/admin/menus/deleteMenuType', admin.menus.deleteMenuType);
app.post('/admin/menus/editMenu', admin.menus.editMenu);
app.post('/admin/menus/deleteMenu', admin.menus.deleteMenu);
*/

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});