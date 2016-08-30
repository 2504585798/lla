<?php
class EleAction extends CommonAction {

    protected $cart = array();

    public function _initialize() {
        parent::_initialize();
        //$this->cart = session('eleproduct');
        $this->cart = cookie('eleproduct');
        $this->assign('cartnum', (int) array_sum($this->cart));
        $cate = D('Ele')->getEleCate();
        $this->assign('elecate', $cate);
    }
    public function main() {
        $map = array('is_open' => 1, 'audit' => 1,'city_id'=>$this->city_id);
        $lat = addslashes(cookie('lat'));
        $lng = addslashes(cookie('lng'));
        if (empty($lat) || empty($lng)) {
            $lat = $this->city['lat'];
            $lng = $this->city['lng'];
        }
        $list = D('Ele')->where($map)->order(" (ABS(lng - '{$lng}') +  ABS(lat - '{$lat}') ) asc ")->limit(0, 10)->select();
        $shop_ids = array();
        foreach ($list as $k=>$val) {
            if(!empty($val['shop_id'])){
                $shop_ids[$val['shop_id']] = $val['shop_id'];
            }
            $list[$k]['d'] =  getDistance($lat, $lng, $val['lat'], $val['lng']);
        }
        $this->assign('shops',D('Shop')->itemsByIds($shop_ids));
        $this->assign('list', $list);
        $this->display();
    }

    public function index() {
        $linkArr = array();
        $keyword = $this->_param('keyword', 'htmlspecialchars');
        $this->assign('keyword', $keyword);
        $linkArr['keyword'] = $keyword;

        $cate = $this->_param('cate','htmlspecialchars');
        $this->assign('cate', $cate);
        $linkArr['cate'] = $cate;
        
        $order = $this->_param('order','htmlspecialchars');
        $this->assign('order', $order);
        $linkArr['order'] = $order;

        $area = (int) $this->_param('area');
        $this->assign('area', $area);
        $linkArr['area'] = $area;

        $business = (int) $this->_param('business');
        $this->assign('business', $business);
        $linkArr['business'] = $business;
        $this->assign('nextpage', LinkTo('ele/loaddata', $linkArr, array('t' => NOW_TIME, 'p' => '0000')));
        $this->assign('linkArr',$linkArr);
        $this->display(); // 输出模板 
    }

