$(document).ready(function() {
   
    // 侧导航
    $(".l-sub-nav1").hover(function() {
        var m = $(this).find(".l-sn-more");
        m.show();
    },function() {
        var m = $(this).find(".l-sn-more");
        m.hide();
    });

    var timer = null;

    $(".hd-menu .hd-mu").hover(function () {
        $(".hd-menu").find(".hd-mu-more").removeClass("none");
    }, function () {
        timer = setTimeout(function () {
            $(".hd-menu").find(".hd-mu-more").addClass("none");
        }, 200);


    });
    $(".hd-mu-more").hover(function () {
        clearTimeout(timer);
    }, function () {
        $(this).addClass('none');
    });

   

})