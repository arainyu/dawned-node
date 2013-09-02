define(['jquery', 'knockout', 'config'], function($, ko, config) {
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

	function _PageMessages() {
		this.message = {
			showInDefault: ko.observable(false),
			showInEditPanel: ko.observable(false),
			msg: ko.observable(''),
			type: ko.observable(config.alertType.DEFAULT)
		};
	};
	_PageMessages.prototype.showMessage = function(msg, type, inEditPanel, successCallback) {
		var showPosition = inEditPanel ? this.message.showInEditPanel : this.message.showInDefault;
		showPosition(true);

		this.message.msg(msg);
		this.message.type(type || config.alertType.DEFAULT);

		if (type === config.alertType.SUCCESS) {
			setTimeout(function() {
				showPosition(false);
				successCallback();
			}, 800);
		}
	};

	_PageMessages.prototype.clearMessage = function(){
		this.message.showInDefault(false);
		this.message.showInEditPanel(false);
		this.message.msg('');
		this.message.type(config.alertType.DEFAULT);
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
		},
		PageMessages: _PageMessages
	};
});