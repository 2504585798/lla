
//记录密码错误次数
var errorCount = 0;

//点击更换登录验证码
function reloadLogincode(){
    var verify=document.getElementById('imgLoginJavaCode');
    verify.setAttribute('src','../static/createCode/makeLoginCertPic.jsp?it='+Math.random());
}

//用户登录
function login(){
	if(checkLoginName()==false){
		return;
	}
	if(checkPassword()==false){
		return;
	}
	if(errorCount>=2){
		$("#loginyzm").css("display","block");
		if(checkLoginJavaCode()==false ||loginJavaCodeIsok==false){
			return;
		}
	}
	$.ajax({  
		url:"../user/login",
		type:"post",
		data:$("#loginForm").serialize(),
		dataType:"json",
		success:function(arr){ 
			if(arr=="1"){
				location.href='../home/home.jsp'
			}else if(arr=='2'){
				alert("用户名或密码输入不正确");
				errorCount++;
				$("#password").val("");
				reloadLogincode();
				$("#msgLoginJavaCode").html("");
				
			}
		}            
	});
	
}

//非空验证用户名
function checkLoginName(){
	var name = $("#loginName").val();
	if(name.length<4){
		$("#msgLoginNameError").html("用户名为4-16位");
		return false;
	}else{
		$("#msgLoginNameError").html("");
	}
}

//非空验证密码
function checkPassword(){
	var password = $("#password").val();
	if(password.length==0){
		$("#msgLoginPwdError").html("请输入密码");
		return false;
	}else{
		$("#msgLoginPwdError").html("");
	}
}


//验证登录时java生成的验证码
var loginJavaCodeIsok = false;
function checkLoginJavaCode(){
	var code = $("#loginJavaCode").val();
	if(code.length==0){
	$("#msgLoginJavaCode").html("请输入验证码");
		return false;
	}
	$.ajax({  
		url:"../user/loginCode",
		type:"post",
		data:{"code":code},
		dataType:"json",
		success:function(arr){ 
			if(arr=="0"){
				loginJavaCodeIsok =true;
				$("#msgLoginJavaCode").html("<img src='images/correct.png' />");
			}else{
				loginJavaCodeIsok =false;
				$("#msgLoginJavaCode").html("验证码不正确");
				reloadLogincode();
		
			}
		}            
	});
}