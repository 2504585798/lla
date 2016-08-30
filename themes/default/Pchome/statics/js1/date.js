
var $_ = function (id){
	return "string" == typeof id ? document.getElementById(id) : id;
};

function addEventHandler(oTarget, sEventType, fnHandler){
	if (oTarget.addEventListener){
		oTarget.addEventListener(sEventType, fnHandler, false);
	}else if(oTarget.attachEvent) {
		oTarget.attachEvent("on" + sEventType, fnHandler);
	}else{
		oTarget["on" + sEventType] = fnHandler;
	}
};

var Class = {
  create: function(){ return function(){ this.initialize.apply(this, arguments); }}
}

var Extend = function(destination, source){
	for (var property in source){
		destination[property] = source[property];
	}
	return destination;
}

var DateSelector = Class.create();

DateSelector.prototype = {
  initialize: function(oYear, oMonth, oDay, oHour, oMinute, options){
	this.SelYear = $_(oYear);//年选择对象
	this.SelMonth = $_(oMonth);//月选择对象
	this.SelDay = $_(oDay);//日选择对象
	this.SelHour = $_(oHour);//时选择对象
	this.SelMinute = $_(oMinute); //分选择对象
	this.SetOptions(options);
	var dt = new Date(), iMonth = parseInt(this.options.Month), iDay = parseInt(this.options.Day), iMinYear = parseInt(this.options.MinYear), iMaxYear = parseInt(this.options.MaxYear), iHour = parseInt(this.options.Hour), iMinute = parseInt(this.options.Minute);
	this.Year = parseInt(this.options.Year) || dt.getFullYear();
	this.Month = 1 <= iMonth && iMonth <= 12 ? iMonth : dt.getMonth() + 1;
	this.Day = iDay > 0 ? iDay : dt.getDate();
	this.Hour = iHour || dt.getHours();
	this.Minute = iMinute || dt.getMinutes();
	this.MinYear = iMinYear && iMinYear < this.Year ? iMinYear : this.Year;
	this.MaxYear = iMaxYear && iMaxYear > this.Year ? iMaxYear : this.Year;
	this.onChange = this.options.onChange;
	//年设置
	this.SetSelect(this.SelYear,this.MinYear,this.MaxYear - this.MinYear + 1,this.Year - this.MinYear);
	//月设置
	this.SetSelect(this.SelMonth, 1, 12, this.Month - 1);
	//日设置
	this.SetDay();
	//时设置
	this.SetSelect(this.SelHour, 0, 24, this.Hour);
	//分设置
	this.SetSelect(this.SelMinute, 0, 60, this.Minute);
	
	var oThis = this;
	//日期改变事件
	addEventHandler(this.SelYear, "change", function(){
		oThis.Year = oThis.SelYear.value; oThis.SetDay(); oThis.onChange();
	});

	addEventHandler(this.SelMonth, "change", function(){
		oThis.Month = oThis.SelMonth.value; oThis.SetDay(); oThis.onChange();
	});
	addEventHandler(this.SelDay,"change",function(){
		oThis.Day = oThis.SelDay.value; oThis.onChange();
	});
	addEventHandler(this.SelHour,"change",function(){
		oThis.Hour = oThis.SelHour.value; oThis.onChange();
	});
	addEventHandler(this.SelMinute,"change",function(){
		oThis.Minute = oThis.SelMinute.value; oThis.onChange();
	});
  },

  //设置默认属性
  SetOptions: function(options){
	this.options = {//默认值
		Year:		0,//年
		Month:		0,//月
		Day:		0,//日
		Hour:		0,//时
		Minute:		0,//分
		MinYear:	0,//最小年份
		MaxYear:	0,//最大年份
		onChange:	function(){}//日期改变时执行
	};
	Extend(this.options, options || {});
  },

  //日设置
  SetDay: function(){
	//取得月份天数
	var daysInMonth = new Date(this.Year, this.Month, 0).getDate();
	if (this.Day > daysInMonth) { this.Day = daysInMonth; };
	this.SetSelect(this.SelDay, 1, daysInMonth, this.Day - 1);
  },

  //select设置
  SetSelect: function(oSelect, iStart, iLength, iIndex){
	//添加option
	oSelect.options.length = iLength;
	for(var i = 0; i < iLength; i++){
		var value = iStart + i;
		value = ((value < 10) ? ('0' + String(value)) : value);
		oSelect.options[i].text = oSelect.options[i].value = value; 
	}
	//设置选中项
	oSelect.selectedIndex = iIndex;
  }
};