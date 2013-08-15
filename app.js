
/**
 * Module dependencies.
 */

var express = require('express')
  , configs = require('./configs')
  , routes = require('./routes')
  , user = require('./routes/user')
  , admin = require('./routes/admin')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
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
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/admin', admin.index);
app.get('/admin/login', admin.login);
app.get('/admin/regist', admin.regist);
app.get('/admin/forgetpwd', admin.forgetpwd);
app.get('/admin/roles', admin.roles);
app.get('/admin/menus', admin.menus);
app.post('/admin/menus/menutype', admin.menus.editMenuType);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
