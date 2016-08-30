<?php

/*
 * 软件为合肥生活宝网络公司出品，未经授权许可不得使用！
 * 作者：baocms团队
 * 84922.com
 * 邮件: youge@baocms.com  QQ 800026911
 */

class MartAction extends CommonAction {

    public function _initialize() {
        parent::_initialize();
        $goods = session('goods');
        $this->assign('cartnum',(int)array_sum($goods));
        $mcates = $this->_CONFIG['mall'];
        $cates = array();
        for ($i = 1; $i <= count($mcates); $i+=1) {
            if ($i % 2 == 0) {
                $ii = $i / 2;
                if (!empty($mcates['ming' . $ii]) && !empty($mcates['dian' . $ii])) {
                    $cates[$mcates['dian' . $ii]] = array('cate_name' => $mcates['ming' . $ii], 'cate_id' => $mcates['dian' . $ii]);
                }
            }
        }
        $this->assign('cates', $cates);
    }

    public function index() {
        $cat = (int) $this->_param('cat');
        $this->assign('cat',$cat);
        $this->assign('nextpage', LinkTo('mart/loaddata', array('t' => NOW_TIME,'cat'=>$cat, 'p' => '0000')));
        $this->display(); // 输出模板   
    }
	
//有问题需要协助解决下
    public function loaddata() {
        $weidian = D('WeidianDetails');
        import('ORG.Util.Page'); // 导入分页类
        //初始数据
        $map = array('audit' => 1,'city_id'=>$this->city_id);
        $cat = (int) $this->_param('cat');
        if($cat){
            $map['cate_id'] = $cat;
        }
        $lat = addslashes(cookie('lat'));
        $lng = addslashes(cookie('lng'));
        if (empty($lat) || empty($lng)) {
            $lat = $this->city['lat'];
            $lng = $this->city['lng'];
        }
        $count = $weidian->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 8); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出

        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
        $list = $weidian->order("(ABS(lng - '{$lng}') +  ABS(lat - '{$lat}') ) asc")->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        foreach ($list as $k => $val) {
            $list[$k]['d'] = getDistance($lat, $lng, $val['lat'], $val['lng']);
        }
        $shop_ids = array();
        foreach ($list as $key => $v) {
            $shop_ids[$v['shop_id']] = $v['shop_id'];
        }
        $shopdetails = D('Shopdetails')->itemsByIds($shop_ids);
        foreach ($list as $k => $val) {
            $list[$k]['price'] = $shopdetails[$val['shop_id']]['price'];
        }
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板   
    }

    public function lists() { //进入微店
        $id = (int) $this->_get('id');
        if (!$detail = D('WeidianDetails')->find($id)) {
            $this->error('没有该微店商家');
            die;
        }
        if ($detail['audit'] != 1) {
            $this->error('没有该微店商家');
            die;
        }

		$autocates = D('Goodsshopcate')->order(array('orderby' => 'asc'))->where(array('shop_id' => $detail['shop_id']))->select();
        $this->assign('autocates', $autocates);

        $cate_id = (int) $this->_param('cate_id');
        $this->assign('cate_id',$cate_id);
        $this->assign('next', LinkTo('mart/load', array('cate_id' => $cate_id, 'id' => $id, 't' => NOW_TIME, 'p' => '0000')));
        $this->assign('detail', $detail);
        $this->display(); // 输出模板   
    }

    public function load() {
        $id = (int) $this->_param('id');
        $wd = D('WeidianDetails')->find($id);
		
		//$autocates = D('Goodsshopcate')->order(array('orderby' => 'asc'))->where(array('shop_id' => $shop_id))->select();

		
		
       $autocates = D('Goodsshopcate')->order(array('orderby' => 'asc'))->where(array('shop_id' => $wd['shop_id']))->select();
        $this->assign('autocates', $autocates);
	  // p($autocates);
        $Goods = D('Goods');
        import('ORG.Util.Page'); // 导入分页类
        //初始数据
        $map = array('closed' => 0, 'audit' => 1,'city_id'=>$this->city_id, 'shop_id' => $wd['shop_id'], 'end_date' => array('EGT', TODAY));
        $cat = (int) $this->_param('cate_id');
        if ($cat) {
            $map['shopcate_id'] = $cat;
        }
        $tt = $this->_param('tt');
        if($tt == 1){
            $order = 'create_time desc';
        }elseif($tt == 2){
            $order = 'sold_num desc';
        }else{
            $order = 'orderby asc';
        }
   
        $count = $Goods->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出

        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
        $list = $Goods->order($order)->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        
        $this->display(); // 输出模板   
    }

    public function cartadd($goods_id) {
        $shop_id = (int) $this->_param('shop_id');
        $goods_id = (int) $goods_id;
        if (empty($goods_id)) {
            die('请选择产品');
        }
        if (!$detail = D('Goods')->find($goods_id)) {
             die('改商品不存在');
        }
        if ($detail['closed'] != 0 || $detail['audit'] != 1) {
             die('该商品不存在');
        }
        if ($detail['end_date'] < TODAY) {
             die('该商品已经过期，暂时不能购买');
        }
        $goods = session('goods');
        if (isset($goods[$goods_id])) {
            $goods[$goods_id] = $goods[$goods_id] + 1;
        } else {
            $goods[$goods_id] = 1;
        }
        session('goods', $goods);
        die('0');
        
    }
    
    public function cartadd2() {
        $shop_id = (int) $_POST['shop_id'];
        $wd = D('WeidianDetails')->where(array('shop_id'=>$shop_id))->find();
        $goods_id = (int)$_POST['goods_id'];
        if (empty($goods_id)) {
            $this->ajaxReturn(array('status'=>'error','msg'=>'请选择产品'));
        }
        if (!$detail = D('Goods')->find($goods_id)) {
            $this->ajaxReturn(array('status'=>'error','msg'=>'商品不存在'));
        }
        if($detail['shop_id'] != $shop_id){
            $this->ajaxReturn(array('status'=>'error','msg'=>'商品不存在'));
        }
        if ($detail['closed'] != 0 || $detail['audit'] != 1) {
            $this->ajaxReturn(array('status'=>'error','msg'=>'商品不存在'));
        }
        if ($detail['end_date'] < TODAY) {
             $this->ajaxReturn(array('status'=>'error','msg'=>'该商品已经过期，暂时不能购买'));
        }
        $goods = session('goods');
        if (isset($goods[$goods_id])) {
            $goods[$goods_id] = $goods[$goods_id] + 1;
        } else {
            $goods[$goods_id] = 1;
        }
        session('goods', $goods);
        $this->ajaxReturn(array('status'=>'success','msg'=>'加入购物车成功，正在跳转','url'=>U('mart/cart',array('id'=>$wd['id']))));
    }
    
    

   

    public function detail($goods_id) {
        $goods_id = (int) $goods_id;
        $detail = D('Goods')->find($goods_id);
        //$shop_id = $detail['shop_id'];
        //$recom = D('Goods')->where(array('shop_id' => $shop_id, 'goods_id' => array('neq', $goods_id)))->select();
        //$record = D('Usersgoods');
        //$insert = $record->getRecord($this->uid, $goods_id);
        //$this->assign('recom', $recom);
        $this->assign('detail', $detail);
        $this->display();
    }
    
     public function cart() {
        $shop_id = (int) $this->_param('shop_id');
        $wd = D('WeidianDetails')->where(array('shop_id'=>$shop_id))->find();
        $goods = session('goods');
        if (empty($goods)) {
            $this->error("亲还没有选购产品呢!", U('mart/lists',array('id'=>$wd['id'])));
        }
        $goods_ids = array_keys($goods);
        $cart_goods = D('Goods')->itemsByIds($goods_ids);
        $shop_ids = array();
        foreach ($cart_goods as $k => $val) {
            $cart_goods[$k]['buy_num'] = $goods[$k];
            $shop_ids[$val['shop_id']] = $val['shop_id'];
        }
        $this->assign('cart_shops', D('Shop')->itemsByIds($shop_ids));
        $this->assign('cart_goods', $cart_goods);
        $this->display();
    }
    

    public function cartdel() {
        $num = $_POST['num'];
        foreach($num as $val){
           $val = (int)$val;
        }
        $goods_id = (int) $_POST['goods_ids'];
        foreach($num as $k=>$v){
             if($k == $goods_id){
                unset($num[$k]);
           } 
        }
        session('goods',null);
        session('goods',$num);
        $this->ajaxReturn(array('status'=>'success','msg'=>'删除商品成功'));
    }

    public function cartdel2() {
        $shop_id = (int) $this->_param('shop_id');
        $wd = D('WeidianDetails')->where(array('shop_id'=>$shop_id))->find();
        $goods_id = (int) $this->_get('goods_id');
        $goods = session('goods');
        if (isset($goods[$goods_id])) {
            unset($goods[$goods_id]);
            session('goods', $goods);
        }
        header("Location:" . U('mart/cart', array('id'=>$wd['id'])));
        //$this->success('删除成功', U('mart/cart',array('shop_id'=>$shop_id)));
    }

    public function order() {
        if (empty($this->uid)) {
            header("Location:" . U('passport/login'));
            die;
        }
        $num = $this->_post('num', false);
        $goods_ids = array();
        foreach ($num as $k => $val) {
            $val = (int) $val;
            if (empty($val)) {
                unset($num[$k]);
            } elseif ($val < 1 || $val > 99) {
                unset($num[$k]);
            } else {
                $goods_ids[$k] = (int) $k;
            }
        }
        if (empty($goods_ids))
            $this->error('很抱歉请填写正确的购买数量');
        $goods = D('Goods')->itemsByIds($goods_ids);
        foreach ($goods as $key => $val) {
            if ($val['closed'] != 0 || $val['audit'] != 1 || $val['end_date'] < TODAY) {
                unset($goods[$key]);
            }
        }
        if (empty($goods)) {
            $this->error('很抱歉，您提交的产品暂时不能购买！');
        }
        $tprice = 0;
        $ip = get_client_ip();
        $ordergoods = $total_price = array();

        foreach ($goods as $val) {
            $price = $val['mall_price'] * $num[$val['goods_id']];
            $js_price = $val['settlement_price'] * $num[$val['goods_id']];
            $mobile_fan = $val['mobile_fan'] * $num[$val['goods_id']];
            $m_price = $val['mall_price'] * $num[$val['goods_id']] - $val['mobile_fan'] * $num[$val['goods_id']];
            $tprice+= $m_price;
            $ordergoods[$val['shop_id']][] = array(
                'goods_id' => $val['goods_id'],
                'shop_id' => $val['shop_id'],
                'num' => $num[$val['goods_id']],
                'price' => $val['mall_price'],
                'total_price' => $price,
                'mobile_fan'=>$mobile_fan,
                'js_price' => $js_price,
                'create_time' => NOW_TIME,
                'create_ip' => $ip
            );
             $total_price[$val['shop_id']] += $m_price;
            $mm_price[$val['shop_id']] += $mobile_fan;
        }
        //总订单
        $order = array(
            'user_id' => $this->uid,
            'create_time' => NOW_TIME,
            'create_ip' => $ip,
            'total_price' => $total_price,
            'mobile_fan' => $mm_price,
        );

        $order_ids = array();
        foreach ($ordergoods as $k => $val) {
            $order['shop_id'] = $k;
            $order['total_price'] = $total_price[$k];
			$shop = D('Shop')->find($k);
            $order['is_shop'] = (int) $shop['is_pei']; //是否由商家自己配送
            if ($order_id = D('Order')->add($order)) {
                $order_ids[] = $order_id;
                foreach ($val as $k1 => $val1) {
                    $val1['order_id'] = $order_id;
                    D('Ordergoods')->add($val1);
                }
            }
        }
        session('goods', null);
        if (count($order_ids) > 1) {//如果大于1 那么形成一个 支付记录 来合并付款！如果其他条件可以直接去付款
            $logs = array(
                'type' => 'goods',
                'user_id' => $this->uid,
                'order_id' => 0,
                'order_ids' => join(',', $order_ids),
                'code' => '',
                'need_pay' => $tprice,
                'create_time' => NOW_TIME,
                'create_ip' => get_client_ip(),
                'is_paid' => 0
            );
            $logs['log_id'] = D('Paymentlogs')->add($logs);
            header("Location:" . U('mart/paycode', array('log_id' => $logs['log_id'])));
        } else {
           header("Location:" . U('mart/pay', array('order_id' => $order_id)));
			 //header("Location:" . U('mart/paycode', array('log_id' => $logs['log_id'])));
        }

        die;
    }

    public function paycode() {
        $log_id = (int) $this->_get('log_id');
        if (empty($log_id)) {
            $this->error('没有有效支付记录！');
        }
        if (!$detail = D('Paymentlogs')->find($log_id)) {
            $this->error('没有有效的支付记录！');
        }
        if ($detail['is_paid'] != 0 || empty($detail['order_ids']) || !empty($detail['order_id']) || empty($detail['need_pay'])) {
            $this->error('没有有效的支付记录！');
        }
        $order_ids = explode(',', $detail['order_ids']);
        $ordergood = D('Ordergoods')->where(array('order_id' => array('IN', $order_ids)))->select();

        $goods_id = $shop_ids = array();

        foreach ($ordergood as $k => $val) {
            $goods_id[$val['goods_id']] = $val['goods_id'];
            $shop_ids[$val['shop_id']] = $val['shop_id'];
        }
        $this->assign('goods', D('Goods')->itemsByIds($goods_id));
        $this->assign('shops', D('Shop')->itemsByIds($shop_ids));
        $this->assign('ordergoods', $ordergood);
        $this->assign('useraddr', D('Useraddr')->where(array('user_id' => $this->uid))->limit()->select());
        $this->assign('payment', D('Payment')->getPayments());
        $this->assign('logs', $detail);
        $this->display();
    }
    
    public function pay() {
        if (empty($this->uid)) {
            header("Location:" . U('passport/login'));
            die;
        }
        
        $this->check_mobile();
        
        $order_id = (int) $this->_get('order_id');
        $order = D('Order')->find($order_id);
        if (empty($order) || $order['status'] != 0 || $order['user_id'] != $this->uid) {
            $this->error('该订单不存在');
            die;
        }
        $ordergood = D('Ordergoods')->where(array('order_id' => $order_id))->select();

        $goods_id = $shop_ids = array();

        foreach ($ordergood as $k => $val) {
            $goods_id[$val['goods_id']] = $val['goods_id'];
            $shop_ids[$val['shop_id']] = $val['shop_id'];
        }
        $this->assign('goods', D('Goods')->itemsByIds($goods_id));
        $this->assign('shops', D('Shop')->itemsByIds($shop_ids));
        $this->assign('ordergoods', $ordergood);
        $this->assign('useraddr', D('Useraddr')->where(array('user_id' => $this->uid))->limit()->select());
        $this->assign('order', $order);
        $this->assign('payment', D('Payment')->getPayments(true));
        $this->display();
    }

    public function paycode2() { //这里是因为原来的是按订单付，这里是合并付款逻辑部分 
        $log_id = (int) $this->_get('log_id');
        if (empty($log_id)) {
            $this->error('没有有效支付记录！');
        }
        if (!$detail = D('Paymentlogs')->find($log_id)) {
            $this->error('没有有效的支付记录！');
        }
        if ($detail['is_paid'] != 0 || empty($detail['order_ids']) || !empty($detail['order_id']) || empty($detail['need_pay'])) {
            $this->error('没有有效的支付记录！');
        }
        $order_ids = explode(',', $detail['order_ids']);
        $addr_id = (int) $this->_post('addr_id');
        if (empty($addr_id)) {
            $this->error('请选择一个要配送的地址！');
        }
        D('Order')->where(array('order_id' => array('IN', $order_ids)))->save(array('addr_id' => $addr_id));
        if (!$code = $this->_post('code')) {
            $this->error('请选择支付方式！');
        }
        if ($code == 'wait') { //如果是货到付款
            D('Order')->save(array(
                'is_daofu' => 1,
                    ), array('where' => array('order_id' => array('IN', $order_ids))));
            D('Ordergoods')->save(array(
                'is_daofu' => 1,
                    ), array('where' => array(
                    'order_id' => array('IN', $order_ids)
                    )));
             D('Payment')->mallSold($order_ids);
            D('Payment')->mallPeisong($order_ids);
             D('Sms')->mallTZshop($order_ids);
            $this->success('恭喜您下单成功！', U('mcenter/goods/index'));
        }else{
            $payment = D('Payment')->checkPayment($code);
            if (empty($payment)) {
                $this->error('该支付方式不存在');
            }
            $detail['code'] = $code;
            D('Paymentlogs')->save($detail);
            header("Location:" . U('cart/combine', array('log_id' => $detail['log_id'])));
        }
    }
    
    public function combine(){
         if (empty($this->uid)) {
            header("Location:" . U('passport/login'));
            die;
        }
        $log_id = (int) $this->_get('log_id');
        if (!$detail = D('Paymentlogs')->find($log_id)) {
            $this->error('没有有效的支付记录！');
        }
        if ($detail['is_paid'] != 0 || empty($detail['order_ids']) || !empty($detail['order_id']) || empty($detail['need_pay'])) {
            $this->error('没有有效的支付记录！');
        }
        $this->assign('button', D('Payment')->getCode($detail));
        $this->assign('logs',$detail);
        $this->display();
    }
    
   public function pay2() {
        if (empty($this->uid)) {
            header("Location:" . U('passport/login'));
            die;
        }
        $order_id = (int) $this->_get('order_id');
        $order = D('Order')->find($order_id);
        if (empty($order) || $order['status'] != 0 || $order['user_id'] != $this->uid) {
            $this->error('该订单不存在');
        }

        $addr_id = (int) $this->_post('addr_id');

        if (empty($addr_id)) {
            $this->error('请选择一个要配送的地址！');
        }
        D('Order')->save(array('addr_id' => $addr_id, 'order_id' => $order_id));
        if (!$code = $this->_post('code')) {
            $this->error('请选择支付方式！');
        }
        if ($code == 'wait') { //如果是货到付款
            D('Order')->save(array(
                'order_id' => $order_id,
                'is_daofu' => 1,
            ));
            D('Ordergoods')->save(array(
                'is_daofu' => 1,
                    ), array('where' => array(
                    'order_id' => $order_id
            )));
            D('Payment')->mallSold($order_id);
            D('Payment')->mallPeisong(array($order_id));

            $goods_ids   = D('Ordergoods')->where("order_id={$order_id}")->getField('goods_id',true);
            $goods_ids   = implode(',', $goods_ids);
            $map         = array('goods_id'=>array('in',$goods_ids));
            $goods_name  = D('Goods')->where($map)->getField('title',true);
            $goods_name  = implode(',', $goods_name);
            //====================微信支付通知===========================
             
            include_once "Baocms/Lib/Net/Wxmesg.class.php";
            $_data_order = array(//整体变更
                'url'       =>  "http://".$_SERVER['HTTP_HOST']."/mcenter/goods/detail/order_id/".$order_id.".html",
                'topcolor'  =>  '#F55555',
                'first'     =>  '亲,您的货到付款订单成功创建！',
                'remark'    =>  '更多信息,请登录http://'.$_SERVER['HTTP_HOST'].'！感谢您的惠顾！',
                'money'     =>  round($order['need_pay']/100,2).'元',
                'goodsName' =>  $goods_name,
                'payType'   =>  '货到付款',
                'orderNum'  =>  '1-'.$order_id,
				'buyNum' 	=>  $order['num'],
            );
            $order_data = Wxmesg::order($_data_order);
            $return   = Wxmesg::net($this->uid, 'OPENTM202297555', $order_data);//结束

            //====================微信支付通知==============================

            $this->success('恭喜您下单成功！', U('mcenter/goods/index'));
        } else {
            $payment = D('Payment')->checkPayment($code);
            if (empty($payment)) {
                $this->error('该支付方式不存在');
            }
            $logs = D('Paymentlogs')->getLogsByOrderId('goods', $order_id);
            if (empty($logs)) {
                $logs = array(
                    'type' => 'goods',
                    'user_id' => $this->uid,
                    'order_id' => $order_id,
                    'code' => $code,
                    'need_pay' => $order['total_price'],
                    'create_time' => NOW_TIME,
                    'create_ip' => get_client_ip(),
                    'is_paid' => 0
                );
                $logs['log_id'] = D('Paymentlogs')->add($logs);
            } else {
                $logs['need_pay'] = $order['total_price'];
                $logs['code'] = $code;
                D('Paymentlogs')->save($logs);
            }

            $goods_ids   = D('Ordergoods')->where("order_id={$order_id}")->getField('goods_id',true);
            $goods_ids   = implode(',', $goods_ids);
            $map         = array('goods_id'=>array('in',$goods_ids));
            $goods_name  = D('Goods')->where($map)->getField('title',true);
            $goods_name  = implode(',', $goods_name);
            //====================微信支付通知===========================
             
            include_once "Baocms/Lib/Net/Wxmesg.class.php";
            $_data_order = array(//整体变更
                'url'       =>  "http://".$_SERVER['HTTP_HOST']."/mcenter/goods/detail/order_id/".$order_id.".html",
                'topcolor'  =>  '#F55555',
                'first'     =>  '亲,您的在线支付订单成功创建！',
                'remark'    =>  '更多信息,请登录http://'.$_SERVER['HTTP_HOST'].'！感谢您的惠顾！',
                'money'     =>  round($order['need_pay']/100,2).'元',
                'goodsName' =>  $goods_name,
                'payType'   =>  $payment['name'],
                'orderNum'  =>  '1-'.$order_id,
				'buyNum' 	=>  $order['num'],
            );
            $order_data = Wxmesg::order($_data_order);
            $return   = Wxmesg::net($this->uid, 'OPENTM202297555', $order_data);//结束
            //====================微信支付通知==============================

            header("Location:" . U('mart/payment', array('order_id' => $order_id)));
            die;
        }
    }

     public function payment($order_id) {
        if (empty($this->uid)) {
            header("Location:" . U('passport/login'));
            die;
        }
        $order_id = (int) $this->_get('order_id');
        $order = D('Order')->find($order_id);
        if (empty($order) || $order['status'] != 0 || $order['user_id'] != $this->uid) {
            $this->error('该订单不存在');
            die;
        }
        $logs = D('Paymentlogs')->getLogsByOrderId('goods', $order_id);
        if (empty($logs)) {
            $this->error('没有有效的支付记录！');
            die;
        }
        $this->assign('button', D('Payment')->getCode($logs));
        $this->assign('order', $order);
        $this->display();
    }
	
	
	//小灰灰增加的哦
	
	 public function favorites() {
        if (empty($this->uid)) {
            header("Location:" . U('passport/login'));
            die;
        }
        $shop_id = (int) $this->_get('shop_id');
        if (!$detail = D('Shop')->find($shop_id)) {
            $this->error('没有该商家');
        }
        if ($detail['closed']) {
            $this->error('该商家已经被删除');
        }
        if (D('Shopfavorites')->check($shop_id, $this->uid)) {
            $this->error('您已经收藏过了！');
        }
        $data = array(
            'shop_id' => $shop_id,
            'user_id' => $this->uid,
            'create_time' => NOW_TIME,
            'create_ip' => get_client_ip()
        );
        if (D('Shopfavorites')->add($data)) {
            $this->success('恭喜您收藏成功！', U('mart/dian', array('shop_id' => $shop_id)));
        }
        $this->error('收藏失败！');
    }
	
	
	
	  public function dian() { //进入微店
      
		
		
		
		 $id = (int) $this->_get('id');
        if (!$detail = D('WeidianDetails')->find($id)) {
            $this->error('没有该微店商家');
            die;
        }
        if ($detail['audit'] != 1) {
            $this->error('没有该微店商家');
            die;
        }
        $cate_id = (int) $this->_param('cate_id');
        $this->assign('cate_id',$cate_id);
        $this->assign('next', LinkTo('mart/load', array('cate_id' => $cate_id, 'id' => $id, 't' => NOW_TIME, 'p' => '0000')));
        $this->assign('detail', $detail);
        $this->display(); // 输出模板   
		
    }
	
	//小灰灰天机啊
	public function main() {
        $this->display(); // 输出模板   
    }

    public function cate() {
        $this->display(); // 输出模板   
    }

	public function cateload() {
        if (!$cate_id = (int) $this->_param('cat')) {
            $this->error('没有该分类！');
        }
		$this->assign('cat',$cate_id);
		$this->display(); // 输出模板 
    }
	
	

}
