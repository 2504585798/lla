/**
 * Copyright (c) 2013 Laoshancun  华律网 
 * 
 *
 * Version: 1.0.0
 *
 *  Tabs 选项卡切换插件
 */
 /*
    使用方法    
    $(obj).tabs(param1);
    param1 必须项 可以是对象，也可以是数组。
    当param1为对象时，要求所有的tab的HTML结构一致。如果只有一个，也行。
    当param1为数组时，长度必须与选择器一致。也就是说页面上有几个实例，就有几个配置。
    
    单个配置项{
        selected:0,             //初始化显示第几个
        tab:'',                 //tab按钮选择器
        content:'',             //内容按钮选择器
        activeClass:'',         //tab按钮选中样式
        tabTagName:'i',         //tab按钮标签名
        contentTagName:'ul',    //内容标签名
        eventType: 'mouseover'  //事件绑定 mouseover,click,dblclick
    }
    
    依赖项
    jquery
        
    示例
    $('.jda_tw').tabs({ tab: '.jda_tw > h2 > span i', content: '.jda_tw > ul', activeClass: 'dq_xz', eventType: 'click' });

 
 */
 
(function ($) {
	var isArray = function(value) {
		return Object.prototype.toString.call(value) == '[object Array]';
	};
	var isObject = function(value) {
		return Object.prototype.toString.call(value) == '[object Object]';
	};
    $.fn.tabs = function (options) {
        var tabs = [];
        if (isArray(options) && this.length == options.length) {
            tabs = options;
        } else if (isObject(options)) tabs[0] = options;
        if (tabs.length < 1) return false;
        return this.each(function (i) {
            var self = $(this);
            var config = tabs.length == 1 ? tabs[0] : tabs[i];
            config=$.extend({},$.fn.tabs.defaults,config);
            var tab=$(config.tab,this);
            var content = $(config.content, this);
            //hack:兼容以前此插件不完善地方
            if (tab.length == 0 ) {
                tab = $(config.tab);    
            }
            if (content.length == 0) {
                 content = $(config.content);
            }
          
           if (tab.length < 1 || tab.length != content.length) return; 
           //事件
            tab.bind(config.eventType,function(){
                var index=tab.index($(this));
                content.eq(index).show().siblings(config.contentTagName).hide();
                tab.eq(index).addClass(config.activeClass).siblings(config.tabTagName).removeClass(config.activeClass);
                $.isFunction(config.onSwitch) && config.onSwitch.call(this,index, content.eq(index));
            });
            //初始化显示            tab.eq(config.selected)[config.eventType]();
//            content.eq(config.selected).show().siblings(config.contentTagName).hide();
//            tab.eq(config.selected).addClass(config.activeClass).siblings(config.tabTagName).removeClass(config.activeClass);
        });
    };
    $.fn.tabs.defaults = {
        selected:0,
        tab:'',
        content:'',
        activeClass:'',
        tabTagName:'i',
        contentTagName:'ul',
        eventType: 'mouseover', //mouseover,click,dblclick
        onSwitch:$.noop
    };
})(jQuery);
