//---------------------------------------------------------------
//	改变网页大小改变尺寸
function deskHeight(){
	var h = $(window).height();
	desk.css('height',h-20);
	sortFile(10);
}

//----------------------------------------------------------------------
//	创建桌面
function createDesk(data){
	var str = '';
	$.each(data, function(i,ele) {
		let time = dateFormat(data,data[i].id);
		let src = getImgSrc(data,data[i].id);
		str += `<div class="item" data-index='${data[i].id}' data-time='${time}'>
				<a href="javascript:;" class="item_img" data-index='${data[i].id}'>
					<img src="${src}" data-index='${data[i].id}'/>
				</a>
				<p class="item_name">${data[i].name}</p>
				<input type="text" />
			</div>`;
	});
	desk.html(str);
	sortFile(10);
}

//--------------------------------------------------------------------------
//	排序
function sortFile(size){
	var h = $(window).height();
	var num = Number.parseInt(h/(100+size));
	$.each($('.item'), function(i,ele) {
		$(ele).stop().animate({
			left:Number.parseInt(i/num)*100+size,
			top:i%num*100+size
		},500,'linear')
	});
	checkOffAll();
}

//------------------------------------------------------------------------
//	点击选中文件夹 (传入原生元素)
function checkFile(item){
	var id = $(item).data('index')*1;
	var obj = getObjectById(data,id);
	if(obj.checked){
		obj.checked = false;
		$(item).css({
			background:'',
			borderColor:''
		})
	}else{
		obj.checked = true;
		$(item).css({
			background:'rgba(0,0,0,0.2)',
			borderColor:'#6cabb4'
		})
	};
}

//-----------------------------------------------------------
//	清空所有选中
function checkOffAll(){
	$.each($('.item'), function(i,item) {
		var id = $(item).data('index')*1;
		var obj = getObjectById(data,id);
		obj.checked = false;
		$(item).css({
			background:'',
			borderColor:''
		})
	});
}

//-----------------------------------------------------------------------
//	右键菜单
function rightMenu(e){
	var x=e.pageX,y=e.pageY;
	$('.mousemenu').show();
	var pw = $(window).width();
	var ph = $(window).height();
	var w = $('.mousemenu').width();
	var h = $('.mousemenu').height();
	var l=pw-x>w?x:x-w;
	var t=ph-y>h?y:y<h?0:y-h;
	$('.mousemenu').css({
		left:l,
		top:t
	})
	$(document).on('click',function(){
		$('.mousemenu').hide();
	})
	$('.mousemenu li').mouseover(function(){
		if($(this).children('ul').length){
			menuOver($(this));
		}
	})
	$('.mousemenu li').mouseout(function(){
		menuOut($(this));
	})
}

//--------------------------------------------------------------------------
//	右键菜单的鼠标移入事件
function menuOver(_this){
	var pw = $(window).width();
	var mw = $('.mousemenu').outerWidth();
	var item = _this.children('ul');
	item.show();
	var w = item.outerWidth();
	var l = (pw-mw-$('.mousemenu').offset().left)>w?mw-4:-w;
	item.css('left',l);
}

//---------------------------------------------------------------------------
//	右键菜单的鼠标移出事件
function menuOut(_this){
	_this.css('background','');
	if($(_this).children('ul').length){
		$(_this).children('ul').hide();
	}
}

//-----------------------------------------------------------------------
//	鼠标画框
function paintDivDown(e){
	$('.mousemenu').hide();
	var painting = $('<div class="painting"></div>');
	painting.appendTo(desk);
	var x = e.pageX,y = e.pageY;
	var pw = $(window).width();
	var ph = $(window).height();
	$(document).on('mousemove',paintDivMove);
	$(document).on('mouseup',function(){
		painting.remove();
		$(document).off('mousemove mouseup');
	})
	function paintDivMove(e){
		var dx = e.pageX,dy = e.pageY;
		painting.css({
			left:Math.min(dx, x),
			top:Math.min(dy, y),
			width:Math.abs(x - dx),
			height:Math.abs(y - dy)
		});
		$.each($('.item'), function(i,item) {
			if(isTouch(painting,item)){
				var id = $(item).data('index')*1;
				if(!getObjectById(data,id).checked){
					checkFile(item);	
				}
			}else{
				var id = $(item).data('index')*1;
				if(getObjectById(data,id).checked){
					checkFile(item);	
				}
			}
		});
	}
}

