// ==UserScript==
// @name           PixivViewComment
// @namespace      nanakoso
// @description    PIXIVコメント履歴をデフォルトで見れるように Ver. 1.1
// @include        http://www.pixiv.net/member_illust.php*mode=medium*
// ==/UserScript==

/*
(function(){
var viewComment = function(doc, url, info ){
  var btn_show = doc.evaluate('id("one_comment_view")/a[@onclick]', document, null, 9, null).singleNodeValue;
  if (btn_show){
    var ev = document.createEvent('Event');
    ev.initEvent('click', true, false);
    btn_show.dispatchEvent(ev);
};
viewComment(document);
if (window.AutoPagerize) {
    init();
} else {
    window.addEventListener('GM_AutoPagerizeLoaded',init,false);
}
function init(){
    window.AutoPagerize.addDocumentFilter(viewComment);
}
})();
*/
//(function(){ renewal
//location.href = 'javascript:(' + 
/*
(function(){
  var btn_show = document.evaluate('id("one_comment_view")/a[@onclick]', document, null, 9, null).singleNodeValue;
  if (btn_show){
    var ev = document.createEvent('Event');
    ev.initEvent('click', true, false);
    btn_show.dispatchEvent(ev);
   // .onclick();
  }
})(); */
// + ')();'; 


/* old version 
var commentDiv = getXPath('//div[@id="one_comment_area"]');
if(commentDiv){
    commentDiv.style.display="";
    unsafeWindow.one_comment_view = function(){};
}

var viewDiv = getXPath('//div[@id="one_comment_view"]');
if(viewDiv){
    viewDiv.style.display="none";
}

function getXPath(xpath){
    var ret = document.evaluate(xpath, document, null
        , XPathResult.ORDERED_NODE_ITERATOR_TYPE, null  );
    var domObj = ret.iterateNext();
    return domObj;
}
*/


//})();

 
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
//alert("start");
function getXPath(xpath){
    var ret = document.evaluate(xpath, document, null
        , XPathResult.ORDERED_NODE_ITERATOR_TYPE, null  );
    var domObj = ret.iterateNext();
    return domObj;
}
u_id=getXPath("id('rpc_u_id')").getAttribute('title');//基本変わらないので一回設定すればおｋ
i_id=getXPath("id('rpc_i_id')").getAttribute('title');//イラスト単位で変わる。urlから取るのも手。
params="i_id="+i_id+"&u_id="+u_id;       //docから取るべき？
//alert(params);
wrap_xmlhttpRequest({
  url:"./rpc_comment_history.php",
  method: "POST",
  headers:{
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: params,
  onload: function(obj){
    el = getXPath("id('one_comment_area')");
    el.innerHTML=obj.responseText;
    el.style.display="";
    el.style.overflow="visible";
    getXPath("id('one_comment_view')").style.display="none";
    getXPath("id('one_comment_view2')").style.display="";
  },//
})
/* */
//======================================
//コメント履歴表示、非表示
//======================================
/*
function one_comment_view(){
	var btn_show = $('one_comment_view');
	var btn_hide = $('one_comment_view2');
	var area     = $('one_comment_area');

	if(area.empty()){
		// 表示(Ajaxで要素を取ってくる)
		var i_id = $('rpc_i_id').getAttribute('title');
		var u_id = $('rpc_u_id').getAttribute('title');

		var url  = './rpc_comment_history.php';
		var me   = 'post';
		var pars = 'i_id=' + i_id + '&u_id=' + u_id;
		var comp = on_loaded_one_comment_view;

		sendRequest(url, me, pars, comp);
		new Effect.BlindDown("one_comment_area", {
			duration:0.2
			});
		btn_show.hide();
		btn_hide.show();
	}else if(!area.visible()){
		new Effect.BlindDown("one_comment_area", {
			duration:0.2
		});
		btn_show.hide();
		btn_hide.show();
	}else{
		new Effect.BlindUp("one_comment_area", {
			duration:0.2
		});
		btn_show.show();
		btn_hide.hide();
	}
}
*/
//======================================
//	リクエスト
//======================================
/*
function sendRequest(url, me, pars, comp){
	var myAjax = new Ajax.Request(
		url, 
		{
			method: me, 
			parameters: pars, 
			onComplete: comp
		});
}
*/
//======================================
//コメント履歴表示をクリック後
//======================================
/*
function on_loaded_one_comment_view(oj){
    var obj = new showOneComment();
    obj.display(oj);
}
*/
//======================================
//コメント履歴表示
//======================================
/*
function showOneComment(){
    this.display = function(oj){
	var res = oj.responseText;
	var el  = $('one_comment_area');
	el.innerHTML = res;
    }
}
*/


function getElementsByXPath(xpath, node) {
    var nodesSnapshot = getXPathResult(xpath, node,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE)
    var data = []
    for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
        data.push(nodesSnapshot.snapshotItem(i))
    }
    return data
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


//u_id=getElementsByXPath("id('rpc_u_id')").getAttribute('title');//基本変わらないので一回設定すればおｋ
//i_id=getElementsByXPath("id('rpc_i_id')").getAttribute('title');//イラスト単位で変わる。urlから取るのも手。
function viewComment(target, url){
  i_id=url.match(/\d+/);
  params="i_id="+i_id+"&u_id="+u_id;
  //alert(params);
  wrap_xmlhttpRequest({
    url:"./rpc_comment_history.php",
    method: "POST",
    headers:{
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer":url,
    },
    data: params,
    onload: function(obj){
      el = getElementsByXPath(".//div[@id='one_comment_area']",target)[0];
      el.innerHTML=obj.responseText;
      el.style.display="";
      el.style.overflow="visible";
      getElementsByXPath(".//div[@id='one_comment_view']",target)[0].style.display="none";
      getElementsByXPath(".//div[@id='one_comment_view2']",target)[0].style.display="";
    },
  })
}

var boot=function(){
  //viewComment(document.body, location.href);//初回起動
  window.addEventListener('AutoPagerize_DOMNodeInserted', function(evt){
    if(getElementsByXPath(".//div[@id='one_comment_area']", evt.target)[0]){
      viewComment(evt.target, evt.newValue);
    }
  }, false);
}

if (window.AutoPagerize) {
    boot();
} else {
    window.addEventListener('GM_AutoPagerizeLoaded',boot,false);
}
