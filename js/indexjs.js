window.onload=function(){
var oMainBox=document.getElementById('mainbox');
var oMainBoxUl=document.getElementsByTagName('ul');	

//header部分
var oPageUl=document.getElementById('header-page');
var oPageBtns=oPageUl.getElementsByTagName('li');

//app最小化


//初始状态设置
var oPage=new Pages();
// oPage.seq=1;

var oClock=document.getElementById('clock');
var oClockDial=document.getElementById('clockDial');
toDial(oClockDial);
var oClockHand=document.getElementById('clockHand');
getTime();
setInterval(function(){
	getTime();
},1000);



function getTime(){
	var oHour=document.getElementById('clockHand-hour');
	var oMin=document.getElementById('clockHand-min');
	var oSec=document.getElementById('clockHand-sec');
	var oTime=new Date();
	var iHour=oTime.getHours();
	var iMin=oTime.getMinutes();
	var iSec=oTime.getSeconds();
	oSec.style.WebkitTransform='rotate('+6*iSec+'deg)' ;
	oMin.style.WebkitTransform='rotate('+6*iMin+'deg)' ;
	oHour.style.WebkitTransform='rotate('+30*iHour+'deg)' ;

	oSec.style.MozTransform='rotate('+6*iSec+'deg)' ;
	oMin.style.MozTransform='rotate('+6*iMin+'deg)' ;
	oHour.style.MozTransform='rotate('+30*iHour+'deg)' ;

}

// 时钟
drap(oClock);


function toDial(obj){
	var sHtml="";
	var iDeg=30;
	for(var i=0;i<12;i++){
		sHtml+="<span style='-webkit-transform:rotate("+iDeg*i+"deg) translate("+55*Math.sin(2*Math.PI/360)+"px, "+55*Math.cos(2*Math.PI/360)+"px); -moz-transform:rotate("+iDeg*i+"deg) translate("+55*Math.sin(2*Math.PI/360)+"px, "+55*Math.cos(2*Math.PI/360)+"px) '></span>" ;
	}
	obj.innerHTML=sHtml;
}


// 天气
var oWeather=document.getElementById('weather');
var oW_close=document.getElementById('weather-close');
var oWeatherToday=document.getElementById('weather-today');
var oWeatherTomorrow=document.getElementById('weather-tomorrow');
var oCityName=document.getElementById('weather-cityName');
var oInputCity=document.getElementById('inputCity');
var oLocal_t=document.getElementsByTagName('localTime');
var oWeatherMenu=document.getElementById('weather-menu');
var oWeatherMenuPro=document.getElementById('weather-menu-province');
var oWeatherMenuCity=document.getElementById('weather-menu-city');
var oWeatherMenuConfirm=document.getElementById('weather-menu-confirm');
var oWeatherMenuCancel=document.getElementById('weather-menu-cancel');
var nowCity="";
var lastCity="";
var storageCity = getStorage("lastCity", "广州");

drap(oWeather);

//天气插件关闭
oW_close.onmouseover=oWeather.onmouseover=function(){
	oW_close.style.display='block';
};
oWeather.onmouseout=function(){
	oW_close.style.display='none';
};
oW_close.onclick=function(){
	this.style.display="none";
	oWeather.style.display="none";
};

for(var j in citymap){
	var oOp=document.createElement('option');
	oOp.value=oOp.innerHTML=j;
	oWeatherMenuPro.appendChild(oOp);
}

oWeatherMenuPro.onmousedown=oWeatherMenuCity.onmousedown=oInputCity.onmousedown=function(e){
	var e=e||event;
	e.stopPropagation();
	e.cancelBubble=true;
};

oWeatherMenuPro.onchange=function(){
	oWeatherMenuCity.innerHTML='';
	for(var j in citymap[oWeatherMenuPro.value]){
		var oOp=document.createElement('option');
		oOp.value=oOp.innerHTML=j;
		oWeatherMenuCity.appendChild(oOp);
	}
};

oInputCity.onclick=function(){
	this.value='';
	this.style.color='#000';
};

// oInputCity.onkeyup = function(){
// 	nowCity = this.value;
// 	console.log(nowCity)
// 	console.log(nowCity.replace(/^\s+|\s+$/g,"") );
// }

oCityName.onclick=function(){
	oWeatherMenu.style.display='block';
	// oWeather.onmousedown=null;
};
oWeatherMenuConfirm.onclick=function(){
	oWeatherMenu.style.display='none';
	
	nowCity=oInputCity.value.replace(/^\s+|\s+$/g,"");
	if(nowCity!="请输入城市名称" && nowCity!=""){
		getWeather(nowCity);
	}else{
		getWeather(oWeatherMenuCity.value);
	}

	oInputCity.value="请输入城市名称";

};
oWeatherMenuCancel.onclick=function(){
	oWeatherMenu.style.display='none';
	oInputCity.value="请输入城市名称";
		// drap(oWeather);

};
function showWeather(city){
//新浪天气接口
	if(SWther.w[city] === undefined){

		alert("请输入正确名称或换一个");
		return false;
	}

	oCityName.innerHTML=city;
	window.localStorage.setItem("lastCity", city);

	var str='<strong>今天 : </strong>';

	if(SWther.w[city][0].s1 == SWther.w[city][0].s2){
		str+=SWther.w[city][0].s1;
	}
	else{
		str+=SWther.w[city][0].s1+'转'+SWther.w[city][0].s2;
	}
	str += ' ' + SWther.w[city][0].t1 + '℃~' + SWther.w[city][0].t2 + '℃';
	oWeatherToday.innerHTML=str;

	var str1='<strong>明天 : </strong>';
	if(SWther.w[city][1].s1 == SWther.w[city][1].s2){
		str1+=SWther.w[city][1].s1;
	}
	else{
		str1+=SWther.w[city][1].s1+'转'+SWther.w[city][1].s2;
	}
	str1 +=' '+ SWther.w[city][1].t1 + '℃~' + SWther.w[city][1].t2 + '℃';
	oWeatherTomorrow.innerHTML=str1;


}
function getDat(){
	var oDate=new Date();
	var iYear=oDate.getFullYear();
	var iMonth=oDate.getMonth()+1;
	var iDate=oDate.getDate();
	iMonth = iMonth<10? '0'+iMonth : ''+iMonth;
	iDate = iDate<10? '0'+iDate : ''+iDate;
	return iYear+iMonth+iDate;

}

// 新浪天气接口
function getWeather(city) {
	var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&day=2&city=" + city + "&dfc=3";

	var oScript=document.createElement('script');
	oScript.src=url;
	oScript.charset='gbk';
	document.body.appendChild(oScript);
	oScript.onload = function(){
		showWeather(city);
	} 
}

getWeather(storageCity);


var sM_item=document.getElementById('sM_item');
var sM_item_a=sM_item.getElementsByTagName('a');
var oBgWin=document.getElementById('bgWin');
var oBody=document.getElementsByTagName('body')[0];

oBody.style.backgroundImage="url(img/bg" + getStorage("bg", 1) + ".jpg)" ;
sideMenuHover();
bgSel();
drap(oBgWin);

function sideMenuHover(){

	var bgJson={
		"out":{
			0:["-81px -109px"],
			1:["0px -109px"],
			2:["-60px -109px"],
			3:["-40px -109px"],
			4:["-102px -109px"]
		},
		"over":{
			0:["-81px -128px"],
			1:["0px -128px"],
			2:["-60px -128px"],
			3:["-40px -128px"],
			4:["-141px -109px"]
		}
	};

	for(var i=0,len=sM_item_a.length; i<len; i++){
		sM_item_a[i].index=i;
		sM_item_a[i].onmouseover=function(){
			this.style.backgroundPosition=bgJson.over[this.index];
		};
		sM_item_a[i].onmouseout=function(){
			this.style.backgroundPosition=bgJson.out[this.index];
		};

	}

}

sM_item_a[3].onclick=function(){
	oBgWin.style.display="block";
	oBgWin.style.left=(viewW()-oBgWin.offsetWidth)/2+'px';
	oBgWin.style.top=(viewH()-oBgWin.offsetHeight)/2+'px';
};

getByClass('close', oBgWin)[0].onclick=function(){
	oBgWin.style.display="none";
};


function bgSel(){

	var bg=getByClass('bgWin-con', oBgWin)[0].getElementsByTagName('img');

	for(var i=0,len=bg.length; i<len; i++){
		bg[i].index=i;
		bg[i].onclick=function(){
			var url="url(img/bg" + (this.index+1) + ".jpg)";
			oBody.style.backgroundImage=url;
			localStorage.setItem("bg", this.index+1);
		};
	}
}



};


