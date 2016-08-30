$(document).ready(function () {

    // 快捷入口
    $(".s-n-down").hover(function () {
        $(this).toggleClass("s-n-hover");
        $(this).find(".s-n-more").toggleClass("none");
    });

    // 搜索框
    $("#top-seek").focus(function () {
        $(this).parent("p").addClass("hd-sk-focus");
    });
    $("#top-seek").blur(function () {
        $(this).parent("p").removeClass("hd-sk-focus");
    });

    var timer = null;
    // 快速咨询
    $("#hd-online-zx").hover(function () {
        $('.hd-zx-pop').show();
    }, function () {
        timer = setTimeout(function () {
            $('.hd-zx-pop').hide();
        }, 300);
    });

    $('.hd-zx-pop').on('mouseover', function () {
        clearTimeout(timer);
        $(this).show();
    }).on('mouseleave', function () {
        $(this).hide();
    });

    $("#hd-f-zx").click(function () {
        $(this).parent(".hd-zx-pop").hide();
    });

    // 友链切换
    $(".ft-bl-tab span").click(function () {
        var i = $(this).index();
        $(this).addClass("bl-tab-ct").siblings().removeClass("bl-tab-ct");
        $(".ft-bl-list li").eq(i).removeClass("none").siblings().addClass("none");
    });

    $(".ft-bl-tab2 span").click(function () {
        var i = $(this).index();
        $(this).addClass("bl-tab-ct").siblings().removeClass("bl-tab-ct");
        $("#yq-link li").eq(i).removeClass("none").siblings().addClass("none");
    });

    // 滑动开关
    $(".m-slide-switch").hover(function () {
        $(this).toggleClass("m-slide-switch-foucs");
    });
    $(".m-slide-switch").click(function () {
        $(this).toggleClass("m-slide-switch-click");
    });

    // Tab切换
    $(".tab-nav a").click(function () {
        $(this).addClass("tab-nav-ct").siblings().removeClass("tab-nav-ct");
    });

    $(".tab-ad-num i").click(function () {
        $(this).addClass("ad-num-ct").siblings().removeClass("ad-num-ct");
    });

    // 小搜索框
    $(".sh-box-sl .sh-text").focus(function () {
        $(".sh-box-sl").addClass("sh-box-sl-fcous");
    });
    $(".sh-box-sl .sh-text").blur(function () {
        $(".sh-box-sl").removeClass("sh-box-sl-fcous");
    });
    //轮播广告
    //$('.tab-ad li').width('990');
    $('.tab-ad').HlSwitcher({
        ctn_focus: ".tab-ad-num i",
        cls_focus: "ad-num-ct",
        lst_contents: "ul li",
        animationSpeed: 800,
        animationType: "linear",
        timeOut: 5000,
        skipFlag: "skip",
        direction: 'left'
    });

    ///热搜词更新点击
    $('.hsw').on('click', function () {

        var $this = $(this);
        var wordid = $this.attr('data-id');
        $.ajax({
            type: "POST",
            url: "/ajax/HotSearchWordPost.aspx",
            data: "wordid=" + wordid,
            success: function (msg) {

            }
        });
    });

})