//选择元素
function $(root, sClass){
	if(typeof root=="string"){
		return document.getElementById('root');
	}
	else{
		var aEles= root.getElementsByTagName('*');
		for(var i=0,len=aEles.length; i<len; i++){
			for(var j=0,aClass=aEles[i].className.split(' ').length; j<k; j++){
				if(aClass[j]==sClass) arr.push(aClass[j]);
			}
		}
		return arr;
	}
}

function getStorage(key, defVal){
	var storage = localStorage.getItem(key) ? localStorage.getItem(key) : defVal;
	// var storage = localStorage.key ? localStorage.key : defVal;
	return storage;
}

function reloadPage(){
	window.location.reload();
}

function addClass(obj,sClass){
	var aClass=obj.className.split('');
	if(!aClass[0]){
		obj.className=sClass;
		return;
	}
	for(var i=0;i<aClass.length;i++){
		if(aClass[i]==sClass){
			return;
		}
	}
	obj.className+=' '+sClass;
}

function removeClass(obj,sClass){
	var aClass = obj.className.split(' ');
	if(!aClass[0])return;
	for(var i=0; i<aClass.length; i++){
		if(aClass[i]==sClass){
			aClass.splice(i,1);
			obj.className = aClass.join(' ');
			return;
		}	
	}		
}

//拖拽
function drap(obj){

	obj.onmousedown=function(e){

		var e=e||event;
		var iX=e.clientX-this.offsetLeft;
		var iY=e.clientY-this.offsetTop;

		if(obj.setCapture){
			obj.setCapture();
			obj.onmousemove=fnMove;
			obj.onmouseup=fnUp;
		}else{
			document.onmousemove=fnMove;
			document.onmouseup=fnUp;
		}

		function fnMove(e){
			var e=e||event;
			var l=e.clientX-iX;
			var t=e.clientY-iY;

			if(l<0){
				l=0;
			}else if(l+obj.offsetWidth>viewW()){
				l=viewW()-obj.offsetWidth;
			}
			if(t<0){
				t=0;
			}else if(t+obj.offsetHeight>viewH()){
				t=viewH()-obj.offsetHeight;
			}
			obj.style.left=l+"px";
			obj.style.top=t+"px";
		}

		function fnUp(e){
			this.onmousemove=null;
			this.onmouseup=null;

			if(obj.releaseCapture){
				obj.releaseCapture();
			}
		}

		return false;

	};
	
}


// window.onload的加载函数
function addLoadEvent(func){
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	}
	else {
		window.onload = function(){
			oldonload();
			func();
		}
	}
}


function getByClass(sClass,oParent){
		
	var parent = oParent || document;
	var aEles = parent.getElementsByTagName('*');
	var arr = [];
	
	for(var i=0; i<aEles.length; i++){
		
		var aClass = aEles[i].className.split(' ');
		
		for(var j=0; j<aClass.length; j++){
			if(aClass[j] == sClass){
			
				arr.push(aEles[i]);
				
			}	
		}
		
	}
	
	return arr;
}

// 获取元素属性
function getStyle(obj,attr){
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,false)[attr];
	}
}

//运动框架，元素所有属性的变化控制(如width/height/opacity等)
function startMove(obj, json, speed, fn){
	if(obj.timer){
		clearInterval(obj.timer);
	}
	
	obj.timer=setInterval(function(){

		var bStop=true;
		for(var attr in json){
			var iCur,
				iSpeed=0;

			if (attr=='opacity') {  
				iCur=parseInt(parseFloat(getStyle(obj,attr))*100);

			}else{
				iCur=parseInt(getStyle(obj,attr));
			}
			iSpeed=(json[attr]-iCur)/speed;

			iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);

			if (iSpeed!=0) {
				bStop=false;
				if (attr=='opacity') {obj.style[attr]=(iCur+iSpeed)/100;}
				else{obj.style[attr]=iCur+iSpeed+'px';}
				
			}
			
		}
		if (bStop) {  
			if (fn) {fn();}
			clearInterval(obj.timer);
		}
	},30)
}


//获取对应className的标签
function getByClass(sClass,oParent){
	// console.log(oParent)	
	var parent = oParent || document;
	var aEles = parent.getElementsByTagName('*');
	var arr = [];
	
	for(var i=0; i<aEles.length; i++){
		
		var aClass = aEles[i].className.split(' ');
		
		for(var j=0; j<aClass.length; j++){
			if(aClass[j] == sClass){
			
				arr.push(aEles[i]);
				
			}	
		}
	}
	return arr;	
}
//纵横线、logo、footer、九宫格字体的显示
function crossLines(){
	var oBg=document.getElementById('bg');
	var oHeader=document.getElementsByTagName('header')[0];
	var oFooter=document.getElementsByTagName('footer')[0];
	var oNineBox=document.getElementById('nine-box');
	var oP=oNineBox.getElementsByTagName('p');
	var oH4=oNineBox.getElementsByTagName('h4');
	var oTab0=oNineBox.getElementsByTagName('div')[0];
	var oLogo=oTab0.getElementsByTagName('img')[0];
	var oBigShow=document.getElementById('bigshow');
	var oMain=document.getElementById('main');
	var aY=getByClass('y', oMain);
	var aX=getByClass('x', oMain);
	uniform(aX[0], 'width', function(){
		uniform(aY[0], 'height');
	});
	uniform(aX[1], 'width', function(){
		uniform(aY[1], 'height',function(){
			startMove(oLogo, {opacity:100}, 30, function(){
				oFooter.style.display="block";
				startMove(oFooter, {opacity:100}, 20, bg );
			});
			for(var i=0,length=oP.length; i<length; i++){
				oNineBox.style.display="block";
				startMove(oP[i], {opacity:100}, 20);
				startMove(oH4[i], {opacity:100}, 20);
			}
		});
	});

}

