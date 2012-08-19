// ==UserScript==
// @name          A smart dashboard is_reblogged_mine
// @description	  Tumblrのダッシュボードの内、自分が投稿したpostからreblogされたものを折りたたみ&半透明化し、ダッシュボードをスマートにします
// @include       http://www.tumblr.com/*
// @include       https://www.tumblr.com/*
// @include       http://*.www.tumblr.com/*
// @include       https://*.www.tumblr.com/*
// ==/UserScript==
(function() {
var css = <![CDATA[
li[id^="post"].is_reblogged_mine {
		-moz-opacity:0.9 !important;
		opacity:0.9 !important;
		max-height:1em !important;
		overflow:hidden !important;
	}
li[id^="post"].is_reblogged_mine img {
		display:none !important;
	}
li[id^="post"].is_reblogged_mine blockquote {
		display:none !important;
}
]]>.toString();

if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		heads[0].appendChild(node); 
	}
}

var XPATH = 'id("posts")/li[div[@class="post_info"][contains(.,"reblogged you") or contains(.,"があなたからリブログ")][count(a)=1]]'

function is_reblogged_mine(htmlDoc){
  var target = htmlDoc.evaluate(XPATH, htmlDoc, null, 7, null);
  for(var i = 0, maxi = target.snapshotLength; i < maxi; i++){
    target.snapshotItem(i).className += " is_reblogged_mine ";
  }
}

//var hookKeyWord="reblogged you";

var boot=function(){
  sharedObject.AutoPagerize.addDocumentFilter(is_reblogged_mine);
}
is_reblogged_mine(document);
if(window.AutoPagerize || sharedObject.AutoPagerize){
  boot();
}else{
  window.addEventListener('GM_AutoPagerizeLoaded', boot, false);
}
})();
