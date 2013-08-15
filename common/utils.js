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