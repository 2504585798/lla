<?php



class MytopicAction extends CommonAction {
    //我参与的话题
   public function index() {
        $diary = D('diary');
        import('ORG.Util.Page');
        $map = array('user_id' => $this->uid);
        $count = $diary->where($map)->count();
        $Page = new Page($count, 16);
        $show = $Page->show();
        $list = $diary->where($map)->order('diary_id desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
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

	
	
	
	
	 //我发布的话题
	public function mypub() {
        $diary = D('diary');
        import('ORG.Util.Page');
        $map = array('user_id' => $this->uid);
        $count = $diary->where($map)->count();
        $Page = new Page($count, 16);
        $show = $Page->show();
        $list = $diary->where($map)->order('diary_id desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
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

    
}
