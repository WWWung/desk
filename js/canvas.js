var ctx = $('.canvas')[0].getContext('2d');
var canvas = $('.canvas')[0];
//----------------------------------------------------------------------
//  画直线
function lineDown(e,color,width){
	var x = e.pageX-$('.canvas').offset().left,
		y = e.pageY-$('.canvas').offset().top;
	var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
	document.addEventListener('mousemove',move);
	document.addEventListener('mouseup',up);
	function move(e){
		ctx.putImageData(imgData,0,0);
		var dx = e.pageX-$('.canvas').offset().left,
			dy = e.pageY-$('.canvas').offset().top;
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(dx,dy);
		ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
		ctx.closePath();
	}
	function up(){
		document.removeEventListener('mousemove',move);
		document.removeEventListener('mouseup',up);
	}
}

//----------------------------------------------------------------------
//  随意画
function drawDown(e,color,width){
	var x = e.pageX-$('.canvas').offset().left,y = e.pageY-$('.canvas').offset().top;
	ctx.beginPath();
	ctx.moveTo(x,y);
	document.addEventListener('mousemove',move);
	document.addEventListener('mouseup',up);
	function move(e){
		var dx = e.pageX-$('.canvas').offset().left,dy = e.pageY-$('.canvas').offset().top;
		ctx.lineWidth = width;
    ctx.strokeStyle = color;
		ctx.lineTo(dx,dy);
		ctx.stroke();
	}
	function up(){
		document.removeEventListener('mousemove',move);
		document.removeEventListener('mouseup',up);
	}
}

//----------------------------------------------------------------------
//  画圆
function arcDown(e,color,width,flag){
  var x = e.pageX-$('.canvas').offset().left,y = e.pageY-$('.canvas').offset().top;
  var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
  document.addEventListener('mousemove',move);

  document.addEventListener('mouseup',up);
  function move(e){
  	var dx = e.pageX-$('.canvas').offset().left,dy = e.pageY-$('.canvas').offset().top;
  	var r1 = Math.abs((dx-x)/2);
  	var r2 = Math.abs((dy-y)/2);
  	r = r1>r2?r1:r2;
  	var midx = dx>x?r1+x:x-r1;
  	var midy = dy>y?r2+y:y-r2;
  	ctx.save();
  	ctx.clearRect(0,0,canvas.width,canvas.height);
  	ctx.putImageData(imgData,0,0);
  	ctx.scale(r1/r,r2/r);
  	ctx.beginPath();
  	ctx.arc(midx/(r1/r),midy/(r2/r),r,0,2*Math.PI);
  	ctx.closePath();
  	if(flag){
      ctx.stroke();
      setTimeout(function(){
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
      })
    }else{
      ctx.fill();
      setTimeout(function(){
        ctx.fillStyle = color;
      })
    }
  	ctx.restore();
  }
  function up(){
  	document.removeEventListener('mousemove',move);
  	document.removeEventListener('mouseup',up);
  }
}

//----------------------------------------------------------------------
//  矩形
function rectDown(e,color,width,flag){
	var x = e.pageX-$('.canvas').offset().left,y = e.pageY-$('.canvas').offset().top;
	var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
	document.addEventListener('mousemove',move);
	document.addEventListener('mouseup',up);
	function move(e){
		var dx = e.pageX-$('.canvas').offset().left,dy = e.pageY-$('.canvas').offset().top;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.putImageData(imgData,0,0);
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(dx,y);
		ctx.lineTo(dx,dy);
		ctx.lineTo(x,dy);
		ctx.lineTo(x,y);
		ctx.closePath();
    if(flag){
      ctx.stroke();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
    }else{
      ctx.fill();
      ctx.fillStyle = color;
    }
	}
	function up(){
		document.removeEventListener('mousemove',move);
		document.removeEventListener('mouseup',up);
	}
}

//--------------------------------------------------------------------------------
// 撤回操作
function canvasReturn(step){
  let img = new Image();
  console.log(step,imgHistory.length);
  if(step>imgHistory.length-1) return;
  img.src = imgHistory[step];
  img.onload = function(){
    clearCanvas();
    ctx.drawImage(img,0,0);
  }
}

//-------------------------------------------------
//  清空画布
function clearCanvas(){
  ctx.clearRect(0,0,$('.canvas')[0].width,$('.canvas')[0].height);
}






















//-
