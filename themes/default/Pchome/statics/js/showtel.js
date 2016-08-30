


(function ($, window, undefined) {

    window.Ajax = window.Ajax || {};

    window.Ajax.showTel = {};

    var showTel = window.Ajax.showTel;



    showTel.getJson = function (data) {

        /// <summary>查询收藏状态</summary>

        /// <return type="deferred">ajax异步队列</return>

        return $.ajax({

            cache: false,

            dataType: "jsonp",

            url: 'http://j.66law.cn/lawyerTelViewHits/',

            data: data

        });

    };



    showTel.init = function (btn, view) {

        ///         lid=2045382（律师编号） 

        ///         lname=田园（律师姓名）

        ///         bc=1(大栏目:1-文章类 2-咨询类 3-个人主页（二级域名）4-找律师) 

        ///         sc=bycate(细分栏目) 

        ///         code=ty(广告位置)



        $('body').on('click', btn, function () {

            var $self = $(this);

            var json = {};

            json.lid = $self.data('lid');

            json.lname = $self.data('lname');

            json.bc = $self.data('bc');

            json.sc = $self.data('sc');

            json.code = $self.data('code');



            showTel.getJson(json)

                .then(function (res) {

                    if (res && res.state == 1) {

                        $self.hide().siblings(view).text(res.msg);

                    } else {

                        $.alert('error', '系统提示', (res && res.msg) || '获取律师电话号码失败!');

                    }



                });

            return false;

        });

    };





    $(function () {

        var $script = $('#script-showtel');

        if ($script.length > 0) {

            var viewer = $script.data('view') || 'em';

            var btn = $script.data('btn') || 'a.fn-showtel';

            if ($('script[src="http://cache.66law.cn/js/modal.js"]').length < 1) {

                $.getScript('http://cache.66law.cn/js/modal.js', function () {

                    showTel.init(btn, viewer);

                });

            } else {

                showTel.init(btn, viewer);



            }

        }

    });

})(jQuery, window);





