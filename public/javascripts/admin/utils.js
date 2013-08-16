define(['jquery'], function($) {
	var _ajax = function(url, type, data, callbacks) {
		var alwaysCallback = callbacks.always || function() {};
		var failCallback = callbacks.fail || function() {};
		var successCallback = callbacks.done;

		$.ajax({
			url: url,
			type: type,
			dataType: 'json',
			data: data
		}).done(successCallback).fail(failCallback).always(alwaysCallback);
	};

	return {
		ajax: {
			default: _ajax,
			post: function(url, data, callbacks) {
				_ajax(url, 'POST', data, callbacks);
			},
			get: function(url, data, callbacks) {
				_ajax(url, 'GET', data, callbacks);
			}
		}
	};
});