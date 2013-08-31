define(['jquery'], function($) {
	var _ajax = function(url, type, data, callbacks) {
		var alwaysCallback = callbacks.always || function() {};
		var failCallback = callbacks.fail || function() {};
		var successCallback = callbacks.done;

		var jqXHR = $.ajax({
			url: url,
			type: type,
			dataType: 'json',
			data: data
		});
		jqXHR.done(successCallback);
		jqXHR.fail(failCallback);
		jqXHR.always(alwaysCallback);
	};

	return {
		ajax: {
			default: _ajax,
			post: function(url, data, callbacks) {
				_ajax(url, 'POST', data, callbacks);
			},
			get: function(url, data, callbacks) {
				_ajax(url, 'GET', data, callbacks);
			},
			delete: function(url, data, callbacks) {
				_ajax(url, 'DELETE', data, callbacks);
			},
			put: function(url, data, callbacks) {
				_ajax(url, 'PUT', data, callbacks);
			}
		}
	};
});