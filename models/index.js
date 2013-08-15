var mongoose = require('mongoose');
var config = require('../configs').config;

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./administrator');

exports.AdminUser = mongoose.model('AdminUser');
exports.AdminRole = mongoose.model('AdminRole');
exports.AdminMenu = mongoose.model('AdminMenu');