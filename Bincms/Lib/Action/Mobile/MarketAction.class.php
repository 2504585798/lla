<?php
class MarketAction extends CommonAction {

    public function index() {
        $order = (int) $this->_param('order');
        $this->assign('order', $order);
        $keyword = $this->_param('keyword', 'htmlspecialchars');
        $this->assign('keyword', $keyword);
        $areas = D('Area')->fetchAll();
        $area = (int) $this->_param('area');
        $this->assign('area_id', $area);
        $biz = D('Business')->fetchAll();
        $business = (int) $this->_param('business');
        $this->assign('business_id', $business);
        $this->assign('areas', $areas);
        $this->assign('biz', $biz);
        $this->assign('nextpage', LinkTo('market/loaddata', array('area' => $area, 'business' => $business, 'order' => $order, 't' => NOW_TIME, 'keyword' => $keyword, 'p' => '0000')));
        $this->display(); // 输出模板   
    }

    public function loaddata() {

        $market = D('Market');
        import('ORG.Util.Page'); // 导入分页类
        //初始数据
        $map = array('closed' => 0);
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['market_name'] = array('LIKE', '%' . $keyword . '%');
        }
        $area = (int) $this->_param('area');
        if ($area) {
            $map['area_id'] = $area;
        }
        $business = (int) $this->_param('business');
        if ($business) {
            $map['business_id'] = $business;
        }
        $order = (int) $this->_param('order');
        $lat = addslashes(cookie('lat'));
        $lng = addslashes(cookie('lng'));
        if (empty($lat) || empty($lng)) {
            $lat = $this->_CONFIG['site']['lat'];
            $lng = $this->_CONFIG['site']['lng'];
        }
        switch ($order) {
            case 2:
                $orderby = array('orderby' => 'asc');
                break;
            default:
                $orderby = " (ABS(lng - '{$lng}') +  ABS(lat - '{$lat}') ) asc ";

                break;
        }