//大背景轮换
function bg(){
	var oMen=document.getElementById('men');
	var oLady=document.getElementById('lady');
	setInterval(function(){
		getStyle(oMen, 'opacity')==0? (startMove(oMen, {opacity:100}, 20), startMove(oLady, {opacity:0}, 20)):(startMove(oMen, {opacity:0}, 20), startMove(oLady, {opacity:100}, 20));
	}, 6000);
}

//垂直居中函数
function setCenter(){
	var oMain=document.getElementById('main');
	var oBox=document.getElementById('box');
	var wH=document.documentElement.clientHeight;
	var oH=oMain.offsetHeight;
	var oT=(wH-oH)/2;

	oBox.style.paddingTop=oT+'px';
}

//线条匀速运动
function uniform(obj, attr, fn){
	if(obj.timer){
		clearInterval(obj.timer);
	}

	obj.timer=setInterval(function(){
			var iCur,
				target=0;
			var iSpeed=10;
			var oBg=document.getElementById('bg');
			attr=='height'?target=oBg.offsetHeight:target=oBg.offsetWidth;
	// document.title=oBg.offsetWidth;
			iCur=parseInt(getStyle(obj, attr));
			// document.title=oBg.offsetHeight;
			if(iCur>=target){
				clearInterval(obj.timer);
				obj.style[attr]=target+'px';
				if(fn){fn();}
			}else{
				obj.style[attr]=iSpeed+iCur+'px';
			}

	},15)
}


var lib={
	EventUtil:{
		addHandler:function(node, type, handler){
			node.addEventListener?node.addEventListener(type, handler, false): node.attachEvent('on'+type, handler);
		},
		getEvent:function(e){
			return e || window.event;
		},
		getTarget:function(e){
			return e.target || e.srcElement;
		},
		preventDefault:function(e){
			e.preventDefault?e.preventDefault(): e.returnValue=false;
		},

		removeHandle:function(node, type, handler){
			node.removeEventListener?node.removeEventListener(type, handler, false): node.detachEvent('on'+type, handler);
		},
		stopPropagation:function(e){
			e.stopPropagation?e.stopPropagation(): e.cancelBubble=true;
		},
	}
};


function findNearest(obj, objs){
	// var obj=obj;
	// var objs=objs;
	var iNearest=9999;
	var dis=0;
	var oNear=null;
	var x=0;
	var y=0;
	var aTouch=findTouch(obj, objs);
// console.log(aTouch);
	if(aTouch.length>0){
		for(var i=0; i<aTouch.length; i++){
			x=aTouch[i].offsetLeft+aTouch[i].offsetWidth/2-obj.offsetLeft-obj.offsetWidth/2;
			y=aTouch[i].offsetTop+aTouch[i].offsetHeight/2-obj.offsetTop-obj.offsetHeight/2;
			dis=Math.sqrt(x*x+y*y);
			if(dis<iNearest){
				iNearest=dis;
				oNear=aTouch[i];
// console.log(oNear);
			}
		}
// console.log(oNear);
		return oNear;
	}else{
		return null;
	}
	


}

function findTouch(obj, objs){
	var aResult=[];
	for(var i=0; i<objs.length; i++){
		if(objs[i] == obj) continue;
		if( objL(obj) > objR(objs[i]) || objR(obj) < objL(objs[i]) || objT(obj) > objB(objs[i]) || objB(obj) < objT(objs[i]) ){
			continue;
		}else{
			aResult.push(objs[i]);
		}
	}
// console.log(aResult);
	return aResult;
}

function objL(obj){
	return obj.offsetLeft;
}
function objR(obj){
	return obj.offsetLeft+obj.offsetWidth;
}
function objT(obj){
	return obj.offsetTop;
}
function objB(obj){
	return obj.offsetTop+obj.offsetHeight;
}


function viewW(){
	return document.documentElement.clientWidth || document.body.clientWidth;
}
function viewH(){
	return document.documentElement.clientHeight || document.body.clientHeight;
}
function viewL(){
	return document.documentElement.offsetLeft || document.body.offsetLeft;
}
function viewT(){
	return document.documentElement.offsetTop || document.body.offsetTop;
}



// function range(obj, left, top){
// 	var pos = null ;
// 	var l = left > viewL() ? left : 0 ;
// 	l = left + obj.offsetWidth > viewW() ? ( viewW() - obj.offsetWidth ) : left ;
// 	console.log(l);
// 	var t = top > viewT() ? top :0 ;
// 	t = top + obj.offsetHeight > viewH() ? ( viewH() - obj.offsetHeight ) : top ;
// 	console.log(t);
// 	pos = { left: l , top: t } ;

// 	return pos ;
// }



