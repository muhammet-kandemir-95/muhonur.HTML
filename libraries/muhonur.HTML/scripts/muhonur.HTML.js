// We are creating namespace.
if (window['muhonur'] === undefined) {
	window['muhonur'] = {};
}

muhonur.HTML = function (params) {
	var self = this;

	var mutationObserver = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			for (let index = 0; index < mutation.addedNodes.length; index++) {
				const addedNode = mutation.addedNodes[index];

				// We are checking is mo elem?
				if (addedNode.getAttribute && addedNode.getAttribute('mo-elem') === '') {
					// We avoid twice init.
					if (addedNode.__loaded_muhonur_HTML !== true) {
						addedNode.__loaded_muhonur_HTML = true;
						if (addedNode.muhonur === undefined) {
							addedNode.muhonur = {};
						} 
						addedNode.muhonur.HTML = {};

						var moType = addedNode.getAttribute('mo-type');
						var moArgs = addedNode.getAttribute('mo-args');
						muhonur.HTML.plugins[moType](addedNode, new Function(moArgs)());
					}
				}
			}
		});
	});

	mutationObserver.observe(document.documentElement, {
		childList: true,
		subtree: true
	});
};

muhonur.HTML.plugins = {};

new muhonur.HTML();