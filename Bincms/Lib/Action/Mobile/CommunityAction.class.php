<?php
class CommunityAction extends CommonAction {

	//小区主页
    public function index() {
		
		
        $community_id = cookie('community_id');
		
		
		
        if ($community_id && empty($_GET['change'])) {
            $this->detail($community_id);
            die;
        }
		
		
        $keyword = $this->_param('keyword', 'htmlspecialchars');
        $this->assign('keyword', $keyword);
		
		
		
		
		
        $areas = D('Area')->fetchAll();
        $this->assign('areas', $areas);
        $area = (int) $this->_param('area');
        $this->assign('area_id', $area);
        $this->assign('nextpage', LinkTo('community/loaddata', array('area' => $area, 't' => NOW_TIME,'change'=>'1', 'keyword' => $keyword, 'p' => '0000')));
        $this->display(); // 输出模板 
    }

	//小区加载
    public function loaddata() {
        $community = D('Community');
        import('ORG.Util.Page'); // 导入分页类
        //初始数据
		
        $map = array('closed' => 0,'city_id'=>$this->city_id);
		
		
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['name|addr'] = array('LIKE', '%' . $keyword . '%');
        }
		
		
		
		
        $area = (int) $this->_param('area');
        if ($area) {
            $map['area_id'] = $area;
        }
        $lat = addslashes(cookie('lat'));
        $lng = addslashes(cookie('lng'));
        if (empty($lat) || empty($lng)) {
            $lat = $this->city['lat'];
            $lng = $this->city['lng'];
        }
        $orderby = " (ABS(lng - '{$lng}') +  ABS(lat - '{$lat}') ) asc ";
        $count = $community->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 8); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出

        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
        $list = $community->order($orderby)->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();

        foreach ($list as $k => $val) {
            $list[$k]['d'] = getDistance($lat, $lng, $val['lat'], $val['lng']);
        }
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板   
    }

	//小区介绍
    public function detail($community_id) {
        $community_id = (int) $community_id;
        $community = D('Community');
        if (empty($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if (!$detail = $community->find($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
            die;
        }
        cookie('community_id', $community_id, 365 * 86400);
        $phone = D('Convenientphonemaps')->where(array('community_id' => $community_id,'audit' => 1))->limit(0, 6)->select();
        $phone_ids = array();
        foreach ($phone as $val) {
            $phone_ids[$val['phone_id']] = $val['phone_id'];
        }
        if (!empty($phone_ids)) {
            $this->assign('phones', D('Convenientphone')->itemsByIds($phone_ids));
        }
        $map = array('community_id' => $community_id, 'closed' => 0, 'audit' => 1);
        $news = D('Communitynews')->where($map)->limit(0, 6)->select();
		
		$isjoin = D('Communityusers')->where(array('community_id' => $community_id , user_id => $this->uid))->count();
		$map = array('closed' => 0, 'audit' => 1, 'city_id' => $this->city_id,'end_date' => array('EGT', TODAY));
        $tuan = D('Tuan')->where($map)->limit(10)->select();
        $keys  = array_keys($tuan);shuffle($keys);
        $this->assign('tuan',$tuan);
        $this->assign('keys', $keys);
        $cat = (int) $this->_param('cat');
        $this->assign('cat', $cat);
		$this->assign('isjoin', $isjoin);
        $this->assign('nextpage', LinkTo('community/loading', array('community_id' => $community_id, 't' => NOW_TIME, 'p' => '0000')));
        $this->assign('news', $news);
        $this->assign('detail', $detail);
        $this->display('detail');
    }

	//小区贴吧
    public function tieba() {
        $community_id = (int) $this->_param('community_id');
        $community = D('Community');
        if (empty($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if (!$detail = $community->find($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
            die;
        }
        $this->assign('nextpage', LinkTo('community/loadtieba', array('community_id' => $community_id, 't' => NOW_TIME, 'p' => '0000')));
		$this->assign('detail', $detail);
		$count['post'] = D('Communityposts') ->where($map)->count();
		$count['reply'] = D('Postreply')->where($map) ->count();
		$this->assign('count',$count);
        $this->display(); // 输出模板 
    }

	//贴吧帖子加载
    public function loadtieba(){
		$community_id = (int) $this->_param('community_id');
        $community = D('Community');
        if (empty($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if (!$detail = $community->find($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
            die;
        }
        $Tieba = D('Communityposts');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('community_id' => $community_id);
		
        $count = $Tieba->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
		
        $list = $Tieba->where($map)->order($orderby)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $ids = array();
        foreach ($list as $k => $val) {
            if ($val['user_id']) {
                $ids[$val['user_id']] = $val['user_id'];
            }
			$reply = D('Communityreplys')->where(array('post_id'=>$val['post_id']))->limit(0,5)->order('reply_id desc')->select();
			
			foreach ($reply as $i => $arr) {
				$reply[$i]['user'] =  D('Users')->find($arr[user_id]);
			}
			$list[$k]['reply'] = $reply;
        }

        $this->assign('users', D('Users')->itemsByIds($ids));
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
		$this->assign('linkArr', $linkArr);
        $this->display(); // 输出模板
    }
	
	
	//贴吧帖子加载-> 首页
    public function loading(){
		$community_id = (int) $this->_param('community_id');
        $community = D('Community');
        if (empty($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if (!$detail = $community->find($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
            die;
        }
        $Tieba = D('Communityposts');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('community_id' => $community_id);
		
        $count = $Tieba->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
		
        $list = $Tieba->where($map)->order($orderby)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $ids = array();
        foreach ($list as $k => $val) {
            if ($val['user_id']) {
                $ids[$val['user_id']] = $val['user_id'];
            }
			$reply = D('Communityreplys')->where(array('post_id'=>$val['post_id']))->limit(0,5)->order('reply_id desc')->select();
			
			foreach ($reply as $i => $arr) {
				$reply[$i]['user'] =  D('Users')->find($arr[user_id]);
			}
			$list[$k]['reply'] = $reply;
        }

        $this->assign('users', D('Users')->itemsByIds($ids));
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
		$this->assign('linkArr', $linkArr);
        $this->display(); // 输出模板
    }
	
	
	//贴吧帖子
    public function tie() {
        $post_id = (int) $this->_get('post_id');
        $tie = D('Communityposts')->find($post_id);
        $puser = D('Users')->find($tie['user_id']);
        $tie['nickname'] = $puser['nickname'];
        if (empty($tie)) {
            $this->error('您查看的内容不存在！');
            die;
        }
        $community = D('Community');
        if (empty($tie['community_id'])) {
            $this->error('没有该小区');
            die;
        }
        if (!$detail = $community->find($tie['community_id'])) {
            $this->error('没有该小区');
            die;
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
            die;
        }
        D('Communityposts')->updateCount($post_id, 'view_num');
		$this->assign('puser', $puser);
		$this->assign('cate', $cate);
        $this->assign('detail', $detail);
		$this->assign('tie', $tie);
        $this->assign('count',$count);
        $this->seodatas['title'] = $detail['title'];
		$this->assign('nextpage', LinkTo('community/loadreply', array('post_id' => $tie['post_id'], 't' => NOW_TIME, 'p' => '0000')));
        $this->display(); // 输出模板
    }
	
	//贴吧点赞
    public function zantie() {
		if (empty($this->uid)) {
			echo "-2";
			die;
		}
        $post_id = (int) $this->_get('post_id');
        $tie = D('Communityposts')->find($post_id);
        if (empty($tie)) {
             echo "-3";
        }

		D('Communityposts')->updateCount($post_id, 'zan_num');
		$num = intval($tie['zan_num']) + 1;
		echo $num;
		die;

    }
	//贴吧回复加载
	public function loadreply(){
		$post_id = (int) $this->_param('post_id');
        $Postreply = D('Communityreplys');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('post_id' => $post_id);
        $count = $Postreply->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
        $list = $Postreply->where($map)->order(array('reply_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $user_ids = array();
      //  $user_ids[$detail['user_id']] = $detail['user_id'];
        foreach ($list as $k => $val) {
            $user_ids[$val['user_id']] = $val['user_id'];
            $list[$k] = $val;
        }
        if (!empty($user_ids)) {
            $this->assign('users', D('Users')->itemsByIds($user_ids));
        }
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
		
		$this->display(); // 输出模板
	}
	
	//贴吧发帖
    public function post() {
		$community_id = (int) $this->_get('community_id');
		
        $community = D('Community');
        if (empty($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if (!$detail = $community->find($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
         } 
		   
		if (empty($this->uid)) {
			$this->error('登录后才能发帖！', U('passport/login'));
		}
		
		$count = D('Communityusers')->where(array('community_id' => $community_id , user_id => $this->uid))->count();
        if ( $count == 0) {
            $this->error('您还没有入驻了该小区！');
        }
		
        if ($this->isPost()) {
            $data = $this->postCheck();
            $obj = D('Communityposts');
            $data['create_time'] = time();
            $data['create_ip'] = get_client_ip();
			$data['username'] = $this->member['nickname'];
			$data['user_id'] = $this->uid;
			$data['community_id'] = $detail['community_id'];
			$last = $obj->add($data);
            if ($last) {
				$this->niuMsg('帖子发布成功！',U('community/tie', array('post_id' => $last)));
            }
            $this->niuMsg('发帖失败！');
        } else {
			$this->assign('detail', $detail);
            $this->display();
        }
    }
	
	//贴吧发帖检测
    private function postCheck() {
        $data = $this->checkFields($this->_post('data', false), array('title', 'details', 'photo'));
        $data['title'] = htmlspecialchars($data['title']);
        if (empty($data['title']) || $data['title']=='标题') {
            $this->niuMsg('标题不能为空');
        }
        $data['user_id'] = (int) $this->uid;
        $data['details'] = SecurityEditorHtml($data['details']);
		$data['gallery'] = $data['photo'];
        if (empty($data['details'])) {
            $this->niuMsg('详细内容不能为空');
        }
        if ($words = D('Sensitive')->checkWords($data['details'])) {
            $this->niuMsg('详细内容含有敏感词：' . $words);
        }
        return $data;
    }
	
	//贴吧回复
    public function reply($post_id) {
		if (empty($this->uid)) {
			$this->error('登录后才能发帖！', U('passport/login'));
		}
        $post_id = (int) $post_id;
        $tie = D('Communityposts')->find($post_id);
        if (empty($tie)) {
            $this->niuMsg('没有该帖子');
        }
        if (!$detail = D('Community')->find($tie['community_id'])) {
            $this->error('没有该小区');
            die;
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
         } 
		$count = D('Communityusers')->where(array('community_id' => $detail['community_id'] , user_id => $this->uid))->count();
        if ( $count == 0) {
            $this->error('您还没有入驻了该小区！');
        }
        if ($this->isPost()) {
            $data = $this->checkReply();
            $data['post_id'] = $post_id;
            $data['create_time'] = NOW_TIME;
            $data['create_ip'] = get_client_ip();
            $data['audit'] = 0;
            $obj = D('Communityreplys');
            if ($obj->add($data)) {
                D('Communityposts')->updateCount($post_id, 'reply_num');
				$this->niuMsg('帖子发布成功！',U('community/tie', array('post_id' => $post_id)));
            }
            $this->niuMsg('回帖失败！');
        } else {
            $this->assign('tie', $tie);
			$this->assign('detail', $detail);
            $this->display();
        }
    }
	
	//贴吧回复检测
    public function checkReply() {
        $data = $this->checkFields($this->_post('data', false), array('details','photo'));
        $data['user_id'] = (int) $this->uid;
		$data['gallery'] = $data['photo']; 
        $data['details'] = SecurityEditorHtml($data['details']);
        if (empty($data['details'])) {
           $this->niuMsg('内容不能为空！');
        }
        if ($words = D('Sensitive')->checkWords($data['details'])) {
           $this->niuMsg('详细内容含有敏感词：' . $words);
        }
        return $data;
    }
	
	
	//联系物业
    public function contact($community_id) {
        $community_id = (int) $community_id;
        $community = D('Community');
        if (empty($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if (!$detail = $community->find($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
            die;
        }
			$this->assign('detail', $detail);
            $this->display();
	}
	
	
	// 小区邻居
	public function neighbor($community_id) {
        $community_id = (int) $community_id;
        $community = D('Community');
        if (empty($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if (!$detail = $community->find($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
            die;
        }
		$this->assign('detail', $detail);
		$this->assign('nextpage', LinkTo('community/loadneighbor', array('community_id' => $detail['community_id'], 't' => NOW_TIME, 'p' => '0000')));
		$this->display();
	}

	
	
	//贴吧邻居加载
    public function loadneighbor(){
		$community_id = (int) $this->_param('community_id');
        $community = D('Community');
        if (empty($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if (!$detail = $community->find($community_id)) {
            $this->error('没有该小区');
            die;
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
            die;
        }
        $Users = D('Communityusers');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('community_id' => $community_id);
        $count = $Users->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
        $list = $Users->where($map)->order($orderby)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $ids = array();
        foreach ($list as $k => $val) {
            if ($val['user_id']) {
                $ids[$val['user_id']] = $val['user_id'];
            }
        }
        $this->assign('users', D('Users')->itemsByIds($ids));
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }
	
	
	//入驻小区
    public function join() {
        if (empty($this->uid)) {
           $this->error('登录后才能发帖！', U('passport/login'));
        }
		$community_id = (int) $this->_get('community_id');
        if (!$detail = D('Community')->find($community_id)) {
            $this->error('没有该小区');
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
        }
		$count = D('Communityusers')->where(array('community_id' => $community_id , 'user_id' => $this->uid))->count();
        if ( $count > 0) {
            $this->error('您已经入驻了该小区！');
        }
        $data = array(
            'community_id' => $community_id,
            'user_id' => $this->uid,
        );
        if (D('Communityusers')->add($data)) {
            $this->error('欢迎您加入'.$detail['name'].'小区！', U('community/detail', array('community_id' => $community_id)));
        }
        $this->error('加入'.$detail['name'].'失败！');
    }
	
	//退出小区
    public function out() {
        if (empty($this->uid)) {
             $this->error('登录后才能发帖！', U('passport/login'));
        }
		$community_id = (int) $this->_get('community_id');
        if (!$detail = D('Community')->find($community_id)) {
            $this->error('没有该小区');
        }
        if ($detail['closed']) {
            $this->error('该小区已经被删除');
        }
		$count = D('Communityusers')->where(array('community_id' => $community_id , user_id => $this->uid))->count();
        if ( $count == 0) {
            $this->error('您还没有入驻了该小区！');
        }
        $map = array(
            'community_id' => $community_id,
            'user_id' => $this->uid,
        );

        if (D('Communityusers')->where($map)->delete()) {
            $this->error('您已经退出'.$detail['name'].'小区！', U('community/detail', array('community_id' => $community_id)));
        }
        $this->error('退出'.$detail['name'].'失败！');
    }
	
	
	//物业反馈
    public function feedback($community_id) {
        if (empty($this->uid)) {
            $this->error('登录状态失效!', U('passport/login'));
        }
        $community_id = (int) $community_id;
        if (!$detail = D('Community')->find($community_id)) {
            $this->error('要反馈的小区不存在');
        }
        if (!empty($detail['closed'])) {
            $this->error('要反馈的小区不存在');
        }
        if ($this->isPost()) {
            $data = $this->checkFeed();
            $data['community_id'] = $community_id;
            $data['create_time'] = NOW_TIME;
            $data['create_ip'] = get_client_ip();
            $obj = D('Feedback');
            if ($obj->add($data)) {
                $this->niuMsg('反馈提交成功', U('community/detail', array('community_id' => $community_id)));
            }
            $this->niuMsg('操作失败！');
        } else {
            $this->assign('detail', $detail);
            $this->display();
        }
    }

	//物业检测
    public function checkFeed() {
        $data = $this->checkFields($this->_post('data', false), array('title', 'details'));
        $data['user_id'] = (int) $this->uid;
        $data['title'] = $data['title'];
        if (empty($data['title'])) {
            $this->niuMsg('标题不能为空');
        }
        $data['details'] = htmlspecialchars($data['details']);
        if (empty($data['details'])) {
            $this->niuMsg('反馈内容不能为空');
        }
        if ($words = D('Sensitive')->checkWords($data['details'])) {
            $this->niuMsg('反馈内容含有敏感词：' . $words);
        }
        return $data;
    }
	
	//物业通知
    public function newslist() {
        $community_id = (int) $this->_param('community_id');
        if (!$detail = D('Community')->find($community_id)) {
            $this->error('要反馈的小区不存在');
        }
        if (!empty($detail['closed'])) {
            $this->error('要反馈的小区不存在');
        }
        $this->assign('next', LinkTo('community/loadnews', array('t' => NOW_TIME, 'community_id' => $community_id, 'p' => '0000')));
		$this->assign('detail', $detail);
        $this->display(); // 输出模板
    }

	//物业通知加载
    public function loadnews() {
        $community_id = (int) $this->_param('community_id');
        $news = D('Communitynews');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0, 'audit' => 1);
        $map['community_id'] = $community_id;
        $count = $news->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 8); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出

        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
        $list = $news->order(array('news_id' => 'desc'))->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板   
    }

	//物业通知内容
    public function news() {
        $news_id = (int) $this->_param('news_id');
        if (!$news = D('Communitynews')->find($news_id)) {
            $this->error('没有该物业通知');
            die;
        }
        if ($news['closed']) {
            $this->error('该物业通知已经被删除');
            die;
        }
        if (!$news['audit']) {
            $this->error('该物业通知未通过审核');
            die;
        }
        D('Communitynews')->updateCount($news_id, 'views');
        $community_id = (int) $news['community_id'];
        if (!$detail = D('Community')->find($community_id)) {
            $this->error('要反馈的小区不存在');
        }
        if (!empty($detail['closed'])) {
            $this->error('要反馈的小区不存在');
        }
        $this->assign('detail', $detail);
		$this->assign('news', $news);
        $this->display();
    }

	//便民合作
    public function together($community_id=null) {
        if(!$community_id){
            $this->error('参数不正确！');
        }
        if (!$detail = D('Community')->find($community_id)) {
            $this->error('要反馈的小区不存在');
        }
        if (!empty($detail['closed'])) {
            $this->error('要反馈的小区不存在');
        }
		if($data=$this->_post('data',false)){
            $data['expiry_date'] = NOW_TIME;
            $data['orderby'] =  0;
            if(empty($data['name'])){
                $this->niuMsg('项目名称不能为空！');
            }
            if(empty($data['phone'])){
                $this->niuMsg('手机号码不能为空！');
            }
            if($phone_id=D('Convenientphone')->add($data)){
              if(D('Convenientphonemaps')->add(array('phone_id'=>$phone_id,'community_id'=>$community_id))){
                $this->niuMsg('您的申请提交成功,等待审核', U('community/detail',array('community_id'=>$community_id)));
              }else{
                $this->niuMsg('申请失败');
              }
            }else{
                $this->niuMsg('申请失败');
            }
        }else{
            $this->assign('detail',$detail);
            $this->display();    
        }
    }
	
	//附近服务
    public function near() {
        $keyword = $this->_param('keyword', 'htmlspecialchars');
        $this->assign('keyword', $keyword);
        $community_id = (int) $this->_param('community_id');
        if (!$detail = D('Community')->find($community_id)) {
            $this->error('要反馈的小区不存在');
        }
        if (!empty($detail['closed'])) {
            $this->error('要反馈的小区不存在');
        }

		$this->assign('keyword',$keyword);
		$this->assign('detail',$detail);
		$this->assign('nextpage', LinkTo('community/loadnear', array( 't' => NOW_TIME,'community_id'=> $community_id, 'keyword' => $keyword, 'p' => '0000')));
		$this->display();    
	}
	
	//附近服务加载
    public function loadnear() {
        $keyword = $this->_param('keyword', 'htmlspecialchars');
		$keyword = urldecode($keyword);
        $map['name|tag'] = array('LIKE',array('%'.$keyword.'%','%'.$keyword,$keyword.'%','OR'));
        $community_id = (int) $this->_param('community_id');
        if (!$detail = D('Community')->find($community_id)) {
            $this->error('要反馈的小区不存在');
        }
        if (!empty($detail['closed'])) {
            $this->error('要反馈的小区不存在');
        }
		$lat = $detail['lat'];
		$lng = $detail['lng'];
		import('ORG.Util.Page'); // 导入分页类
        $orderby = " (ABS(lng - '{$lng}') +  ABS(lat - '{$lat}') ) asc ";
        $count = D('Near')->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 8); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出

        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
        $list = D('Near')->order($orderby)->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();
		$this->assign('lat', $lat);
		$this->assign('lng', $lng);
		$this->assign('keyword', $keyword);
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板  
	}
	
	
}
