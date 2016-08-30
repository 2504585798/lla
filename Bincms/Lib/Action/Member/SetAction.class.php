<?php
/**
@auth  top_iter  1149100178
@time   2016-5-16

*/

class SetAction extends CommonAction {
   //基本信息设置
    public function nickname() {
		
        if (IS_AJAX) {
			 $nickname = $this->_param('nickname','htmlspecialchars');
            
            if (empty($nickname)) {
				
                $this->ajaxReturn(array('msg'=>'昵称不能为空'),array('status'=>0));
            }
			    $introduc = $this->_param('introduc','htmlspecialchars');
			 if (empty($introduc)) {
				
                $this->ajaxReturn(array('msg'=>'介绍不能为空'),array('status'=>0));
            }
			
		
            $data = array(
			 'user_id' => $this->uid, 
			'nickname' => $nickname,
			 'introduc'=>$introduc,
			 'sex'=>$this->_param('sex','htmlspecialchars'),
			 'birthday'=>$this->_param('birthday','htmlspecialchars'),
			 'province'=>$this->_param('resideprovince','htmlspecialchars'),
			 'city'=>$this->_param('residecity','htmlspecialchars'),
			 'birthday_setting'=>$this->_param('birthday_setting','htmlspecialchars'),
			 'parts'=>$this->_param('parts','htmlspecialchars'),
			 'parts_setting'=>$this->_param('parts_setting','htmlspecialchars'),
			 'interest_setting'=>$this->_param('interest_setting','htmlspecialchars')
			);
            if (false !== D('Users')->save($data)) {
                 $this->ajaxReturn(array('msg'=>'用户设置成功','status'=>1,'url'=>'index'));
            }
			
			$this->ajaxReturn(array('msg'=>'用户设置失败','status'=>0,'url'=>'index'));
            
        } else {
            $this->display();
        }
    }
   //图像上传
    public function face() {
        if ($this->isPost()) {
            $face = $this->_post('face', 'htmlspecialchars');
			 $face1 = $this->_post('face1', 'htmlspecialchars');
			  $face2 = $this->_post('face2', 'htmlspecialchars');
            if (empty($face)) {
                $this->baoError('请上传头像');
            }
            if (!isImage($face)) {
                $this->baoError('头像格式不正确');
            }
            $data = array('user_id' => $this->uid, 'face' => $face,'face1' => $face1,'face2' => $face2);
            if (false !== D('Users')->save($data)) {
                $this->baoSuccess('上传头像成功！', U('set/face'));
            }
            $this->baoError('更新头像失败');
        } else {
            $this->display();
        }
    }
     //修改密码
    public function password() {
        if ($this->isPost()) {
            $oldpwd = $this->_post('oldpwd', 'htmlspecialchars');
            if (empty($oldpwd)) {
                $this->baoError('旧密码不能为空！');
            }
            $newpwd = $this->_post('newpwd', 'htmlspecialchars');
            if (empty($newpwd)) {
                $this->baoError('请输入新密码');
            }
            $pwd2 = $this->_post('pwd2', 'htmlspecialchars');
            if (empty($pwd2) || $newpwd != $pwd2) {
                $this->baoError('两次密码输入不一致！');
            }
            if ($this->member['password'] != md5($oldpwd)) {
                $this->baoError('原密码不正确');
            }
            if (D('Passport')->uppwd($this->member['account'], $oldpwd, $newpwd)) {
                session('uid', null);
                $this->baoSuccess('更改密码成功！', U('pchome/passport/login'));
            }
            $this->baoError('修改密码失败！');
        } else {
            $this->display();
        }
    }
	
	//认证中心
	 public function center() {
        if ($this->isPost()) {
            $oldpwd = $this->_post('oldpwd', 'htmlspecialchars');
            if (empty($oldpwd)) {
                $this->baoError('旧密码不能为空！');
            }
            $newpwd = $this->_post('newpwd', 'htmlspecialchars');
            if (empty($newpwd)) {
                $this->baoError('请输入新密码');
            }
            $pwd2 = $this->_post('pwd2', 'htmlspecialchars');
            if (empty($pwd2) || $newpwd != $pwd2) {
                $this->baoError('两次密码输入不一致！');
            }
            if ($this->member['password'] != md5($oldpwd)) {
                $this->baoError('原密码不正确');
            }
            if (D('Passport')->uppwd($this->member['account'], $oldpwd, $newpwd)) {
                session('uid', null);
                $this->baoSuccess('更改密码成功！', U('pchome/passport/login'));
            }
            $this->baoError('修改密码失败！');
        } else {
            $this->display();
        }
    }
    
