// For yuemei 
//包含 用户登陆、搜索框、右侧浮窗工具
if (typeof(host) == "undefined") var host = 'http://www.yuemei.com/';
if (typeof(domain) == "undefined") var domain = '.yuemei.com/';
if (typeof(main) == "undefined") var main = 'yuemei.com/';
if (typeof(soHost) == "undefined") var soHost = 'http://so.yuemei.com/';
if (typeof(user) == "undefined") var user = 'http://user.yuemei.com/';
var isIE=false;
/*无需再判断是否ie
if((navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9.")||(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i)=="8.")||(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7.")||(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/6./i)=="6.")){
    isIE=true;
    var meiqia=true;
}*/
if(typeof(forIP)=="undefined"&&typeof(meiqia)=="undefined"){
    var meiqia=true;
}
if(typeof(meiqia)=="undefined"&&!isIE&&typeof(forIP)!="undefined"){//如果没有定义meiqia,则默认美恰并先隐藏咨询按钮，请求后放出
    var meiqia=true;

    window.onload=function(){
        $(".toolbar-zx").remove();
        $.ajax({
            url:"http://tao.yuemei.com/home/getRongyunUserId",
            type:'get',
            dataType:"jsonp",
            jsonp:"callbackPart",//
            jsonpCallback:"callbackPart",
            async: false,
            success:function(data){
                if(data!=0)
                {
                    str="http://user.yuemei.com/user/rongcloud/id/"+data;
                    $("#newTalk").attr("src",str);

                    $(".toolbar-ph").after('<a style="" class="toolbar-tab toolbar-zx" href="javascript:void(0);"><i class="tab-hover">在线咨询</i><em></em></a>');
                    $(".toolbar-zx,.pro-tip .online").live("click",function(){
                        $("#ryOnPage,#newTalk,.editBtns").show();
                        $(".showIt").hide();
                    });
                    //$("body").append('.right-girl,.taoZiXun{ display:block !important}');
                    //$(".toolbar-tab.toolbar-zx").show();
                    //处理二四级在线咨询
                    if($(".pro-tip .online").length>0){
                        $(".pro-tip .online").after('<a class="online" href="javascript:void(0);" style="display: inline-block"><span>在线咨询</span></a>').remove();
                    }
                    setTimeout(function(){
                        $(".ryOnPage").show();
                    },10000);
                }else{
                    $(".toolbar-ph").after('<a class="toolbar-tab toolbar-zx" href="javascript:void(0);" onclick="mechatClick();return false;"><i class="tab-hover">在线咨询</i><em></em></a>');
                }
                $(".pro-tip .online").show();
            }
        });
    }
}else{
    var detail=true;
}

