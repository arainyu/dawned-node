define(['jquery'], function($) {
	// 更新文件


	function UnloadCompletelyCssHandler() {

		var reloadCssFile = function(node) {
			node.href = node.href + '?v=' + Math.random();
		};

		var clearFileCache = function(url, done, fail) {
			$.ajax({
				url: url,
				headers: {
					'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT',
					'Cache-Control': 'no-cache'
				}
			}).done(function(responseText, textStatus, jqXhr) {
				(jqXhr.status === 200 ? done : fail)();
			}).fail(fail);
		};

		var checkCrossDomain = function(url) {
			var proIdx = url.indexOf('//');
			var protocol = url.substring(0, proIdx);
			var hostname = url.substring(proIdx + 2, url.indexOf('/', proIdx + 2)),
				locationHostName;

			hostname = hostname.split(':')[0];
			locationHostName = location.hostname.split(':')[0];

			return (protocol !== location.protocol || hostname !== locationHostName);
		};

		this.getUnloadCompletelyNodes = function() {
			var styleSheetList = document.styleSheets,
				unloadCompletelyArr = [];

			for (var i = 0, len = styleSheetList.length; i < len; i++) {
				var styleSheet = styleSheetList[i],
					node = styleSheet.ownerNode || styleSheet.owningElement,
					rules = styleSheet.cssRules || styleSheet.rules;

				if (node.nodeName === 'LINK' && !styleSheet.disabled) {
					try {
						if (rules.length <= 0) {
							unloadCompletelyArr.push(node);
						}
					} catch (ex) {
						//本方法不处理跨域请求.
						if (!checkCrossDomain(styleSheet.href)) {
							unloadCompletelyArr.push(node);
						}
					}
				}
			}

			return unloadCompletelyArr;
		};

		this.reloadCssFiles = function(nodes, failedCallback) {
			var unloadCount = nodes.length,
				loadCount = 0,
				failCount = 0;

			for (var i = 0; i < unloadCount; i++) {
				var node = nodes[i];

				reloadCssFile(node);
				node.onload = node.onreadystatechange = function() {
					if (!this.readyState || this.readyState === "complete" || this.readyState=='loaded') {
						node.onload = node.onreadystatechange = null; //防止IE内存泄漏
						loadCount++;
					}
				};
				node.onerror = function(){
					failCount++;
					if (loadCount + failCount == unloadCount && failCount > 0) {
						failedCallback();
					}
				};
			}
		};

		this.clearCacheAndReloadCssFiles = function(nodes, failedCallback) {
			var unloadCount = nodes.length,
				loadCount = 0,
				failCount = 0;

			for (var i = 0; i < unloadCount; i++) {
				var node = nodes[i];
				clearCache(node.href, function() {
					loadCount++;
					reloadCssFile(node);
				}, function() {
					failCount++

					if (loadCount + failCount == unloadCount && failCount > 0) {
						failedCallback();
					}
				});
			}
		};

	}

	return new UnloadCompletelyCssHandler();
});