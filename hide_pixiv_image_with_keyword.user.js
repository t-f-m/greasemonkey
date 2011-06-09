// ==UserScript==
// @name           hide pixiv image with keyword in title
// @namespace      http://d.hatena.ne.jp/t_f_m/
// @description    タイトルに特定キーワードを持つpixivの画像を非表示にする
// @include        http://www.pixiv.net/*
// ==/UserScript==
var HIDE_KEYWORD = [
  "腐",
];
var SAFE_KEYWORD= [
  "豆腐",
];

function hide(node){
  var titles=document.evaluate('.//a[p/img and h1]/h1',node,null,7,null);
  var hooked=[];
  var hideKey=HIDE_KEYWORD.join("|");
  var safeKey=SAFE_KEYWORD.join("|");
  for(var i=0, l=titles.snapshotLength;i<l;i++){
    var title=titles.snapshotItem(i);
    if(title.textContent.match(safeKey)){
      continue;
    }
    if(title.textContent.match(hideKey)){
      hooked.push(title);
    }
  }
  hooked.forEach(function(f){
      f.previousElementSibling.style.display="none";
    }
  );
}

function boot(){
  window.addEventListener("AutoPagerize_DOMNodeInserted",function(evt){
      hide(evt.target)
    },
    false
  );
}

hide(document);
if(window.AutoPagerize){
  boot();
}else{
  window.addEventListener("GM_AutoPagerizeLoaded",boot,false);
}