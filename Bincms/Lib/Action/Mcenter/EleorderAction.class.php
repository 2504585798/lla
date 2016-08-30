<?php
class EleorderAction extends CommonAction {

	public function index() {
		$aready = (int) $this->_param('aready');
		$this->assign('aready', $aready);
		$this->display();
	}

	public function loading() {
		$s = I('aready','','trim,intval');

		$Eleorder = D('Eleorder');
		import('ORG.Util.Page'); // 导入分页类
		$map = array('user_id' => $this->uid, 'closed' => 0); //这里只显示 实物
		
		if($s == 0 || $s == 1 || $s == 8){
			$map['status'] = $s;
		}

		if (($bg_date = $this->_param('bg_date', 'htmlspecialchars') ) && ($end_date = $this->_param('end_date', 'htmlspecialchars'))) {
			$bg_time = strtotime($bg_date);
			$end_time = strtotime($end_date);
			$map['create_time'] = array(array('ELT', $end_time), array('EGT', $bg_time));
			$this->assign('bg_date', $bg_date);
			$this->assign('end_date', $end_date);
		} else {
			if ($bg_date = $this->_param('bg_date', 'htmlspecialchars')) {
				$bg_time = strtotime($bg_date);
				$this->assign('bg_date', $bg_date);
				$map['create_time'] = array('EGT', $bg_time);
			}
			if ($end_date = $this->_param('end_date', 'htmlspecialchars')) {
				$end_time = strtotime($end_date);
				$this->assign('end_date', $end_date);
				$map['create_time'] = array('ELT', $end_time);
			}
		}
		if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
			$map['order_id'] = array('LIKE', '%' . $keyword . '%');
			$this->assign('keyword', $keyword);
		}
		if (isset($_GET['st']) || isset($_POST['st'])) {
			$st = (int) $this->_param('st');
			if ($st != 999) {
				$map['status'] = $st;
			}
			$this->assign('st', $st);
		} else {
			$this->assign('st', 999);
		}
		$count = $Eleorder->where($map)->count(); // 查询满足要求的总记录数 
		$Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
		$show = $Page->show(); // 分页显示输出
		$var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
		$p = $_GET[$var];
		if ($Page->totalPages < $p) {
			die('0');
		}
		$list = $Eleorder->where($map)->order(array('order_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
		$user_ids = $order_ids = $addr_ids = array();
		foreach ($list as $k => $val) {
			$order_ids[$val['order_id']] = $val['order_id'];
			$addr_ids[$val['addr_id']] = $val['addr_id'];
			$user_ids[$val['user_id']] = $val['user_id'];
		}
		if (!empty($order_ids)) {
			$products = D('Eleorderproduct')->where(array('order_id' => array('IN', $order_ids)))->select();
			$product_ids = $shop_ids = array();
			foreach ($products as $val) {
				$product_ids[$val['product_id']] = $val['product_id'];
				$shop_ids[$val['shop_id']] = $val['shop_id'];
			}
			$this->assign('products', $products);
			$this->assign('eleproducts', D('Eleproduct')->itemsByIds($product_ids));
			$this->assign('shops', D('Shop')->itemsByIds($shop_ids));
		}
		$this->assign('addrs', D('Useraddr')->itemsByIds($addr_ids));
		$this->assign('areas', D('Area')->fetchAll());
		$this->assign('business', D('Business')->fetchAll());
		$this->assign('users', D('Users')->itemsByIds($user_ids));
		$this->assign('cfg', D('Eleorder')->getCfg());
		$this->assign('list', $list); // 赋值数据集
		$this->assign('page', $show); // 赋值分页输出    

		
		$this->display();

		
	}
        
        public function detail($order_id){
            $order_id = (int) $order_id;
            if(empty($order_id) || !$detail = D('Eleorder')->find($order_id)){
                $this->error('该订单不存在');
            }
            if($detail['user_id'] != $this->uid){
                $this->error('请不要操作他人的订单');
            }
            $ele_products = D('Eleorderproduct')->where(array('order_id'=>$order_id))->select(); 
            $product_ids = array();
            foreach($ele_products as $k=>$val){
                $product_ids[$val['product_id']] = $val['product_id'];
            }
            if(!empty($product_ids)){
                $this->assign('products',D('Eleproduct')->itemsByIds($product_ids));
            }
            $this->assign('eleproducts',$ele_products);
            $this->assign('addr',D('Useraddr')->find($detail['addr_id']));
            $this->assign('cfg', D('Eleorder')->getCfg());
            $this->assign('detail',$detail);
            $this->display();
        }

        

        public function del(){
            
            $order_id = I('order_id',0,'trim,intval');
            $o = D('EleOrder');
            $f = $o -> where('order_id ='.$order_id) -> find();
            
            if(!$f){
                $this->error('错误！');
            }else{
               
                if ($f['user_id'] != $this->uid) {
                    $this->error('请不要操作他人的订单');
                }
                
                if ($detial['status'] != 0) {
                    $this->error('该订单暂时不能取消');
                }
                
                $r = $o -> where('order_id ='.$order_id) -> setField('closed',1);
                $this->success('取消订单成功！',U('eleorder/index'));
               
                
            }
  
            
        }
        
        
}
