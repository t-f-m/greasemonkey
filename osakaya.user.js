// ==UserScript==
// @name           osakaya
// @namespace      http://d.hatena.ne.jp/t_f_m/
// @include        http://www.osakaya.co.jp/kensaku/KENSAKU2.asp*
// @include        http://www.osakaya.co.jp/kensaku/kensaku2.asp
// ==/UserScript==
(function(){
var t = document.evaluate('//table[@width="95%"]/tbody/tr/td/a[contains(@href,"kensaku3")]',document,null,7,null)
as=[]
for(i=0,l=t.snapshotLength;i<l;i++){
  a=t.snapshotItem(i)
  as.push(a)
}

function loadRanking(as){
  a=as.shift()
  //for(var i =0,l=as.length;i<l;i++)
  if(a)
  {
    (function(a,as){
      GM_xmlhttpRequest(
        { method:"GET",
          overrideMimeType:"text/plain; charset=Shift_JIS",
          url:a.href,
          onload:function(res){
            if(res.responseText.match(/<table border=3 .*>.*<td nowrap align=center>(<FONT .*>.*<\/FONT>)<\/td>.*<\/table>/i)){
              a.parentNode.innerHTML+=('<span style="{float:right;background-color:#fff2b7;border:3px solid #f5dc98;}">'+RegExp.$1.replace(/<br>|売上ランキング|！！/gi,"").replace(/size="?(?:4|5)"?/gi,'size="-1"')+'</span>');
            }
            loadRanking(as);
          },
        });
    })(/*as[i]*/a,as);
  } 
}
loadRanking(as)

//alert("te")
var boot=function(){
  window.addEventListener('AutoPagerize_DOMNodeInserted', function(evt){
      var aaa=document.evaluate('./td/a[contains(@href,"kensaku3")]',evt.target,null,7,null).snapshotItem(0);
      var aaas=[];
      aaas.push(aaa);
      loadRanking(aaas);
    },false);
  //window.AutoPagerize.addDocumentFilter(function ls(doc,url,siteinfo){});
  /*
  window.AutoPagerize.addDocumentFilter(function(doc,url,siteinfo){
    var aIndoc=[];
    for(var i=0,var l=doc.length;i<l;++i)
      aInDoc.push(document.evaluate('./td/a[contains(@href,"kensaku3")]',doc[i],null,7,null).snapshotItem(0))
    loadRanking(aInDoc)});
  */
}
if(window.AutoPagerize){
  boot();
}else{
  window.addEventListener('GM_AutoPagerizeLoaded', boot, false);
}

/*
//table[@width="95%"]/tbody/tr/td/a[contains(@href,"kensaku3")]
//img/following-sibling::table/tbody/tr/td[font/a] for kensaku3
// @include        http://www.osakaya.co.jp/kensaku/kensaku2.asp
*/
})()