function Pages(){
	
	this.iNowPage=0;
	this.oMainBox=document.getElementById('mainBox');
	this.pages=this.oMainBox.getElementsByTagName('ul');
	//排序、图标大小变量
	this.seq=0;;
	this.iconSize=1;
	this.flag=true;
	this.oWin=document.getElementById('winIframe');
	this.oWinTop=document.getElementById('winIframe-top');
	// this.oWinTopBtns=oWinTop.getElementsByTagName('a');
	this.oIframe=this.oWin.getElementsByTagName('iframe')[0];
	this.oWin.w=600;
	this.oWin.h=430;
	this.oWin.l,
	this.oWin.t,
	this.oWin.mt=0;
	this.aHttp=[
		'http://web.3366.com/ddz/','http://mgp.qq.com/webqqindex.html','http://qqbaby.qq.com/baby.html','../T-Mall/T-Mall.html','../UR/index.html',
		'introduce.html','http://www.4399.com/','http://www.mangocity.com/webqq/bookFlight.html',
		'http://kuaidi100.com/frame/app/index.html','http://kuaidi100.com/frame/app/index.html','http://www.bjbqdz.com/',
		'http://pan.baidu.com/','http://www.kuaipan.cn/','http://www.163.com','','','','','http://www.qidian.com/',
		'http://qqreader.qq.com/','http://play.baidu.com/?from=mp3','http://v.qq.com/','http://www.letv.com/',
		'http://www.pengyou.com','http://qqreader.qq.com/','http://id.qq.com/index.html',
		'http://k.ai/','http://webqq.kxjy.com'
	];
	this.oAppMini=document.getElementById('appMini');
	this.oAppMini.w=112;
	this.oAppMini.h=40;
	this.oAppCon=document.getElementById('appMiniCon');
	this.oAppBtn=document.getElementById('appMini-btns');
	var that=this;
	this.oApp=this.oMainBox.getElementsByTagName('li');
	this.openApp=null;

	this.init();
	this.rightClick();
}

