// ==UserScript==
// @name           PixivViewComment
// @namespace      nanakoso
// @description    PIXIVコメント履歴をデフォルトで見れるように Ver. 1.1
// @include        http://www.pixiv.net/member_illust.php*mode=medium*
// @include        http://www.pixiv.net/novel/show.php*
// ==/UserScript==

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
      el = document.evaluate(".//div[@id='one_comment_area']",target,null,7,null).snapshotItem(0);
      el.innerHTML=obj.responseText;
      //alert(el.innerHTML)
      el.style.setProperty("display","",null);
      el.style.setProperty("overflow","visible",null);
      document.evaluate(".//p[@id='one_comment_view']",target,null,7,null).snapshotItem(0).style.setProperty("display","none",null);
      document.evaluate(".//p[@id='one_comment_view2']",target,null,7,null).snapshotItem(0).style.setProperty("display","",null);
    },
    onerror: function(obj){
      alert("onerror")
    }
  })
}

var boot=function(){
  window.addEventListener('AutoPagerize_DOMNodeInserted', function(evt){
    if(evt.target.className=='works_info'){
      viewComment(evt.target, evt.newValue);
    }
  }, false);
}

if (window.AutoPagerize) {
    boot();
} else {
    window.addEventListener('GM_AutoPagerizeLoaded',boot,false);
}
