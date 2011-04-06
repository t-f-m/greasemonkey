// ==UserScript==
// @name           fc2DirectLinkErrorRemover
// @namespace      http://d.hatena.ne.jp/t_f_m/
// @description    remove error of direct link to fc2 image .
// @include        http://*
// @include        https://*
// ==/UserScript==
//fc2DirectLinkErrorRemover
const FC2_DOMAIN = "^http://[^/]+\.fc2\.com/";
const FC2_IMAGES = ".+\.(?:gif|png|jpe?g)";

//ベタ書きなので初回動作しかしない
//何らかのDOM操作後の追加への対策も要検討
if(location.href.match(FC2_DOMAIN)){
  var temp=getTemp();
  if(temp){
    saveTemp("");
    location.href=temp;
  }
  return;
} else{
  var as=document.getElementsByTagName("a");
  //全探索するので遅い
  //document.evaluateに変えて、コンテキストとして探索許可範囲も渡すとマシ？
  //var fc2=[];
  for(var i=0,var l=as.length;i<l;++i){
    var a=as[i];
    //expandShortened(a);
    //短縮URL対策　未実装
    if(a.href.match(FC2_DOMAIN + FC2_IMAGES)){
      a.addEventListener("click",function(){saveTemp(a.href)},false);
      //クリックイベントしか拾わない
      //適切なイベント設定が課題
    }
  }
  return;
}

function saveTemp(href){
  GM_setValue("fc2DLER",href);
}
function getTemp(){
  return GM_getValue("fc2DLER");
}
function expandShortened(a){
}