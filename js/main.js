var desk = $('.desk');

createDesk(data);

deskHeight();

timeAppear();

$(window).on('resize',deskHeight);

desk.on('click',function(e){
	var _this = $(e.target);
	if(_this.is('.item')||_this.is('.item_img')||_this.is('img')){
		var id = _this.data('index')*1;
		var item = getDomById(id);
		checkFile(item);
	}
})

document.oncontextmenu = function(e){
	e.preventDefault();
}

$(document).on('mousedown',function(e){
	var _this = $(e.target);
	if(3 == e.which){
		if(_this.is(desk)){
			rightMenu(e);
		}
	}
})

$('.desk').on('mousedown',function(e){
	var _this = $(e.target);
	if(_this.is('.desk')){
		paintDivDown(e);
	}
	if(_this.is('.item')||_this.is('.item_img')||_this.is('img')){
		e.preventDefault();
		var id = _this.data('index')*1;
		var item = getDomById(id);
		dragFileDown(e,item);
	}
});

$('.desk').on('dblclick',function(e){
	var _this = $(e.target);
	if(_this.is('.item')||_this.is('.item_img')||_this.is('img')){
		e.preventDefault();
		var id = _this.data('index')*1;
		var obj = getObjectById(data,id);
		if(obj.type === 'folder'){
			popupAppear(id);
			checkFile(getDomById(id));
		}else if(obj.type === 'date'){
			$('.calendar').animate({
				height:552,
				paddingBottom:10
			})
		}
	}
})

$('.calendar .icon-close').on('click',function(){
	$('.calendar').animate({
		height:0,
		paddingBottom:0
	})
})

$('.mousemenu').on('click',function(e){
	e.stopPropagation();
})

$('.mousemenu').children('li').eq(2).on('click',function(){
	window.location.reload();
});

$('.mousemenu').children('li').eq(3).on('click',function(){
	$('.mousemenu').hide();
	newFile();
});

$('.mousemenu').children('li').eq(7).on('click',function(){
	localStorage.clear();
	$('.mousemenu').hide();
});

$('.po-bottom').on('mousedown',function(e){
	e.preventDefault();
	bottomResize(e);
});

$('.po-left').on('mousedown',function(e){
	e.preventDefault();
	leftResize(e);
});

$('.po-right').on('mousedown',function(e){
	e.preventDefault();
	rightResize(e);
});

$('.po-top').on('mousedown',function(e){
	e.preventDefault();
	topResize(e);
});

$('.po-lt').on('mousedown',function(e){
	e.preventDefault();
	topResize(e);
	leftResize(e);
})

$('.po-lb').on('mousedown',function(e){
	e.preventDefault();
	bottomResize(e);
	leftResize(e);
})

$('.po-rt').on('mousedown',function(e){
	e.preventDefault();
	topResize(e);
	rightResize(e);
})

$('.po-rb').on('mousedown',function(e){
	e.preventDefault();
	bottomResize(e);
	rightResize(e);
})

$('.po-head').on('mousedown',function(e){
	e.preventDefault();
	dragFileDown(e,$('.popup'));
})

$('.po-btns').children().eq(1).on('click',function(){
	$('.popup').hide();
})

$('.po-btns').children().eq(0).on('click',function(){
	resizeClick($(this));
});

$('.po-content').on('dblclick',function(e){
	var item = $(e.target);
	if(item.is('.po-item-name')||item.is('.po-item')||item.is('.po-item-time')||item.is('.po-item-type')){
		var id = item.data('index')*1;
		popupHTML(id);
		createPoBread(id);
	}
})

$('.po-content').on('mousedown',function(e){
	var item = $(e.target);
	if(item.is('.po-item-name')||item.is('.po-item')||item.is('.po-item-time')||item.is('.po-item-type')){
		e.preventDefault();
		var id = item.data('index')*1;
		moveSubFile(id,e);
	}
});
