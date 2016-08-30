$(function(){
	//fn_get_menu('ane');
	$("#mobileFormRegist")[0].reset();
	$("#loginName").val("");
	$("#password").val("");
});

function phoneTable(){
	$("#commonTable").hide();
	$("#phoneTable").show();
	$("#putong").css("background-color","white").css("color","gray")
	$("#shouji").css("background-color","#ed5736").css("color","white")
	$("#mobileFormRegist")[0].reset();
	
}
function commonTable(){
	$("#commonTable").show();
	$("#phoneTable").hide();
	
	$("#shouji").css("background-color","white").css("color","gray")
	$("#putong").css("background-color","#ed5736").css("color","white")
	$("#commonFormRegist")[0].reset();
	
	
	
}
//验证注册手机号码
var regPhoneIsok = false;
function ckeckRegPhone(){
	 var phone = $("#regPhone").val();
	 var chPhone = /^1[2-9]{1}[0-9]{9}$/;
	 if(!chPhone.test(phone)){
		 $("#msgRegPhone").html("请输入正确的手机号");
		 return false;
	 }else{
		 $.post("../user/checkPhone",{"phone":phone},function(rv){
			 if(rv==null){
				 $("#msgRegPhone").html("<img src='images/correct.png' />");
				 regPhoneIsok = true;
			 }else{
				 $("#msgRegPhone").html("手机已被注册");
				 regPhoneIsok = false;
			 }
		});
	 }
}

//点击获取验证码
var dx;
var isSend = false;
function clickPhoneCode(){
	var phone = $("#regPhone").val();
	if(regPhoneIsok==false){
		alert("该手机号码不正确或已经被注册");
		return;
	}
	var code = $("#regPhoneJavaCode").val();
	if(code==''){
	$("#msgRegPhoneJavaCode").html("请输入验证码");
		return;
	}
	$.ajax({  
		url:"../user/phoneCode",
		type:"post",
		data:{"code":code},
		dataType:"json",
		success:function(arr){ 
			if(arr=="0"){
				$("#msgRegPhoneJavaCode").html("<img src='images/correct.png' />");
				$("#regPhoneCodeBtn").attr("disabled","disabled");
				isSend = true;
				clearInterval(dx);
				var i = 60;
				dx = setInterval(function() {  
					if(i -- > 0) {  
						$("#regPhoneCodeBtn").val(i + "秒后重发"); 
					}else{
						$("#regPhoneCodeBtn").attr("disabled",false);
						$("#regPhoneCodeBtn").val("获取验证码");  
						reloadPhonecode();
						clearInterval(dx);
					}
				}, 1000);
				//return;
				$.post("../user/getMsg",{"phone":phone,"code":$("#regPhoneJavaCode").val()},function(rv){});
			}else{
				$("#msgRegPhoneJavaCode").html("验证码不正确");
				$("#regPhoneJavaCode").val("");
				$("#regPhoneJavaCode").focus();
				reloadPhonecode();
			}
		}            
	});
	
}

//验证短信码
function checkPhoneMessageCode(){
	var phoneCode = $("#regPhoneMessageCode").val();
	var chPhoneCode = /^\d{6}$/;
	if(phoneCode==''||!chPhoneCode.test(phoneCode)){
		$("#msgPhoneMessageCode").html("验证码必须为6位数字");
		return false;
	}else{
		$("#msgPhoneMessageCode").html("");
	}
}


//验证手机注册密码
function checkRegPhonePwd(){
	var pwd = $("#regPhonePwd").val();
	var chpwd = /^(?=.*\d)(?=.*[a-z]).{6,16}$/;
	if(pwd=='' || !chpwd.test(pwd)){
		$("#msgRegPhonePwd").html("密码强度不符合");
		return false;
	}else{
		$("#msgRegPhonePwd").html("<img src='images/correct.png' />");
	}
}

//验证手机注册确认密码
function checkRegPhoneRePwd(){
	var pwd = $("#regPhonePwd").val();
	var rePwd = $("#regPhoneRePwd").val();
	if(pwd!=rePwd ||pwd.length==0){
		$("#msgRegPhoneRePwd").html("两次密码输入不一致");
		return false;
	}else{
		$("#msgRegPhoneRePwd").html("<img src='images/correct.png' />");
	}
}

//点击更换手机注册验证码
function reloadPhonecode(){
    var verify=document.getElementById('imgPhoneJavaCode');
    verify.setAttribute('src','../static/createCode/makePhoneCertPic.jsp?it='+Math.random());
}

//手机图形验证码
var regPhoneJavaCodeIsok = false;
function checkRegPhoneJavaCode(){
	var code = $("#regPhoneJavaCode").val();
	if(code==''){
	$("#msgRegPhoneJavaCode").html("请输入验证码");
		return;
	}
	$.ajax({  
		url:"../user/phoneCode",
		type:"post",
		data:{"code":code},
		dataType:"json",
		success:function(arr){ 
			if(arr=="0"){
				regPhoneJavaCodeIsok =true;
				$("#msgRegPhoneJavaCode").html("<img src='images/correct.png' />");
			}else{
				regPhoneJavaCodeIsok =false;
				$("#msgRegPhoneJavaCode").html("验证码不正确");
				$("#regPhoneJavaCode").val("");
				$("#regPhoneJavaCode").focus();
				reloadPhonecode();
			}
		}            
	});
}

//点击注册
function clickPhoneReg(){
	if(regPhoneIsok==false){
		$("#msgRegPhone").html("请输入正确的手机号码");
		return;
	}
	if(ckeckRegPhone()==false){
		return;
	}
	if(isSend==false){
		alert("请先获取手机验证码");
		return;
	}
	if(checkPhoneMessageCode()==false){
		return;
	}
	if(checkRegPhonePwd()==false){
		return;
	}
	if(checkRegPhoneRePwd()==false){
		return;
	}
	$.ajax({  
		url:"../user/mobileRegist",
		type:"post",
		data:$("#mobileFormRegist").serialize(),
		dataType:"json",
		success:function(arr){ 
			if(arr=="1"){
				alert("恭喜你,注册成功！");
				location.href='../home/home.jsp'
			}else if(arr=='2'){
				alert("注册失败");
			}else if(arr=='3'){
				reloadPhonecode();
				alert("验证码与手机号不匹配");
				$("#msgRegPhoneJavaCode").html("");
				$("#regPhoneJavaCode").val("");
				$("#regPhoneMessageCode").val("");
				$("#regPhoneMessageCode").focus();
			}
		}            
	});
}