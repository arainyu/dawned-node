define(['jquery', '/javascripts/plugins/css-reload.js'], function($, cssHandler) {
	var unloadCompletelyCssNodes = cssHandler.getUnloadCompletelyNodes();
	if (unloadCompletelyCssNodes.length > 0) {
		cssHandler.reloadCssFiles(unloadCompletelyCssNodes, function() {
			alert('also load file');
		});
	}
});

