function lawyerEWM(zid, zurl) {
    
    var lawyerStr = document.getElementById("lawyer_" + zid);

    var isIE = document.all && window.external;
    var qr = qrcode("" || 3, "" || 'L');
    zurl = "http://app.maxlaw.cn/" + zurl;
    qr.addData(zurl);
    qr.make();
    if (isIE) {
        var _IE = (function () {
            var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
            while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
            return v > 4 ? v : false;
        }());
        if (_IE < 8) {
            var sh = qr.createTableTag(3, 3);
        } else {
            var sh = qr.createImgTag();
        }
    } else {
        var sh = qr.createImgTag();
    }
    sh = sh.replace("124", "100");
    sh = sh.replace("124", "100");
    sh = sh.replace("124", "100");
    lawyerStr.innerHTML = sh;

}

function lawyerEWM(zid, zurl, t) {
    var lawyerStr = document.getElementById("lawyer_" + t);

    var isIE = document.all && window.external;
    var qr = qrcode("" || 3, "" || 'L');
    zurl = "http://app.maxlaw.cn/" + zurl;
    qr.addData(zurl);
    qr.make();
    if (isIE) {
        var _IE = (function () {
            var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
            while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
            return v > 4 ? v : false;
        }());
        if (_IE < 8) {
            var sh = qr.createTableTag(3, 3);
        } else {
            var sh = qr.createImgTag();
        }
    } else {
        var sh = qr.createImgTag();
    }
    sh = sh.replace("124", "100");
    sh = sh.replace("124", "100");
    sh = sh.replace("124", "100");
    lawyerStr.innerHTML = sh;

}


//二级联动获取城市(option 值为字符串)
function getprovice(pid) {
    var areaid1 = $("#Areaid1");
    $.ajax({
        url: '/Ajax/Common/getprovice',
        data: { t: +new Date() },
        timeout: 10000,
        dataType: "json",
        success: function (data) {
            if (data.status == 1) {
                var r = data.ds;
                var html = "<option value=''>请选择省份</option>";
                for (var i = 0, len = r.length; i < len; i++) {
                    if (r[i].id == pid) {
                        html += "<option value=" + r[i].id + " selected>" + r[i].name + "</option>";
                    } else {
                        html += "<option value=" + r[i].id + ">" + r[i].name + "</option>";
                    }
                }
                areaid1.html(html);
            }
        }
    });
}

function getcity(pid, cid) {
    var areaid2 = $("#Areaid2");
    $.ajax({
        url: '/Ajax/Common/getcity',
        data: { t: +new Date(), pid: pid },
        timeout: 10000,
        dataType: "json",
        success: function (data) {
            if (data.status == 1) {
                var r = data.ds;
                if (r) {
                    var html = "<option value='0'>请选择城市</option>";
                    for (var i = 0, len = r.length; i < len; i++) {
                        html += "<option value=" + r[i].py_code + ">" + r[i].name + "</option>";
                    }
                    areaid2.html(html);
                }
            }
            else {
                areaid2.html("<option value='0'>请选择城市</option>");
            }
        }
    });
}

function getzone(cid, zid) {
    var areaid3 = $("#Areaid3");
    $.ajax({
        url: '/Ajax/Common/getzone',
        data: { t: +new Date(), cid: cid },
        timeout: 10000,
        dataType: "json",
        success: function (data) {
            areaid3.empty();
            if (data.status == 1) {
                var r = data.ds;
                if (r) {
                    var html = "<option value=''>请选择</option>";
                    for (var i = 0, len = r.length; i < len; i++) {
                        if (r[i].id == zid) {
                            html += "<option value=" + r[i].id + " selected>" + r[i].name + "</option>";

                        } else {
                            html += "<option value=" + r[i].id + ">" + r[i].name + "</option>";
                        }
                    }
                    areaid3.html(html);
                }
            }
            else {
                areaid3.html("<option value=''>请选择</option>");
            }
        }
    });
}

function GetNewClass1(curid) {
    var classid1 = $("#classid1");
    $.ajax({
        url: '/Ajax/Common/GetNewClass1',
        data: { t: +new Date() },
        timeout: 10000,
        dataType: "json",
        success: function (data) {
            if (data.status == 1) {
                var r = data.ds;
                var html = "<option value=''>请选择大类</option>";
                for (var i = 0, len = r.length; i < len; i++) {
                    if (r[i].id == curid) {
                       html += "<option value=" + r[i].id + " selected>" + r[i].ClassName + "</option>";
                    } else {
                       html += "<option value=" + r[i].id + ">" + r[i].ClassName + "</option>";
                    }
                }
                classid1.html(html);
            }
        }
    });
}

