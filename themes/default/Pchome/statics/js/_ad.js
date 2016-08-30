$(function () {
    var tophtml = "<div id=\"izl_rmenu\" class=\"izl-rmenu\"><ul><li><a target=\"_blank\" href=\"http://www.maxlaw.cn/cp/2016\" class=\"btn btn-cpfw\"></a></li><li><a href=\"http://huodong.maxlaw.cn/zp2016\" target=\"_blank\" class=\"btn btn-znq\"></a></li><li><a href=\"http://wpa.qq.com/msgrd?v=3&uin=2851289666&site=qq&menu=yes\" target=\"_blank\" class=\"btn btn-qqzx\"></a></li><li><a href=\"http://www.weibanan.com\" target=\"_blank\" class=\"btn btn-wba\"><img class=\"pic\" src=\"/style/images/ewm.png\"></a></li></ul><div class=\"btn btn-top\"></div></div>";
    $("#cbl").html(tophtml);
    $("#izl_rmenu").each(function () {
        $(this).find(".btn-znq").mouseenter(function () {
            $(this).find(".pic").fadeIn("fast");
        });
        $(this).find(".btn-znq").mouseleave(function () {
            $(this).find(".pic").fadeOut("fast");
        });
        $(this).find(".btn-wba").mouseenter(function () {
            $(this).find(".pic").fadeIn("fast");
        });
        $(this).find(".btn-wba").mouseleave(function () {
            $(this).find(".pic").fadeOut("fast");
        });
        $(this).find(".btn-top").click(function () {
            $("html, body").animate({
                "scroll-top": 0
            }, "fast");
        });
    });
    var lastRmenuStatus = false;
    $(window).scroll(function () {//bug
        var _top = $(window).scrollTop();
        if (_top > 500) {
            $("#izl_rmenu").data("expanded", true);
        } else {
            $("#izl_rmenu").data("expanded", false);
        }
        if ($("#izl_rmenu").data("expanded") != lastRmenuStatus) {
            lastRmenuStatus = $("#izl_rmenu").data("expanded");
            if (lastRmenuStatus) {
                $("#izl_rmenu .btn-top").slideDown();
            } else {
                $("#izl_rmenu .btn-top").slideUp();
            }
        }
    });
});