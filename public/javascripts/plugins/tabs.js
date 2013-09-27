define(['jquery'], function($) {

	function Tabs($tabs) {
		var self = this;
		$tabs.on('click', '[data-toggle="tab"]', function(e) {
			e.preventDefault();

			var $tab = $(this);
			self.active($tab.attr('href'), $tab);
		});

		this.active = function(activeSelector, $tab) {
			if (!activeSelector) return;

			var cls = 'active';
			$tabs.find('.active').removeClass(cls);

			$(activeSelector).addClass(cls);
			($tab || $tabs.find('[href="' + activeSelector + '"]')).addClass(cls)

		};
	}


	return {
		create: function($tabs, activeSelector) {
			var tabs = new Tabs($tabs);
			tabs.active(activeSelector);
			return tabs;
		}
	}
});