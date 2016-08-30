<?php



class FavoritesAction extends CommonAction {
     //关注医生
   public function index() {
        $favorites = D('favorites');
        import('ORG.Util.Page');
        $map = array('user_id' => $this->uid);
        $count = $favorites->where($map)->count();
        $Page = new Page($count, 16);
        $show = $Page->show();
        $list = $favorites->where($map)->order('favorites_id desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $hospital_ids = array();
        foreach ($list as $k => $val) {
            $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
        }
        $this->assign('shops', D('Hospital')->itemsByIds($hospital_ids));
        $this->assign('prices', D('Hospitaldetails')->itemsByIds($hospital_ids));
        $this->assign('list', $list);
        $this->assign('page', $show);
        $this->display();
    }
	
	  //关注医院
	 public function favhospital() {
        $favorites = D('favorites');
        import('ORG.Util.Page');
        $map = array('user_id' => $this->uid);
        $count = $favorites->where($map)->count();
        $Page = new Page($count, 16);
        $show = $Page->show();
        $list = $favorites->where($map)->order('favorites_id desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $hospital_ids = array();
        foreach ($list as $k => $val) {
            $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
        }
        $this->assign('shops', D('Hospital')->itemsByIds($hospital_ids));
        $this->assign('prices', D('Hospitaldetails')->itemsByIds($hospital_ids));
        $this->assign('list', $list);
        $this->assign('page', $show);
        $this->display();
    }
	
	
	//关注活动
	 public function favactivity() {
        $favorites = D('favorites');
        import('ORG.Util.Page');
        $map = array('user_id' => $this->uid);
        $count = $favorites->where($map)->count();
        $Page = new Page($count, 16);
        $show = $Page->show();
        $list = $favorites->where($map)->order('favorites_id desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $hospital_ids = array();
        foreach ($list as $k => $val) {
            $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
        }
        $this->assign('shops', D('Hospital')->itemsByIds($hospital_ids));
        $this->assign('prices', D('Hospitaldetails')->itemsByIds($hospital_ids));
        $this->assign('list', $list);
        $this->assign('page', $show);
        $this->display();
    }
    //关注产品
   public function favproduct() {
        $favorites = D('favorites');
        import('ORG.Util.Page');
        $map = array('user_id' => $this->uid);
        $count = $favorites->where($map)->count();
        $Page = new Page($count, 16);
        $show = $Page->show();
        $list = $favorites->where($map)->order('favorites_id desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $hospital_ids = array();
        foreach ($list as $k => $val) {
            $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
        }
        $this->assign('shops', D('Hospital')->itemsByIds($hospital_ids));
        $this->assign('prices', D('Hospitaldetails')->itemsByIds($hospital_ids));
        $this->assign('list', $list);
        $this->assign('page', $show);
        $this->display();
    }
  
  
    public function deletefavo($favorites_id) {
        $favorites_id = (int) $favorites_id;
        if ($detial = D('favorites')->find($favorites_id)) {
            if ($detial['user_id'] == $this->uid) {
                D('favorites')->delete($favorites_id);
                $this->baoSuccess('取消关注成功!', U('favorites/index'));
            }
        }
        $this->baoError('参数错误');
    }

    
}
