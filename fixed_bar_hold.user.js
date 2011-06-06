// ==UserScript==
// @name           fixed bar hold
// @namespace      http://d.hatena.ne.jp/t_f_m/
// @description    css 'position:fixed' bar move to absolute
// @include        *
// ==/UserScript==

//via AutoPagerize
function getElementsByXPath(xpath, node) {
    var nodesSnapshot = getXPathResult(xpath, node,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE)
    var data = []
    for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
        data.push(nodesSnapshot.snapshotItem(i))
    }
    return data
}

function getFirstElementByXPath(xpath, node) {
    var result = getXPathResult(xpath, node,
        XPathResult.FIRST_ORDERED_NODE_TYPE)
    return result.singleNodeValue
}

function getXPathResult(xpath, node, resultType) {
    var node = node || document
    var doc = node.ownerDocument || node
    var resolver = doc.createNSResolver(node.documentElement || node)
    // Use |node.lookupNamespaceURI('')| for Opera 9.5
    var defaultNS = node.lookupNamespaceURI(null)

    if (defaultNS) {
        const defaultPrefix = '__default__'
        xpath = addDefaultPrefix(xpath, defaultPrefix)
        var defaultResolver = resolver
        resolver = function (prefix) {
            return (prefix == defaultPrefix)
                ? defaultNS : defaultResolver.lookupNamespaceURI(prefix)
        }
    }
    return doc.evaluate(xpath, node, resolver, resultType, null)
}

function wrap_xmlhttpRequest(options) {
	var req = new XMLHttpRequest();
	try {
		req.onreadystatechange = function () {
			if (req.readyState == 4) {
				if (req.status == 200) {
					if (options.onload) options.onload(req);
				}
			}
		}
		req.open(options.method || "GET", options.url, true);
		if (options.headers) {
			for (key in options.headers) {
				req.setRequestHeader(key, options.headers[key]);
			}
		}
		req.send(options.data? options.data : null);
	} catch (e) {
		if (options.onerror) options.onerror(req, e);
	}
} 
/* alert("start");
function getXPath(xpath){
    var ret = document.evaluate(xpath, document, null
        , XPathResult.ORDERED_NODE_ITERATOR_TYPE, null  );
    var domObj = ret.iterateNext();
    return domObj;
}
*/

SITEINFO = [
/* 
  {
    url:         '',
    targetXPath: '',
//    position:    '',
  },
*/
  {
    url:         '^http://www\.dannychoo\.com/',
    targetXPath: 'id("global-bar-wrapper global-bar")',
//    position:    '',
  },
  /*
  {
    url:         '^http://twitter\.com/',
    targetXPath: '//div[@class="fixed-banners"]',
//    position:    '',
  },
  */
  {
    url:         '^https?://twitter.com/',
    targetXPath: '//div[@class="fixed-banners"]|id("top-stuff")',
  },
  {
    url:         '^http://.+\.nicovideo\.jp/',
    targetXPath: 'id("PAGEHEADMENU")/div|id("navWrap bar navi")',
  },
  {
    url:         '^http://(?:[^fw])+\.hatena\.ne\.jp',
    targetXPath: 'id("header")|id("info-header")',
  },
  {
    url:         '^http://ameblo\.jp/',
    targetXPath: 'id("amebaBar")',
  },
  {
    url:         '^http://yaplog\.jp/',
    targetXPath: 'id("common_head")',
  },
  {
    url:         '^http://plixi\.com/',
    targetXPath: 'id("lockerz header_box")',
  },
  {
    url:         '^http://[^./]+\.blog\\d+.fc2\.com/',
    targetXPath: 'id("sh_fc2blogheadbar")',
  },
  {
    url:         '^http://blog\.goo\.ne\.jp/',
    targetXPath: 'id("global-header")',
  },
]
bar_hold(SITEINFO);

function fixed_fixer(xpath){
  var target = getElementsByXPath(xpath);
  for(var i = 0, maxi = target.length; i < maxi; i++){
    target[i].style.setProperty("position","absolute","important");
  }
}
function check_url(url){
  return RegExp(url).test(location.href)
}
function bar_hold(siteinfo){
  var xpath=null;
  for(var i=0,l=siteinfo.length;i<l;++i){
    if(check_url(siteinfo[i].url)){
      xpath=siteinfo[i].targetXPath;
      break;
    }
  }
  if(xpath){
    fixed_fixer(xpath);
  }
}
