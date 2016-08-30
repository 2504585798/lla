//登录按钮回车
//$('#loginButton').bind('click', Login);
//$('#Code1').bind('keydown', function (ev) {
//    if (ev.keyCode == 13) {
//        Login();
//    }
//});

//$("#loginButton").click(alert(1));


function Login() {
    var $uName = $('#username').val(); //个人用户名
    var $uPwd = $('#userpass').val(); //个人密码
    var $code = $('#Code1').val();
    var result = $("#result");

    if ($uName == "" || $uPwd == "") {
        document.getElementById("lszcboxheng").style.display = "";
        result.html("请填写账号或密码！");
        return;
    }
    
    if($code=="")
    {
        document.getElementById("lszcboxheng").style.display = "";
        result.html("验证码不能为空");
        return;
    }

    CheckCode(1);
}

function checkd() {
    var result = $("#result");
    var $uName = $('#username').val(); //个人用户名
    var $uPwd = $('#userpass').val(); //个人密码
    var $Code = $("#Code1").val();
    $.ajax({
        url: '/Ajax/Common/Check',
        data: {
            uName: $uName,
            uPwd: $uPwd,
            Code: $Code
         },
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                
                // var url = $("#comeUrl").val();
                if (data.tp == 1) {
                   // alert("登陆成功！");
                    bindTime(4);
                   setTimeout("location.href='/user/home/" + data.id + "';", 2000);

                } else if (data.tp == 2) {
                    // alert("登陆成功！");
                    bindTime(4);
                    var rnd = "";
                   for (var i = 0; i < 150; i++)
                       rnd += Math.floor(Math.random() * 10);
                   setTimeout("location.href='http://uc.maxlaw.cn/pubadmin/readkey.asp?uucode=" + rnd + "';", 2000);
                   //window.location.href = "http://uc.maxlaw.cn/pubadmin/readkey.asp?uucode="+rnd+"";
                   // setTimeout("location.href=‘http://uc.maxlaw.cn/pubadmin/readkey.asp?uucode="+rnd+"’", 500);
                } else if (data.tp == 3) {
                    // alert("登陆成功！");
                    bindTime(4);
                    var rnd = "";
                    for (var i = 0; i < 150; i++)
                        rnd += Math.floor(Math.random() * 10);
                    setTimeout("location.href='http://uc.maxlaw.cn/TeamAdmin/readkey.asp?uucode=" + rnd + "';", 2000);
                  //  window.location.href = "http://uc.maxlaw.cn/TeamAdmin/readkey.asp?uucode=" + rnd + "";
                   // setTimeout("location.href='http://uc.maxlaw.cn/TeamAdmin/main.asp';", 500);
                }
                else {
                    window.location.href = "/";
                }
            } else if(data.status==2){  //对象为空
                image();
                document.getElementById("lszcboxheng").style.display = "";
                result.html("用户名或密码有误！");
            }else if(data.status==3)   //账号异常
            {
                image();
                document.getElementById("lszcboxheng").style.display = "";
                result.html("账号异常，请联系管理员！");
            }else if(data.status==4){  //账号被锁定
                image();
                document.getElementById("lszcboxheng").style.display = "";
                result.html("该账号被锁定！");
            }else if(data.status==5)
            {
                image();
                document.getElementById("lszcboxheng").style.display = "";
                result.html("验证码错误！");
            }else if(data.status==6)
            {
                image();
                document.getElementById("lszcboxheng").style.display = "";
                result.html("操作过于频繁请过5分钟以后再试！");
            }else if(data.status==7)
            {
                image();
                document.getElementById("lszcboxheng").style.display = "";
                result.html("网络错误！");
            }
        }
    });
}

function bindTime(i) {
   document.getElementById("lszcboxheng").style.display = "";
    var result = $("#result");
   interval = setInterval(function () {
        i--;
        result.html("登录成功："+i);
      
    }, 1000);
}

function image() {
    $("#codeimg").attr('src', "/Ask/GetValidateCode?" + Math.random() + "");
}


function CheckCode(id) {
 
    var Code = $("#Code" + id).val();
    var result = $("#result");
    var ycode = $("#ycode");
    if (Code == "") {
        alert("请输入验证码！");
        return false;
    } else {
        $.ajax({
            url: '/Ajax/Common/CheckCode',
            data: {
                Code: Code
            },
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data.status == "y") {
                    checkd();//验证通过提交表单
                } else {
                    document.getElementById("lszcboxheng").style.display = "";
                    result.html("验证码错误");
                    ycode.val("no");
                    return false;
                }
            }
        });
    }
}

