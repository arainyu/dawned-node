exports.isFunction = function(val){
	return typeof val === 'function';
};

exports.returnValue = function(code, data, message){
	return {
		code: code,
		data: data,
		message: message
	};
};

exports.extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || typeof add !== 'object') return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};