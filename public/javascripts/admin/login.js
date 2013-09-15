define(['jquery', 'knockout', 'config', 'utils', 'bootstrap'], function($, ko, config, utils) {

	var ViewModel = function() {
		var self = this;
		var pageMessages = new utils.PageMessages();
		var msgType = config.alertType;

		self.message = pageMessages.message;
		self.loginName = ko.observable('');
		self.password = ko.observable('');

		self.login = function(data) {
			var loginName = $.trim(data.loginName());
			var password = $.trim(data.password());
			if (loginName == '' || password == '') {
				pageMessages.showMessage('用户名密码不能留空', msgType.WARNING);
			} else {
				utils.ajax.post('/admin/api/login/', {
					loginName: loginName,
					password: password
				}, {
					done: function(data) {
						pageMessages.showMessage("成功登录", msgType.SUCCESS);
						setTimeout(function() {
							location.href = '/admin/index';
						}, 500);
					},
					fail: function() {
						pageMessages.showMessage("用户名密码错误", msgType.ERROR);
					}
				});
			}
		}
	};

	$(document).ready(function() {
		ko.applyBindings(new ViewModel(), document.getElementById('login'));
	});
});