define(['jquery', 'knockout'], function($, ko) {

	var _resize = function($ele) {
		var $elePane = $ele.is('.tab-pane') ? $ele : $ele.find('.tab-pane');
		ofs = $elePane.offset(),
		height = window.innerHeight - ofs.top;
		$elePane.height(height).css({
			'overflow': 'hidden'
		});
	};

	var _viewModel = {
		tabs: ko.observableArray([])
	};

	var acitveTab = function(id){
		var existActiveItem = null;
		var tabs = _viewModel.tabs();
		for (var i = 0, len = tabs.length; i < len; i++) {
			var item = tabs[i];
			if (item.id === id) {
				existActiveItem = item;
				item.active() || item.active(true);
			} else {
				item.active(false);
			};
		}
		return existActiveItem;
	};

	var addTab = function(tabInfo) {
		var existItem = acitveTab(tabInfo.id);
		
		if (existItem === null) {
			_viewModel.tabs.push({
				id: tabInfo.id,
				title: tabInfo.title,
				url: tabInfo.url,
				active: ko.observable(true),
				close: tabInfo.close || false
			});
		}
	};

	_viewModel.resize = function(element) {
		_resize($(element).not(':empty'));
	};

	_viewModel.colsePane = function(data, e) {
		var tabs = _viewModel.tabs(),
			index = tabs.indexOf(data),
			len = tabs.length,
			nextActiveIndex = index + 1 < len ? index + 1 : index - 1,
			hasActiveItem = false;

		for (var i = 0; i < len; i++) {
			var item = tabs[i];
			if (index !== i && item.active()) {
				hasActiveItem = true;
			}
		}

		if (!hasActiveItem) {
			tabs[nextActiveIndex].active(true);
		}
		_viewModel.tabs.remove(data);
	};

	_viewModel.switchTab = function(data) {
		acitveTab(data.id);
	};

	return {
		create: function($eles) {
			ko.applyBindings(_viewModel, $eles[0]);
			$(window).bind('resize', function() {
				_resize($eles);
			});
			return {
				add: addTab
			}
		}
	};
});