var isRY=false;
if(!meiqia){
    //非ie789且非美恰
    isRY=true;
}
$(function() {
    //登录判断
    //检查用户登录
    var html;
	var news_nums = 0;
	var is_ry = true;
    /*function userInfo(data) {
        html = '<div class="sign-right">' + '<span><a href="' + data.msg.arrUrl.order + '">我的订单</a></span>' + '</div>' + '<div class="box-xx firstone">|</div>' + '<div class="user-info hover-cont">' + '<span><a href="' + data.info.link + '"><img src="' + data.msg.pic + '" alt="' + data.msg.nickname + '"/>' + data.msg.nickname + '</a></span>' + '<div class="hover-show">' + '<a href="' + data.msg.arrUrl.index + '">基本信息</a>' + '<a href="' + data.msg.arrUrl.password + '">修改密码</a>' + '<a href="' + data.msg.arrUrl.order + '">我的订单</a>' + '<a href="' + data.msg.arrUrl.coupons + '">我的代金券</a>' + '<a href="' + data.msg.arrUrl.collet + '">我的收藏</a>' + '<a href="' + data.msg.arrUrl.logout + '">退出</a>' + '</div>' + '</div>' + '<div class="box-xx">|</div>' + '<div class="sign-right hover-cont">' + '<span><a href="' + data.msg.askurl + 'q/">问医生</a></span>' + '<div class="hover-show">' + '<a href="' + data.msg.baseurl + '/u_share/">写日记</a>' + '</div>' + '<div class="hover-show">' + '<a href="' + data.msg.arrUrl.talk + '">随便聊聊</a>' + '</div>' + '</div>' + '<div class="box-xx">|</div>' + '<div class="sign-right hover-cont sign-side" >' +
            //添加消息提示
            '<span  id="news_xiaoxi">消息</span>' + getNum(data.num.userAll_num, true) + '<div class="hover-show xx_num">' + '<a href="' + data.msg.arrUrl.comments + '"><span>评论</span>' + getNum(data.num.message) + '</a>' + '<a href="' + data.msg.arrUrl.answer + '"><span>被解答的问题</span>' + getNum(data.num.answer_num) + '</a>' + '<a href="' + data.msg.arrUrl.reply + '"><span>回复</span>' + getNum(data.num.reply_num) + '</a>' + '<a href="' + data.msg.arrUrl.agree + '"><span>赞</span></a><a class="new_sx_num" href="' + data.msg.arrUrl.sixin + '" target="_blank">私信</a>' + '</div>' + '</div>' + '<div class="box-xx box_xx-line lastone">|</div>' + '<div class="sign-right"><span class="callUs">联系客服<em>400 056 7118</em></span></div>';
        return html;
    }*/
    function userInfo(data) {
        html = '<div class="sign-right">' + '<span><a href="' + data.msg.arrUrl.order + '">我的订单</a></span>' + '</div>' + '<div class="box-xx firstone">|</div>' + '<div class="user-info hover-cont">' + '<span><a href="' + data.info.link + '"><img src="' + data.msg.pic + '" alt="' + data.msg.nickname + '"/>' + data.msg.nickname + '</a></span>' + '<div class="hover-show">' + '<a href="' + data.msg.arrUrl.index + '">基本信息</a>' + '<a href="' + data.msg.arrUrl.password + '">修改密码</a>' + '<a href="' + data.msg.arrUrl.order + '">我的订单</a>' + '<a href="' + data.msg.arrUrl.coupons + '">我的代金券</a>' + '<a href="' + data.msg.arrUrl.collet + '">我的收藏</a>' + '<a href="' + data.msg.arrUrl.logout + '">退出</a>' + '</div>' + '</div>' + '<div class="box-xx">|</div>' + '<div class="sign-right hover-cont">' + '<span><a href="' + data.msg.askurl + 'q/">问医生</a></span>' + '<div class="hover-show">' + '<a href="' + data.msg.baseurl + '/u_share/">写日记</a>' + '</div>' + '<div class="hover-show">' + '<a href="' + data.msg.arrUrl.talk + '">随便聊聊</a>' + '</div>' + '</div>' + '<div class="box-xx">|</div>' + '<div class="sign-right hover-cont sign-side" >' +
            //添加消息提示
        '<span  id="news_xiaoxi">消息</span>' + getNum(data.num.userAll_num, true) + '<div class="hover-show xx_num">' + '<a href="' + data.msg.arrUrl.comments + '"><span>社区消息</span>' + getNum(data.num.message) + '</a>' + '<a href="' + data.msg.arrUrl.sysmessage + '"><span>系统消息</span>' + getNum(data.num.sys_num) + '</a><a class="new_sx_num" href="' + data.msg.arrUrl.sixin + '" target="_blank">私信</a>' + '</div>' + '</div>' + '<div class="box-xx box_xx-line lastone">|</div>' + '<div class="sign-right"><span class="callUs">联系客服<em>400 056 7118</em></span></div>';
        return html;
    }
    function doctorInfo(data) {
        var sixin_html='';
        if(data.msg.sixin==1)
        {
            sixin_html='<a class="new_sx_num" href="' + data.msg.arrUrl.sixin + '" target="_blank">私信</a>';
        }
        html = '<div class="user-info hover-cont">' + '<span><a href="' + data.info.link + '"><img src="' + data.msg.pic + '" alt="' + data.msg.nickname + '"/>' + data.msg.nickname + '</a></span>' + '<div class="hover-show">' + '<a href="' + data.msg.arrUrl.me + '">我的工作台</a>' + '<a href="' + data.msg.arrUrl.index + '">账号设置</a>' +
            //'<a href="'+data.msg.arrUrl.subscribe+'">订阅问题</a>'+
            // '<a href="'+data.msg.arrUrl.contact+'">联系方式</a>'+
            '<a href="' + data.msg.arrUrl.password + '">修改密码</a>' +
            //'<a href="'+data.msg.arrUrl.tao+'">自助提交淘整形</a>'+
            '<a href="' + data.msg.arrUrl.logout + '">退出</a>' + '</div>' + '</div>' + '<div class="box-xx">|</div>' + '<div class="sign-right hover-cont">' + '<span><a href="' + data.msg.baseurl + '/dr/adept_me/">解答问题</a></span>' + '<div class="hover-show">' + '<a href="' + data.msg.baseurl + '/u/add_case/">发案例</a>' + '<a href="' + data.msg.baseurl + '/u/add_article/">发观点</a>' + /*'<a href="' + data.msg.arrUrl.talk + '">随便聊聊</a>'*/  '</div>' + '</div>' + '<div class="box-xx">|</div>' + '<div class="sign-right hover-cont sign-side" >' + '<a href="' + data.msg.baseurl + '/dr/comment_me/" id="news_xiaoxi">消息</a>' + getNum(data.num.docAll_num, true) + '<div class="hover-show xx_num">' +
            // '<a href="'+data.msg.baseurl+'/dr/reply_me/">追问我的'+getNum(data.num.askNum)+'</a>'+
            //'<a href="'+data.msg.baseurl+'/dr/answer_me/">回复'+getNum(data.num.askNum)+'</a>'+
            '<a href="' + data.msg.baseurl + '/dr/thanks_me/">赞'+ getNum(data.num.thanks_me) +'</a>' + '<a href="' + data.msg.baseurl + '/dr/comment_me/">评论' + getNum(data.num.comment_me) + '</a>' + sixin_html+'<a href="' + data.msg.baseurl + '/dr/mentioned_me/">提到我的'+ getNum(data.num.mentionedmeNum) + '</a>' +'<a href="' + data.msg.baseurl + '/dr/invite_me/">邀我解答' + getNum(data.num.askQmeNum) + '</a>' +
            //'<a href="'+data.msg.baseurl+'/dr/thanks_me/">赞</a>'+
            '</div>' + '</div>' + '<div class="box-xx box_xx-line lastone">|</div>' + '<div class="sign-right"><span class="callUs">联系客服<em>400 056 7118</em></span></div>';
        return html;
    }
    function alertLoginHTML(){
        var loginHTML = '' ;
            loginHTML +='<div class="login-alert">' ;
            loginHTML +='    <div class="alert-bj"></div>' ;
            loginHTML +='    <div class="alert-cont">' ;
            loginHTML +='        <div class="alert-tit">' ;
            loginHTML +='            <p>登录</p>' ;
            loginHTML +='            <div class="alert-close"></div>' ;
            loginHTML +='        </div>' ;
            loginHTML +='        <div class="alert-nav">' ;
            loginHTML +='            <a href="javascript:;" class="now">帐号密码登录</a>' ;
            loginHTML +='            <a href="javascript:;">短信快捷登录</a>' ;
            loginHTML +='        </div>' ;
            loginHTML +='        <div id="account-msg" class="alert-msg"></div>' ;
            loginHTML +='        <div class="nav-cont">' ;
            loginHTML +='            <div class="login-input-box">' ;
            loginHTML +='                <input type="text" id="account" class="login-input" init="手机号/邮箱" value="手机号/邮箱" >' ;
            loginHTML +='            </div>' ;
            loginHTML +='            <div class="login-input-box">' ;
            loginHTML +='                <input type="text" id="account-pwd1" class="login-input" value="请输入密码" init="请输入密码" >' ;
            loginHTML +='                <input type="password" id="account-pwd" class="login-input input-focus d-n" value="" >' ;
            loginHTML +='            </div>' ;
            loginHTML +='            <input type="button" class="login-btn" value="登录" >' ;
            loginHTML +='            <div class="remember-box">' ;
            loginHTML +='                <div class="remember-ls check-me"><i></i><span>记住我</span> <input type="checkbox" checked="checked"></div>' ;
            loginHTML +='                <a href="'+user+'user/getpwd" class="forget">忘记密码?</a>' ;
            loginHTML +='            </div>' ;
            loginHTML +='            <div class="other-login">使用其他方式登录</div>' ;
            loginHTML +='            <div class="other-lab">' ;
            loginHTML +='                <a href="'+host+'user/sina" class="sina" title="微博"></a>' ;
            loginHTML +='                <a href="'+host+'user/tencent" class="qq" title="QQ"></a>' ;
            loginHTML +='                <a href="'+user+'login/weixin" class="weixin" title="微信"></a>' ;
            loginHTML +='            </div>' ;
            loginHTML +='            <div class="register-test">还没有悦美帐号？<a href="'+user+'user/register">立即注册</a></div>' ;
            loginHTML +='        </div>' ;
            loginHTML +='        <div class="nav-cont" style="display:none">' ;
            loginHTML +='            <div class="login-input-box">' ;
            loginHTML +='                <input type="text" id="sms-tel" class="sms-input samll-input" init="请输入手机号" value="请输入手机号" >' ;
            loginHTML +='                <input type="button" class="get-tel-code down-time" value="获取短信验证码" disabled="disabled">' ;
            loginHTML +='            </div>' ;
            loginHTML +='            <div class="login-input-box img-code-box">' ;
            loginHTML +='                <input type="text" id="img-code-text" class="sms-input samll-input" value="请输入校验码" init="请输入校验码" >' ;
            loginHTML +='                <img src="'+user+'user/getCaptcha/?tm=97839942" class="img-code" >' ;
            loginHTML +='                <div class="img-code-true"></div>' ;
            loginHTML +='            </div>' ;
            loginHTML +='            <div class="login-input-box">' ;
            loginHTML +='                <input type="text" id="sms-ma" class="sms-input" value="短信验证码" init="短信验证码" >' ;
            loginHTML +='            </div>' ;
            loginHTML +='            <input type="button" class="tel-login-btn" value="登录" >' ;
            loginHTML +='            <div class="sms-bot">未注册将自动创建悦美帐号</div>' ;
            loginHTML +='        </div>' ;
            loginHTML +='    </div>' ;
            loginHTML +='</div>' ;
        return loginHTML ;
    }
	function req()
	{
		$.getJSON(host + "/u/user/getNewNum?callback=?",
			function(data) {
				if (data.new_num == 0) {
					$("#countMessage").parent('em').hide();
					$("#countMessage").html(0);
					$(".ico_online").hide();
				}
				else {
					$("#countMessage").parent('em').show();
					$("#countMessage").html(data.new_num);
					$(".ico_online").show();
				}

				if (data.notice != '') {
					$('#box_msg_ul').html(data.notice);
					$('#box_msg_ul').parents(".box_message").show();
				}

				if (data.noticedt != '') {

					$('#msg_dl_dt').html(data.noticedt);
					$('#msg_dl_dt').show();
				}
			
        });
    }

/*    if(!isRY) {
        function rynews(appkey, token) {
            RongIMClient.hasUnreadMessages(appkey, token, {
                onSuccess: function (symbol) {
                    if (symbol) {
                        //有未收到的消息
                        sixin(1);
                        return true;
                    } else {
                        //没有未收到的消息
                        return false;
                    }
                }, onError: function (err) {
                    //失败 err instanceOf RongIMClient.callback.ErrorCode
                }
            });
        }
//    }*/
	function messageAlert(){
		var isie6 = window.XMLHttpRequest ? false : true;
		var objBox = $(".box_message");
		var funBox = function() {
			var w_width = $(window).width();
			var widths = w_width >1200 ? 1200 : 1000;
			objBox.css("right",(w_width - widths)/2);
			objBox.css("padding",'0px 10px');
			objBox.css("background-color",'#fdfbe4');
			if($(window).scrollTop() > 40){
				if(isie6){
					objBox.css("position","absolute");
					objBox.css("top",$(window).scrollTop() - 1);
				}
				else{
					objBox.css("position","fixed");
					objBox.css("top",-1);
				}
			}
			else{
				objBox.css("position","absolute");
				objBox.css("top",40);
			}
		};
		funBox();
		$(window).scroll(funBox);
		$(window).resize(funBox);
    } 

    //根据传入的值，返回一个字符串
    function getNum(num, hasCla) {
        var iStr = '' ;
        if (num <= 0) {
            return '';
        } else if (num > 99) {
            num = 99;
        }
        if (hasCla) {
            iStr = '<i class="news-num">' + num + '</i>';
        } else {
            iStr = '<i>' + num + '</i>';
        }
        return iStr;
    }
	var user_id = 1964;
	var is_sx = false;
    function sixin(num){
        var val = RongIMClient.getInstance().getTotalUnreadCount();
        if(num>0){
            if(!news_nums){
                news_nums = $('.news-num').text();
            }
            if(!news_nums){
                var str_xx = getNum(num, true);
                $('#news_xiaoxi').html('消息'+str_xx);
            } else {

                news_nums = parseInt(news_nums) + parseInt(num);
                $('.news-num').text(val);
            }
            if(!is_sx){
                $('.new_sx_num').html('私信<i id="xx_up">' + num + '</i></a>');
                is_sx=true;
            } else {

                var xx = $('#xx_up').text();
                xx = parseInt(xx) + parseInt(num);
                $('#xx_up').text(val);
            }

        }
    }
    var time;
    time = new Date().getTime();
    $.getJSON(host + '/user/hasLogin/type/json/?callback=' + time + '&jsoncallback=?', {}, function (data) {
        if (data.status == 1) {
            if (data.info.group == 2) {
                doctorInfo(data);
            } else {
                userInfo(data);
            }
            $('#isLogin').html(html).show();
            $("#notLogin").hide();
            messageAlert();
            req();
            setInterval(function () {
                    req();
                },
                    60 * 1000);
            var num = 0;
            if (data.token != '') {
                var num = 0;
                //rynews(data.appkey, data.token);
                var intervalId = setInterval(function () {
                        //var ty_news = rynews(data.appkey, data.token);
                        //if (ty_news) {
                        //    clearInterval(intervalId);
                       // }
                    },
                        10 * 1000);
                // 初始化。
                RongIMClient.init(data.appkey);
                // 连接状态监听器
                RongIMClient.setConnectionStatusListener({
                    onChanged: function (status) {
                        switch (status) {
                            //链接成功
                            case RongIMLib.ConnectionStatus.CONNECTED:
                                console.log('链接成功');
                                break;
                            //正在链接
                            case RongIMLib.ConnectionStatus.CONNECTING:
                                console.log('正在链接');
                                break;
                            //重新链接
                            case RongIMLib.ConnectionStatus.DISCONNECTED:
                                console.log('断开连接');
                                break;
                            //其他设备登陆
                            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                                console.log('其他设备登陆');
                                break;
                            //网络不可用
                            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                                console.log('网络不可用');
                                break;
                        }
                    }});

                // 消息监听器
                RongIMClient.setOnReceiveMessageListener({
                    // 接收到的消息
                    onReceived: function (message) {
                        RongIMClient.getInstance().getTotalUnreadCount({
                            onSuccess: function(count) {
                                if(count>0){
                                    $("#news_xiaoxi").html('消息<i class="news-num">'+count+'</i>');
                                    $(".new_sx_num").html('私信<i id="xx_up">'+count+'</i>');
                                }else{
                                    $("#news_xiaoxi").html('消息');
                                    $(".new_sx_num").html('私信');
                                }
                            },
                            onError: function(error) {
                            }
                        });
                    }
                });
                RongIMClient.connect(data.token, {
                    onSuccess: function(userId) {
                        console.log("Login successfully." + userId);
                        RongIMClient.getInstance().getTotalUnreadCount({
                            onSuccess: function(count) {
                                if(count>0){
                                    $("#news_xiaoxi").html('消息<i class="news-num">'+count+'</i>');
                                    $(".new_sx_num").html('私信<i id="xx_up">'+count+'</i>');
                                }else{
                                    $("#news_xiaoxi").html('消息');
                                    $(".new_sx_num").html('私信');
                                }
                            },
                            onError: function(error) {
                            }
                        });
                    },
                    onTokenIncorrect: function() {
                        console.log('token无效');
                    },
                    onError:function(errorCode){
                        console.log(errorCode);
                    }
                });


                }
            }
            /*控制头部用户信息样式*/
            $(".hover-cont").hover(function () {
                if ($(this).prev()) {
                    $(this).prev().addClass("hover-hide");
                }
                ;
                if ($(this).next()) {
                    $(this).next().addClass("hover-hide");
                }
            }, function () {
                if ($(this).prev()) {
                    $(this).prev().removeClass("hover-hide");
                }
                ;
                if ($(this).next()) {
                    $(this).next().removeClass("hover-hide");
                }
            });
        });

	//首页搜索框的方法
	fnSearCh() ;
	function fnSearCh(){
		var $search = $('.search') ,
			$searchBtn = $('.search-btn') ,
			$searchList = $('.search-list') ;
			$hotLab = $('.hot-lab') ,
			searchMsg = $search.attr('msg') ,
			//msg = '请输入搜索内容' ;
		$(".hot-searchWd").click(function(){
			$search.focus() ;
		}) ;
		//得到/失去焦点的时候	
		$search.focus(function(){
			clearTimeout($search[0].t) ;
			
			$(".hot-searchWd").addClass("hot-focus") ;	
			$(this).addClass('search-focus') ;
			$(this).siblings('.search-btn').addClass('search-btn-on') ; 
			/* 得到焦点后边长；add: yxx,搜索框交互效果。
			 * 判断是不是顶部是白底或者黑底的搜索框，只有这样的搜索框才有这个效果 ;*/
			if($('.chanl-head').length){
	            $(this).parents('.ym-search').animate({left:'-220px',width:'465px'},600) ;  
	            $(this).animate({width:'420px'},600) ;  
	            $searchList.animate({width:'435px'},600) ;
	        }
            //搜索框交互效果。 end  
			function keyVal(){   
				$searchList.css('display','block') ;
				if($.trim($search.val()) == ''){
					$searchList.css('display','none') ; 
					$(".hot-searchWd").show() ;
				}else{
					$(".hot-searchWd").hide() ; 
				}
			}  
			$(document).keypress(function(event){  
				if( $(event.target).hasClass('search-focus') ){ 
					keyVal() ;
				}
			});
			$(document).keyup(function(event){ 
				if( $(event.target).hasClass('search-focus') ){ 
					keyVal() ;
				}
			});	
			 
		}).blur(function(){
			
			$(".hot-searchWd").removeClass("hot-focus");
 
			//判断是不是顶部是白底或者黑底的搜索框，只有这样的搜索框才有这个效果 ;
			if($('.chanl-head').length){
	            $(this).parents('.ym-search').stop().animate({left:'0',width:'245px'},600) ;
	            $(this).stop().animate({width:'200px'},600) ; 
	            $searchList.animate({width:'215px'},600) ;
	        }
            //搜索框交互效果。 end 

			if($.trim($(this).val()) == ''){
				//$(this).val(searchMsg) ;
				$hotLab.css('display','block') ;
				$(this).removeClass('search-focus') ;
				$(this).siblings('.search-btn').removeClass('search-btn-on') ;
				$search[0].t = setTimeout(function(){
					//console.log("1000")
					$searchList.css('display','none') ; 
					$(".hot-searchWd").show() ;
				},200)
			}
		}) 
		$searchBtn.click(function(){
			goSearch() 
		}) ;
		
		//点击热词的时候
		/*$hotLab.on('click','a',function(){
			//var aTxt = $(this).text() ;
			//$search.val( aTxt ).addClass('search-focus') ; 
			$search.addClass('search-focus') ; 
			$search.siblings('.search-btn').addClass('search-btn-on') ;
		});*/
		
		
		
		$searchList.on('click','li',function(){ 
			var txt = $(this).find('span').text() ;  
			$search.val( txt ).addClass('search-focus') ;
			var data_type=$(this).attr('data-type');  
			if(data_type){          
				$('#searchWd').attr('data-type',data_type);  
			}  
			$search.siblings('.search-btn').addClass('search-btn-on') ;
			$searchList.css('display','none') ;
		});
		
		//点击别处，关闭提示列表
		$(document).click(function(e){  
			if(!$(e.target).hasClass('search') || $search.val() == '' ){
				$searchList.css('display','none') ;	 
			}  
		});

		//按下回车的时候，也可以进行搜索
		$(document).keydown(function(event){   
			if( $(event.target).hasClass('search') ){
				if (event.keyCode == 13){ 
					/*var searchVal = $search.val() ;		
						// 如果内容为空，则按照推荐位热词搜索
						if( $.trim(searchVal)=='' ){ 
							 searchVal = $(".hot-searchWd").text() ;
						}
					var searchAction = $('#searchWd').attr('data-type'),
						searchWd=encodeURIComponent( searchVal ) ;
					
					var searchLink = soHost+searchAction+'/'+searchWd+'/' ;
					//如果是火狐浏览器就本页打开，别的浏览器就新窗口打开，因为火狐会拦截新窗口。 
					if( navigator.userAgent.indexOf('Firefox') >= 0 ){
						window.location.href = searchLink ;
					}else{ 
						var formStr = '<form id="keydownSearch" method="get" style="display:none;" action="" target="_blank" ></form>' ;
						$('body').append(formStr) ;
						$('#keydownSearch').attr('action',searchLink) ; 
						$('#keydownSearch').submit() ;
						$('#keydownSearch').remove() ; 
					} */
                    //console.log("huiche");
                    //	进行搜索
                    goSearch();
                    //$search.blur() ;
                    //return false;
                }
            }
        });
    }

    function goSearch() {
        console.log("dj") ;
        var searchVal = $(".search").val();
        // 如果内容为空，则按照推荐位热词搜索
        if ($.trim(searchVal) == '') {
            searchVal = searchMsg;
        }
        var searchAction = $('#searchWd').attr('data-type'),
            searchWd = encodeURIComponent(searchVal);
        var searchLink = soHost + searchAction + '/' + searchWd + '/';
        //$("#YMsearch").attr("href",searchLink) ;
        //如果是火狐浏览器就本页打开，别的浏览器就新窗口打开，因为火狐会拦截新窗口。 
        if (navigator.userAgent.indexOf('Firefox') >= 0) {
            window.location.href = searchLink;
        } else {
            var formStr = '<form id="keydownSearch" method="post" style="display:none;" action="' + searchLink + '" target="_blank" ></form>';
            $('body').append(formStr);
            $('#keydownSearch').submit();
            $('#keydownSearch').remove();
        }
    }
    var $searchWd = $('#searchWd');
    if ($searchWd.length) {
        /*$('#YMsearch').click(function(){
			var searchVal = $.trim( $('#searchWd').val() ) ; 
			//	如果输入框内容时空的，则按照推荐位搜索
			if( searchVal =="" ){
				searchVal = $(".hot-searchWd").text() ;
			}
			var searchAction=$('#searchWd').attr('data-type') ,
				searchWd=encodeURIComponent(searchVal.replace(/\//g,' ')) ;			
			$(this).attr('href',soHost+searchAction+'/'+searchWd+'/');
		});*/
        if ( $searchWd.val() !== "" ) {
            $searchWd.siblings('.hot-searchWd').hide() ;
        }
        

		var textList=$('.search-list'); 
		var searchWd=$searchWd.attr('msg');
		function getsearchList(){
			var newSearchWd=$('#searchWd').val().replace(/\//g,' ');
			if(searchWd !=newSearchWd){
				searchWd = newSearchWd;
				$.ajax({
					type:'get',
					url:soHost+'search/relation/',
                    url:host+'/yaf/site/search/index.php/search/relation/',
					data:{'searchWd':newSearchWd},
					dataType:'jsonp',
					jsonp:'callback',
					success:function(data){
						//console.log(data);  
						var html='<li data-type=""><a href="'+soHost+'reviewsall/'+data.searchWd+'/" target="_blank"><span>'+data.searchWd+'</span></a></li>';
						$.each(data.list,function(k,v){
							html+='<li data-type="'+ v.type+'" class="list-2"><a href="'+soHost+v.type+'/'+data.searchWd+'"  target="_blank"><i>查看</i><span>'+data.searchWd+'</span><i>'+ v.name+'</i></a></li>';
						}); 
						textList.html(html);
					}
	
				});
			}
		}
        $searchWd.keyup(getsearchList);
        getsearchList();
        //使用form 进行跳转，浏览器不会拦截。
        /*$searchWd.keypress(function(event){  
			event = window.event || arguments.callee.caller.arguments[0];
			if (event.keyCode == 13){
				window.location.href = soHost+'tao/'+searchWd+'/' ;
			}
		});*/
    }
    //头部样式控制
    $(".hover-cont").mouseover(function() {
        $(this).prev(".box-xx").addClass("hover");
        $(this).next(".box-xx").addClass("hover");
    }).mouseleave(function() {
        $(this).prev(".box-xx").removeClass("hover");
        $(this).next(".box-xx").removeClass("hover");
    });

    //sku融云
    if(isRY) {
        function mechatClick() {
            $(".ryOnPage").show();
        }
    }
    $(function(){
            $(".hideIt").click(function(){
                $("#newTalk,.editBtns").hide();
            });
            $(".minIt").click(function(){
                $("#newTalk,.editBtns").hide();
                $(".showIt").css("display","block");
            });
            $(".showIt").click(function(){
                $("#newTalk,.editBtns").show();
                $(this).hide();
            });
        if(isRY){
            $(".zixun2,.base1200 .zixun,.toolbar-zx,.zixungirl").click(function(){
                $("#ryOnPage,#newTalk,.editBtns").show();
		        $(".showIt").hide();
            });
            setTimeout(function(){
                $(".ryOnPage").show();
            },10000);
        }else{
            $(".base1200 .zixun,.zixun2").attr("onclick","mechatClick();return false;");
            if(isIE){
                $(".toolbar-zx,.zixun2").remove();
                $(".toolbar-ph").after('<a class="toolbar-tab toolbar-zx" href="javascript:void(0);" onclick="mechatClick();return false;"><i class="tab-hover">在线咨询</i><em></em></a>');
                $(".priceInfo").before('<a class="zixun2" href="javascript:void(0);" onclick="mechatClick();return false;">客服</a>');
            }
        }
    });

    //右侧导航
    var quickcss="";
    quickcss+="<style>.quick-publink{ display:none !important}.toolbar i{ font-style:normal }.toolbar .inner{ position:fixed; right:0; top:0; width:28px; height:100%; z-index:99999; border-right:7px solid #7a6e6e;}.toolbar-cent{ position:absolute; left:0; margin-top: -61px; top:50%; width:28px; height:100px;}.inner-bot{ bottom:-1px; position:absolute; width:100%;}.toolbar-tab{display:block; margin-bottom:1px; height:36px; width:35px; position:relative}.toolbar-tab em{ cursor:pointer; position:absolute; left:0; top:0; display:block; margin-bottom:1px; height:36px; width:35px; background:url(http://icon.yuemei.com/front/common/images/common-head.png) no-repeat #7a6e6e; border-radius:3px 0 0 3px}.toolbar-tab:hover em{ background-color:#ff5370;}.toolbar-ph em{ background-position:0 -648px}.toolbar-zx em{ background-position:0 -684px}.toolbar-app em{ background-position:0 -721px;}.toolbar-top em{ background-position:0 -759px;}.toolbar-re em{ background-position:0 -795px}.tab-hover{ height:36px; white-space:nowrap; line-height:36px; position:absolute; left:3px; top:0; font-size:12px; padding:0 7px; font-family:Arial; color:#fff; background:#7a6e6e; border-radius:3px 0 0 3px; transition:left ease-out 0.2s; text-decoration:none}.toolbar-ph .tab-hover{ font-size:14px;}.toolbar-ph:hover .tab-hover{ left:-100px; background:#ff5370;}.toolbar-zx:hover .tab-hover,.toolbar-top:hover .tab-hover,.toolbar-re:hover .tab-hover{ left:-59px;  background:#ff5370;}    .toolbar-app .tab-hover{ width:130px; height:181px; left:-124px; top: -2px; z-index: 2; background:url(http://icon.yuemei.com/front/common/images/rightApp.png) no-repeat 0 0; padding:0; display:none}    .toolbar-app:hover .tab-hover{ display:block}</style>";


    var quickHtml='<div class="toolbar">';
    quickHtml+='<div class="inner">';
    quickHtml+='<div class="toolbar-cent">';
    quickHtml+='<span class="toolbar-tab toolbar-ph">';
    quickHtml+='<i class="tab-hover">400 056 7118</i><em></em>';
    quickHtml+='</span>';
    if(isRY) {
        quickHtml+='<a href="javascript:void(0);" class="toolbar-tab toolbar-zx">';
    }else{
        quickHtml+='<a onClick="mechatClick();return false;" href="javascript:void(0);" class="toolbar-tab toolbar-zx" style="display: none">';
    }
    quickHtml+='<i class="tab-hover">在线咨询</i><em></em>';
    quickHtml+='</a>';
    quickHtml+='<a href="http://www.yuemei.com/app/kuaiwen.html" target="_blank" class="toolbar-tab toolbar-app">';
    quickHtml+='<i class="tab-hover"></i><em></em>';
    quickHtml+='</a>';
    quickHtml+='</div>';
    quickHtml+='<div class="inner-bot">';
    quickHtml+='<span class="toolbar-tab toolbar-top">';
    quickHtml+='<i class="tab-hover">回到顶部</i><em id="goTopBtn"></em>';
    quickHtml+='</span>';
    quickHtml+='<a href="http://www.yuemei.com/feedback/" target="_blank" class="toolbar-tab toolbar-re">';
    quickHtml+='<i class="tab-hover">意见反馈</i><em></em>';
    quickHtml+='</a>';
    quickHtml+='</div>';
    quickHtml+='</div>';
    quickHtml+='</div>';
    $("body").append(quickcss);
    $("body").append(quickHtml);

    $("#goTopBtn").click(function(){
        $("html,body").animate({scrollTop:0},500);
    });

    //首页跳转
    $('#sel_city').bind('click',function(){
        var ename = $(this).attr('data_ename');
        sel_city(ename,'sel_city');
    })
    
    // 快捷弹出登陆框
    alertLogin();
    function alertLogin() {
        var sHasAccount=false;//弹窗登录帐号登录 帐号是否正确
        var sHasAccountPwd=false;//弹窗登录帐号登录 密码是否正确
        var isTel=false;//弹窗登录短信 手机是否正确
        var isImgCode=false;//弹窗登录短信 效验码是否正确
        var isMa=false;//弹窗登录短信 短信效验码是否正确
        // 添加登录html结构
        if ( $(".login-alert").length>0 ) {
            return ;
        }
        $("body").append( alertLoginHTML() ) ;
        $.ajax({
            url: user+"user/isRemname/",
            type: 'get',
            data: {"type":1},
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback:"callback",
            success:function(data){
                var username=data.username;
                if(username)
                {
                    $('#account').val(username);
                }
            }
        }) ;
        $(".alert-nav").delegate("a", "click", function() {
            var index = $(this).index() ;
            //console.log("index: "+index) ;
            $("#account-msg").html("") ; 
            $(this).addClass('now').siblings().removeClass("now");
            $(".alert-cont .nav-cont").eq(index).css("display","block").siblings(".nav-cont").css("display","none");
        });
        $(".img-code").click(function() {
            var imgSrc = $(this).attr('src'),
                num = imgSrc.indexOf('='),
                m = Math.round(Math.random() * 100000000),
                newSrc = imgSrc.substring(0, num) + '=' + m;
            $(this).attr("src", newSrc);
        });

        function showMsg(obj, isB, str) {
            $(obj).removeClass("focusOn");
            if (isB) {
                $(obj).removeClass("input-error");
                if (str === undefined) {
                    $("#account-msg").attr({
                        "class": "alert-msg ok-msg"
                    }).html("<i></i>");
                } else {
                    $("#account-msg").attr({
                        "class": "alert-msg ok-msg"
                    }).html("<span>" + str + "</span>");
                }
            } else {
                $(obj).addClass("input-error");
                $("#account-msg").attr({
                    "class": "alert-msg error-msg"
                }).html("<i></i><span>" + str + "</span>");
            }
            return isB;
        }
        var tel_zz = /^0?1(3|4|5|7|8)[0-9]{9}$/;
        var email_zz = /^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

        function focusOn(obj) {
            $(obj).focus(function() {
                var init = $(this).attr("init"),
                    val = $(this).val();
                $(this).addClass("focusOn");
                if (val == init) {
                    $(this).val("");
                }
            });
        }
        /*修改密码*/
        function IsNumber(a) {
            return /^[0-9]*$/.test(a);
        }

        function IsLetter(a) {
            return /^[a-zA-Z]*$/.test(a);
        }

        function IsSymbol(a) {
            return /[0-9a-zA-Z]{1,25}/.test(a);
        }
        focusOn("#account");
        $("#account").blur(function() {
            sHasAccount=false;
            var val = $.trim($(this).val()),
                init = $(this).attr("init");
            if (val === "" || val === init) {
                $(this).val($(this).attr("init"));
                showMsg($(this), false, "请输入手机号/邮箱");
            } else {
                if (tel_zz.test(val)) {
                    showMsg($(this), true, "");
                    sHasAccount=true;
                    return;
                } else if (email_zz.test(val)) {
                    showMsg($(this), true, "");
                    sHasAccount=true;
                    return;
                } else {
                    showMsg($(this), false, "帐号不正确");
                }
            }
        });
        $("#account-pwd1").focus(function() {
            $(this).css({
                "display": "none"
            });
            $("#account-pwd").css({
                "display": "block"
            }).focus().addClass("focusOn");
        });
        $("#account-pwd").blur(function(event) {
            sHasAccountPwd=false;
            var pass = $(this).val();
            if (pass === '') {
                $("#account-pwd1").css({
                    "display": "block"
                });
                $("#account-pwd").css({
                    "display": "none"
                });
                showMsg($("#account-pwd1"), false, "请输入密码");
            } else if (pass.length < 6 || pass.length > 20) {
                showMsg($(this), false, "密码应是6-20个字符");
            } else {
                sHasAccountPwd=true;
                showMsg($(this), true, "");
            } 
        });
        // 账号密码，回车登录
		$("#account,#account-pwd").keydown(function(event) {
			var keycode = event.which;  
			if (keycode == 13) {  
				$(".login-btn").click()      
			}  
		});
        $(".login-btn").click(function() {
            $("#account").blur();
            $("#account-pwd").blur();
            if (!$("#account-pwd").hasClass("input-error")) {
                $("#account").blur();
            }
            if(sHasAccount&&sHasAccountPwd) {
                var username=$("#account").val();
                var password=$("#account-pwd").val();
                var autologin=$('.remember-ls').find('input').attr("checked")=='checked' ?1:0;
                $.ajax({
                    url: user+"user/alertLogin/",
                    type: 'get',
                    data: {
                        'username': username,
                        'password': password,
                        'autologin':autologin
                    },
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback:"callback",
                    success:function(data){
                        if(data.code==10000)
                        {
                            window.location.reload();
                        }else
                        {
                            showMsg($(this), false, data.message);
                        }
                    }
                }) ;
            }
        });
        $(".remember-ls").click(function() {
            if ($(this).hasClass("check-me")) {
                $(this).removeClass("check-me");
                $(this).find('input').attr("checked", false);
            } else {
                $(this).addClass("check-me");
                $(this).find('input').attr("checked", true);
            }
        });
        // 手机号登陆 
        focusOn("#sms-tel");
        $("#sms-tel").blur(function() {
            var val = $.trim($(this).val()),
                init = $(this).attr("init");
            isTel= false;
            if (val === "" || val === init) {
                $(this).val($(this).attr("init"));
                showMsg($(this), false, "请输入手机号");
                $(".get-tel-code").addClass("down-time").attr('disabled', 'disabled') ;
            } else {
                if (tel_zz.test(val)) {
                    showMsg($(this), true, "");
                    $(".get-tel-code").removeClass("down-time").removeAttr('disabled') ;
                    isTel= true;
                } else {
                    showMsg($(this), false, "手机号不正确"); 
                    $(".get-tel-code").addClass("down-time").attr('disabled', 'disabled') ;
                }
            } 
        });
        $(".get-tel-code").click(function() {
            if (isTel) {
                showMsg($("#img-code-text"), false, "请输入校验码");
                $('.img-code').show();
                $('.img-code-true').hide();
                $('.img-code-box').slideDown();
            }
        });
        // 倒计时
        function downTime() {
            var $getTelCode = $(".get-tel-code"),
                codeTime = 120,
                codeT = null;

            function goTime() {
                clearInterval(codeT);
                codeing = false;
                $getTelCode.val(codeTime + "秒").addClass("down-time").attr("disabled", "disabled");
                codeTime = codeTime - 1;
                if (codeTime >= 0) {
                    codeT = setInterval(goTime, 1000);
                } else {
                    $getTelCode.val('重新发送').removeClass("down-time").removeAttr("disabled");
                    clearInterval(codeT);
                    codeing = true;
                }
            }
            goTime();
        }
        // 校验码
        focusOn("#img-code-text");
        var imgCode_zz = /^[a-zA-Z]{4}$/,
            codeing = true;
        $("#img-code-text").blur(function() {
            var val = $.trim($(this).val()),
                init = $(this).attr("init");
            isImgCode=false;
            // 与数据库对比。
            if (val === "" || val === init) {
                $(this).val($(this).attr("init"));
                showMsg($(this), false, "请输入校验码");
            }else if($(this).val().length!=4)
            {
                showMsg($(this), false, "请输入4位校验码");
            }else
            {
                $.ajax({
                    type: "get",
                    url: user+'/user/ajaxCheckCaptchaSendSms/?callback=' + Math.random() + '&jsoncallback=?',
                    data: {code:val,phone:$('#sms-tel').val()},
                    dataType: "jsonp",
                    success: function(data) {
                        if (data.status!= 1) {
                            showMsg($(this), false, data.msg);
                        } else {
                            isImgCode=true;
                            $("#img-code-text").keyup();
                            $('.img-code').attr('src',user+'user/getCaptcha?m='+Math.random() ) ;
                        }
                    }
                });
            }
        });
        $(document).keyup(function(event) {
            var $target = $(event.target);
            if ($target.attr('id') == "img-code-text") {
                var val = $.trim($target.val());
                if (imgCode_zz.test(val)) {
                    //这块儿应该进行验证码的校验,如果成功则执行倒计时函数。
                    if (isImgCode && codeing) {
                        $target.siblings('.img-code').hide();
                        $target.siblings('.img-code-true').show();
                        downTime();
                        setTimeout(function() {
                            $target.parent(".img-code-box").slideUp();
               				showMsg($target, true, "");
                        }, 2000) ;
                    }
                }
            } 

            // 输入手机号的时候
            if ( $target.attr('id') == "sms-tel") {
                var telVal = $.trim( $target.val() ) ,
                    init = $(this).attr("init") ;
                if (telVal === "" || telVal === init) {
                    $(".get-tel-code").addClass("down-time").attr('disabled', 'disabled') ;
                } else {
                    if (tel_zz.test(telVal)) {
                        $(".get-tel-code").removeClass("down-time").removeAttr('disabled') ;
                    } else {
                        $(".get-tel-code").addClass("down-time").attr('disabled', 'disabled') ;
                    }
                } 
            }
        });
        // 短信验证码
        focusOn("#sms-ma");
        $("#sms-ma").blur(function() {
            isMa=false;
            var $this = $(this) ,
            	val = $.trim($this.val()),
                init = $this.attr("init");
            // 与数据库对比。
            if (val === "" || val === init) {
                $this.val($this.attr("init"));
                showMsg($this, false, "请输入短信验证码");
            } else
            {
                $.ajax({
                    type: "get",
                    url: user+'/user/callbackverifyCode/',
                    data: {phone:$('#sms-tel').val(), code:val},
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback:"callback",
                    success: function(data) {
                    	//console.log( "html: "+$this.html() );
                        if (data.status != 1) {
                            showMsg($this, false, data.msg);
                        } else {
                            showMsg($this, true, "");
                            isMa=true;
                        }
                    }
                });
            }
            if (isMa) {
                showMsg($this, true, "");
            } else {
                showMsg($this, false, "短信验证码不正确");
            }
        });
		// 短信，回车登录
		$("#sms-ma").keydown(function(event) {
			var keycode = event.which;  
			if (keycode == 13) {  
				$(".tel-login-btn").click()      
			}  
		});
        $(".tel-login-btn").click(function() {
            if(isTel&&isImgCode&&isMa)
            {
                $.ajax({
                    url: user+"user/alertLogin/",
                    type: 'get',
                    data: {
                        'phone': $('#sms-tel').val(),
                        'code': $('#sms-ma').val(),
                        'PhoneLogin':1
                    },
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback:"callback",
                    success:function(data){
                        if(data.code==10000)
                        {
                            window.location.reload();
                        }else
                        {
                            showMsg($(this), false, data.message);
                        }
                    }
                }) ;
            }else
            {
                if(!isTel)
                {
                    $("#sms-tel").blur();
                }else if(!isImgCode)
                {
                    $("#img-code-text").blur();
                }else if(!isMa)
                {
                    $("#sms-ma").blur();
                }
                /*if (!$("#sms-ma").hasClass("input-error")) {
                    $("#sms-tel").blur();
                }*/
            }
        });
        $(".alert-close").click(function() {
            hideAlertLogin() ;
        });
        $(".show-login").click(function() {
            showAlertLogin() ;
        });
    }
    function showAlertLogin(){
        $(".login-alert").show() ;
    }
    function hideAlertLogin(){
        $(".login-alert").hide() ;
    }

    // 第三方登录成功绑定手机号。(订单成功页面不用执行这个函数，有单独的绑定函数。)
    var locationHref = document.location.href,
        comUrl = "user.yuemei.com/tao/success/id/" ;
    if( locationHref.indexOf(comUrl) <= 0 ) {
        successfulBindTel();
    }
    function successfulBindTel(){
        //console.log("执行了。")
        var bindTelHtml = '<div class="bind-alert" id="bind-alert" style="display: block;" >' ;
        bindTelHtml += 		'<div class="bind-bj"></div>' ;
        bindTelHtml += 		'<div class="bind-cont">' ;
        bindTelHtml += 			'<div class="bind-tit">' ;
        bindTelHtml += 				'<p>绑定手机号</p>' ;
        bindTelHtml += 				'<a href="javascript:;" class="bind-close"></a>' ;
        bindTelHtml += 				'<a href="javascript:;" class="skip">跳过</a>' ;
        bindTelHtml += 			'</div>' ;
        bindTelHtml += 			'<div class="bind-ok">' ;
        bindTelHtml += 				'<span><i></i>登录成功，请绑定手机号</span>' ;
        bindTelHtml += 			'</div>' ;
        //<!-- 不能重复绑定！该手机号已被注册，可直接登录  -->
        bindTelHtml += 			'<div class="bind-msg" id="bind-msg">一步绑定，手机号登录更快捷~</div>' ;
        bindTelHtml += 			'<div class="from-cont">' ;
        bindTelHtml += 				'<div class="bind-input-box">' ; 
        bindTelHtml += 					'<input type="text" id="" class="bind-input" init="手机号" value="手机号">' ;
        bindTelHtml += 					'<input type="button" disabled="disabled" value="获取验证码" class="bind-get-code down-time">' ;
        bindTelHtml += 				'</div>' ;
        bindTelHtml += 				'<div class="bind-input-box bind-img-box">' ;
        bindTelHtml += 					'<img src="'+user+'user/getCaptcha/?tm=0.04642257560044527" class="bind-img-code">' ;
        bindTelHtml += 					'<input type="text" id="" class="img-input" init="图形校验码" value="图形校验码">' ;
        bindTelHtml += 				'</div>' ;
        bindTelHtml += 				'<div class="bind-input-box">' ;
        //bindTelHtml += 					'<div class="tel-right">' ;
        //bindTelHtml += 						'<a href="javascript:;" class="no-get"><span>没收到</span>？</a>' ;
        //bindTelHtml += 						'<p class="colling">电话拨打中...</p>' ;
        //bindTelHtml += 					'</div>' ;
        bindTelHtml += 					'<input type="text" id="" class="tel-msg" init="短信验证码" value="短信验证码">' ;
        bindTelHtml += 				'</div>' ;
        bindTelHtml += 				'<div class="bind-input-box">' ;
        bindTelHtml += 					'<input type="text" id="" class="set-pwd set-pwd-show" init="设置密码" value="设置密码">' ;
        bindTelHtml += 					'<input type="password" id="" class="set-pwd set-pwd-hide">' ;
        bindTelHtml += 				'</div>' ;
        bindTelHtml += 				'<input type="button" class="bind-login-btn" value="立即绑定">' ;
        bindTelHtml += 			'</div>' ;
        bindTelHtml += 		'</div>' ;
        bindTelHtml += 	'</div>' ;

        var tel_zz = /^0?1(3|4|5|7|8)[0-9]{9}$/ ,
            imgCode_zz = /^[a-zA-Z]{4}$/,
            pwd_zz = /^[\\~!@#$%^&*()-_=+|{}\[\],.?\/:;\'\"\d\w]{6,25}$/,
            isCode = true,
            phoneCheck = false,
            imgCodeCheck=false,
            smsCodeCheck=false,
            pwdCheck=false;
        // 隐藏-绑定手机号弹层
        function bindHide(){
            $("#bind-alert").css({"display":"none"}) ;
        }
        // 显示-绑定手机号弹层
        function bindShow(){
            if( $("#bind-alert").length === 0 ){
                $("body").append(bindTelHtml) ;
            }
            $("#bind-alert").css({"display":"block"}) ;
        }
        //显示提示信息。
        function showMsg(obj, isB, str) {
            var $bindMsg = $("#bind-msg"),
                $objParent = $(obj).parents(".bind-input-box") ;
            $objParent.removeClass("focusOn");
            if (isB) {
                $objParent.removeClass("input-error");
                $bindMsg.attr({"class": "bind-msg"}).text("一步绑定，手机号登录更快捷~") ;
            } else {
                $objParent.addClass("input-error");
                $bindMsg.attr({ "class": "bind-msg error-text"}).html(str);
            }
        }
        // 输入框得到焦点的时候
        function focusAndBlur(obj,fn) {
            $(obj).live("focus",function(){
                var init = $(this).attr("init"),
                    val = $(this).val();
                $(this).parents(".bind-input-box").addClass("focusOn");
                if (val == init){
                    $(this).val("");
                }
                // 单独判断一下设置密码的时候。
                if( $(this).hasClass("set-pwd-show") ){
                    $(this).hide().siblings(".set-pwd-hide").focus() ;
                }
            }).live("blur",function(){
                var thisVal = $(this).val() ,
                    thisInit = $(this).attr("init") ;
                // 单独判断一下设置密码的时候。
                if( $(this).hasClass("set-pwd-hide") ){
                    pwdCheck=false;
                    if (thisVal === "" || thisVal === thisInit) {
                        $(this).siblings(".set-pwd-show").show() ;
                    }else if(!pwd_zz.test(thisVal)){
                        showMsg($(this), false, "密码由 6-25 位英文，数字和符号组成") ;
                    }else{
                        pwdCheck=true;
                        showMsg($(this), true) ;
                    }
                }else{
                    if (thisVal === "" || thisVal === thisInit) {
                        $(this).val(thisInit);
                        showMsg($(this), false, "请输入"+thisInit) ;
                    }
                }
                if(typeof(fn) === "function"){
                    fn() ;
                }
            }) ;
        }
        // 倒计时
        function downTime() {
            var $bindGetCode = $(".bind-get-code"),
                codeTime = 120,
                codeT = null;
            function goTime() {
                clearInterval(codeT);
                isCode = false;
                $bindGetCode.val(codeTime + "秒").addClass("down-time").attr("disabled", "disabled");
                codeTime = codeTime - 1;
                if (codeTime >= 0) {
                    codeT = setInterval(goTime, 1000);
                } else {
                    $bindGetCode.val('重新发送').removeClass("down-time").removeAttr("disabled");
                    clearInterval(codeT);
                    isCode = true;
                }
            }
            goTime();
        }
        // 验证手机号
        function checkTel(){
            phoneCheck=false;
            var $bindGetCode = $(".bind-get-code"),
                $bindTel = $(".bind-input"),
                telVal = $.trim( $bindTel.val() ) ,
                init = $bindTel.attr("init") ;
            if (telVal === "" || telVal === init) {
                $bindGetCode.addClass("down-time").attr('disabled', 'disabled') ;
                showMsg($bindTel, false, "请输入"+init) ;
            } else {
                if (tel_zz.test(telVal)) {
                    $.ajax({
                        type: "get",
                        url: user+'/user/callbackisphoneexist/',
                        data: 'phone=' + telVal,
                        dataType: "jsonp",
                        jsonp: "callback",
                        jsonpCallback:"callback",
                        success: function (res) {
                            if (res.status==0) //已绑定
                            {
                                $bindGetCode.addClass("down-time").attr('disabled', 'disabled') ;
                                showMsg($bindTel, false, "不能重复绑定！该手机号已被注册，可直接登录") ;
                            }else
                            {
                                phoneCheck=true;
                                $bindGetCode.removeClass("down-time").removeAttr('disabled') ;
                                showMsg($bindTel, true ) ;
                            }
                        }
                    });
                } else {
                    $bindGetCode.addClass("down-time").attr('disabled', 'disabled') ;
                    showMsg($bindTel, false, "请输入正确的"+init) ;
                }
            }
        }
        //验证短信验证码
        function checkSmsCode()
        {
            smsCodeCheck=false;
                var $this = $('.tel-msg') ,
                    val = $.trim($this.val()),
                    init = $this.attr("init");
                // 与数据库对比。
                if (val === "" || val === init) {
                    //$this.val(init);
                    showMsg($this, false, "请输入"+init);
                } else{
                    $.ajax({
                        type: "get",
                        url: user+'/user/callbackverifyCode/',
                        data: {phone:$('.bind-input').val(),code:val,login:1},
                        dataType: "jsonp",
                        jsonp: "callback",
                        jsonpCallback:"callback",
                        success: function(data) {
                            //console.log( "html: "+$this.html() );
                            if (data.status != 1) {
                                showMsg($this, false, data.msg);
                            } else {
                                showMsg($this, true ) ;
                                smsCodeCheck=true;
                            }
                        }
                    });
                }
        }

        // 输入框，输入内容的时候。
        $(document).keyup(function(event) {
            var $target = $(event.target);
            if ($target.hasClass('img-input')) {
                imgCodeCheck=false;
                var val = $.trim($target.val()),
                    $this = $(this) ;
                //	必须满足正则，和没有发送请求（或者已经发送了，还没有返回值）
                if (imgCode_zz.test(val) && isCode) {
                    iscode = false ;
                    $.ajax({
                        type: "get",
                        url: user+'/user/CallbackCheckCaptcha/',
                        data: {code:val},
                        dataType: "jsonp",
                        jsonp: "callback",
                        jsonpCallback:"callback",
                        success: function(data) {
                            console.log( "data: "+data.status ) ;
                            if (data.status!= 1) {
                                showMsg($target, false, "请输入正确的"+$target.attr("init"));
                            } else {
                                var phone=$('.bind-input').val() ;
                                $.ajax({
                                    type: "get",
                                    url: user+'/user/CallbackSend/',
                                    data: 'phone=' + phone,
                                    dataType: "jsonp",
                                    jsonp: "callback",
                                    jsonpCallback:"callback",
                                    success: function (res) {
                                        if (!res.status) {
                                            showMsg($target, false, res.msg) ;
                                        }else
                                        {
                                            showMsg($target, true ) ;
                                            // 执行倒计时
                                            downTime() ;
                                            setTimeout(function(){
                                                $(".bind-img-box").slideUp() ;
                                            },2000) ;
                                            isCode=true ;
                                            imgCodeCheck=true;
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
            // 输入手机号的时候
            if ( $target.hasClass("bind-input")) {
                checkTel() ;
            }
            // 输入短信验证码的时候
            if ( $target.hasClass("tel-msg")) {
                checkSmsCode() ;
            }
        });
        //点击关闭(bind-close)，或者跳过(skip)
        $(".skip,.bind-close").live("click",bindHide) ;
        //	手机号得到焦点的时候
        focusAndBlur(".bind-input",checkTel) ;
        // 点击获取验证码
        $(".bind-get-code").live("click",function(){
            if($(".bind-img-box").is(":hidden")){
                $(".bind-img-box").slideDown() ;
            }
        });
        //	图形校验码
        focusAndBlur(".img-input") ;
        // 点击图形刷新
        $(".bind-img-code").live("click",function(){
            var imgSrc = $(this).attr('src'),
                num = imgSrc.indexOf('='),
                m = Math.round(Math.random() * 100000000),
                newSrc = imgSrc.substring(0, num) + '=' + m;
            $(this).attr("src", newSrc);
        });
        // 短信验证码
        focusAndBlur(".tel-msg",checkSmsCode) ;
        // 设置密码
        focusAndBlur(".set-pwd-show") ;
        focusAndBlur(".set-pwd-hide") ;
        // 点击立即绑定的时候
        $(".bind-login-btn").live("click",function(){
            if(phoneCheck && imgCodeCheck && smsCodeCheck && pwdCheck)
            {
                $.ajax({
                    type: "get",
                    url: user+'/user/callbackboundphone/',
                    data: {phone:$('.bind-input').val(),code:$('.tel-msg').val(),password:$('.set-pwd-hide').val()},
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback:"callback",
                    success: function(data) {
                        if (data.status != 1) {
                            $("#bind-msg").attr({ "class": "bind-msg error-text"}).html(data.msg);
                        } else {
                            $("#bind-msg").attr({ "class": "bind-msg error-text"}).html(data.msg);
                            bindHide();
                        }
                    }
                });
            }else
            {
                if(!phoneCheck)
                {
                    $('.bind-input').trigger("blur") ;
                    return false;
                }
                if(!imgCodeCheck)
                {
                    $('.img-input').trigger("blur") ;
                    return false;
                }
                if(!smsCodeCheck)
                {
                    $('.tel-msg').trigger("blur") ;
                    return false;
                }
                if(!pwdCheck)
                {
                    $('.set-pwd-show').trigger("blur") ;
                    return false;
                }
                /*$(".bind-input-box").each(function(index,obj){
                    var $input = $(obj).find('input').eq(0) ;
                    if($input.attr("type") === "text" || $input.attr("type") === "password"){
                        $input.trigger("blur") ;
                    }
                })*/
            }
        });

        //读取cookies
        function getCookie(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg)) {
                return unescape(arr[2]);
            }else {
                return null;
            }
        }
        //删除cookies
        function deleteCookie(name){
            var date=new Date();
            date.setTime(date.getTime()-10000);
            document.cookie=name+"=v; expires="+date.getTime()+";domain=yuemei.com;";
        }
        // 判断cookie, 调用显示弹框
       /* var documentHref = document.location.href
        if(documentHref == "www.yuemei.test" || documentHref == "http://www.yuemei.test/"){*/
        /*console.log("cookie1 : "+getCookie("three_login") ) ;
        if( getCookie("three_login") == 1 ) {
            bindShow() ;
            deleteCookie("three_login") ;
            console.log("cookie2 : "+getCookie("three_login") ) ;
        }*/
       /* function callback(arr){
            console.log(arr);
        }
        $.ajax({
            url: user+'/user/threeloginexist/',
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback:"callback",
            success: function(data) {
                if (data.status == 1) {
                    bindShow();
                }
            }
        });*/
        var time;
        time = new Date().getTime();
        $.getJSON(user + '/user/threeloginexist/?callback=' + time + '&jsoncallback=?', {}, function (data){
            if (data.status == 1) {
                bindShow();
            }
        });
    }


});

function sel_city(ename,type){
    $.ajax({
        type:"get",
        url:host+"/city/ajaxCity?type="+type+"&ename="+ename,
        success:function(res){
            if(res && type == 'sel_city'){
                if (res == 'quanguo') {
                    window.location.href=host;
                } else {
                    window.location.href=host+res+"/";
                }
            }
        }
    });
}
$(function() {//频道页公用导航列表展现
    if($(".all_left_list").length>0){

        $(".all_left_list a").mouseover(function(){
            if(!$(this).is(".now")){
                var nIn=$(this).index();
                $(".infoShowCont").hide().css({left:194});
                $(this).addClass("now").siblings().removeClass("now");
                $(".infoShowCont").show().animate({left:204},{duaration:150,queue:!1});
                $(".btnItem2 li").eq(nIn).show().siblings().hide();
            }
        });
        $(".all_list").mouseleave(function() {
            $(".infoShowCont").hide().css({"left":194});
        });
        $('.infoShowCont').hover(function(){
        	
        	$('.all_left_list').addClass('all_left_on') ;
        },function(){
            $('.all_left_list').removeClass('all_left_on') ;        	
        })
        $(".pull_down").mouseover(function(){
            $(".all_list").show();
        }).mouseleave(function(){
            $(".all_list").hide();
            $(".infoShowCont").hide().css({"left":194});
            $(".all_left_list a").removeClass("now");
        });
    }
});
// 添加右边的客服小女孩图片
function addGirl(){
    var girlHtml = '<style type="text/css">.right-girl{ height: 100px; right: 0; top: 0; position: fixed; z-index: 999999; }.right-girl .girl-img{ position: fixed; top: 50%; margin-top: -245px; right: 3px; display: block; width: 40px; height: 92px; background: url(http://icon.yuemei.com/front/common/images/right-girl.gif) no-repeat; }.right-girl .girl-txt{ position: absolute; right:-4px; top: 0; display: none; width: 345px; height: 164px; background: url(http://icon.yuemei.com/front/common/images/girl-txt.png) no-repeat; cursor: pointer; }.right-girl .close-girl{ display: block; width: 25px; height: 25px; position: absolute; right: 86px; top: 17px; cursor: pointer; }</style><div class="right-girl" id="right-girl"><div class="girl-img" id="girl-img"><span class="girl-txt zixungirl" id="girl-txt" onclick="mechatClick();return false;" ><i class="close-girl" id="close-girl"></i></span></div></div>';
    if(typeof(theGirl)!="undefined"&&!theGirl) {//如果是淘整形详情页（只有淘整形详情有这个变量）
        girlHtml +='<style>.right-girl,.taoZiXun{ display:none !important}</style>';
    }else{
        girlHtml +='<style>.right-girl,.taoZiXun{ display:none !important}</style>';
    }
    $("body").append( girlHtml );
    var $rightGirl = $("#right-girl"),
        $girlImg = $("#girl-img") ,
        $girlTxt = $("#girl-txt") ,
        showTime = null ,
        hideTime = null ;
    $girlImg.hover(function(){
        clearTimeout(showTime) ;
        clearTimeout(hideTime) ;
        isHover = false ;
        $girlImg.css({"background":"none"}) ;
        $girlTxt.css({"display":"block"}) ;
    },function(){
        $girlImg.css({"background":"url(http://icon.yuemei.com/front/common/images/right-girl.gif) no-repeat"}) ;
        $girlTxt.css({"display":"none"}) ;
    })	;
    $girlTxt.mouseover(function(){
        clearTimeout(hideTime) ;
    })	;
    $("#close-girl").click(function(){
        $girlTxt.hide() ;
        return false;
    })	;
    showTime = setTimeout(function(){
        $girlImg.trigger('mouseover') ;
        hideTime = setTimeout(function(){
            $girlImg.trigger('mouseout') ;
        },7000) ;
    },3000) ;
}
// 添加返现链接入口
function returnMoney(href,left){
    if(href == '' || href == undefined ){
    	// 返现的链接
        href = 'http://www.yuemei.com/p/939555.html' ;
    }
    var returnHTML = '<style type="text/css">.return-money {position: fixed; right: 50%;margin-right: '+left+';bottom: 80px;z-index: 1;display: block;width: 143px;height: 93px;background: url(http://icon.yuemei.com/front/common/images/returnMoney.png) no-repeat;}.return-money .close-money {position: absolute;top: 0;right: 5px;display: block;width: 19px;height: 19px;}@media screen and ( max-width:1550px ){.return-money{right:10px; margin: 0;}}</style><a href='+href+' target="_blank" class="return-money"><i class="close-money" id="close-money"></i></a>' ;
    $("body").append( returnHTML ) ;
    $("#close-money").click(function(){
        $(this).parents('.return-money').hide() ;
        return false ;
    })
}

// @TODO 临时应对劫持 by dexteryy
/*var _write = _doc.write,
	_white_list = {
		'yuemei.com': 1,
		'zhengmei.com.cn': 1,
		'baidu.com': 1,
		'meiqia.com': 1,
 		'upaiyun.com': 1,
 		'cnzz.com': 1
	},
	// 统计劫持情况
	_hijack_stat = function(reason, env){
		var img = new Image();
		img.onload = function(){};
		img.src = "http://www.douban.com/j/except_report?kind=ra022&reason="
			+ encodeURIComponent(reason)
			+ "&environment=" + encodeURIComponent(env);
	},
	_RE_SCRIPTS = /<script.*?src\=["']?([^"'\s>]+)/ig,
	_RE_DOMAIN = /(.+?)\.([^\/]+).+/;
_doc.write = function(str){
	try {
		var s, safes = [], unkowns = [];
		while (s = _RE_SCRIPTS.exec(str)) {
			if (_white_list[(_RE_DOMAIN.exec(s) || [])[2]]) {
				safes.push(s);
			} else {
				unkowns.push(s);
			}
		}
		if (unkowns.length > 0) {
			_hijack_stat([unkowns[0], safes[0] || ""].join("~_~"), location.href);
		}
		try {
			_write.call(this, str);
		} catch (ex) {
			_write(str);
		}
	} catch (ex) {
		_write(str);
		_hijack_stat(ex.name + ":" + ex.message, location.href);
	}
};*/

if(!isRY&&detail){
    $(function(){
        $(".toolbar-tab.toolbar-zx").show();
    });
}
/*添加导航*/

/* var userARea = 'http://user.yuemei.com/';
$.ajax({
    url: userARea+"user/ajaxpartlist",
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback:"callback",
    success:function(data){
        var html=data.data;
        if($(".channel_nav_js").length > 0){
            $(".pull_down>span").after(html);
        }

    }
}); */