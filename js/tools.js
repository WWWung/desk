//--------------------------------------------------------------------
//	根据id找到data对象
function getObjectById(data,id){
	var obj = null;
	$.each(data, function(i,item) {
		if(data[i].id === id){
			obj = data[i];
			return false;
		}
		if(!obj){
			obj = getObjectById(data[i].child,id);
			if(obj){
				return false;;
			}
		}
	});
	return obj;
}

//-----------------------------------------------------------------------------------
//	获取现在的时间
function getNowTime(){
	var time = new Date;
	var year = time.getFullYear();
	var month = time.getMonth()+1;
	var date = time.getDate();
	var hour = time.getHours();
	var min = time.getMinutes();
	return ''+year+'/'+month+'/'+date+' '+hour+':'+min+'';
}

//--------------------------------------------------------------------
//	格式化日期
function dateFormat(data,id){
	var str = getObjectById(data,id).time;
	var _date = new Date(str);
	return (_date.getTime()/1000)/60;
}

//-------------------------------------------------------------------
//	获取图标地址
function getImgSrc(data,id){
	var obj = getObjectById(data,id);
	var src = '';
	var arr = ['imgs/recycle.png','imgs/file.png','imgs/calendar.png'];
	if(obj){
		switch(obj.type){
			case 'folder':
				src = arr[1];
				break;
			case 'resycle':
				src = arr[0];
				break;
			case 'date':
				src = arr[2];
				break;
		}
	}
	return src;
}

//-----------------------------------------------------------------------
//	根据id找到对应的DOM元素
function getDomById(id){
	var obj = null;
	$.each($('.item'), function(index,ele) {
		if(id === ele.dataset.index*1){
			obj = ele;
			return false;
		}
	});
	return obj;
}

//------------------------------------------------------------------
//	求两点间的距离
function distance(a,b){
    var dx = $(a).offset().left - $(b).offset().left;
    var dy = $(a).offset().top - $(b).offset().top;
    return Math.sqrt(dx * dx + dy * dy);
}

//------------------------------------------------------------------------
// 碰撞检测
function isTouch(current,target){
	var w = $(window).width(),h = $(window).height();
	var currentL = $(current).offset().left,
		currentR = currentL + $(current).outerWidth(),
		currentT = $(current).offset().top,
		currentB = currentT + $(current).outerHeight();
	var targetL = $(target).offset().left,
		targetR = targetL + $(target).outerWidth(),
		targetT = $(target).offset().top,
		targetB = targetT + $(target).outerHeight();
	return currentR > targetL && currentB > targetT && currentL < targetR && currentT < targetB;
}

//---------------------------------------------------------------------
//判断名字
function nameRepeat(_data,id){
	var obj = getObjectById(data,id);
	var flag = true;
	$.each(_data, function(i,item) {
		if(obj.name === item.name && obj.id != item.id){
			flag = false;
			return false;
		}
	});
	return flag;
}

//-----------------------------------------------------------------------------------
//	创建新的id
function getNewId(){
	return getAllId(data).sort(function(a,b){
		return b-a;
	})[0]+1;
}

//-----------------------------------------------------------------------------------
//	找到所有的id
function getAllId(data){
	var arr=[];
	for(var i=0;i<data.length;i++){
		arr.push(data[i].id);
		if(data[i].child.length){
			arr = arr.concat(getAllId(data[i].child));
		}
	}
	return arr;
}

//---------------------------------------------------------------------------
//	找到最近的元素
function nearest(obj){
	var min = Infinity,target = null;
	$.each($('.item'), function(i,item) {
		if(isTouch(obj,item)&&item != obj){
			if(min>distance(obj,item)){
				min = distance(obj,item);
				target = item;
			}
		}else{
			checkOffAll();
		}
	});
	return target;
}

//-----------------------------------------
//	文件类型格式化
function typeFormat(attr){
	var a = '';
	switch(attr){
		case 'folder':
			a = '文件夹'
			break;
	}
	return a;
}

//------------------------------------------------------------------------------------
//	根据id找到对应的对象以及它所有的父集并返回
function getParentsById(data,id){
	var items = [];
	var current = getObjectById(data,id);
	if(current){
		items.push(current);
		items = items.concat(getParentsById(data,current.pId));
	}
	return items;
}
//--------------------------------------------------------------------------------------
//	补0函数
function add0(num)	{
	if(num < 10){
		num = '0' + num;
	}else{
		num = '' + num;
	}
	return num;
}

//--------------------------------------------------------------
//	在popup框中找到id对应的DOM元素
function getSubDom(id){
	var obj = null;
	$.each($('.po-item'), function(i,item) {
		if($(item).data('index')*1 === id){
			obj = item;
			return false;
		}
	});
	return obj;
}
