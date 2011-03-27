// ==UserScript==
// @name           minibuffer to niconicoplaylist mod
// @namespace      http://d.hatena.ne.jp/t_f_m/
// @description    add minibuffer command that controll niconicoplaylist mod
// @include        http://*.nicovideo.jp/*
// ==/UserScript==

let w=this.unsafeWindow;

// Minibufferが動いているかどうかチェック。なければreturnでScriptを中止させている。
if(window.Minibuffer){
  boot();
} else {
  window.addEventListener('GM_MinibufferLoaded', boot, false);
}
//if(!window.gm_playlistController) return;


function boot(){
let {status, getName, pushVideo, unshiftVideo, pushVideos, addLocationParam, addContextMenu, toggleCheckbox,hidePlayer} = w.Nico.Playlist;
let NPLstatus=status;
let {$X, $N, addShortcutkey, addCommand, execute, status} = window.Minibuffer;

[ {
    // 追加するコマンドの名前
    name: 'Nico::location',
    // 追加するコマンド
    command: function(){ 
      status('Sample','YouTube?...');
      setTimeout(function(){status('Sample','YouTube?...NicoVideo!',150);},1000);
    },
  },
  /* template
  {
    name:  '',
    command:  function(){
    },
  },
  */
  {
    name:  'NicoPlayListMod::status',
    command:  function(){
      var playerStatus=(NPLstatus() ? "playing" : "ready") ;
      status('playlistOnOff',"playlist is now...");
      setTimeout( function(){ status('playlistOnOff', playerStatus, 150); },1000 );
    },
  },
  {
    name:  'NicoPlayListMod::getName',
    command:  function(){
      status('playlistName',"playlist is now...");
      setTimeout( function(){ status('playlistName', getName(), 150); },1000 );
    },
  },
  {
    name:  'NicoPlayListMod::addLocationParam',
    //変更予定
    command:  function(){
      param=this.args.toString().replace(/,[:=],/g,':').concat(',');
      //str="{ a:1  ,  noi=98 ,  san = fan  }";
      params={},views=[];
      while(/(\S+)\s*(?:[:=]\s*(\S+))?,/g.exec(param)){
        key=encodeURI(RegExp.$1);
        value=encodeURI(RegExp.$2);
        params[key]=value;
        views.push(key+'='+value)
      }
      status('addLocationParam',"parameter set...");
      addLocationParam(params);
      setTimeout( function(){ status('addLocationParam', views.toString(),150); },1000 );
    },
  },
  {
    name:  'NicoPlayListMod::addLocationParam?eco=1',
    command:  function(){
      status('addLocationParamEco',"parameter set...");
      addLocationParam({eco:1});
      setTimeout( function(){ status('addLocationParamEco', "eco=1",150); },1000 );
    },
  },
  {
    name:  'NicoPlayListMod::addLocationParam?lo=1',
    command:  function(){
      status('addLocationParamLo',"parameter set...");
      addLocationParam({lo:1});
      setTimeout( function(){ status('addLocationParamLo', "lo=1",150); },1000 );
    },
  },
  {
    name:  'NicoPlayListMod::addContextMenu',
    command:  function(){
      status('addContextMenu',"parameter set...");
      setTimeout( function(){ status('addContextMenu', "undefined",150); },1000 );
    },
  },
  {
    name:  'NicoPlayListMod::toggleCheckbox',
    command:  function(){
      status('toggleCheckbox',"parameter set...");
      setTimeout( function(){ status('toggleCheckbox', "undefined",150); },1000 );
    },
  },
  {
    name:  'NicoPlayListMod::hidePlayer',
    command:  function(){
      status('hidePlayer',"hidePlayer...");
      if($X('id("flvplayer")').length){
        scroll = this.args.shift();
        (typeof scroll == "number")? hidePlayer(scroll):hidePlayer();
        setTimeout( function(){ status('hidePlayer', "done",150); },1000 );
      }else{
        setTimeout( function(){ status('hidePlayer', "nothing",150); },1000 );
      }
    },
  },
  /* LDRize の参考部分
  paragraphes: {},      // this.paragraphes[xpath] => instance of Paragraphes (not list)
  html: {},             // pinlist_number pinlist_container pinlist help space
  initPinList: function(){
	  var number_container = $N('div',{id:'gm_ldrize_pinlist_number_container'},
				    [$N('div',{id:'gm_ldrize_pinlist_number'}),' item']);
	  var pin_container = $N('div',{style: 'display:'+GM_getValue('pinlist', 'block')});
	  var box = $N('div',{id:'gm_ldrize_pinlist', style:'display:none;'},
	               [number_container, pin_container]);
	  this.html.pinlist_number = number_container;
	  this.html.pinlist_container = pin_container;
	略
  }
  addPinToPinList: function(node){
  	略
	  var paragraph = this.getParagraphes().find(function(para){return node == para.node});
  	略
	  this.html.pinlist_container.appendChild(paragraph.html);
	略
  }
		  { name: 'pinned-node',
			command: function(stdin){
				return self.getPinnedItems().map(function(i){return i.node})}},
		  { name: 'all-node',
			command: function(stdin){
				return self.getParagraphes().list.map(function(i){return i.node;});}},
  getSiteinfo: function(){return this.siteinfo_current},
  getParagraphes: function(){return this.paragraphes[this.getSiteinfo().paragraph]},
  pinIsEmpty: function(){return !this.html.pinlist_container.childNodes.length},
  getPinnedItems: function(){
	  var paragraphes = this.getParagraphes();
	  return toArray(this.html.pinlist_container.childNodes).map(function(view){
		  return paragraphes.find(function(arg){
			  return arg.html == view});
	  });
  },
  getPinnedItemsOrCurrentItem: function(){
	if(this.pinIsEmpty()){
		var para = this.getParagraphes().current.paragraph;
		return para ? [para] : [];
	}
	return this.getPinnedItems();
  },
  */
  {
    name:  'NicoPlayListMod::pushVideo',
    //pinned-link | NicoPlayListMod::pushVideo
    command:  function(stdin){
      /*
      for(i=0,l=stdin.length;i<l;++i){
        for(j in stdin[i]){
          status('pushVideo'+i+j,i+" : "+j+ " "+stdin[i][j]);
        }
      }
      */
      
      stdin.forEach(function(node){
        ta=$X('./self::a/following::a[contains(@href,"watch")]',node)[0];
        href=ta.href;
        title=ta.title;
        video=href.substring(href.lastIndexOf('/')+1);
        if(/^\d/.test(video)) {
          video="watch/"+video;}
        (function(href,title,video){
          status("video"+href,video+":"+title);
          pushVideo(""+video,""+title,null);
          setTimeout( function(){ status("video"+href, video+"added to playlist", 150); },1000 );
        })(href,title,video);
        /*
        status("a"+href,""+href);
        status("t"+title,""+title);
        status("te",$X('./parent::p',ta)[0].innerHTML);
        */
      });
      //setTimeout( function(){ status('pushVideo', "" + typeof stdin, 150); },1000 );
    },
  },
  {
    name:  'NicoPlayListMod::unshiftVideo',
    //pinned-link | NicoPlayListMod::unshiftVideo
    command:  function(stdin){
      stdin.forEach(function(node){
        ta=$X('./self::a/following::a[contains(@href,"watch")]',node)[0];
        href=ta.href;
        title=ta.title;
        video=href.substring(href.lastIndexOf('/')+1);
        if(/^\d/.test(video)) {
          video="watch/"+video;
        }
        (function(href,title,video){
          status("video"+href,video+":"+title);
          unshiftVideo(""+video,""+title,null);
          setTimeout( function(){ status("video"+href, video+"added to playlist", 150); },1000 );
        })(href,title,video);
      });
    },
  },
  //id('buttons')/input[@value="next"]
  {
    name:  'NicoPlayListMod::playNext',
    command:   function(){
      var next = document.evaluate('id("buttons")/input[@value="next"]', document, null, 9, null).singleNodeValue;
      if (next){
        var ev = document.createEvent('Event');
        ev.initEvent('click', true, false);
        next.dispatchEvent(ev);
      }
    }
  },
  //e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  {
    name:  'NicoPlayListMod::addAll',
    command:   function(){
      var addall = document.evaluate('id("buttons")/input[@value="add all"]', document, null, 9, null).singleNodeValue;
      if (addall){
        var ev = document.createEvent('Event');
        ev.initEvent('click', true, false);
        addall.dispatchEvent(ev);
      }
    }
  },
  {
    name:  'NicoPlayListMod::addThis',
    command:   function(){
      var addthis = document.evaluate('id("buttons")/input[@value="add this"]', document, null, 9, null).singleNodeValue;
      if (addthis){
        var ev = document.createEvent('Event');
        ev.initEvent('click', true, false);
        addthis.dispatchEvent(ev);
      }
    }
  },
  {
    name:  'NicoPlayListMod::update',
    command:   function(){
      var update = document.evaluate('id("buttons")/input[@value="update"]', document, null, 9, null).singleNodeValue;
      if (update){
        var ev = document.createEvent('Event');
        ev.initEvent('click', true, false);
        update.dispatchEvent(ev);
      }
    }
  },
  {
    name:  'NicoPlayListMod::showPlaylistController',
    command:   function(){
      var pc = document.evaluate('id("playlistController")', document, null, 9, null).singleNodeValue;
      if (pc){
        pc.style.left=0;
      }
    }
  },
  {
    name:  'NicoPlayListMod::hidePlaylistController',
    command:   function(){
      var pc = document.evaluate('id("playlistController")', document, null, 9, null).singleNodeValue;
      if (pc){
        pc.style.left="-"+(parseInt(pc.style.width)-4)+"px";
      }
    }
  },
].forEach(addCommand);
/*
pushVideos(videos);
複数の動画をキューの最後に追加。
"videos" : "{ video : video , title : title , opt : opt }" の連想配列形式。

addLocationParam(obj);
次の動画のurlにパラメーターを追加。
"obj" : "{ key : name }" の連想配列形式。

addContextMenu(label,caption,func,title);
playlist内の動画を右クリックしたときに表示されるメニューを追加。
"label" : 識別子。labelが同じものを追加した場合はその内容がアップデートされる。
"caption" : メニュー項目の表示名。
"func" : 追加させたい機能。引数としてindex(playlist内での動画の位置。値は始めが0になるので注意),video,title,optが第一から第四に入る。
"title" : tooltipに表示される内容。省略可。

toggleCheckbox(e,opt);
playlistの下にあるcheckboxをトグルさせる。
"e" : checkbox名。
"opt" : 真偽値。これを指定すれば、checkboxの状態に関わらずon/offを直接指定できる。
なお、ここで指定したものは保存されないので注意して下さい。

hidePlayer(scroll);
プレイヤーを非表示にする。
"scroll" は数値。これを指定すれば、その高さまで自動的に移動。
*/
}
/*
myAddCommand = function(arg){
  if(isArray(arg)){
    arg.forEach(window.Minibuffer.addCommand);
  }else{
    window.Minibuffer.addCommand(arg);
  }
}
*/
/*
isArray = function(arg){
  if(typeof arg != "object")
    return false;
  var i=0;
  for(var j in arg){
    if(j!=i++) return false;
  }
  return true;
}
*/

/*
function hoge(args){
  prt(j++);
  if(typeof args == "object"
     && typeof args.length == "number"){
    for(var i=0;i<args.length;i++){
      prt("recursive");
      hoge(args[i]);
      prt("return")
    }
    //    return ;
  }else if(typeof args == "string"){
    prt("string");
  }else{
    prt(args);
  }
}
*/
