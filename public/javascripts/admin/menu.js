define(['jquery', 'knockout', 'knockout.map', 'config', 'bootstrap'], function($, ko, koMap, config) {

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

	var viewModel = {
		list: ko.observableArray([]),
		currentMenuTypeViewModel: {
			id: ko.observable(''),
			name: ko.observable(''),
			orderId: ko.observable(0),
			roles: ko.observableArray([]),
			menus: ko.observableArray([]),
			message: {
				show: ko.observable(false),
				msg: ko.observable(''),
				type: ko.observable(config.alertType.DEFAULT)
			}
		},
		currentMenuViewModel: {
			id: ko.observable(''),
			name: ko.observable(''),
			type: ko.observable(''),
			url: ko.observable(''),
			params: ko.observable(''),
			roles: ko.observableArray([]),
			orderId: ko.observable(0),
			message: {
				show: ko.observable(false),
				msg: ko.observable(''),
				type: ko.observable(config.alertType.DEFAULT)
			}
		}
	};
	viewModel.menuTypeEvent = {
		add: function() {
			viewModel.menuTypeEvent.reset();
			modal.openMenuTypeEditPanel();
		},
		edit: function(data, e) {
			modal.openMenuTypeEditPanel();
		},
		delete: function(data, e) {

		},
		reset: function(data, e) {
			var cv = viewModel.currentMenuTypeViewModel;
			cv.name('');
			cv.orderId(0);
			cv.roles([]),
			cv.menus([]),
			cv.message.show(false);
		},
		toggle: function(data, e) {
			data.showMenus(!data.showMenus());
		},
		setMessage: function(show, type, msg){
			var cv = viewModel.currentMenuTypeViewModel;
			cv.message.show(show);
			cv.message.type(type);
			cv.message.msg(msg);

		},
		save: function(data, e) {
			e.preventDefault();

			var cv = data.currentMenuTypeViewModel;

			$.ajax({
				url: '/admin/menus/menutype',
				type: 'POST',
				dataType: 'json',
				data: ko.toJS(cv)
			}).done(function(result) {
				console.log('done');
				if (config.returnCode.OK === result.code) {

					viewModel.menuTypeEvent.setMessage(true, config.alertType.SUCCESS, result.message);
					
					setTimeout(function(){
						viewModel.menuTypeEvent.reset();
						modal.closeMenuTypeEditPanel();
					}, 500);

				}else{
					viewModel.menuTypeEvent.setMessage(true, config.alertType.ERROR, result.message);
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
			
		}
	};
	viewModel.menuEvent = {
		add: function() {
			modal.openMenuEditPanel();
		},

		edit: function(data, e) {
			modal.openMenuEditPanel();
		},
		delete: function(data, e) {

		},
		reset: function(data, e) {
			e.preventDefault();
			this.name('');
			this.type('');
			this.url('');
			this.params('');
			this.roles('');
			this.orderId(0);
		},
		save: function(data, e) {
			modal.closeMenuEditPanel();
		}
	};

	viewModel.dataOperations = {
		bind: function(data) {
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
	});
});