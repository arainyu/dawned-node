define(['jquery', 'knockout', 'knockout.map', 'config', 'utils', 'bootstrap'], function($, ko, koMap, config, utils) {

	var modal = {
		openMenuEditPanel: function() {
			$('#edit_menu').modal('show');
		},
		openMenuTypeEditPanel: function() {
			$('#edit_menu_type').modal('show');
		},
		closeMenuEditPanel: function() {
			$('#edit_menu').modal('hide');
		},
		closeMenuTypeEditPanel: function() {
			$('#edit_menu_type').modal('hide');
		}
	};

	var ViewModel = function(data) {
		var self = this;

		self.message = {
			show: ko.observable(false),
			msg: ko.observable(''),
			type: ko.observable(config.alertType.DEFAULT)
		};

		var msgType = config.alertType;

		var showMessage = function(msg, type) {
			self.message.show(true);
			self.message.msg(msg);
			self.message.type(type || msgType.DEFAULT);

			if (type === msgType.SUCCESS) {
				setTimeout(function() {
					self.message.show(false);
				}, 800);
			}
		};

		self.list = ko.observableArray(ko.utils.arrayMap(data, function(menuType) {
			return {
				_id: menuType._id,
				name: menuType.name,
				orderId: menuType.orderId,
				showMenus: ko.observable(false),
				editable: ko.observable(false),
				menus: ko.observableArray(ko.utils.arrayMap(menuType.menus, function(menu) {
					return $.extend({
						editable: ko.observable(false)
					}, menu);
				}))
			};
		}));

		self.toggle = function(data, e) {
			data.showMenus(!data.showMenus());
		};

		self.addMenuType = function() {
			self.list.push({
				_id: ko.observable(''),
				name: '',
				orderId: 0,
				showMenus: ko.observable(false),
				editable: ko.observable(true),
				menus: ko.observableArray([])
			});
		};

		self.editMenuType = function(menuType) {
			menuType.editable(true);
		};

		self.saveMenuType = function(menuType) {

			var data = ko.toJS(menuType);

			if (menuType.name == "") {
				showMessage("您必须输入名称");
				return;
			}

			if (data._id === "") {
				utils.ajax.post('/admin/api/menutype', data, {
					done: function(returnData) {
						showMessage("成功新增加了一条记录", msgType.SUCCESS);
						menuType.editable(false);
						menuType._id(returnData.data._id);
					},
					fail: function() {
						showMessage("增加失败", msgType.ERROR);
					}
				});
			} else {
				utils.ajax.put('/admin/api/menutype/' + data._id, data, {
					done: function(data) {
						showMessage("成功更新了一条记录", msgType.SUCCESS);
						menuType.editable(false);
					},
					fail: function() {
						showMessage("更新失败", msgType.ERROR);
					}
				});
			}
		};

		self.removeMenuType = function(menuType) {

			var id = (typeof menuType._id !== 'function')?menuType._id:menuType._id();

			if (!id) return;

			utils.ajax.delete('/admin/api/menutype/' + id, null, {
				done: function(data) {
					showMessage("成功删除了一条记录", msgType.SUCCESS);
					self.list.remove(menuType);
				},
				fail: function() {
					showMessage("删除失败", msgType.ERROR);
				}
			});
		};

		self.addMenu = function(menuType) {
			menuType.showMenus(true);
			menuType.menus.push({
				_id: ko.observable(''),
				name: '',
				type: menuType._id,
				url: '',
				params: '',
				orderId: 0,
				editable: ko.observable(true)
			});
		};

		self.editMenu = function(menu) {
			menu.editable(true);
		};

		self.saveMenu = function(menu) {
			var data = ko.toJS(menu);

			if (data._id === "") {
				utils.ajax.post('/admin/api/menu', data, {
					done: function(returnData) {
						showMessage("成功新增加了一条记录", msgType.SUCCESS);
						menu.editable(false);
						menu._id(returnData.data._id);
					},
					fail: function() {
						showMessage("增加失败", msgType.ERROR);
					}
				});
			} else {
				utils.ajax.put('/admin/api/menu/' + data._id, data, {
					done: function(returnData) {
						showMessage("成功更新了一条记录", msgType.SUCCESS);
						menu.editable(false);
					},
					fail: function() {
						showMessage("更新失败", msgType.ERROR);
					}
				});
			}
		};

		self.removeMenu = function(menu) {

			var id = (typeof menu._id !== 'function')?menu._id:menu._id();

			if (!id) {
				return;
			}


			utils.ajax.delete('/admin/api/menutype/' + id, {
				type: menu.type
			}, {
				done: function(data) {

					$.each(self.list(), function() {
						this.menus.remove(menu);
					});

					showMessage("成功删除了一条记录", msgType.SUCCESS);
				},
				fail: function() {
					showMessage("删除失败", msgType.ERROR);
				}
			});
		};
	};

	$(document).ready(function() {
		ko.applyBindings(new ViewModel(menuData), document.getElementById('menu'));
	});
});