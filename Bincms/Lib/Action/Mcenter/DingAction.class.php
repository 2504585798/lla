<?php

class DingAction extends CommonAction {

    public function index() {
		$aready = $this->_get('aready');
		if(!$aready){
			$aready = 999;
		}
		$this->assign('aready', $aready);
        $this->display();
    }

	public function loaddata()
	{
		$dingorder = D('Shopdingorder');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('user_id' => $this->uid);
        $count = $dingorder->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count,10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
		$var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
		$p = $_GET[$var];
		if ($Page->totalPages < $p) {
			die('0');
		}
		
		if(intval($this->_get('status')) != 999 ){
			$map['status'] = $this->_get('status');
		}
		if(intval($this->_get('status')) == '-2' ){
			$map['status'] = 0;
		}
		
        $list = $dingorder->where($map)->order(array('order_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $user_ids = $order_ids  = $shops_ids = array();
        foreach ($list as $k => $val) {
            $order_ids[$val['order_no']] = $val['order_no'];
            $shops_ids[$val['shop_id']] = $val['shop_id'];
        }
        if (!empty($shops_ids)) {
            $this->assign('shop_s', D('Shop')->itemsByIds($shops_ids));
        }
        if (!empty($order_ids)) {
            $yuyue = D('Shopdingyuyue')->where(array('order_no' => array('IN', $order_ids)))->select();
            $shop_ids = array();
            foreach ($yuyue as $val) {
                $shop_ids[$val['shop_id']] = $val['shop_id'];
				$yuyues[$val['ding_id']] = $val;
            }
			$yuyue_d = $dingorder->get_d($yuyues);
            $this->assign('yuyue', $yuyue_d);
            $this->assign('shops', D('Shop')->itemsByIds($shop_ids));
        }
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display();
	}

	public function detail($order_id)
	{
		$dingorder = D('Shopdingorder');
		$dingyuyue = D('Shopdingyuyue');
		$dingmenu = D('Shopdingmenu');
		if(!$order = $dingorder->where('order_id = '.$order_id)->find()){
			$this->error('该订单不存在');
		}else if(!$yuyue = $dingyuyue->where('ding_id = '.$order['ding_id'])->find()){
			$this->error('该订单不存在');
		}else if($yuyue['user_id'] != $this->uid){
			$this->error('非法操作');
		}else{
			$arr = $dingorder->get_detail($yuyue['shop_id'],$order,$yuyue);
			$menu = $dingmenu->shop_menu($yuyue['shop_id']);
			$this->assign('yuyue', $yuyue);
			$this->assign('order', $order);
			$this->assign('order_id', $order_id);
			$this->assign('arr', $arr);
			$this->assign('menu', $menu);
			$this->display();
		}
	}
}
