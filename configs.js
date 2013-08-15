/**
 * config
 */

var path = require('path');

exports.config = {
  debug: true,
  name: 'Dawned Node',
  description: 'Dawned Node is a CMS.',
  version: '0.0.1',

  db: 'mongodb://127.0.0.1/dawned_node_dev',
  session_secret: 'dawned_node',
  auth_cookie_name: 'dawned_node'
};

exports.message = {

};

exports.returnCode = {
	OK: 1,
	ERROR: 0,
	DB_ERROE: -1
};