//------------------------------------------------------------------------
//	新建文件夹
function newFile(){
	var obj = {
		type:'folder',
		id:getNewId(),
		pId:0,
		name:'新建文件夹',
		checked:false,
		time:getNowTime(),
		child:[]
	}
	data.push(obj);
	var time = dateFormat(data,obj.id);
	var str = `<div class="item" data-index='${obj.id}' data-time='${time}'>
				<a href="javascript:;" class="item_img" data-index='${obj.id}'>
					<img src="imgs/file.png" data-index='${obj.id}'/>
				</a>
				<p class="item_name">${obj.name}</p>
				<input type="text" />
			</div>`;
	$('.desk').html($('.desk').html()+str);
	var _input = $('.desk').children('.item:last').children('input');
	var p = $('.desk').children('.item:last').children('p');
	p.hide();
	_input.show();
	_input.val(obj.name);
	_input.focus();
	_input.select();
	sortFile(10);
	_input.blur(function(){
		console.log(1)
		obj.name = this.value;
		if(nameRepeat(data,obj.id)){
			$(this).hide();
			p.html(_input.val());
			p.show();
		}else{
			tipShow('该名字已存在');
		}
		storage.setItem(strKey,JSON.stringify(data));
	});
}

//-------------------------------------------------------------------------
//	拖拽文件夹
function dragFileDown(e,item){
	var x = e.pageX - $(item).offset().left;
	var y = e.pageY - $(item).offset().top;	
	$(item).css('z-index',100);
	$(document).on('mousemove',dragFileMove);
	$(document).on('mouseup',dragFileUp)
	function dragFileMove(e){
		var w = $(window).width() - $(item).width();
		var h = $(window).height() - $(item).height();
		var l = e.pageX - x < 0?0:e.pageX - x>w?w:e.pageX - x;
		var t = e.pageY - y < 0?0:e.pageY - y>h?h:e.pageY - y;
		$(item).css({
			left:l,
			top:t
		})
		if($(item).is('.item')){
			var target = nearest(item);
			if(target){
				checkOffAll();
				getObjectById(data,$(target).data('index')*1).checked = false;
				checkFile(target);
			}
		}
	}
	function dragFileUp(e){
		$(item).css('z-index','');
		if($(item).is('.popup')){
			getPopupInfo();
		}
		var obj = getObjectById(data,$(item).data('index')*1);
		if($(item).is('.item') && obj.type != 'date' && obj.type != 'resycle'){
			var target = nearest(item);
			if(target){
				var targetId = $(target).data('index')*1;
				var targetObj = getObjectById(data,targetId);
				if(targetObj.type === 'resycle' || targetObj.type === 'folder'){
					currentToTarget($(item).data('index')*1,targetId);
				}
			}
			if(isTouch(item,$('.po-content')) && $(item).data('index')*1 !== $('.po-content').attr('index')*1){
				moveToSub(item,$('.po-content').attr('index')*1);
				
			}
		}
		$(document).off('mousemove mouseup');
	}
}

//------------------------------------
//	让popup窗口出现
function popupAppear(id){
	$('.popup').show();
	$('.popup').css({
		left:'calc(50% - 275px)',
		top:'calc(50% - 200px)'
	})
	popupSize();
	popupHTML(id);
	getPopupInfo();
}

//-------------------------------------
//	根据id生成popup里的内容
function popupHTML(id){
	var str = '';
	var arr = getObjectById(data,id).child;
	$('.po-content').attr('index',id);
	for(var i=0;i<arr.length;i++){
		var type = typeFormat(arr[i].type);
		str += `<div class="po-item" data-index='${arr[i].id}'>
					<i  data-index='${arr[i].id}'></i>
					<span class="po-item-name" data-index='${arr[i].id}'>${arr[i].name}</span>
					<span class="po-item-time" data-index='${arr[i].id}'>${arr[i].time}</span>
					<span class="po-item-type" data-index='${arr[i].id}'>${type}</span>
				</div>`;
	}
	$('.po-content').html(str);
	$('.po-title').html(getObjectById(data,id).name);
	createPoBread(id);
}

//-----------------------------------------------
//	判断popup窗口的大小
function popupSize(){
	var ph = $(window).height(),
		pw = $(window).width();
	var h = $('.popup').height(),
		w = $('.popup').width();
	if(h >= ph){
		$('.popup').css({
			top:0,
			height:ph
		})
	}
	if(w >= pw){
		$('.popup').css({
			left:0,
			width:ph
		})
	}
}