Pages.prototype={
	init: function(){
		var that=this;

		for(var i=0; i<this.pages.length; i++){
			this.pages[i].style.left='-1500px';
			this.iconInOrder(this.pages[i]);
		}
		// this.pages[this.iNowPage].style.opacity=1;
		// this.pages[this.iNowPage].style.left=0;
		
		this.pageCtl();
		drap(this.oWin);
		// this.fly(this.pages[this.iNowPage], true, "right");
		//app的弹窗侦听
		for(var j=0,len=this.oApp.length; j<len; j++){
			this.oApp[j].symbol=j;
			this.oApp[j].onclick=function(){
				if(that.flag==true){

					that.openApp=this;
					that.appOpen(this, that.aHttp[this.symbol]);
				}
				
			};
		}
		//窗口按钮
		getByClass('close', this.oWinTop)[0].onclick=function(){
			that.appBackClose();
			startMove(that.oWin, {height:0, opacity:0}, 8, function(){
				that.oWin.style.display='none';

			});
		};
		getByClass('max', this.oWinTop)[0].onclick=function(){
			if(/resume/.test(this.className)){
				removeClass(this, 'resume');
				startMove(that.oWin, {width:600, height:430, left:Math.floor((viewW()-600)/2), top:Math.floor((viewH()-430)/2) }, 8);			
				
			}else{
				addClass(this, "resume");
				startMove(that.oWin, {width:viewW(), height:viewH(), left:0, top:0 }, 8);
			}

		};

		getByClass('min', this.oWinTop)[0].onclick=function(){
			that.appBack(that.openApp);
			that.oAppMini.style.display='block';
			that.oWin.t=that.oWin.offsetTop;
			that.oWin.l=that.oWin.offsetLeft;
			that.oWin.h=that.oWin.offsetHeight;
			startMove(that.oWin, {height:0, opacity:0, top:that.oWin.h+that.oWin.offsetTop}, 8);
		};

		//任务栏按钮
		getByClass('resume', this.oAppBtn)[0].onclick=function(){
			startMove(that.oWin, {height:that.oWin.h, opacity:100, top:that.oWin.t}, 8);
			// startMove(that.oWin, {height:that.oWin.h, opacity:100, marginTop:0}, 8);
		};
		getByClass('close', this.oAppBtn)[0].onclick=function(){
			that.appBackClose();
			startMove(that.oWin, {height:0, opacity:0}, 8, function(){
				that.oWin.style.display='none';

			});
		};

		this.oAppMini.onmouseover=function(){
			// console.log(that.oAppCon.style.top)
			startMove(that.oAppCon, {top: -35}, 8);
			// .style.top="-35px";
		};
		this.oAppMini.onmouseout=function(){
			startMove(that.oAppCon, {top: 0}, 8);
			// that.oAppCon.style.top="0px";
		};

		window.onresize=function(){
			for(var i=0; i<that.pages.length; i++){
				that.iconInOrder(that.pages[i]);
			}
		};
	},


	appOpen: function(obj, url){
		removeClass(getByClass('max', this.oWinTop)[0], 'resume');
		this.appBackClose();
		clearInterval(this.oWin.timer);
		var that=this;
		this.oIframe.src=url;
		this.oWin.style.display='block';
		this.oWin.style.width='600px';
		this.oWin.style.height='430px';
		this.oWin.style.left=(viewW()-600)/2+'px';
		this.oWin.style.top=(viewH()-430)/2+'px';
		
		this.oWin.style.opacity=1;
		

	},
	appBack: function(obj){
		getByClass('appMini-title', this.oAppCon)[0].innerHTML=obj.title;
		this.oAppMini.style.width=0;
		this.oAppMini.style.display='block';
		startMove(this.oAppMini, {width: this.oAppMini.w}, 8);
		
	},
	appBackClose: function(){
		this.oAppMini.style.display='none';
	},

	//页面切换按钮
	pageCtl: function(){
		var oPageUl=document.getElementById('header-page');
		var pageCtl=oPageUl.getElementsByTagName('li');
		var that=this;
		pageCtl[this.iNowPage].className="active";
		for(var i=0; i<pageCtl.length; i++){
			pageCtl[i].index=i;
			pageCtl[i].onclick=function(){
				for(var i=0; i<pageCtl.length; i++){
					pageCtl[i].className='';
				}
				this.className='active';
				if(this.index>that.iNowPage){
					that.fly(that.pages[this.index], 1, "left");
					that.fly(that.pages[that.iNowPage], 0, "left");
				}else if(this.index<that.iNowPage){
					that.fly(that.pages[this.index], 1, "right");
					that.fly(that.pages[that.iNowPage], 0, "right");
				}
				that.iNowPage=this.index;

			};
		}
	},


	fly: function(obj, isIn, direction){
		if(isIn){

			var begin = direction=="left"? 1500:-1500; 
			obj.style.opacity=1;
			obj.style.left=begin+"px";
			obj.timer=setInterval(function(){
				obj.offsetLeft==0?clearInterval(obj.timer):obj.style.left=-begin/10+obj.offsetLeft+"px";
			},30);
		}else{
			var dest = direction=="left"? -1500:1500;
			obj.style.left=dest+"px";
			obj.timer=setInterval(function(){
				if(obj.offsetLeft==dest){
					clearInterval(obj.timer);
					obj.style.opacity=0;
				}else{
					obj.style.left=dest/10+obj.offsetLeft+"px";
				}	
			},30);
		}
		
		
	},

	appSize: function(iNum){
		var sizeLib={
			'0': 70,
			'1': 90,
			'2': 130
		}
		for(var i=0,len=this.oApp.length; i<len; i++){
			this.oApp[i].style.width=sizeLib[iNum];
		}
		for(var j=0; j<this.pages.length; j++){
				this.iconInOrder(this.pages[j]);
		}
	},

	iconInOrder: function(obj){

		var iconX;
		var iconY;
		// this.iconSize=0;
		switch(this.iconSize){
			case 0:
				iconX=iconY=90;
				for(var x=0; x<this.oApp.length; x++){
					this.oApp[x].style.width=this.oApp[x].style.height='70px';
				}
				break;
			case 1:
				iconX=iconY=120;
				for(var y=0; y<this.oApp.length; y++){
					this.oApp[y].style.width=this.oApp[y].style.height='90px';
				}
				break;
			case 2:
				iconX=iconY=140;
				for(var z=0; z<this.oApp.length; z++){
					this.oApp[z].style.width=this.oApp[z].style.height='130px';
				}
				break;
			default:
				break;
		}
		var icons=obj.getElementsByTagName('li');
		obj.aPos={
			left:0,
			top:0
		};

		deskX=Math.floor(parseInt((document.documentElement.clientWidth - this.oMainBox.offsetLeft )/iconX));
		deskY=Math.floor(parseInt((document.documentElement.clientHeight - this.oMainBox.offsetTop )/iconY));

		for(var i=0,len=icons.length; i<len; i++){
			// icons[i].index=i;
			if(this.seq){
				startMove(icons[i], {left: i%deskX*iconX, top: Math.floor(i/deskX)*iconY}, 8);
				obj.aPos[i]={							//icons初始位置数组
					left:  i%deskX*iconX,
					top: Math.floor(i/deskX)*iconY
				};
			}else{
				startMove(icons[i], {left: Math.floor(i/deskY)*iconX, top: i%deskY*iconY}, 8);
				obj.aPos[i]={							//icons初始位置数组
					left:  Math.floor(i/deskY)*iconX,
					top: i%deskY*iconY
				};
			}

		}

		this.pages[this.iNowPage].style.opacity=1;
		this.pages[this.iNowPage].style.left=0;

		this.drap(obj);
	},
	
	drap: function(obj){
		var _this=this;
		var oNear=null;
		var icons=obj.getElementsByTagName('li');

		for(var i=0,len=icons.length; i<len; i++){
			icons[i].index=i;

			icons[i].onmousedown=function(e){
				var that=this;
				_this.flag=true;
				this.style.zIndex++;
				var oEv=e||window.event;
				var iX = oEv.clientX - this.offsetLeft;
				var iY = oEv.clientY - this.offsetTop;

				document.onmousemove=function(e){
					var oEv=e||window.event;
					var l=oEv.clientX - iX;
					var t=oEv.clientY - iY;
					//判断单击抑或拖动事件
					_this.flag=(Math.abs(l)>5 || Math.abs(t)>5)==1?false:true;

					that.style.left=l + "px";
					that.style.top=t + "px";
					oNear=findNearest(that, icons);
				};

				document.onmouseup=function(){
					var temp=that.index;

					document.onmousemove=null;
					document.onmouseup=null;
					if(oNear){
						startMove(that, {left: obj.aPos[oNear.index].left, top: obj.aPos[oNear.index].top}, 8);
						// that.style.left=obj.aPos[oNear.index].left + "px";
						// that.style.top=obj.aPos[oNear.index].top + "px";
						startMove(oNear, {left: obj.aPos[that.index].left, top: obj.aPos[that.index].top}, 8);
						// oNear.style.left=obj.aPos[that.index].left + "px";
						// oNear.style.top=obj.aPos[that.index].top + "px";
						//交换index,可更新obj.aPos的坐标
						that.index=oNear.index;
						oNear.index=temp;

						//交换li位置,使window.onresize时保持图标坐标
						// that.parentNode.insertBefore(that, oNear);
						// that.parentNode.insertBefore(oNear, icons[temp]);

					}else{
						startMove(that, {left: obj.aPos[that.index].left, top: obj.aPos[that.index].top}, 8);
						// that.style.left=obj.aPos[that.index].left + "px";
						// that.style.top=obj.aPos[that.index].top + "px";
					}
					that.style.zIndex=0;

				};
				oEv.stopPropagation();
				return false;			//取消默认行为,避免拖动img出现图片灵魂出窍行为

			};
		}
	},


	rightClick: function(){

		// 右键菜单
		var that=this;
		var oRightMenu=document.getElementById('rightMenu');
		var tabArrange=getByClass('rightMenu-second', oRightMenu)[0].getElementsByTagName('li');
		var tabArrangeUl=getByClass('rightMenu-second', oRightMenu)[0].getElementsByTagName('ul')[0];
		var tabSize=getByClass('rightMenu-second', oRightMenu)[1].getElementsByTagName('li');
		var tabSizeUl=getByClass('rightMenu-second', oRightMenu)[1].getElementsByTagName('ul')[0];
		document.oncontextmenu=function(e){
			var e=e||event;
			e.preventDefault();
			oRightMenu.style.display='block';
			oRightMenu.style.left=e.clientX+'px';
			oRightMenu.style.top=e.clientY+'px';
		}

		document.onclick=function(){
			oRightMenu.style.display='none';
		};

		getByClass('rightMenu-second', oRightMenu)[0].onmouseover=function(){
			this.getElementsByTagName('ul')[0].style.display='block';
		};
		getByClass('rightMenu-second', oRightMenu)[0].onmouseout=function(){
			this.getElementsByTagName('ul')[0].style.display='none';
		};
		getByClass('rightMenu-second', oRightMenu)[1].onmouseover=function(){
			this.getElementsByTagName('ul')[0].style.display='block';
		};
		getByClass('rightMenu-second', oRightMenu)[1].onmouseout=function(){
			this.getElementsByTagName('ul')[0].style.display='none';
		};

		for(var p=0; p<tabArrange.length; p++){
			tabArrange[p].index=p;
			tabArrange[p].onclick=function(){
				for(var p=0; p<tabArrange.length; p++){
					tabArrange[p].className='';
				}
				this.className='rightMenu-active';
				that.seq=this.index;

				for(var i=0; i<that.pages.length; i++){
					that.pages[i].style.left='-1500px';
					that.iconInOrder(that.pages[i]);
				}
			};
		}
		for(var q=0; q<tabSize.length; q++){
			tabSize[q].index=q;
			tabSize[q].onclick=function(){
				for(var q=0; q<tabArrange.length; q++){
					tabSize[q].className='';
				}
				this.className='rightMenu-active';
				that.iconSize=this.index;

				for(var j=0; j<that.pages.length; j++){
					that.pages[j].style.left='-1500px';
					that.iconInOrder(that.pages[j]);
				}
			};
		}

	}





};

