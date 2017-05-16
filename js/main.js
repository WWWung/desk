var desk = $('.desk');

createDesk(data);

deskHeight();

timeAppear();

var drawNum = {
	toolNum:1,
	shapeNum:1,
	thicknessNum:1,
	colorNum:1,
	step:0
}

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
		}else if(obj.type === 'draw'){
			if($('body').width()<$('.drawBoard').width() || $('body').height()<$('.drawBoard').height()){
				var str = '请确保分辨率大于'+$('.drawBoard').width()+'X'+$('.drawBoard').height();
				tipShow(str);
			}else{
				$('.drawBoard').css('transform','scale(1)');
				$('.drawBoard').animate({
					opacity:1
				});
				drawNum.step = 0;
				imgHistory = [];
			}
		}
	}
})

$('.draw-close').on('click',function(){
	$('.drawBoard').animate({
		opacity:0
	},function(){
		$('.drawBoard').css('transform','scale(0)');
	})
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

var downTime = 0;

// $('.po-content').on('dblclick',function(e){
//
// 	var item = $(e.target);
// 	if(item.is('.po-item-name')||item.is('.po-item')||item.is('.po-item-time')||item.is('.po-item-type')){
// 		e.preventDefault();
// 		var id = item.data('index')*1;
// 		popupHTML(id);
// 		createPoBread(id);
// 	}
// })

$('.po-content').on('mousedown',function(e){
	var nowTime = Date.parse(new Date());
	var item = $(e.target);
	if(item.is('.po-item-name')||item.is('.po-item')||item.is('.po-item-time')||item.is('.po-item-type')){
		e.preventDefault();
		var id = item.data('index')*1;
		if(nowTime - downTime >500){
			moveSubFile(id,e);
		}else{
			popupHTML(id);
			createPoBread(id);
		}
	}
	downTime = nowTime;
});

$('.draw-tools span').on('click',function(){
	drawNum.toolNum = $('.draw-tools span').index($(this))+1;
	$('.draw-tools span').css('background','none');
	$(this).css('background','#000');
})

$('.draw-s span').on('click',function(){
	drawNum.shapeNum = $('.draw-s span').index($(this))+1;
	$('.draw-s span').css({
		background:'none',
		color:'#000'
	});
	$(this).css({
		background:'#000',
		color:'#fff'
	});
})

$('.thickness li').on('click',function(){
	drawNum.thicknessNum = $('.thickness li').index($(this))+1;
	$('.thickness li').css('border','none');
	$(this).css('border','1px dotted rgb(207, 111, 24)')
})

$('.draw-color .draw-tools-item').on('click',function(){
	drawNum.colorNum = $('.draw-color .draw-tools-item').index($(this))+1;
	$('.draw-color .draw-tools-item').css({
		border:'',
		zIndex:''
	});
	$(this).css({
		border:'1px solid #000',
		zIndex: 10
	})
})

$('.canvas').on('mousedown',function(e){
	storageImg();
	drawNum.step = 0;
	var color = colorPicker(drawNum.colorNum);
	var width = widthPicker(drawNum.thicknessNum);
	var flag = true;
	if(drawNum.toolNum===1){
		if(drawNum.shapeNum === 1){
			drawDown(e,color,width);
		}else if(drawNum.shapeNum === 4){
			lineDown(e,color,width);
		}else if(drawNum.shapeNum === 2){
			arcDown(e,color,width,true);
		}else if(drawNum.shapeNum === 5){
			arcDown(e,color,width);
		}else if(drawNum.shapeNum === 3){
			rectDown(e,color,width,true);
		}else if(drawNum.shapeNum === 6){
			rectDown(e,color,width);
		}
	}
})
$('.draw-handler li').eq(0).on('click',function(){
	console.log(drawNum.step);
	canvasReturn(drawNum.step);
	drawNum.step++;
});

$('.draw-handler li').eq(1).on('click',clearCanvas);

$('.po-search').bind('input propertychange', function() {
	var str = $(this).val();
	searchFile(str);
})
