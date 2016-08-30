<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class UsercashAction extends CommonAction {

    public function index() {
        $Userscash = D('Userscash');
        import('ORG.Util.Page'); // 导入分页类
        $map = array();
        if ($account = $this->_param('account', 'htmlspecialchars')) {
            $map['account'] = array('LIKE', '%' . $account . '%');
            $this->assign('account', $account);
        }
        $count = $Userscash->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Userscash->where($map)->order(array('cash_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $ids = array();
        foreach ($list as $row) {
            $ids[] = $row['user_id'];
        }
        $Usersex = D('Usersex');
        $map = array();
        $map['user_id'] = array('in', $ids);
        $ex = $Usersex->where($map)->select();
        $tmp = array();
        foreach ($ex as $row) {
            $tmp[$row['user_id']] = $row;
        }
        foreach ($list as $key => $row) {
            $list[$key]['bank_name'] =  empty($list[$key]['bank_name']) ? $tmp[$row['user_id']]['bank_name'] :$list[$key]['bank_name'];
            $list[$key]['bank_num'] =  empty($list[$key]['bank_num']) ? $tmp[$row['user_id']]['bank_num'] :$list[$key]['bank_num'];
            $list[$key]['bank_branch'] =  empty($list[$key]['bank_branch']) ? $tmp[$row['user_id']]['bank_branch'] :$list[$key]['bank_branch'];
            $list[$key]['bank_realname'] =  empty($list[$key]['bank_realname']) ? $tmp[$row['user_id']]['bank_realname'] :$list[$key]['bank_realname'];
        }
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function audit($cash_id = 0, $status = 0) {
        if (!$status)
            $this->baoError('参数错误');
        $Userscash = D('Userscash');
        if (is_numeric($cash_id) && ($cash_id = (int) $cash_id)) {
            $data = $Userscash->find($cash_id);
            if ($data['status'] == 0) {
                $arr = array();
                $arr['cash_id'] = $cash_id;
                $arr['status'] = $status;
                $Userscash->save($arr);

                //微信通知
                $this->remainMoneyNotify($data['user_id'],$data['money']);
                $this->baoSuccess('操作成功！', U('usercash/index'));
            }
            else
            {
                $this->baoError('请不要重复操作');
            }
        } else {
            $cash_id = $this->_post('cash_id', FALSE);
            if (!is_array($cash_id)) {
                $this->baoError('请选择要审核的提现');
            }
            foreach ($cash_id as $id) {
                $data = $Userscash->find($id);
                if ($data['status'] > 0) {
                    continue;
                }
                $arr = array();
                $arr['cash_id'] = $id;
                $arr['status'] = $status;
                $Userscash->save($arr);
                //微信通知
                $this->remainMoneyNotify($data['user_id'],$data['money']);
                //如果是拒绝则返还钱
            }
            $this->baoSuccess('操作成功！', U('usercash/index'));
        }
    }


    public function jujue() {
        $status = (int) $_POST['status'];
        $cash_id = (int)$_POST['cash_id'];
        $value = $this->_param('value', 'htmlspecialchars');
        if(empty($value)){
            $this->ajaxReturn(array('status'=>'error','msg'=>'拒绝理由请填写'));
		}
        if(empty($cash_id)|| !$detail = D('Userscash')->find($cash_id)){
            $this->ajaxReturn(array('status'=>'error','msg'=>'参数错误'));
        }
        $money = $detail['money'];
        if($status == 2){
            D('Users')->addMoney($data['user_id'], $money, '提现拒绝，退款');
            D('Userscash')->save(array('cash_id'=>$cash_id,'status'=>$status,'reason'=>$value));
			//微信通知
                $this->remainMoneyNotify($data['user_id'],$data['money']);
            $this->ajaxReturn(array('status'=>'success','msg'=>'拒绝退款操作成功','url'=>U('usercash/index')));
        }
    }
    

    //微信余额通知
    private function remainMoneyNotify($uid,$money)
    {
        //余额变动,微信通知
        $openid    = D('Connect')->getFieldByUid($uid,'open_id'); 
        $order_id  = $order['order_id'];
        $uname = D('User')->getFieldByUser_id($uid,'nickname');
        $words     = "您申请的提现金额{$money}请求已通过,请注意您的账户变动！";
        if($openid){
            $template_id = D('Weixintmpl')->getFieldByTmpl_id(4,'template_id');//余额变动模板
            $tmpl_data =  array(
                'touser'      => $openid,//用户微信openid
                'url'         => 'http://'.$_SERVER['HTTP_HOST'].'/mcenter',//相对应的订单详情页地址
                'template_id' => $template_id,
                'topcolor'    => '#2FBDAA',
                'data'        => array(
                    'first'=>array('value'=>'尊敬的用户,{$uname},您的账户余额有变动！' ,'color'=>'#2FBDAA'),   
                    'keynote1'=>array('value'=> $user_name, 'color'=>'#2FBDAA'),//用户名
                    'keynote2'=>array('value'=> $words, 'color'=>'#2FBDAA'),//详情
                    'remark'  =>array('value'=>'详情请登录您的用户中心了解', 'color'=>'#2FBDAA')
                )
            );
            D('Weixin')->tmplmesg($tmpl_data);
        }
    }


    /*
    public function delete($cash_id = 0)
    {
        $Userscash = D('Userscash');
        if (is_numeric($cash_id) && ($cash_id = (int) $cash_id)) 
        {
            $Userscash->delete($cash_id);
            $this->baoSuccess('删除成功！', U('usercash/index'));
        } 
        else 
        {
            $cash_id = $this->_post('cash_id', FALSE);
            if ( ! is_array($cash_id)) 
            {
                $this->baoError('请选择要删除的提现');
            }
            foreach ($cash_id as $id)
            $Userscash->delete($id);
            $this->baoSuccess('删除成功！', U('usercash/index'));
        }
        if(empty($cash_id)|| !$detail = D('Userscash')->find($cash_id)){
            $this->ajaxReturn(array('status'=>'error','msg'=>'参数错误'));
        }
        $money = $detail['money'];
        if($status == 2){
            D('Users')->addMoney($data['user_id'], $money, '提现拒绝，退款');
            D('Userscash')->save(array('cash_id'=>$cash_id,'status'=>$status,'reason'=>$value));
            $this->ajaxReturn(array('status'=>'success','msg'=>'拒绝退款操作成功','url'=>U('usercash/index')));
        }
    }

    /*
      public function delete($cash_id = 0)
      {
      $Userscash = D('Userscash');
      if (is_numeric($cash_id) && ($cash_id = (int) $cash_id))
      {
      $Userscash->delete($cash_id);
      $this->baoSuccess('删除成功！', U('usercash/index'));
      }
      else
      {
      $cash_id = $this->_post('cash_id', FALSE);
      if ( ! is_array($cash_id))
      {
      $this->baoError('请选择要删除的提现');
      }
      foreach ($cash_id as $id)
      $Userscash->delete($id);
      $this->baoSuccess('删除成功！', U('usercash/index'));
      }
      }
     * 
     */
}