        $count = $market->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 8); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出

        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
        $list = $market->order($orderby)->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();

        foreach ($list as $k => $val) {
            $list[$k]['d'] = getDistance($lat, $lng, $val['lat'], $val['lng']);
        }
        $market_ids = array();
        foreach ($list as $key => $v) {
            $market_ids[$v['market_id']] = $v['market_id'];
        }
        $marketdetails = D('Marketdetails')->itemsByIds($market_ids);
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板   
    }

    public function detail() {

        $market_id = (int) $this->_get('market_id');
        $market = D('Market');
        if (!$detail = $market->find($market_id)) {
            $this->error('没有该商场');
            die;
        }
        if ($detail['closed']) {
            $this->error('该商场已经被删除');
            die;
        }
        $lat = addslashes(cookie('lat'));
        $lng = addslashes(cookie('lng'));
        if (empty($lat) || empty($lng)) {
            $lat = $this->_CONFIG['site']['lat'];
            $lng = $this->_CONFIG['site']['lng'];
        }
        $orderby = " (ABS(lng - '{$lng}') +  ABS(lat - '{$lat}') ) asc ";
        $map = array('closed' => 0, 'market_id' => array('NEQ', $market_id));
        $markets = $market->where($map)->order($orderby)->limit(0, 4)->select();
        foreach ($markets as $k => $val) {
            $markets[$k]['d'] = getDistance($lat, $lng, $val['lat'], $val['lng']);
        }
        $huodong = D('Marketactivity')->where(array('market_id' => $market_id, 'closed' => 0))->order(array('id' => 'desc'))->limit(0, 4)->select();

        $marketpic = D('Marketpic')->where(array('market_id' => $market_id))->order('pic_id desc')->select();

        $this->assign('marketpic', $marketpic);
        $this->assign('markets', $markets);
        $this->assign('huodong', $huodong);
        $this->assign('detail', $detail);
        $this->assign('ex', D('Marketdetails')->find($market_id));
		$this->assign('nextpage', LinkTo('market/loadshop', array('market_id' => $market_id, 'p' => '0000')));
        $this->display();
    }
	
	public function loadshop() {
		
        $lat = addslashes(cookie('lat'));
        $lng = addslashes(cookie('lng'));
        if (empty($lat) || empty($lng)) {
            $lat = $this->_CONFIG['site']['lat'];
            $lng = $this->_CONFIG['site']['lng'];
        }
		
        $market_id = (int) $this->_get('market_id');
        $market = D('Market');
        if (!$detail = $market->find($market_id)) {
            $this->error('没有该商场');
            die;
        }
        if ($detail['closed']) {
            $this->error('该商场已经被删除');
            die;
        }
		import('ORG.Util.Page'); // 导入分页类
		
        $count = $market->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 8); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出

        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
		
        $list = D('Marketenter')->where(array('market_id'=>$market_id))->limit($Page->firstRow . ',' . $Page->listRows)->select();
	
        foreach ($list as $k => $val) {
            $list[$k]['shop'] = D('shop')->find($val['shop_id']);
			$list[$k]['shop']['d'] = getDistance($lat, $lng, $list[$k]['shop']['lat'], $list[$k]['shop']['lng']);
        }
	
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
		$this->display();
	}
	

    public function favorites() {
        if (empty($this->uid)) {
            header("Location:" . U('passport/login'));
            die;
        }
        $market_id = (int) $this->_get('market_id');
        if (!$detail = D('Market')->find($market_id)) {
            $this->error('没有该商场');
        }
        if ($detail['closed']) {
            $this->error('该商场已经被删除');
        }
        if (D('Marketfavorites')->check($market_id, $this->uid)) {
            $this->error('您已经收藏过了！');
        }
        $data = array(
            'market_id' => $market_id,
            'user_id' => $this->uid,
            'create_time' => NOW_TIME,
            'create_ip' => get_client_ip()
        );
        if (D('Marketfavorites')->add($data)) {
            $this->success('恭喜您收藏成功！', U('market/detail', array('market_id' => $market_id)));
        }
        $this->error('收藏失败！');
    }

    public function gps($market_id){
        $market_id = (int)$market_id;
        if(empty($market_id)){
            $this->error('该卖场不存在');
        }
        $market = D('Market')->find($market_id);
        
        $this->assign('market',$market);
        $this->display();
    }
    //点评
    public function dianping() {
        $shop_id = (int) $this->_get('shop_id');
        if (!$detail = D('Shop')->find($shop_id)) {
            $this->error('没有该商家');
            die;
        }
        if ($detail['closed']) {
            $this->error('该商家已经被删除');
            die;
        }
        $this->assign('detail', $detail);
        $this->display();
    }

    public function dianpingloading() {
        $shop_id = (int) $this->_get('shop_id');
        if (!$detail = D('Shop')->find($shop_id)) {
            die('0');
        }
        if ($detail['closed']) {
            die('0');
        }
        $Shopdianping = D('Shopdianping');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0, 'shop_id' => $shop_id, 'show_date' => array('ELT', TODAY));
        $count = $Shopdianping->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 1); // 实例化分页类 传入总记录数和每页显示的记录数

        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }

        $show = $Page->show(); // 分页显示输出
        $list = $Shopdianping->where($map)->order(array('dianping_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $user_ids = $dianping_ids = array();
        foreach ($list as $k => $val) {
            $list[$k] = $val;
            $user_ids[$val['user_id']] = $val['user_id'];
            $dianping_ids[$val['dianping_id']] = $val['dianping_id'];
        }
        if (!empty($user_ids)) {
            $this->assign('users', D('Users')->itemsByIds($user_ids));
        }
        if (!empty($dianping_ids)) {
            $this->assign('pics', D('Shopdianpingpics')->where(array('dianping_id' => array('IN', $dianping_ids)))->select());
        }
        $this->assign('totalnum', $count);
        $this->assign('list', $list); // 赋值数据集
        $this->assign('detail', $detail);
        $this->display();
    }

    public function event() {

        $this->display();
    }

    public function eventdetail() {//活动详情
        $id = (int) $this->_get('id');
        $marketactivity = D('Marketactivity');
        if (!$detail = $marketactivity->find($id)) {
            $this->error('没有该活动');
            die;
        }
        if ($detail['closed']) {
            $this->error('该活动已经被删除');
            die;
        }
		$details = D('Market')->find($detail['market_id']);
        $this->assign('detail', $detail);
        $this->assign('details',$details);
		$seo_title = $detail['title'];
		$this->assign('seo_title',$seo_title);
        $marketactivity->updateCount($id, 'views');
        $this->display();
    }

}