//--------------------------------------------------------------------------------
//	移动弹框
function bottomResize(e){
	var t = $('.popup').offset().top;
	var ph = $(window).height();
	$('.popup').css({
		bottom:'',
		top:t
	})
	$(document).on('mousemove',bottomMove);
	$(document).on('mouseup',popupUp);
	function bottomMove(e){
		var h = e.pageY-t<200?200:e.pageY-t>ph-t?ph-t:e.pageY - t;
		$('.popup').css({height:h});
	}
}

function topResize(e){
	var ph = $(window).height();
	var b = ph - $('.popup').offset().top - $('.popup').height();
	$('.popup').css({
		top:'',
		bottom:b
	})
	$(document).on('mousemove',topMove);
	$(document).on('mouseup',popupUp);
	function topMove(e){
		var h = ph-e.pageY-b<200?200:ph-e.pageY-b>ph-b?ph-b:ph-e.pageY-b;
		$('.popup').css({height:h});
	}
}

function rightResize(e){
	var pw = $(window).width();
	var l = $('.popup').offset().left;
	$('.popup').css({
		right:'',
		left:l
	})	
	$(document).on('mousemove',rightMove);
	$(document).on('mouseup',popupUp);
	function rightMove(e){
		var w = e.pageX - l<540?540:e.pageX - l>pw-l?pw-l:e.pageX-l;
		$('.popup').css({width:w});
	}
}

function leftResize(e){
	var pw = $(window).width();
	var r = pw - $('.popup').offset().left - $('.popup').width();
	$('.popup').css({
		left:'',
		right:r
	})
	$(document).on('mousemove',leftMove);
	$(document).on('mouseup',popupUp);
	function leftMove(e){
		var w = pw-e.pageX-r<540?540:pw-e.pageX-r>pw-r?pw-r:pw-e.pageX-r;
		$('.popup').css({width:w});
	}
}

function popupUp(){
	getPopupInfo();
	smallOrBig();
	$(document).off('mousemove mouseup');
}

//---------------------------------------------
//	获取popup的宽高和定位并储存
function getPopupInfo(){
	popupWidth = $('.popup').width();
	popupHeight = $('.popup').height();
	popupLeft = $('.popup').offset().left;
	popupTop = $('.popup').offset().top;
}

//-----------------------------------------------
//	根据popup窗口改变最大化最小化样式
function smallOrBig(){
	if($('.popup').height() != $(window).height() || $('.popup').width() != $(window).width()){
		$('.po-btns').children().eq(0).removeClass('icon-small');
		
	}else{
		$('.po-btns').children().eq(0).addClass('icon-small');
	}
}

//-----------------------------------------------
//	最小化和窗口化
function resizeClick(_this){
	if(_this.is('.icon-small')){
		$('.popup').animate({
			width:popupWidth,
			height:popupHeight,
			left:popupLeft,
			top:popupTop
		})
		_this.removeClass('icon-small');
	}else{
		$('.popup').animate({
			width:$(window).width(),
			height:$(window).height(),
			left:0,
			top:0
		})
		_this.addClass('icon-small');
	}
}	

//-----------------------------------------------
//	移动到子项
function moveToSub(item,targetId){
	var id = $(item).data('index')*1;
	var obj = getObjectById(data,id);
	var targetObj = getObjectById(data,targetId);
	var parentArr = obj.pId?getObjectById(data,targetId):data;
	targetObj.child.push(parentArr.splice(parentArr.indexOf(obj,1))[0]);
	obj.pId = targetId;
	popupHTML(targetId);
	createDesk(data);
	storage.setItem(strKey,JSON.stringify(data));
}

//-----------------------------------------------------------------------
//	移动到
function currentToTarget(currentId,targetId){
	var currentObj = getObjectById(data,currentId);
	var parentArr = currentObj.pId?getObjectById(data,currentObj.pId).child:data;
	var targetObj = getObjectById(data,targetId);
	targetObj.child.push(parentArr.splice(parentArr.indexOf(currentObj),1)[0]);
	currentObj.pId = targetId;
	createDesk(data);
	if(targetObj.pId){
		popupHTML(currentId.pId);
	}
	storage.setItem(strKey,JSON.stringify(data));
}

//------------------------------------------------------------------
//	弹出框面包屑导航
function createPoBread(id){
	var str = `<i class="bread-ico"></i>`;
	var arr = getParentsById(data,id).reverse();
	for(var i=0;i<arr.length;i++){
		str += `<i class="icon-more"></i>
				<span class="bread-name">${arr[i].name}</span>`;
	}
	$('.po-bread-nav').html(str);
}

