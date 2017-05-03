var storage = window.localStorage;
var strKey = 'strKey';
var data = createData();
function createData(){
	if(storage.getItem(strKey)){
		var a = storage.getItem(strKey);
		return JSON.parse(a);
	}else{
		return [
			{
				type:'resycle',
				id:7,
				pId:0,
				name:'回收站',
				checked:false,
				time:'2017/4/7 23:59',
				child:[]
			},
			{
				type:'date',
				id:8,
				pId:0,
				name:'日历',
				checked:false,
				time:'2017/4/7 23:58',
				child:[]
			},
			{
				type:'folder',
				id:1,
				pId:0,
				name:'javascript',
				checked:false,
				time:'2017/4/8 6:22',
				child:[
					{
						type:'folder',
						id:3,
						pId:1,
						name:'jQuery',
						checked:false,
						time:'2017/4/8 8:24',
						child:[]
					},
					{
						type:'folder',
						id:4,
						pId:1,
						name:'vue',
						checked:false,
						time:'2017/4/8 9:12',
						child:[]
					}
				]
			},
			{
				type:'folder',
				id:2,
				pId:0,
				name:'CSS',
				checked:false,
				time:'2017/4/8 10:32',
				child:[
					{
						type:'folder',
						id:5,
						pId:2,
						name:'sass',
						checked:false,
						time:'2017/4/8 16:4',
						child:[]
					},
					{
						type:'folder',
						id:6,
						pId:2,
						name:'less',
						checked:false,
						time:'2017/4/8 4:22',
						child:[]
					}
				]
			}
		];
	}
}


// 记录弹窗的属性
var popupWidth = 0,
	popupHeight = 0,
	popupLeft = 0,
	popupTop = 0;