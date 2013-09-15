define(['jquery', 'knockout', 'config', 'utils', 'tabWindow', 'bootstrap'], function($, ko, config, utils, tabWindow) {

	$(document).ready(function() {
		var myTabs = tabWindow.create($('#tabbable'));

		var viewModel = {
			openMenu: function(data, e) {
				myTabs.add({
					id: data._id,
					title: data.name,
					url: data.url,
					close: true
				});
			},
			menuType: ko.observableArray(menuData)
		};

		myTabs.add({
			id: 'mainframe',
			title: '首页',
			url: 'http://localhost:3000/admin/menus'
		});


		ko.applyBindings(viewModel, document.getElementById('accordion_menu'));
	});
});