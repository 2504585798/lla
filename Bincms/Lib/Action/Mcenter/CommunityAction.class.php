<?php

class CommunityAction extends CommonAction {
  public function index() {
        $this->display(); // 输出模板;
    }



    public function community_load() {
		
        $map = array('user_id' => $this->uid);
		$joined = D('Communityusers')->where($map)->order(array('join_id' => 'desc'))->limit(0,2)-> select();	
		foreach ($joined as $val) {
			$cmm_ids[$val['community_id']] = $val['community_id'];
		}
		$this->assign('list', D('Community')->itemsByIds($cmm_ids));		
        $this->display();
    }


	public function tongzhi(){
        
         $this->display(); // 输出模板;
    }
	
		public function tongzhi_load() {
		$community_id = (int) $this->_param('community_id');
		$communitynews = D('Communitynews');
        $maps['community_id']  = array('in',$cmm_ids);
		$news = $communitynews->where($maps)->order(array('news_id' => 'desc'))->limit(0,10)->select();
		$this->assign('news', $news);
        $this->display();
    }
   
}