    public function loaddata() {
        $ele = D('Ele');
        import('ORG.Util.Page'); // 导入分页类
        //初始数据
        $map = array('audit'=>1,'city_id'=>$this->city_id);
        $area = (int) $this->_param('area');
        if ($area) {
            $map['area_id'] = $area;
        }
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['shop_name'] = array('LIKE', '%' . $keyword . '%');
        }
        $business = (int) $this->_param('business');
        if ($business) {
            $map['business_id'] = $business;
        }
        $order = $this->_param('order','htmlspecialchars');
        $lat = addslashes(cookie('lat'));
        $lng = addslashes(cookie('lng'));
        if (empty($lat) || empty($lng)) {
            $lat = $this->city['lat'];
            $lng = $this->city['lng'];
        }
        switch ($order) {
            case 'a':
                $orderby = array("(ABS(lng - '{$lng}') +  ABS(lat - '{$lat}') )"=>'asc','orderby' => 'asc','month_num'=>'desc','distribution'=>'asc','since_money'=>'asc');
                break;
            case 'p':
                $orderby = array('since_money'=>'asc');
                break;
            case 'v':
                $orderby = array('distribution'=>'asc');
                break;
            case 'd':
                $orderby = " (ABS(lng - '{$lng}') +  ABS(lat - '{$lat}') ) asc ";
                break;
            case 's':
                $orderby = array('month_num'=>'desc');
                break;
        }
        $cate =  $this->_param('cate','htmlspecialchars');
        $lists = $ele->order($orderby)->where($map)->select();
        foreach ($lists as $k => $val) {
            if (!empty($cate)) {
                if (strpos($val['cate'],$cate) === false) {
                    unset($lists[$k]);
                }
            }
        }
        /*foreach ($lists as $k => $val) {
            if (!empty($lng) && !empty($lat)) {
                $lists[$k]['d'] = getDistanceNone($lat, $lng, $val['lat'], $val['lng']);
                if ($lists[$k]['d'] > 20000) { //大于2KM的要咔嚓掉
                    unset($lists[$k]);
                }
            }
        }*/
        $count = count($lists);  // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出  
        
        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
        $list = array_slice($lists, $Page->firstRow, $Page->listRows);
        $shop_ids = array();
        foreach ($list as $k => $val) {
            $shop_ids[$val['shop_id']] = $val['shop_id'];
            $list[$k]['d'] = getDistance($lat, $lng, $val['lat'], $val['lng']);
        }
        if ($shop_ids) {
            $this->assign('shops', D('Shop')->itemsByIds($shop_ids));
        }
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板   
    }

    public function shop() {
        $shop_id = (int) $this->_param('shop_id');
        if (!$detail = D('Ele')->find($shop_id)) {
            $this->error('该餐厅不存在');
        }
        if (!$shop = D('Shop')->find($shop_id)) {
            $this->error('该餐厅不存在');
        }
        $linkArr = array();
        $is_new = (int) $this->_param('is_new');
        $this->assign('is_new', $is_new);
        $linkArr['is_new'] = $is_new;

        $is_hot = (int) $this->_param('is_hot');
        $this->assign('is_hot', $is_hot);
        $linkArr['is_hot'] = $is_hot;

        $is_tuijian = (int) $this->_param('is_tuijian');
        $this->assign('is_tuijian', $is_tuijian);
        $linkArr['is_tuijian'] = $is_tuijian;

        $cat = (int) $this->_param('cat');
        $this->assign('cat', $cat);
        $linkArr['cat'] = $cat;

        $this->assign('next', LinkTo('ele/load', $linkArr, array('shop_id' => $shop_id, 't' => NOW_TIME, 'p' => '0000')));
        $this->assign('detail', $detail);
        $this->assign('cates', D('Elecate')->where(array('shop_id' => $shop_id, 'closed' => 0))->select());
        $this->display(); // 输出模板 
    }

    public function load() {
        $shop_id = (int) $this->_param('shop_id');
        $detail = D('Ele')->find($shop_id);
        $Eleproduct = D('Eleproduct');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0,'audit'=>1, 'shop_id' => $shop_id);
        if ($is_new = (int) $this->_param('is_new')) {
            $map['is_new'] = 1;
        }
        if ($is_hot = (int) $this->_param('is_hot')) {
            $map['is_hot'] = 1;
        }
        if ($is_tuijian = (int) $this->_param('is_tuijian')) {
            $map['is_tuijian'] = 1;
        }
        $cat = (int) $this->_param('cat');
        if ($cat) {
            $map['cate_id'] = $cat;
        }
        $count = $Eleproduct->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
        $list = $Eleproduct->where($map)->order(array('sold_num' => 'desc', 'price' => 'asc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->assign('detail', $detail);
        $this->assign('cates', D('Elecate')->where(array('shop_id' => $shop_id, 'closed' => 0))->select());
        $this->assign('shop', $shop);
        if (!empty($this->cart)) {
            $ids = array_keys($this->cart);
            $total = array(
                'num' => 0, 'money' => 0
            );
            $products = D('Eleproduct')->itemsByIds($ids);
            foreach ($products as $k => $val) {
                $products[$k]['cart_num'] = $this->cart[$val['product_id']];
                $total['num'] += $this->cart[$val['product_id']];
                $total['money'] +=( $this->cart[$val['product_id']] * $val['price']);
            }
            $this->assign('total', $total);
            $this->assign('cartgoods', $products);
        }
        $this->display();
    }

    // public function delete2($product_id) {
    //     $product_id = (int) $product_id;
    //     if (!$detail = D('Eleproduct')->find($product_id)) {
    //         $this->error('该产品不存在');
    //     }
    //     if (isset($this->cart[$product_id])) {
    //         unset($this->cart[$product_id]);
    //         //session('eleproduct', $this->cart);
    //         cookie('eleproduct', $this->cart);
    //     }
    //     $this->success('删除成功', U('ele/cart'));
    // }

    // public function delete($product_id) {
    //     $product_id = (int) $product_id;
    //     if (!$detail = D('Eleproduct')->find($product_id)) {
    //         $this->error('该产品不存在');
    //     }
    //     if (isset($this->cart[$product_id])) {
    //         unset($this->cart[$product_id]);
    //         //session('eleproduct', $this->cart);
    //         cookie('eleproduct', $this->cart);
    //     }
    //     $this->success('删除成功', U('ele/shop', array('shop_id' => $detail['shop_id'])));
    // }

    // public function clean($shop_id) {
    //     $shop_id = (int) $shop_id;
    //     //session('eleproduct', null);
    //     cookie('eleproduct', null);
    //     $this->success('清空购物车成功', U('ele/shop', array('shop_id' => $shop_id)));
    // }

    // public function changenum($product_id, $num) {
    //     $product_id = (int) $product_id;
    //     $num = (int) $num;
    //     if ($this->cart[$product_id]) {
    //         if ($num >= 1 && $num <= 99) {
    //             $this->cart[$product_id] = $num;
    //             //session('eleproduct', $this->cart);
    //             cookie('eleproduct', $this->cart);
    //         }
    //     }
    // }

    // public function add($product_id) {
    //     $product_id = (int) $product_id;
    //     if (empty($product_id)) {
    //         die('参数错误');
    //     }
    //     if (!$detail = D('Eleproduct')->find($product_id)) {
    //         die('该产品不存在');
    //     }
    //     if (!empty($this->cart)) {
    //         foreach ($this->cart as $k => $v) {
    //             $data = D('Eleproduct')->find($k);
    //             if ($data['shop_id'] != $detail['shop_id']) {
    //                 die('一次只能订购一家的外卖，您可以清空购物车重新定！');
    //             }
    //             break;
    //         }
    //     }
    //     if (isset($this->cart[$product_id])) {
    //         $this->cart[$product_id]+=1;
    //     } else {
    //         $this->cart[$product_id] = 1;
    //     }
    //     //session('eleproduct', $this->cart);
    //     cookie('eleproduct', $this->cart);
    //     die('0');
    // }
    
    
    
    // public function dec($product_id) {
    //     $product_id = (int) $product_id;
    //     if (empty($product_id)) {
    //         die('参数错误');
    //     }
    //     if (!$detail = D('Eleproduct')->find($product_id)) {
    //         die('该产品不存在');
    //     }
    //     if (!empty($this->cart)) {
    //         foreach ($this->cart as $k => $v) {
    //             $data = D('Eleproduct')->find($k);
    //             if ($data['shop_id'] != $detail['shop_id']) {
    //                 die('一次只能订购一家的外卖，您可以清空购物车重新定！');

    //             }
    //             break;
    //         }
    //     }
    //     if (isset($this->cart[$product_id])) {
    //         $this->cart[$product_id]-=1;
    //     } else {
    //         $this->cart[$product_id] = 1;
    //     }
    //     //session('eleproduct', $this->cart);
    //     cookie('eleproduct', $this->cart);
    //     die('0');
    // }
    //重写购物车
    public function cart() {
        $cart = null;
        if($goods=cookie('ele')){
            $total = array('num' => 0, 'money' => 0);
            $goods = (array)json_decode($goods);
            $ids = array();
            foreach ($goods as $shop_id=>$items) {
              foreach($items as $k2=>$item){
                $item = (array)$item;
                $total['num']+=$item['num'];
                $total['money']+=$item['price']*$item['num'];
                $ids[] = $item['product_id'];
                $product_item_num[$item['product_id']] = $item['num'];
              }
            }
            $ids = implode(',',$ids);
            $products = D('Eleproduct')->where('closed=0')->select($ids);
            foreach($products as $k=>$val){
                $products[$k]['cart_num'] = $product_item_num[$val['product_id']];
            }
            $this->assign('detail', D('Ele')->find($shop_id));
            $this->assign('total', $total);
            $this->assign('shop_id',$shop_id);
            $this->assign('cartgoods', $products);
        }
        $this->display();
    }

    public function order() {
        if (empty($this->uid)) {
            header("Location:" . U('passport/login'));
            die;
        }
        $num = $this->_post('num', false);
        if (empty($num)) {
            $this->error('您还没有订餐呢');
        }
        $shop_id = 0;
        $shops = array();
        $products = array();
        $total = array(
            'money' => 0,
            'num' => 0,
        );
        //产品名
        $product_name = array( );
        foreach ($num as $key => $val) {
            $key = (int) $key;
            $val = (int) $val;
            if ($val < 1 || $val > 99) {
                $this->error('请选择正确的购买数量');
            }
            $product = D('Eleproduct')->find($key);
            $product_name[]=$product['product_name'];
            if (empty($product)) {
                $this->error('产品不正确');
            }
            $shop_id = $product['shop_id'];
            $product['buy_num'] = $val;
            $products[$key] = $product;
            $shops[$shop_id] = $shop_id;
            $total['money'] += ($product['price'] * $val);
            $total['num'] += $val;
        }

        if (count($shops) > 1) {
            $this->error('您购买的商品是2个商户的！');
        }
        if (empty($shop_id)) {
            $this->error('商家不存在');
        }
        $shop = D('Ele')->find($shop_id);
        if (empty($shop)) {
            $this->error('该商家不存在');
        }
        if (!$shop['is_open']) {
            $this->error('商家已经打烊，实在对不住客官');
        }
        $settlement_price = $total['money'];
        $total['money'] += $shop['logistics'];
        $total['need_pay'] = $total['money']; //后面要用到计算
        if ($shop['since_money'] > $total['money']) {
            $this->error('客官，您再订点吧！');
        }
        if ($shop['is_new'] && !D('Eleorder')->checkIsNew($this->uid, $shop_id)) { //如果是新单  
            if ($total['money'] >= $shop['full_money']) { //满足新单的条件 立马减几块钱
                $num1 = (int) (($total['money'] - $shop['full_money']) / 1000); //10块钱加1规则
                $total['new_money'] = $shop['new_money'] + $num1 * 100;
                $total['need_pay'] = $total['need_pay'] - $total['new_money'];
            }
        }
        $month = date('Ym', NOW_TIME);
        if ($order_id = D('Eleorder')->add(array(
            'user_id' => $this->uid,
            'shop_id' => $shop_id,
            'total_price' => $total['money'],
            'need_pay' => $total['need_pay'],
            'num' => $total['num'],
            'new_money' => (int) $total['new_money'],
            'settlement_price' => $settlement_price,
            'status' => 0,
            'create_time' => NOW_TIME,
            'create_ip' => get_client_ip(),
            'is_pay' => 0,
            'month' => $month //主要后面最统计用好用
                ))) {

            foreach ($products as $val) {
                D('Eleorderproduct')->add(array(
                    'order_id' => $order_id,
                    'product_id' => $val['product_id'],
                    'num' => $val['buy_num'],
                    'total_price' => $val['price'] * $val['buy_num'],
                    'month' => $month
                ));
            }
            //session('eleproduct', null);
            cookie('eleproduct', null);

            $this->success('下单成功！您可以选择配送地址!', U('ele/pay', array('order_id' => $order_id)));
        }
        $this->error('创建订单失败！');
    }

    public function pay() {
        if (empty($this->uid)) {
            header("Location:" . U('passport/login'));
            die;
        }
        
        $this->check_mobile();
        
        $order_id = (int) $this->_get('order_id');
        $order = D('Eleorder')->find($order_id);
        if (empty($order) || $order['status'] != 0 || $order['user_id'] != $this->uid) {
            $this->error('该订单不存在');
            die;
        }
        $this->assign('shop', D('Ele')->find($order['shop_id']));
        $ordergoods = D('Eleorderproduct')->where(array('order_id' => $order_id))->select();
        $goods = array();
        foreach ($ordergoods as $key => $val) {
            $goods[$val['product_id']] = $val['product_id'];
        }
        $products = D('Eleproduct')->itemsByIds($goods);


        $this->assign('products', $products);
        $this->assign('ordergoods', $ordergoods);
        $this->assign('useraddr', D('Useraddr')->where(array('user_id' => $this->uid))->limit()->select());
        $this->assign('order', $order);
        $this->assign('payment', D('Payment')->getPayments(true));
        $this->display();
    }


    public function pay2() {
        if (empty($this->uid)) {
            $this->ajaxLogin();
        }
        $order_id = (int) $this->_get('order_id');
        $order = D('Eleorder')->find($order_id);
        if (empty($order) || $order['status'] != 0 || $order['user_id'] != $this->uid) {
            $this->error('该订单不存在');
            die;
        }
        $addr_id = (int) $this->_post('addr_id');
        if (empty($addr_id)) {
            $this->error('请选择一个要配送的地址！');
        }
        D('Eleorder')->save(array('addr_id' => $addr_id, 'order_id' => $order_id));
        if (!$code = $this->_post('code')) {
            $this->error('请选择支付方式！');
        }

        $dv = D('DeliveryOrder');
        $ua = D('UserAddr');
        $uaddr = $ua -> where('user_id ='.$order['user_id']) -> find();
        //为写入物流记录，查询商家类型
        $shop = D('Shop');
        $fshop = $shop -> where('shop_id ='.$order['shop_id']) -> find();
        cookie('ele',null);
        if ($code == 'wait') { //如果是货到付款
            D('Eleorder')->save(array(
                'order_id' => $order_id,
                'status' => 1,
            ));
            $eleorder = D('Eleorder')->find($order_id);
            $shops = D('Shop')->find($eleorder['shop_id']);
            
            //如果是货到付款，该订单已经下单了，并且商家是配送员配送
            if($fshop['is_pei'] == 0){
                $dv_data = array(
                    'type' => 1,
                    'type_order_id' => $order['order_id'],
                    'delivery_id'   => 0,
                    'shop_id'       => $order['shop_id'],
                    'user_id'       => $order['user_id'],
                    'shop_name'     => $fshop['shop_name'],
                    'shop_addr'     => $fshop['addr'],
                    'shop_mobile'   => $fshop['tel'],
                    'user_name'     => $this->member['nickname'],
                    'user_addr'     => $uaddr['addr'],
                    'user_mobile'   => $this->member['mobile'],
                    'create_time'   => time(),
                    'update_time'   => 0,
                    'status' => 0
                );
  
                $dv -> add($dv_data);
             }
            
            
            D('Sms')->sendSms('sms_ele', $this->member['mobile'], array(
                'nickname' => $this->member['nickname'],
                'shopname' => $shops['shop_name'],
            ));
			


            $product_ids  = D('Eleorderproduct')->where("order_id=".$order['order_id'])->getField('product_id',true);
            $product_ids  = implode(',', $product_ids);
            $map          = array('product_id'=>array('in',$product_ids));
            $product_name = D('Eleproduct')->where($map)->getField('product_name',true);
            $product_name = implode(',', $product_name);
            //====================微信支付通知===========================
             
            include_once "Baocms/Lib/Net/Wxmesg.class.php"; 
            $_data_order = array(//整体变更
                'url'       =>  "http://".$_SERVER['HTTP_HOST']."/mcenter/eleorder/detail/order_id/".$order_id.".html",
                'topcolor'  =>  '#F55555',
                'first'     =>  '亲,您的货到付款订单我们已经收到,我们马上发货！请保持手机开机！',
                'remark'    =>  '更多信息,请登录http://'.$_SERVER['HTTP_HOST'].'再次感谢您的惠顾！',
                'money'     =>  round($order['need_pay']/100,2).'元',
                'goodsName' =>  $product_name,
                'payType'   =>  '货到付款',
                'orderNum'  =>  '1-'.$order_id,
				'buyNum' 	=>  $order['num'],
            );
            $order_data = Wxmesg::order($_data_order);
            $return   = Wxmesg::net($this->uid, 'OPENTM202297555', $order_data);//结束

            //====================微信支付通知==============================

            //到付通知商家
            D('Sms')->eleTZshop($order_id);
            $this->success('恭喜您下单成功！', U('mcenter/eleorder/index'));
            
        } else {
            $payment = D('Payment')->checkPayment($code);
            if (empty($payment)) {
                $this->error('该支付方式不存在');
            }
            $logs = D('Paymentlogs')->getLogsByOrderId('goods', $order_id);
            if (empty($logs)) {
                $logs = array(
                    'type' => 'ele',
                    'user_id' => $this->uid,
                    'order_id' => $order_id,
                    'code' => $code,
                    'need_pay' => $order['need_pay'],
                    'create_time' => NOW_TIME,
                    'create_ip' => get_client_ip(),
                    'is_paid' => 0
                );
                $logs['log_id'] = D('Paymentlogs')->add($logs);
            } else {
                $logs['need_pay'] = $order['need_pay'];
                $logs['code'] = $code;
                D('Paymentlogs')->save($logs);
            }

            $product_ids  = D('Eleorderproduct')->where("order_id=".$order_id)->getField('product_id',true);
            $product_ids  = implode(',', $product_ids);
            $map          = array('product_id'=>array('in',$product_ids));
            $product_name = D('Eleproduct')->where($map)->getField('product_name',true);
            $product_name = implode(',', $product_name);
            //====================微信支付通知===========================
             
            include_once "Baocms/Lib/Net/Wxmesg.class.php"; 
            $_data_order = array(//整体变更
                'url'       =>  "http://".$_SERVER['HTTP_HOST']."/mcenter/eleorder/detail/order_id/".$order_id.".html",
                'topcolor'  =>  '#F55555',
                'first'     =>  '亲,您的在线支付订单已经创建,请尽快支付！',
                'remark'    =>  '更多信息,请登录http://'.$_SERVER['HTTP_HOST'].'再次感谢您的惠顾！',
                'money'     =>  round($order['need_pay']/100,2).'元',
                'goodsName' =>  $product_name,
                'payType'   =>  $payment['name'],
                'orderNum'  =>  '1-'.$order_id,
				'buyNum' 	=>  $order['num'],
            );
            $order_data = Wxmesg::order($_data_order);
            $return   = Wxmesg::net($this->uid, 'OPENTM202297555', $order_data);//结束

            //====================微信支付通知==============================
            $this->success('选择支付方式成功！下面请进行支付！', U('payment/payment', array('log_id' => $logs['log_id'])));
        }
    }

   public function ajax() {
        //$this->cart = session('eleproduct');
        $this->cart = cookie('eleproduct');
        $num = count($this->cart);
        $num = $num + 1;
        die("{$num}");
    }

    private function getShop($shop, $lng, $lat) { // 2公里过滤
        foreach ($shop as $k => $v) {

            $shop[$k]['d'] = getDistanceNone($lat, $lng, $v['lat'], $v['lng']);
            if ($shop[$k]['d'] > 20000) { //大于2KM的要咔嚓掉
                unset($shop[$k]);
            }
        }
        return $shop;
    }


    public function favorites() {
        if (empty($this->uid)) {
            $this->ajaxLogin(); //提示异步登录
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
            $this->success('恭喜您收藏成功！', U('ele/detail', array('shop_id' => $shop_id)));
        }
        $this->error('收藏失败！');
    }

    public function detail() {

        $shop_id = (int) $this->_get('shop_id');
        if (!$detail = D('Shop')->find($shop_id)) {
            $this->error('没有该商家');
            die;
        }
        if ($detail['closed']) {
            $this->error('该商家已经被删除');
            die;
        }
        $Shopdianping = D('Shopdianping');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0, 'shop_id' => $shop_id, 'show_date' => array('ELT', TODAY));
        $count = $Shopdianping->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
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
        $this->assign('page', $show); // 赋值分页输出
        $this->assign('detail', $detail);
        $this->assign('ex', D('Shopdetails')->find($shop_id));

        $tuan = D('Tuan')->where(array('shop_id' => $shop_id, 'audit' => 1, 'closed' => 0, 'end_date' => array('EGT', TODAY)))->order(' tuan_id desc ')->limit(0, 5)->select();
        $this->assign('tuan', $tuan);
        $coupon = D('Coupon')->order(' coupon_id desc ')->find(array('where' => array('shop_id' => $shop_id, 'audit' => 1, 'closed' => 0, 'expire_date' => array('EGT', TODAY))));
        $this->assign('coupon', $coupon);
        D('Shop')->updateCount($shop_id, 'view');
        $this->seodatas['shop_name'] = $detail['shop_name'];
        $this->seodatas['shop_tel'] = $detail['shop_tel'];
        if ($this->uid) {
            D('Userslook')->look($this->uid, $shop_id);
        }
        $this->assign('shopdomain', D('Shopdomain')->domain($shop_id));
        $this->assign('cate', $this->shopcates[$detail['cate_id']]);
        $this->assign('shoppic', D('Shoppic')->order('orderby asc')->limit(0, 8)->where(array('shop_id' => $shop_id))->select());

        $this->display();
    }

    public function dianping() {
        if (empty($this->uid)) {
            $this->ajaxLogin(); //提示异步登录
        }
        $shop_id = (int) $this->_get('shop_id');
        if (!$detail = D('Shop')->find($shop_id)) {
            $this->error('没有该商家');
        }
        if ($detail['closed']) {
            $this->error('该商家已经被删除');
        }
        if (D('Shopdianping')->check($shop_id, $this->uid)) {
            $this->error('不可重复评价一个商户');
        }


        $data = $this->checkFields($this->_post('data', false), array('score', 'd1', 'd2', 'd3', 'cost', 'contents'));
        $data['user_id'] = $this->uid;
        $data['shop_id'] = $shop_id;
        $data['score'] = (int) $data['score'];

        if (empty($data['score'])) {
            $this->error('评分不能为空');
        }
        if ($data['score'] > 5 || $data['score'] < 1) {
            $this->error('评分不能为空');
        }

        $cate = $this->shopcates[$detail['cate_id']];
        $data['d1'] = (int) $data['d1'];
        if (empty($data['d1'])) {
            $this->error($cate['d1'] . '评分不能为空');
        }
        if ($data['d1'] > 5 || $data['d1'] < 1) {
            $this->error($cate['d1'] . '评分不能为空');
        }
        $data['d2'] = (int) $data['d2'];
        if (empty($data['d2'])) {
            $this->error($cate['d2'] . '评分不能为空');
        }
        if ($data['d2'] > 5 || $data['d2'] < 1) {
            $this->error($cate['d2'] . '评分不能为空');
        }
        $data['d3'] = (int) $data['d3'];
        if (empty($data['d3'])) {
            $this->error($cate['d3'] . '评分不能为空');
        }
        if ($data['d3'] > 5 || $data['d3'] < 1) {
            $this->error($cate['d3'] . '评分不能为空');
        }


        $data['cost'] = (int) $data['cost'];
        $data['contents'] = SecurityEditorHtml($data['contents']);
        if (empty($data['contents'])) {
            $this->error('评价内容不能为空');
        }
        if ($words = D('Sensitive')->checkWords($data['contents'])) {
            $this->error('评价内容含有敏感词：' . $words);
        }
        $data['show_date'] = date('Y-m-d', NOW_TIME + 15 * 86400); //15天生效
        $data['create_time'] = NOW_TIME;
        $data['create_ip'] = get_client_ip();
        if ($dianping_id = D('Shopdianping')->add($data)) {
            $photos = $this->_post('photos', false);
            $local = array();
            foreach ($photos as $val) {
                if (isImage($val))
                    $local[] = $val;
            }
            if (!empty($local))
                D('Shopdianpingpics')->upload($dianping_id, $data['shop_id'], $local);
            D('Users')->prestige($this->uid, 'dianping');
            D('Shop')->updateCount($shop_id, 'score_num');
            D('Users')->updateCount($this->uid, 'ping_num');
            D('Shopdianping')->updateScore($shop_id);
            $this->success('恭喜您点评成功!', U('ele/detail', array('shop_id' => $shop_id)));
        }
        $this->error('点评失败！');
    }

    public function yuyue() {
        $shop_id = (int) $this->_get('shop_id');
        if (!$detail = D('Shop')->find($shop_id)) {
            $this->error('没有该商家');
            die;
        }
        if ($detail['closed']) {
            $this->error('该商家已经被删除');
            die;
        }
        if ($this->isPost()) {
            $data = $this->checkFields($this->_post('data', false), array('name', 'mobile', 'content', 'yuyue_date', 'yuyue_time', 'number'));
            $data['user_id'] = (int) $this->uid;
            $data['shop_id'] = (int) $shop_id;
            $data['name'] = htmlspecialchars($data['name']);
            if (empty($data['name'])) {
                $this->error('称呼不能为空');
            }
            $data['content'] = htmlspecialchars($data['content']);
            if (empty($data['content'])) {
                $this->error('留言不能为空');
            }
            $data['mobile'] = htmlspecialchars($data['mobile']);
            if (empty($data['mobile'])) {
                $this->error('手机不能为空');
            }
            if (!isMobile($data['mobile'])) {
                $this->error('手机格式不正确');
            }
            $data['yuyue_date'] = htmlspecialchars($data['yuyue_date']);
            $data['yuyue_time'] = htmlspecialchars($data['yuyue_time']);
            if (empty($data['yuyue_date']) || empty($data['yuyue_time'])) {
                $this->error('预定日期不能为空');
            }
            if (!isDate($data['yuyue_date'])) {
                $this->error('预定日期格式错误！');
            }
            $data['number'] = (int) $data['number'];
            $data['create_time'] = NOW_TIME;
            $data['create_ip'] = get_client_ip();
            $obj = D('Shopyuyue');
            $data['code'] = $obj->getCode();
            if ($obj->add($data)) {
                D('Sms')->sendSms('sms_shop_yuyue', $data['mobile'], array(
                    'shop_name' => $detail['shop_name'],
                    'shop_tel' => $detail['tel'],
                    'shop_addr' => $detail['addr'],
                    'code' => $data['code']
                ));
                D('Shop')->updateCount($shop_id, 'yuyue_total');
                $this->success('预约成功！', U('ele/detail', array('shop_id' => $detail['shop_id'])));
            }
            $this->error('操作失败！');
        } else {
            $this->assign('yuyue_date', htmlspecialchars(cookie('yuyue_date')));
            $this->assign('yuyue_time', htmlspecialchars(cookie('yuyue_time')));
            $this->assign('number', (int) cookie('number'));
            $this->assign('shop_id', $shop_id);
            $this->assign('detail', $detail);
            $this->display();
        }
    }

    public function elecancle($order_id = 0) {
        if (is_numeric($order_id) && ($order_id = (int) $order_id)) {
            if (!$detial = D('Eleorder')->find($order_id)) {
                $this->error('您取消的订单不存在');
            }
            if ($detial['user_id'] != $this->uid) {
                $this->error('请不要操作别人的订单');
            }
            if ($detial['is_pay'] == 0) {
                $this->error('当前状态不能退款');
            }
            if ($detial['status'] != 1) {
                $this->error('当前状态不能退款');
            }
            $obj = D('Eleorder');
            $obj->save(array('order_id' => $order_id, 'closed' => 1));
            $this->success('删除成功！', U('member/eleorder'));
        } else {
            $this->error('请选择要取消的订单');
        }
    }

}
