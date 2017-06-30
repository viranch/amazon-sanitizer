/*
Author: Viranch Mehta
Email: email@viranch.me
*/

// 1. Loop through all anchor tags
// 2. Clean URLs that match our radar

var inject = '(' + function() {
	function parse_query(query) {
	  var result = {};
	  query.split("&").forEach(function(part) {
		var item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	  });
	  return result;
	}
	var observeDOM = (function(){
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
			eventListenerSupported = window.addEventListener;

		return function(obj, callback){
			if( MutationObserver ){
				// define a new observer
				var obs = new MutationObserver(function(mutations, observer){
					if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
						callback();
				});
				// have the observer observe foo for changes in children
				obs.observe( obj, { childList:true, subtree:true });
			}
			else if( eventListenerSupported ){
				obj.addEventListener('DOMNodeInserted', callback, false);
				obj.addEventListener('DOMNodeRemoved', callback, false);
			}
		};
	})();
    var sanitize = function() {
        var anchors = document.getElementsByTagName('a');
        for (var i in anchors) {
            var a = anchors[i];
            var old_href = a.href;
            var href = old_href;
            if (href == null) continue;
            if (href.indexOf('&url=') !== -1) {
                href = a.href = parse_query(href).url || href;
            }
            if ((href.indexOf('/dp/') !== -1 || href.indexOf('/gp/product/') !== -1) && href.indexOf('/ref=') !== -1) {
                href = a.href = href.replace(/ref=.*/, '');
            }
            if (old_href != a.href) {
                console.log(old_href, a.href);
            }
        }
    };
	observeDOM(document.getElementsByTagName('body')[0], sanitize);
} + ')();';

var script = document.createElement('script');
script.textContent = inject;
(document.head||document.documentElement).appendChild(script);