	//修改手机认证
	 public function modphone() {
        if ($this->isPost()) {
            $oldpwd = $this->_post('oldpwd', 'htmlspecialchars');
            if (empty($oldpwd)) {
                $this->baoError('旧密码不能为空！');
            }
            $newpwd = $this->_post('newpwd', 'htmlspecialchars');
            if (empty($newpwd)) {
                $this->baoError('请输入新密码');
            }
            $pwd2 = $this->_post('pwd2', 'htmlspecialchars');
            if (empty($pwd2) || $newpwd != $pwd2) {
                $this->baoError('两次密码输入不一致！');
            }
            if ($this->member['password'] != md5($oldpwd)) {
                $this->baoError('原密码不正确');
            }
            if (D('Passport')->uppwd($this->member['account'], $oldpwd, $newpwd)) {
                session('uid', null);
                $this->baoSuccess('更改密码成功！', U('pchome/passport/login'));
            }
            $this->baoError('修改密码失败！');
        } else {
            $this->display();
        }
    }
	
	//修改邮箱认证
	 public function modemail() {
        if ($this->isPost()) {
            $oldpwd = $this->_post('oldpwd', 'htmlspecialchars');
            if (empty($oldpwd)) {
                $this->baoError('旧密码不能为空！');
            }
            $newpwd = $this->_post('newpwd', 'htmlspecialchars');
            if (empty($newpwd)) {
                $this->baoError('请输入新密码');
            }
            $pwd2 = $this->_post('pwd2', 'htmlspecialchars');
            if (empty($pwd2) || $newpwd != $pwd2) {
                $this->baoError('两次密码输入不一致！');
            }
            if ($this->member['password'] != md5($oldpwd)) {
                $this->baoError('原密码不正确');
            }
            if (D('Passport')->uppwd($this->member['account'], $oldpwd, $newpwd)) {
                session('uid', null);
                $this->baoSuccess('更改密码成功！', U('pchome/passport/login'));
            }
            $this->baoError('修改密码失败！');
        } else {
            $this->display();
        }
    }
    public function mobile() {
        if ($this->isPost()) {
            $mobile = $this->_post('mobile');
            $yzm = $this->_post('yzm');
            if (empty($mobile) || empty($yzm))
                $this->baoError('请填写正确的手机及手机收到的验证码！');
            $s_mobile = session('mobile');
            $s_code = session('code');
            if ($mobile != $s_mobile)
                $this->baoError('手机号码和收取验证码的手机号不一致！');
            if ($yzm != $s_code)
                $this->baoError('验证码不正确');
            $data = array(
                'user_id' => $this->uid,
                'mobile' => $mobile
            );
            if (D('Users')->save($data)) {
                D('Users')->integral($this->uid, 'mobile');
                D('Users')->prestige($this->uid, 'mobile');
                $this->baoSuccess('恭喜您通过手机认证', U('set/mobile'));
            }
            $this->baoError('更新数据失败！');
        } else {

            $this->display();
        }
    }

    public function mobile2() {
        if ($this->isPost()) {
            $mobile = $this->_post('mobile');
            $yzm = $this->_post('yzm');
            if (empty($mobile) || empty($yzm))
                $this->baoError('请填写正确的手机及手机收到的验证码！');
            $s_mobile = session('mobile');
            $s_code = session('code');
            if ($mobile != $s_mobile)
                $this->baoError('手机号码和收取验证码的手机号不一致！');
            if ($yzm != $s_code)
                $this->baoError('验证码不正确');
            $data = array(
                'user_id' => $this->uid,
                'mobile' => $mobile
            );
            if (D('Users')->save($data)) {
                $this->baoSuccess('恭喜您成功更换绑定手机号', U('set/mobile'));
            }
            $this->baoError('更新数据失败！');
        } else {

            $this->display();
        }
    }

    
    public function sendsms() {
        if (!$mobile = $this->_post('mobile')) {
            $this->ajaxReturn(array('status'=>'error','msg'=>'请输入正确的手机号码'));
        }
        if (!isMobile($mobile)) {
            $this->ajaxReturn(array('status'=>'error','msg'=>'请输入正确的手机号码'));
        }
        if ($user = D('Users')->where(array('mobile' => $mobile))->find()) {
            $this->ajaxReturn(array('status'=>'error','msg'=>'手机号码已经存在！'));
        }
        session('mobile', $mobile);
        $randstring = session('code');
        if (empty($randstring)) {
            $randstring = rand_string(6, 1);
            session('code', $randstring);
        }
        D('Sms')->sendSms('sms_code', $mobile, array('code' => $randstring));
        $this->ajaxReturn(array('status'=>'success','msg'=>'短信发送成功，请留意收到的短信','code'=>session('code')));
    }

    public function email() {

        $this->display();
    }
	public function email_name() {
		$email = $this->_post('email');
		$where['email'] = $email;
			$user = D('Users')->where($where)->find();
			if ($user) 
				echo 1;
	}
    public function sendemail() {
        $email = $this->_post('email');
        if (isEmail($email)) {
            $link = 'http://' . $_SERVER['HTTP_HOST'];
            $uid = $this->uid;
            $local = array(
                'email' => $email,
                'uid' => $uid,
                'time' => NOW_TIME,
                'sig' => md5($uid . $email . NOW_TIME . C('AUTH_KEY'))
            );
            $link .=U('public/email', $local);
            D('Email')->sendMail('email_rz', $email, $this->_CONFIG['site']['sitename'] . '邮件认证', array('link' => $link));
        }
    }
	
    
}
