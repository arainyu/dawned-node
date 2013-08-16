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
				_id: '',
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

			if (menuType.name == "") {
				showMessage("您必须输入名称");
				return;
			}

			utils.ajax.post('/admin/menus/menutype', ko.toJS(menuType), {
				done: function(result) {
					if (config.returnCode.OK === result.code) {

						showMessage(result.message, msgType.SUCCESS);
						menuType.editable(false);

					} else {
						showMessage(result.message, msgType.ERROR);
					}
				}
			});
		};

		self.removeMenuType = function(menuType) {

			self.list.remove(menuType);
			
			if (!menuType._id) return;

			utils.ajax.post('/admin/menus/delete', {
				id: menuType._id
			}, {
				done: function(result) {
					if (config.returnCode.OK === result.code) {

						showMessage(result.message, msgType.SUCCESS);

					} else {
						showMessage(result.message, msgType.ERROR);
					}
				}
			});
		};

		self.addMenu = function(menuType) {
			menuType.showMenus(true);
			menuType.menus.push({
				_id: '',
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
			utils.ajax.post('/admin/menus/editMenu', ko.toJS(menu), {
				done: function(result) {
					if (config.returnCode.OK === result.code) {

						showMessage(result.message, msgType.SUCCESS);
						menu.editable(false);

					} else {
						showMessage(result.message, msgType.ERROR);
					}
				}
			});
		};

		self.removeMenu = function(menu) {
			$.each(self.list(), function() {
				this.menus.remove(menu);
			});

			if (!menu._id) {
				return;
			}

			utils.ajax.post('/admin/menus/deleteMenu', {
				id: menu._id,
				type: menu.type
			}, {
				done: function(result) {
					if (config.returnCode.OK === result.code) {
						showMessage(result.message, msgType.SUCCESS);

					} else {
						showMessage(result.message, msgType.ERROR);
					}
				}
			});
		};
	};

	$(document).ready(function() {
		ko.applyBindings(new ViewModel(menuData), document.getElementById('menu'));
	});

	/*

	var viewModel = {
		list: ko.observableArray([]),
		currentMenuTypeViewModel: {
			id: ko.observable(''),
			name: ko.observable(''),
			orderId: ko.observable(0),
			menus: ko.observableArray([])
		},
		currentMenuViewModel: {
			id: ko.observable(''),
			name: ko.observable(''),
			type: ko.observable(''),
			url: ko.observable(''),
			params: ko.observable(''),
			orderId: ko.observable(0)
		},
		message: {
			showInEditType: ko.observable(false),
			showInEditMenu: ko.observable(false),
			showInDefault: ko.observable(false),
			msg: ko.observable(''),
			type: ko.observable(config.alertType.DEFAULT)
		},
		setMessage: function(messageObj) {
			var message = messageObj || {};
						viewModel.message.msg(message.msg || '');

			viewModel.message.showInEditType(message.showInEditType || false);
			viewModel.message.showInEditMenu(message.showInEditMenu || false);
			viewModel.message.showInDefault(message.showInDefault || false);
		},
		resetMessage: function() {
			viewModel.setMessage();
		}
	};
	viewModel.menuTypeEvent = {
		add: function() {
			viewModel.menuTypeEvent.reset();
			modal.openMenuTypeEditPanel();
		},
		edit: function(data, e) {
			modal.openMenuTypeEditPanel();
			viewModel.menuTypeEvent.set(data);
		},
		delete: function(data, e) {
			utils.ajax.post('/admin/menus/delete', {
				id: data._id
			}, {
				done: function(result) {
					var message = {
						msg: result.message,
						showInDefault: true
					};
					if (config.returnCode.OK === result.code) {

						message.type = config.alertType.SUCCESS;
						viewModel.dataOperations.bind(result.data);
						viewModel.setMessage(message);

						setTimeout(function() {
							viewModel.resetMessage();
						}, 500);

					} else {
						message.type = config.alertType.ERROR;
						viewModel.setMessage(message);
					}
				}
			});
		},
		set: function(data) {
			var cv = viewModel.currentMenuTypeViewModel,
				rcv = data || {};
			cv.name(rcv.name || '');
			cv.orderId(rcv.orderId || 0);
			cv.menus(rcv.menus || []);
			cv.id(rcv._id || '');
		},
		reset: function() {
			viewModel.menuTypeEvent.set(),
			viewModel.resetMessage();
		},
		toggle: function(data, e) {
			data.showMenus(!data.showMenus());
		},
		save: function(data, e) {
			viewModel.resetMessage();

			var cv = viewModel.currentMenuTypeViewModel,
				message = {
					showInEditType: true,
					msg: "您必须输入名称"
				};

			viewModel.message.showInEditType(true);

			if ($.trim(cv.name()) == "") {
				viewModel.setMessage(message);
				return;
			}

			utils.ajax.post('/admin/menus/menutype', ko.toJS(cv), {
				done: function(result) {
					message.msg = result.message;
					if (config.returnCode.OK === result.code) {
						message.type = config.alertType.SUCCESS
						viewModel.setMessage(message);

						setTimeout(function() {
							viewModel.menuTypeEvent.reset();
							modal.closeMenuTypeEditPanel();
							viewModel.dataOperations.bind(result.data);
						}, 500);

					} else {
						message.type = config.alertType.ERROR
						viewModel.setMessage(message);
					}
				}
			});
		}
	};
	viewModel.menuEvent = {
		add: function(data, e) {
			viewModel.menuEvent.reset();

			if (data._id) {
				viewModel.currentMenuViewModel.type(data._id);
			}

			modal.openMenuEditPanel();
		},
		edit: function(data, e) {
			modal.openMenuEditPanel();
			viewModel.menuEvent.set(data);
		},
		delete: function(data, e) {
			utils.ajax.post('/admin/menus/deleteMenu', {
				id: data._id,
				type: data.type
			}, {
				done: function(result) {
					var message = {
						msg: result.message,
						showInDefault: true
					};
					if (config.returnCode.OK === result.code) {

						message.type = config.alertType.SUCCESS;
						viewModel.dataOperations.bind(result.data);
						viewModel.setMessage(message);

						setTimeout(function() {
							viewModel.resetMessage();
						}, 500);

					} else {
						message.type = config.alertType.ERROR;
						viewModel.setMessage(message);
					}
				}
			});
		},
		set: function(data) {
			var cv = viewModel.currentMenuViewModel,
				rcv = data || {};
			cv.id(rcv._id || '');
			cv.name(rcv.name || '');
			cv.type(rcv.type || '');
			cv.url(rcv.url || '');
			cv.params(rcv.params || '');
			cv.orderId(rcv.orderId || 0);
		},
		reset: function() {
			viewModel.menuEvent.set();
			viewModel.resetMessage();
		},
		save: function(data, e) {
			viewModel.resetMessage();

			var cv = viewModel.currentMenuViewModel,
				message = {
					showInEditType: true,
					msg: "您必须输入名称"
				};

			if ($.trim(cv.name()) == "") {
				viewModel.setMessage(message);
				return;
			}

			utils.ajax.post('/admin/menus/editMenu', ko.toJS(cv), {
				done: function(result) {
					message.msg = result.message;
					if (config.returnCode.OK === result.code) {
						message.type = config.alertType.SUCCESS
						viewModel.setMessage(message);

						setTimeout(function() {
							viewModel.menuEvent.reset();
							modal.closeMenuEditPanel();
							viewModel.dataOperations.bind(result.data);
						}, 500);

					} else {
						message.type = config.alertType.ERROR
						viewModel.setMessage(message);
					}
				}
			});
		}
	};

	viewModel.dataOperations = {
		bind: function(data) {
			viewModel.list([]);
			for (var i = 0, len = data.length; i < len; i++) {
				var menu = $.extend({}, data[i]);
				menu.showMenus = ko.observable(false);

				viewModel.list.push(menu);
			}
		}
	};

	$(document).ready(function() {
		viewModel.dataOperations.bind(menuData);

		ko.applyBindings(viewModel, document.getElementById('menu'));
	});*/
});