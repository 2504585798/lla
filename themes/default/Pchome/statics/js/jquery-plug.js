$(function(){
/********Banner轮播********/
	var timer = null,index = 0;
	$('.nav ul li').eq(index).addClass('active');
	$('.nav ul li').mouseover(function(){
		index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.banner ul').stop().animate({top:-350*index});
	});
	timer = setInterval(slide,5000);
	$('.banner,.nav').hover(function(){
		clearInterval(timer);
	},function(){
		timer = setInterval(slide,5000);
	});
	function slide(){
		if(index == ($('.banner ul li').length - 1)){
			index = 0;
		}else{
			index++;
		}
		$('.banner ul').stop().animate({top:-350*index});
		$('.nav ul li').eq(index).addClass('active').siblings().removeClass('active');
	}
/********核心业务处Tab切换********/
	$(".index_content_title span").click(function(){
		var thisSpan = $(this).index(".index_content_title span");
		$(".index_business_list ul li").css({"width":0+'px'});
		$(".index_business_list ul li").eq(thisSpan).addClass("index_business_list_zero").animate({width:200+'px'}).siblings().removeClass("index_business_list_zero");
		$(".index_business_list ul li").eq(thisSpan+1).addClass("index_business_list_disp").animate({width:200+'px'}).siblings().removeClass("index_business_list_disp");
	});
/********导航菜单不随页面滚动而消失********/
	$(window).scroll(function(){
		var toTop = $(document).scrollTop();
		$(".header_box").css({"position":"relative","top":toTop+"px"});
	});
/********返回顶部********/
	$(window).scroll(function(){
		var browse_height = $(window).height()-500;//$(window).height()代表了当前可见区域的大小，而$(document).height()则代表了整个文档的高度
		var scroll_height = $(document).scrollTop();//$(document).scrollTop() 获取垂直滚动的距离，即当前滚动的地方的窗口顶端到整个页面顶端的距离
		if(scroll_height >= browse_height){
			$(".scroll_top").fadeIn(500);
		}else{
			$(".scroll_top").fadeOut(500);
		}
	});
	$(".scroll_top").click(function(){
		$("html,body").animate({scrollTop:0});
	});
/********二级分类********/
	$(".subNav").click(function(){
		$(this).toggleClass("dis-now").siblings(".subNav").removeClass("dis-now");
		$(this).next(".navContent").slideToggle(500).siblings(".navContent").slideUp(500);//修改数字控制速度，slideUp(500)控制卷起速度
	});
/********二级分类********/
	$(".aboutcenter_left_2 ul li").click(function(){
		$(this).addClass("cursor").siblings().removeClass("cursor");	
	});
/********作品集********/	
	$(".tit h3").click(function(){
		$(this).addClass("dis-tit").siblings().removeClass("dis-tit");//点击谁给谁dis-red类，其他去掉dis-red类，siblings()选出同胞元素不包含自己
		var i=$(this).index(".tit h3");//$(this)是.tit h3中的一个，所以index(".tit h3")获得点击的第几个.tit h3,返回值为从0开始的数字
		$(".con li").eq(i).removeClass("no-dis").addClass("dis").siblings().removeClass().addClass("no-dis");
		scrollPro();
	});
/********产品滚动********/
	function scrollPro(){
		var page_now = 1;  
		var dd_each_page = 5; //每版放4个图片
		var dd_total = $(".con ul li.dis dl dd").length;
		var page_total = Math.ceil((dd_total / dd_each_page)); //只要不是整数，就往大的方向取最小的整数
		var parent_box = $(".con ul li.dis dl");
		var parent_box_width = $(".con ul li.dis dl").width()-30; //获取框架内容的宽度,不带单位
		//向右 按钮
		$(".con ul li.dis .btnLeft").click(function(){
			if( !parent_box.is(":animated") ){
				if( page_now == page_total ){ //已经到最后一个版面了,如果再向后，必须跳转到第一个版面
					parent_box.animate({ left : 20 }, 800); //通过改变left值，跳转到第一个版面
					page_now = 1;
				}else{
					parent_box.animate({ left : '-='+parent_box_width }, 800); //通过改变left值，达到每次换一个版面
					page_now++;
				}
			}
		});
		//往左 按钮
		$(".con ul li.dis .btnRight").click(function(){
			if( !parent_box.is(":animated") ){
				if( page_now == 1 ){ //已经到第一个版面了,如果再向前，必须跳转到最后一个版面
					parent_box.animate({ left : '-='+parent_box_width*(page_total-1) }, 800); //通过改变left值，跳转到最后一个版面
					page_now = page_total;
				}else{
					parent_box.animate({ left : '+='+parent_box_width }, 800);  //通过改变left值，达到每次换一个版面
					page_now--;
				}
			}
		});}
	scrollPro();
});