function GetNewClass12(classid1) {
    var classid2 = $("#classid2");
    $.ajax({
        url: '/Ajax/Common/GetNewClass2',
        data: { t: +new Date(), classid1: classid1 },
        timeout: 10000,
        dataType: "json",
        success: function (data) {
            if (data.status == 1) {
                var r = data.ds;
                if (r) {
                    var html = "";
                    for (var i = 0, len = r.length; i < len; i++) {
                        if (i == 0) {
                            html += "<option value=" + r[i].py_code + " selected>" + r[i].classname + "</option>";
                        } else {
                            html += "<option value=" + r[i].py_code + ">" + r[i].classname + "</option>";
                        }
                    }
                    classid2.html(html);
                }
            } else {
                classid2.html("<option value=''>请选择小类</option>");
            }
        }
    });
}

function zmm(zid) {
    otheDiv = document.getElementById("div_" + zid);
    if (otheDiv.style.display == "none") {
        otheDiv.style.display = "";
    } else {
        otheDiv.style.display = "none";
    }
}

function zmm2(zid, zurl) {
    
    otheMobile = document.getElementById("zapp_" + zid);
    var isIE = document.all && window.external;
    var qr = qrcode("" || 3, "" || 'L');
    zurl = "http://m.maxlaw.cn/ask/details/" + zurl;
    qr.addData(zurl);
    qr.make();
    if (isIE) {
        var _IE = (function () {
            var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
            while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
            return v > 4 ? v : false;
        }());
        if (_IE < 8) {
            var sh = qr.createTableTag();
        } else {
            var sh = qr.createImgTag();
        }
    } else {
        var sh = qr.createImgTag();
    }
    sh = sh.replace("124", "100");
    sh = sh.replace("124", "100");
    sh = sh.replace("124", "100");
    otheMobile.innerHTML = sh;

}

function zmm3(zid, zurl) {

    var lawyerStr = document.getElementById("lawyer_" + zid);

    var isIE = document.all && window.external;
    var qr = qrcode("" || 3, "" || 'L');
    zurl = "http://app.maxlaw.cn/" + zurl;
    qr.addData(zurl);
    qr.make();
    if (isIE) {
        var _IE = (function () {
            var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
            while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
            return v > 4 ? v : false;
        }());
        if (_IE < 8) {
            var sh = qr.createTableTag(3, 3);
        } else {
            var sh = qr.createImgTag();
        }
    } else {
        var sh = qr.createImgTag();
    }
    sh = sh.replace("124", "100");
    sh = sh.replace("124", "100");
    sh = sh.replace("124", "100");
    lawyerStr.innerHTML = sh;

}


function do_list_row_show(strid) {

    strid.getElementsByTagName('.tanchubox2').className = 'on';
    strid.getElementsByTagName('ul')[1].style.display = "block";
    strid.style.position = "relative";

}
function do_list_row_unshow(strid) {
    strid.getElementsByTagName('.tanchubox2').className = '';
    strid.getElementsByTagName('ul')[1].style.display = "";
    strid.style.position = "";
}
submenu = function (box, div) {
    var div_classname = document.getElementById(div).getElementsByTagName('ul')[0];
    if (div_classname.className == 'show') {
        with (document.getElementById(box).style) {
            height = 'auto'; display = 'block';
        }
        div_classname.className = 'less'; div_classname.innerHTML = '收缩';
    } else {
        with (document.getElementById(box).style) {
            height = '0'; display = 'none';
        }
        div_classname.className = 'show'; div_classname.innerHTML = '展开';
    }
}

function zmm4(zid, zurl) {

    var lawyerStr = document.getElementById("lawyer_" + zid);

    var isIE = document.all && window.external;
    var qr = qrcode("" || 3, "" || 'L');
    zurl = "http://app.maxlaw.cn/" + zurl;
    qr.addData(zurl);
    qr.make();
    if (isIE) {
        var _IE = (function () {
            var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
            while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
            return v > 4 ? v : false;
        }());
        if (_IE < 8) {
            var sh = qr.createTableTag(3, 3);
        } else {
            var sh = qr.createImgTag();
        }
    } else {
        var sh = qr.createImgTag();
    }
    sh = sh.replace("124", "88");
    sh = sh.replace("124", "88");
    sh = sh.replace("124", "88");
    lawyerStr.innerHTML = sh;

}

