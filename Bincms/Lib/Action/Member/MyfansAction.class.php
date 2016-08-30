<?php



class MyfansAction extends CommonAction {
   
   public function index() {
	  
        $fans = D('Fans');
        import('ORG.Util.Page');
		//int(1)
        $map = array('fanshost_id' => $this->uid,'closed'=>0);
        $count = $fans->where($map)->count();
        $Page = new Page($count, 10);
        $show = $Page->show();
        $list = $fans->where($map)->order('fid desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
		//dump( $list);
        $users_ids = array();
        foreach ($list as $k => $val) {
            $users_ids[$val['fans_id']] = $val['fans_id'];
        }
		//获取粉丝个人信息
        $this->assign('fans',D('Users')->itemsByIds($users_ids));
		//获取粉丝个人等级标志
        $this->assign('user_ranks',$m=D('Userrank')->fetchall());
		
        $this->assign('list', $list);
        $this->assign('page', $show);
        $this->display();
    }

    public function deletefavo($diary_id) {
        $diary_id = (int) $diary_id;
        if ($detial = D('diary')->find($diary_id)) {
            if ($detial['user_id'] == $this->uid) {
                D('diary')->delete($diary_id);
                $this->baoSuccess('取消关注成功!', U('diary/index'));
            }
        }
        $this->baoError('参数错误');
    }
    //给我的粉丝发消息
	public function sendmsg($fans_id){
		
		$msg=D('msg');
	    $fans_id=(int)$fans_id;
	   if($this->isPost()) {
		   
		     $data = $this->postCheck();
			//dump($data);
			
			 $data['fans_id'] =$fans_id;
			 $data['user_id'] =$this->uid;
			 $data['type'] =1;
             $data['create_time'] = NOW_TIME;
             $data['create_ip'] = get_client_ip();
            if ($msg->add($data)) {
               // D('Users')->prestige($this->uid, 'share');
                $this->baoSuccess('回复消息成功',U('myfans/index'));
		     }
		              $this->baoError('回复消息失败');
		 }
	
	    $fans=D('Users')->where(array('user_id'=>$fans_id))->find();	
		$this->assign('fans',$fans);
        import('ORG.Util.Page');
		//type 0表示发消息回复消息
        $map = array('fans_id' =>$fans_id,'user_id'=>$this->uid,'type'=>0);
	
        $count = $msg->where($map)->count();
        $Page = new Page($count, 16);
        $show = $Page->show();
        $list = $msg->where($map)->order('msg_id desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
		//发送消息时将未读变为已读的消息
		
      $list["reply"]=$msg->where(array('fans_id' =>$fans_id,'user_id'=>$this->uid,'type'=>1))->select();
		dump($list);
		
		 //将粉丝的未读消息更新为已读
		foreach($list  as $key=>$val){
			 $datas=array('is_read'=>1);
			$msg->where(array("msg_id"=>$list[$key][msg_id],"fans_id"=>$fans_id))->save($datas);
            }
		
		
		
		
	   $this->assign('fanslist',$list);
		$this->assign('page', $show);
	
	$this->display();
		
		
	}
	
	

		
		
		
	//回复消息
	  private function postCheck() {
        $data = $this->checkFields($this->_post('data', false), array('details'));
      
       
        $data['details'] = SecurityEditorHtml($data['details']);
        if (empty($data['details'])) {
            $this->baoError('回复内容不能为空');
        }
        if ($words = D('Sensitive')->checkWords($data['details'])) {
            $this->baoError('回复内容含有敏感词：' . $words);
        }
        return $data;
    }

    

	
	
	
	
	
    
}
