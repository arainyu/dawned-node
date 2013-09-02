define(['jquery', 'knockout', 'knockout.map', 'config', 'utils', 'bootstrap'], function($, ko, koMap, config, utils) {

	var modal = {
		openEditPanel: function() {
			$('#edit_users').modal('show');
		},
		closeEditPanel: function() {
			$('#edit_users').modal('hide');
		}
	};

	var ViewModel = function(users, menus) {
		var self = this;
		var msgType = config.alertType;
		var pageMessages = new utils.PageMessages();

		var showMessage = function(msg, type, inEditPanel) {
			pageMessages.showMessage(msg, type, inEditPanel, function() {
				if (inEditPanel) {
					self.showEditPanel(false);
				}
			});
		};

		self.message = pageMessages.message;
		self.showEditPanel = ko.observable(false);
		self.editPanelDispalyCSS = ko.computed(function() {
			console.log(self.showEditPanel());
			if (self.showEditPanel()) {
				$('#edit_users').modal('show').on('hidden', function() {
					self.showEditPanel(false);
				});
			} else {
				$('#edit_users').modal('hide');
			}
		});

		self.users = ko.observableArray(users);

		self.updateItem = function(item) {
			var users = self.users();
			for (var i = 0, len = users.length; i < len; i++) {
				if (users[i]._id == item._id) {
					users[i] = item;
					break;
				}
			}
			self.users(users);
		};

		self.addUser = function() {
			self.showEditPanel(true);
			self.currentUserViewModel._id('');
			self.currentUserViewModel.loginName('');
			self.currentUserViewModel.name('');
			self.currentUserViewModel.password('');
			self.currentUserViewModel.email('');
			self.currentUserViewModel.role('');
		};

		self.editUser = function(data, e) {

			self.showEditPanel(true);
			self.currentUserViewModel._id(data._id);
			self.currentUserViewModel.loginName(data.loginName);
			self.currentUserViewModel.name(data.name);
			self.currentUserViewModel.password(data.password);
			self.currentUserViewModel.role(data.role._id);
		};

		self.removeUser = function(user) {

			var id = (typeof user._id !== 'function') ? user._id : user._id();

			if (!id) return;

			utils.ajax.delete('/admin/api/user/' + id, null, {
				done: function(data) {
					showMessage("成功删除了一条记录", msgType.SUCCESS);
					self.users.remove(user);
				},
				fail: function() {
					showMessage("删除失败", msgType.ERROR);
				}
			});
		};

		self.saveUser = function() {

			var data = ko.toJS(self.currentUserViewModel);

			if (data.name == "") {
				showMessage("您必须输入名称");
				return;
			}

			if (data._id === "") {
				utils.ajax.post('/admin/api/user', data, {
					done: function(returnData) {
						showMessage("成功新增加了一条记录", msgType.SUCCESS, true);
						self.users.push(returnData.data);
					},
					fail: function() {
						showMessage("增加失败", msgType.ERROR, true);
					}
				});
			} else {
				utils.ajax.put('/admin/api/user/' + data._id, data, {
					done: function(returnData) {
						showMessage("成功更新了一条记录", msgType.SUCCESS, true);
						self.updateItem(returnData.data);
					},
					fail: function() {
						showMessage("更新失败", msgType.ERROR, true);
					}
				});
			}
		};

		self.currentUserViewModel = {
			_id: ko.observable(''),
			name: ko.observable(''),
			loginName: ko.observable(''),
			password: ko.observable(''),
			email: ko.observable('')
		};
	};

	$(document).ready(function() {
		ko.applyBindings(new ViewModel(usersData), document.getElementById('user'));
	});
});