function remo()
{
    var result = $("#result");
    result.html("");
}



//收藏本站
function AddFavorite(title, url) {
    try {
        window.external.addFavorite(url, title);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(title, url, "");
        }
        catch (e) {
            alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加");
        }
    }
}
$(document).ready(function () {

    $("a[name='dshow']").click(function () {
       $("#show").height("");
     });


   // $("#loginButton").click(function () { Login(); });
    $('#loginButton').bind('click', Login);
    $('#loginButton').bind('keydown', function (ev) {
        if (ev.keyCode == 13) {
            Login();
        }
    });
    $('#username').bind('keydown', function (ev) {
        if (ev.keyCode == 13) {
            Login();
        }
    });
    $('#userpass').bind('keydown', function (ev) {
        if (ev.keyCode == 13) {
            Login();
        }
    });
    $('#Code1').bind('keydown', function (ev) {
        if (ev.keyCode == 13) {
           Login();
        }
    });


    $(".top_leftya2").mouseover(function () {
        $(".cityList2").show();
    });
    $(".top_leftya2").mouseout(function () {
        $(".cityList2").hide();
    });
    //搜索框分类选择
    $(".search_left").click(function () {
        $(".subnav").slideDown('fast');
        $(".subnav li").click(function () {
            $(".search_left").text($(this).text());
            $(".subnav").slideUp("fast");
        });
        $(this).parent(".search_subnav").hover(function () {

        }, function () {
            $(".subnav").slideUp('slow');
        });
    });


    //focus fun
    $("input[type=text], textarea").each(function () {
        var $title = $(this).val();

        $(this).focus(function () {
            if ($(this).val() == $title) {
                $(this).val('');
            }
        })
        .blur(function () {
            if ($(this).val() == "") {
                $(this).val($title);
            }
        });
    });


    //切换城市
    $(".top_leftya").click(function () {
        $(".cityList").toggle(500, function () {
            $(this).hover(function () {
            }, function () {
                $(this).hide();
            });
          
        });

        $(".dw").hover(function () {
        }, function () {
            $(".cityList").hide();
        });
      });

    $change_li = $(".titleChar li");
    $change_li.each(function (i) {
        $(this).mouseover(function () {
            $(this).addClass("on1").siblings().removeClass("on1");
            $(".cityListBox dl").eq(i).show().siblings().hide();
        })

    });

    //选择城市
    $("#xzdq").mouseover(function () {
        $("#csList2").toggle(500, function () {
            $(this).hover(function () {
            }, function () {
                $(this).hide();
            });

        });
    });
});
function show(id) {
    var method = "/law";
    switch (id) {
        case "1":
            method = "/law";
            break;
        case "2":
            method = "/ask/list";
            break;
        case "3":
            method = "/lawfirm";
            break;
    }
    $("#seachform").prop("action", method);
}
function valempty(){
    var key = $("#menukey").val()
    if(key==""||key=="请在此输入您要搜索的内容！")
    {
        alert("请输入关键词");
        return false;
    }
    return true;
}
function getpass() {
    var name = $("#username").val();
    if (name == "") {
        alert("请输入您申请本站用户时使用的邮箱!！");
        return;
    }
    $.ajax({
        url: '/Ajax/Common/CheckEmail2',
        data: {
            username: name
        },
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.status == 1) {
                $("#userid").val(data.id);
                $("#passform").attr("action", "/user/getpass").submit();
            } else {
                alert("未找到该邮箱，请确认邮箱的正确性后重新填写!");
                return;
            }
        }
    });
}

function checkpass() {
    var pass = $("#userpass").val();
    var pass2 = $("#userpass2").val();
    if (pass == "") {
        alert("重置密码不能为空！");
        return;
    }
    if (pass2 == "") {
        alert("重复密码不能为空！");
        return;
    }
    if (pass != pass2) {
        alert("两次输入的密码不一致！");
        return;
    } else {
        $("#paform").attr("action", "/user/getpassreturn").submit();
    }
}

//复制地址
function copyurl() {

    strHref = window.location.href;

    if (window.clipboardData) {
        if (window.clipboardData.setData("Text", strHref)) {
            alert("地址复制成功！");
        }
    }
    else {
        alert("您的浏览器不支持一键复制功能，请手动复制！");
    }
}

