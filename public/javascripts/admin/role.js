define(['jquery', 'knockout', 'knockout.map', 'config', 'utils', 'bootstrap'], function($, ko, koMap, config, utils) {

	var modal = {
		openEditPanel: function() {
			if(top!=this || self.frameElement.tagName=="IFRAME"){
				$('#edit_roles').modal('show');
			}
		},
		closeEditPanel: function() {
			$('#edit_roles').modal('hide');
		}
	};

	var ViewModel = function(roles, menus) {
		var self = this;

		self.message = {
			showInDefault: ko.observable(false),
			showInEditPanel: ko.observable(false),
			msg: ko.observable(''),
			type: ko.observable(config.alertType.DEFAULT)
		};

		var msgType = config.alertType;

		var showMessage = function(msg, type, inEditPanel) {
			var showPosition = inEditPanel ? self.message.showInEditPanel : self.message.showInDefault;
			showPosition(true);
			self.message.msg(msg);
			self.message.type(type || msgType.DEFAULT);

			if (type === msgType.SUCCESS) {
				setTimeout(function() {
					showPosition(false);
					if(inEditPanel){
						modal.closeEditPanel();
					}
				}, 800);
			}
		};

		self.roles = ko.observableArray(ko.utils.arrayMap(roles, function(role) {
			return {
				_id: role._id,
				name: role.name,
				menus: role.menus
			};
		}));

		self.menutypes = ko.observableArray(ko.utils.arrayMap(menus, function(menutype) {
			return {
				_id: menutype._id,
				name: menutype.name,
				menus: ko.observableArray(ko.utils.arrayMap(menutype.menus, function(menu) {
					return menu;
				}))
			};
		}));

		self.updateItem = function(item){
			var roles = self.roles();
			for(var i=0,len = roles.length; i<len; i++){
				if(roles[i]._id == item._id){
					roles[i] = item;
					break;
				}
			}
			self.roles(roles);
		};

		self.addRole = function() {
			modal.openEditPanel();
			self.currentRoleViewModel._id('');
			self.currentRoleViewModel.name('');
			self.currentRoleViewModel.menus([]);
		};

		self.editRole = function(data, e) {
			modal.openEditPanel();
			var menuIdArr = [];

			for(var index in data.menus){
				menuIdArr.push(data.menus[index]._id);
			}

			self.currentRoleViewModel._id(data._id);
			self.currentRoleViewModel.name(data.name);
			self.currentRoleViewModel.menus(menuIdArr);
		};

		self.removeRole = function(role) {

			var id = (typeof role._id !== 'function') ? role._id : role._id();

			if (!id) return;

			utils.ajax.delete('/admin/api/role/' + id, null, {
				done: function(data) {
					showMessage("成功删除了一条记录", msgType.SUCCESS);
					self.roles.remove(role);
				},
				fail: function() {
					showMessage("删除失败", msgType.ERROR);
				}
			});
		};

		self.saveRole = function() {

			var data = ko.toJS(self.currentRoleViewModel);

			if (data.name == "") {
				showMessage("您必须输入名称");
				return;
			}

			if (data._id === "") {
				utils.ajax.post('/admin/api/role', data, {
					done: function(returnData) {
						showMessage("成功新增加了一条记录", msgType.SUCCESS, true);
						self.roles.push(returnData.data);
					},
					fail: function() {
						showMessage("增加失败", msgType.ERROR, true);
					}
				});
			} else {
				utils.ajax.put('/admin/api/role/' + data._id, data, {
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

		self.currentRoleViewModel = {
			_id: ko.observable(''),
			name: ko.observable(''),
			menus: ko.observableArray([])
		};
	};

	$(document).ready(function() {
		ko.applyBindings(new ViewModel(rolesData), document.getElementById('role'));
	});
});