
$(function(){
    //滑过显示更多
    $(".hoverTab .tabCont a").hover(function(){
        var nIn=$(this).index();
        $(this).addClass("now").siblings().removeClass("now");
        $(this).parents(".hoverTab").find(".hoverCont").eq(nIn).show().siblings(".hoverCont").hide();
    });
	setTimeout(function(){
		$(".bannerImg li:eq(0) img").addClass("now");
	},100);
	//banner图
	var bannerTimer;
	var theS=5000;
	function bannerEffet(){
		var nIn=$(".bannerImg .current").index();
		//var datatag=nIn+1;//新增
		
		//$(this).attr('datatag',datatag);//设置属性
		//alert(datatag);
		$(".bannerImg li img").removeClass("now");
		if(nIn<$(".bannerImg li").length-1){
			nIn++;
		}else{
			nIn=0;
		}
		$(".bannerImg li").eq(nIn).addClass("current").siblings("li").removeClass("current");
		$(".bannerImg li").eq(nIn).fadeIn(200,function(){
			$(this).find("img").fadeIn(100).toggleClass("now");
		});
		$(".bannerImg li").eq(nIn).siblings("li").fadeOut(700);
		$(".tabIcon span").eq(nIn).addClass("now").siblings().removeClass("now");
	}
	$(".tabIcon").mouseover(function(){
		clearInterval(bannerTimer) ;
	})
	$(".tabIcon span").mouseover(function(){
		$(".banner li img").removeClass("now");
		var nIn=$(this).index();
		$(this).addClass("now").siblings().removeClass("now");
		$(".bannerImg li").eq(nIn).addClass("current").siblings("li").removeClass("current");
		$(".bannerImg li").eq(nIn).fadeIn(200,function(){
			$(this).find("img").fadeIn(100).toggleClass("now");
		});
		$(".bannerImg li").eq(nIn).siblings("li").fadeOut(700);
	});
	$(".bannerImg li img").mouseover(function(){
		$(".prev,.next").fadeIn();
	});
	$(".banner").mouseleave(function(){
		$(".prev,.next").hide();
	});
	//上翻
	$(".prev").click(function(){
		$(".banner li img").removeClass("now");
		var nIn=$(".bannerImg .current").index();
		if(nIn<$(".bannerImg li").length&&nIn>0){
			nIn--;
		}else{
			nIn=$(".bannerImg li").length-1;
		}
		$(".tabIcon span").eq(nIn).addClass("now").siblings().removeClass("now");
		$(".bannerImg li").eq(nIn).addClass("current").siblings("li").removeClass("current");
		$(".bannerImg li").eq(nIn).fadeIn(200,function(){
			$(this).find("img").fadeIn(100).toggleClass("now");
		});
		$(".bannerImg li").eq(nIn).siblings("li").fadeOut(700);
	});
	//下翻
	$(".next").click(function(){
		$(".banner li img").removeClass("now");
		var nIn=$(".bannerImg .current").index();
		if(nIn<$(".bannerImg li").length-1){
			nIn++;

		}else{
			nIn=0;
		}
		$(".tabIcon span").eq(nIn).addClass("now").siblings().removeClass("now");
		$(".bannerImg li").eq(nIn).addClass("current").siblings("li").removeClass("current");
		$(".bannerImg li").eq(nIn).fadeIn(200,function(){
			$(this).find("img").fadeIn(100).toggleClass("now");
		});
		$(".bannerImg li").eq(nIn).siblings("li").fadeOut(700);

	});
	$(".bannerImg").hover(function(){
		clearInterval(bannerTimer) ;
	},function(){
		clearInterval(bannerTimer);
		bannerTimer=setInterval(bannerEffet,theS);
	}).trigger("mouseleave") ;
	//banner图---end


	$(".btnItem1 li").mouseover(function(){
		if(!$(this).is(".current")){
			var nIn=$(this).index();
			$(".btnItem2").hide().css({left:-15});
			$(this).addClass("current").siblings().removeClass("current");
			$(".btnItem2").fadeIn(300).animate({left:0},{duaration:350,queue:!1});
			$(".btnItem2 li").eq(nIn).show().siblings().hide();
			$(".fastZT2").show();
			$(".fastZT2 li").eq(nIn).show().siblings().hide();
		}
	});
	$(".banner").mouseleave(function(){
		$(".btnItem1 li").removeClass("current");
		$(".btnItem2,.btnItem2 li").hide();
		$(".fastZT2,.fastZT2 li").hide();
		$(".btnItem2").css({left:-15});
	});
	$(".tabList span").mouseover(function(){
		var nIn=$(this).index();
		$(this).addClass("now").siblings().removeClass("now");
		$(".tabShowCont ul").eq(nIn).show().siblings().hide();
	});
	var serveTimer=setTimeout(function(){
		var nIn=$(".serveTab .now").index();
		if(nIn<1){
			nIn++;
		}else{
			nIn=0;
		}
		$(".serveTab span").eq(nIn).addClass("now").siblings().removeClass("now");
		$(".serveCont ul").eq(nIn).show().siblings().hide();
		serveTimer=setTimeout(arguments.callee,theS);
	},theS);
	$(".serveTab span").click(function(){
		clearTimeout(serveTimer);
		var nIn=$(this).index();
		$(this).addClass("now").siblings().removeClass("now");
		$(".serveCont ul").eq(nIn).show().siblings().hide();
	});
});

$('#masonry').masonry({ singleMode: true,  gutterWidth : 10 });

$(document).ready(function(){
    var $container = $('#con1_1');
    $container.imagesLoaded(function(){
        $container.masonry({
            itemSelector: '.product_list',
            columnWidth: 5 //每两列之间的间隙为5像素
        });
    });

});