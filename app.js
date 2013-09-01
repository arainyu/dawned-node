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
var adminAPI = ["menu", "menutype", "role"];
var getDefaultApiUrl = function(moduleName, type) {
  var _default = '/'+ type +'/api/' + moduleName;
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
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({
    src: __dirname + '/public'
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/admin', admin.index);
app.get('/admin/users', admin.users);
app.get('/admin/login', admin.login);
app.get('/admin/regist', admin.regist);
app.get('/admin/forgetpwd', admin.forgetpwd);
app.get('/admin/roles', admin.roles);

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

app.get('/admin/menus', admin.menus);

/*
app.post('/admin/menus/editMenuType', admin.menus.editMenuType);
app.post('/admin/menus/deleteMenuType', admin.menus.deleteMenuType);
app.post('/admin/menus/editMenu', admin.menus.editMenu);
app.post('/admin/menus/deleteMenu', admin.menus.deleteMenu);
*/

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});