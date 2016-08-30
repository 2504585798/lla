<?php



class MymsgAction extends CommonAction {

   public function index() {
        $msg = D('msg');
        import('ORG.Util.Page');
        $map = array('user_id' =>$this->uid,'is_first'=>1);
	
        $count = $msg->where($map)->count();
        $Page = new Page($count, 16);
        $show = $Page->show();
        $list = $msg->where($map)->order('msg_id desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $fans_ids = array();
		//所有用户首次发消息
        foreach ($list as $k => $val) {
            $fans_ids[$val['fans_id']] = $val['fans_id'];
			$list[$k]["create_time"]= formatTime( $val['create_time']);
			//查询粉丝未读消息总数数量
			  $msg_num=$msg->where(array('fans_id' =>$val['fans_id'],'is_read'=>0))->count();
			   $list[$k]["msg_num"]= $msg_num;
        }
		
		//dump($fans_ids);
		//dump(NOW_TIME-3600);
		//dump($list);
        $this->assign('fans', D('Users')->itemsByIds($fans_ids));
		//dump($v);
       // $this->assign('prices', D('Hospitaldetails')->itemsByIds($hospital_ids));
        $this->assign('list', $list);
        $this->assign('page', $show);
        $this->display();
    }

    public function deletefavo($msg_id) {
        $msg_id = (int) $msg_id;
        if ($detial = D('msg')->find($msg_id)) {
            if ($detial['user_id'] == $this->uid) {
                D('msg')->delete($msg_id);
                $this->baoSuccess('取消关注成功!', U('msg/index'));
            }
        }
        $this->baoError('参数错误');
    }

    
}
