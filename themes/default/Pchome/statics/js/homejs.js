/**
 * Created by Administrator on 2015/3/25.
 */
$(document).ready(function(){
    $('table.datalist tr').each(function(){
        $(this).find('td').eq(0).css({fontSize:'14px',width:'260px'});
        $(this).find('td').eq(1).css({color:'#f28a0f'});
        $(this).find('td').last().css({color:'#27984f'});
    });
    $(".ui-select").selectWidget({
        change: function (changes) {
            return changes;
        },
        effect       : "slide",
        keyControl   : true,
        speed        : 200,
        scrollHeight : 250
    });
    $('div.leftTabTit span').eq(2).css({width:'76px'});
    $('div.leftTabTit span').mouseover(function(){
        var thisIndex=$(this).index();
        var $span=$('div.leftTabTit span');
        $(this).addClass('after'+(thisIndex+1));
//        if(thisIndex==0){
//            $span.eq(1).removeClass('after2');
//            $span.eq(2).removeClass('after3');
//        }
//        if(thisIndex==1){
//            $span.eq(0).removeClass('after1');
//            $span.eq(2).removeClass('after3');
//        }
//        if(thisIndex==2){
//            $span.eq(0).removeClass('after1');
//            $span.eq(1).removeClass('after2')
//        }
        switch (thisIndex){
            case 0:
                $span.eq(1).removeClass('after2');
                $span.eq(2).removeClass('after3');
                break;
            case 1:
                $span.eq(0).removeClass('after1');
                $span.eq(2).removeClass('after3');
                break;
            case 2:
                $span.eq(0).removeClass('after1');
                $span.eq(1).removeClass('after2');
                break;
        }
        $('div.tabInfo').hide();
        $('div.tabInfo').eq(thisIndex).show();
    })
    $('div.childWeb').hover(function(){
        $('.area_nav').show();
    },function(){
        $('.area_nav').hide();
    });
    $('div.matrix').hover(function(){
        $('ul.sub_list').show();
    },function(){
        $('ul.sub_list').hide();
    });

    $('.m_search .hd ul li').mouseover(function(){
        $('.m_search .hd ul li').removeClass('on');
        $(this).addClass('on');
        var liIndex=$(this).index();
        $('.bd .pan').hide();
        $('.bd .pan').eq(liIndex).show();
    });
    $('div.goodlinkTit ul li a').mouseover(function(){
        var aIndex=$(this).parent().index();
        $('.gongLinkCon').hide();
        $('div.goodlinkTit ul li a').removeClass('mouseHover');
        $(this).addClass('mouseHover');
        $('.gongLinkCon').eq(aIndex).show();
    });

    $('a.moreBox').hover(function(){
        $('.topAbsoluted').show();
    },function(){
        $('.topAbsoluted').hide();
    });
    $('li.hidedDiv').hover(function(){
        $('div.moreClass').show();
    },function(){
        $('div.moreClass').hide();
    });
    $('div.todayhotTit span').mouseover(function(){
        var thisIndex=$(this).index();
        $('div.todayhotTit span').removeClass('hoverNow');
        $('div.todyhotContext').hide();
        $(this).addClass('hoverNow');
        $('div.todyhotContext').eq(thisIndex).show();

    });
    $('ul.wt li span').mouseover(function(){
        var thisIndex=$(this).parent().index();
        $('ul.wt li span').removeClass('cursor');
        $('div.tableOne').hide();
        $(this).addClass('cursor');
        $('div.tableOne').eq(thisIndex).show();

    });
    $('div.tabBox>a').hover(function(){
        $('div.tabBox a').removeClass('mousehover');
        var aaIndex=$(this).index();
        $(this).addClass('mousehover');
        $('div.tabConBox').hide();
        $('div.tabConBox').eq(aaIndex).show();

        $(".entrustTit").each(function(){
            $(this).find("span").eq(0).addClass('cursorT');
            $(this).parent().find(".newsBox").eq(0).show();
        });
    },function(){
        $(".entrustTit").each(function(){
            $(this).find("span").eq(1).removeClass('cursorT');
            $(this).find("span").eq(2).removeClass('cursorT');
        });
    });
    $('ul.tabTit li span').mousemove(function(){
        var thisIndex=$(this).parent().index();
        $('ul.tabTit li span').removeClass('cursorT');
        $('div.newsBox').hide();
        $(this).addClass('cursorT');
        $(this).parents('.tabConBoxL').find(".newsBox").eq(thisIndex).show();
    });

    $(".twoAD").each(function(){
        $(this).find("a").eq(0).addClass('left');
        $(this).find("a").eq(1).addClass('right');
    });
    $('#asksub').bind('click',function(){
        $("#askform").submit();
    });

    //
    //$('div.tabBox a').mouseover(function(){
    //    var AIndex=$(this).index();
    //    var $getSpan= $(this).parent().siblings().children('.tabConBoxL').children('.entrustTit').children('.tabTit');
    //    var $tabConBox=$('.tabConBox');
    //            if(AIndex==0){
    //                //$getSpan.attr('id','tabTit0');
    //                $('ul.tabTit:eq[0] li span').mouseover(function(){
    //                    var thisIndex=$(this).parent().index();
    //                    $('ul#tabTit0 li span').removeClass('cursorT');
    //                    //$('div.newsBox').hide();
    //                    $(this).parent().parent().parent().siblings('.newsBox').hide();
    //                    $(this).addClass('cursorT');
    //                    $(this).parent().parent().parent().siblings('.newsBox').eq(thisIndex).show();
    //                });
    //            }
    //
    //})

})