//--------------------------------------------------------------------
//	生成日历
function calendar(now){
	var currentTime = new Date();
	currentTime.setMonth(currentTime.getMonth() + now)
	var year = currentTime.getFullYear();
	var month = currentTime.getMonth();
	var date = currentTime.getDate();
	$('.cur-month').html(year + '年' + (month+1) + '月');
	currentTime.setDate(1);
	var startDay = currentTime.getDay();
	if(startDay == 0){
		startDay = 7;
	}
	startDay--;
	currentTime.setMonth(currentTime.getMonth()+1);
	currentTime.setDate(0);
	var allDays = currentTime.getDate();
	var lastDays = currentTime.getDate(currentTime.setDate(0)) - startDay + 1;
	var str = '';
	var cls = '';
	for(var i = 0;i < startDay;i++){
		str += '<span class = "otherDays"> '+lastDays+' </span>';
		lastDays++;
	}
	var nowTime = new Date;
	for(var i = 0; i < allDays;i++){
		if(i+1 == date && now == 0){
			cls = 'current-day';
		}else{
			cls = '';
		}
		str += '<span class = '+cls+'>'+(i+1)+'</span>';
	}
	for(var i = 0; i < 42 -allDays - startDay;i++){
		str += '<span class = "otherDays">'+(i+1)+'</span>';
	}
	$('.date-nums').html(str);
}

//----------------------------------------------------------------------
//	日历的交互
function timeAppear(){
	var now = 0;
	calendar(now);
	$('.date-prev').on('click',function(){
		now--;
		calendar(now);
		$('.date-nums').css({
			top:330
		})
		$('.otherDays').css({
			color:'#fff'
		})
		$('.date-nums').animate({
			top:0
		},function(){
			$('.otherDays').css({
				color:'#848584'
			})
		})
	});
	$('.date-next').on('click',function(){
		now++;
		calendar(now);
		$('.date-nums').css({
			top:-330
		})
		$('.otherDays').css({
			color:'#fff'
		})
		$('.date-nums').animate({
			top:0
		},function(){
			$('.otherDays').css({
				color:'#848584'
			})
		})
	});
	
	clearInterval(timer);
	var timer = setInterval(timerNow,500);
}

//------------------------------------------------------------------------------
//	右上角时间
function timerNow(){
	var now = new Date(),
		hours = now.getHours(),
		mins = now.getMinutes(),
		secs = now.getSeconds();
	$('.hour-screen').html(getNowTime());
	$('.date-time').html(add0(hours) + ':' + add0(mins) + ':' + add0(secs));
}
//--------------------------------------------------------------------------------
//	提示框
function tipShow(str){
	$('.tip').animate({
		top:20,
		opacity:1
	})
	$('.tip').html(str);
	setTimeout(function(){
		$('.tip').animate({
			top:-40,
			opacity:0
		})
	},2000)
}

//--------------------------------------------------------------------------
//	搜索文件
function searchFile(id){
	
	
	
}

//----------------------------------------------------------------------------
//	
function moveSubFile(id,e){
	var div = $('<div class="mouse-item" data-index='+id+'></div>');
			var item = getSubDom(id);
			var obj = getObjectById(data,id);
			var str = `<a href="javascript:;" class="mouse-img">
							<img src="imgs/file.png"/>
						</a>
						<p class="mouse-name">${obj.name}</p>`;
			$(div).appendTo($(document.body));
			$(div).html(str);
	$(document).on('mousemove',movefilemove);
	$(document).on('mouseup',movefileup);
	function movefilemove(e){
		var x = e.pageX,y = e.pageY;
		$('.mouse-item').css({
			zIndex:100,
			left:x-div.width()/2,
			top:y-div.height()/2,
			opacity:0.7
		})
		var target = nearest(div);
		if(target){
			checkOffAll();
			getObjectById(data,$(target).data('index')*1).checked = false;
			checkFile(target);
		}
	}
	function movefileup(){
		var target = nearest(div);
		var targetId = $(target).data('index')*1;
		var currentParentId = $('.po-content').attr('index')*1;
		if(target && (getObjectById(data,targetId).type === 'folder' || getObjectById(data,targetId).type === 'resycle') ){
			currentToTarget(id,targetId);
			popupHTML(currentParentId);
		}else if(!isTouch(div,$('.popup'))){
			var parent = getObjectById(data,currentParentId).child;
			data.push(parent.splice(parent.indexOf(obj),1)[0]);
			obj.pId = 0;
			popupHTML(currentParentId);
			createDesk(data);
			storage.setItem(strKey,JSON.stringify(data));
		}
		$('.mouse-item').remove();
		$(document).off('mousemove mouseup');
	}
}


