<?php



/*

 * 软件为合肥生活宝网络公司出品，未经授权许可不得使用！

 * 作者：baocms团队

 * 84922.com

 * 邮件: youge@baocms.com  QQ 800026911

 */



class MallAction extends CommonAction {



    public function _initialize() {

        parent::_initialize();

        $goods = session('goods');

        $this->assign('cartnum', count($goods));

    }



    public function index() {

        $keyword = $this->_param('keyword', 'htmlspecialchars');

        $this->assign('keyword', $keyword);

        $cat = (int) $this->_param('cat');

        $area = (int) $this->_param('area');

        $cate_id = (int) $this->_param('cate_id');

        $order = (int) $this->_param('order');

        $this->assign('area', $area);

        $this->assign('cate_id', $cate_id);
		//$this->assign('city_id', $this->city_id);
		
		
		

        $this->assign('order', $order);

        $this->assign('cat', $cat);

        $this->assign('nextpage', LinkTo('mall/loaddata',array('cat' => $cat,'order'=>$order,'area'=>$area,'cate_id'=>$cate_id, 'keyword' => $keyword, 'p' => '0000')));

        $this->display();

    }



    public function main() {

        $cate_id = I('cate_id','','trim,intval');

        $gc = D('GoodsCate');

        if($cate_id){

            $map['cate_id'] = array('eq',$cate_id);

            $gc_name = $gc->where('cate_id ='.$cate_id)->getField('cate_name');

            $this->assign('gc_name',$gc_name);

        }



        $this->assign('cate_id',$cate_id);

        

        $where = array();

        

        $where['cate_id'] = array('in','1,14,2,6,8,21,25');

        $rgc = $gc ->where($where)-> select();

        $all_gc = $gc ->where('parent_id = 0')-> select();

        $this->assign('all_gc',$all_gc);

        $this->assign('rgc',$rgc);

        $map['city_id'] = $this->city_id;

        $map['audit'] = 1;

        $map['closed'] = 0;

        $map['end_date'] = array('egt',TODAY);

        $order = (int) $this->_param('order');

        switch ($order) {

            case 2:

                $orderby = array('sold_num' => 'desc');

                break;

            case 3:

                $orderby = array('goods_id' => 'desc');

                break;

            default:

                $orderby = array('mall_price' => 'asc' ,'orderby' => 'asc' );

                break;

        }

        $this->assign('order',$order);

        

        



        $list = D('Goods')->order($orderby)->where($map)->limit(0, 10)->select();

        $this->assign('list',$list);

        $this->display();

    }



    public function loaddata() {

        

        $Goods = D('Goods');

        import('ORG.Util.Page'); // 导入分页类

        $area = (int) $this->_param('area');

        

        $order = (int) $this->_param('order');



        if ($area) {

            $map['area_id'] = $area;

        }

        $cate_id = (int) $this->_param('cate_id');



        if ($cate_id) {

            $map['cate_id'] = $cate_id;

        }

        $map['audit'] = 1;

        $map['closed'] = 0;

        $map['end_date'] = array('egt',TODAY);



        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {

            $map['title'] = array('LIKE', '%' . $keyword . '%');

        }

        $cat = (int) $this->_param('cat');

        if ($cat) {

            $catids = D('Goodscate')->getChildren($cat);

            if (!empty($catids)) {

                $map['cate_id'] = array('IN', $catids);

            } else {

                $map['cate_id'] = $cat;

            }

        }

        $map['city_id']= $this->city_id;

        $count = $Goods->where($map)->count(); // 查询满足要求的总记录数 

        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数

        $show = $Page->show(); // 分页显示输出



        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';

        $p = $_GET[$var];

        if ($Page->totalPages < $p) {

            die('0');

        }

        

        if($order == '1'){

            $order_arr = 'create_time desc';

        }elseif($order == '2'){

            $order_arr = 'sold_num desc';

        }else{

            $order_arr = 'orderby desc';

        }

    

        $list = $Goods->where($map)->order($order_arr)->limit($Page->firstRow . ',' . $Page->listRows)->select();

        foreach ($list as $k => $val) {

            if ($val['shop_id']) {

                $shop_ids[$val['shop_id']] = $val['shop_id'];

            }

            $val['end_time'] = strtotime($val['end_date']) - NOW_TIME + 86400;

            $list[$k] = $val;

        }

        $this->assign('list', $list); // 赋值数据集

        $this->assign('page', $show); // 赋值分页输出

        $this->display(); // 输出模板

    }



    public function buy($goods_id) {

        $goods_id = (int) $goods_id;

        if (empty($goods_id)) {

            $this->error('请选择产品');

        }

        if (!$detail = D('Goods')->find($goods_id)) {

            $this->error('改商品不存在');

        }

        if ($detail['closed'] != 0 || $detail['audit'] != 1) {

            $this->error('该商品不存在');

        }

        if ($detail['end_date'] < TODAY) {

            $this->error('该商品已经过期，暂时不能购买');

        }

        $goods = session('goods');

        if (isset($goods[$goods_id])) {

            $goods[$goods_id] = $goods[$goods_id] + 1;

        } else {

            $goods[$goods_id] = 1;

        }

        session('goods', $goods);

        header("Location:" . U('mall/cart'));

        die;

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



    public function cart() {

        $goods = session('goods');

        $back = end($goods);

        $back = key($goods);//传递访问的最后一个商品的ID



        $this->assign('back',$back);

        if (empty($goods)) {

            $this->error("亲还没有选购产品呢!", U('mall/index'));

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



    public function detail($goods_id) {

        $goods_id = (int) $goods_id;

        if(empty($goods_id)){

            $this->error('商品不存在');

        }

        if(!$detail = D('Goods')->find($goods_id)){

            $this->error('商品不存在');

        }

        if($detail['closed'] != 0 || $detail['audit'] != 1){

            $this->error('商品不存在');

        }

        $shop_id = $detail['shop_id'];

        $recom = D('Goods')->where(array('shop_id' => $shop_id, 'goods_id' => array('neq', $goods_id)))->select();

        $record = D('Usersgoods');

        $insert = $record->getRecord($this->uid, $goods_id);

        $this->assign('recom', $recom);

        $this->assign('detail', $detail);

        $this->assign('shop',D('Shop')->find($shop_id));

        $this->display();

    }



    public function cartdel() {

        $goods_id = (int) $this->_get('goods_id');

        $goods = session('goods');

        if (isset($goods[$goods_id])) {

            unset($goods[$goods_id]);

            session('goods', $goods);

        }

        die('0');

    }



    public function cartdel2() {

        $goods_id = (int) $this->_get('goods_id');

        $goods = session('goods');

        if (isset($goods[$goods_id])) {

            unset($goods[$goods_id]);

            session('goods', $goods);

        }

        header("Location:" . U('mall/cart'));

        //$this->success('删除成功', U('mall/cart'));

    }



    public function  neworder(){

        $goods = $this->_get('goods');

        $goods = explode(',', $goods);

        if(empty($goods)){

            $this->error('亲购买点吧');

        }

        $datas = array();

        foreach($goods as $val){

            $good = explode('-', $val);

            $good[1] = (int)$good[1];

            if(empty($good[0])||empty($good[1])) {

                $this->error('亲购买点吧');

            }

            if($good[1] > 99 || $good[1]<0){

                $this->error('本店不支持批发');

            }

            $datas[$good[0]] = $good[1];

        }

         session('goods', $datas);

         header("Location:".U('mall/cart'));

        die;

    }

    

    public function order() {

        if (empty($this->uid)) {

            $this->niuMsg('没有登录或者登录失效',U('passport/login'));
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

            $this->niuMsg('很抱歉请填写正确的购买数量');

        $goods = D('Goods')->itemsByIds($goods_ids);

        foreach ($goods as $key => $val) {

            if ($val['closed'] != 0 || $val['audit'] != 1 || $val['end_date'] < TODAY) {

                unset($goods[$key]);

            }

        }

        if (empty($goods)) {

            $this->niuMsg('很抱歉，您提交的产品暂时不能购买！');

        }

        $tprice = 0;

        $total_mobile = 0;

        $ip = get_client_ip();

        $ordergoods = $total_price = array();



        foreach ($goods as $val) {

            $price = $val['mall_price'] * $num[$val['goods_id']];

            $js_price = $val['settlement_price'] * $num[$val['goods_id']];

            $mobile_fan = $val['mobile_fan'] * $num[$val['goods_id']];

            $m_price = $val['mall_price'] * $num[$val['goods_id']] - $val['mobile_fan'] * $num[$val['goods_id']];

            $tprice+= $m_price;

            $total_mobile += $mobile_fan;

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

        $tui = cookie('tui');

        if (!empty($tui)) {//推广部分

            $tui = explode('_', $tui);

            $tuiguang = array(

                'uid' => (int) $tui[0],

                'goods_id' => (int) $tui[1]

            );

        }



        $order_ids = array();

        foreach ($ordergoods as $k => $val) {

            $order['shop_id'] = $k;

            $order['total_price'] = $total_price[$k];

            $shop = D('Shop')->find($k);

            $order['is_shop'] = (int) $shop['is_pei']; //是否由商家自己配送



            if ($order_id = D('Order')->add($order)) { //推广ID 赋值了 

                $order_ids[] = $order_id;

                foreach ($val as $k1 => $val1) {

                    $val1['order_id'] = $order_id;

                    if (!empty($tuiguang)) {

                        if ($tuiguang['goods_id'] == $val1['goods_id']) {

                            $val1['tui_uid'] = $tuiguang['uid'];

                        }

                    }

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

                'mobile_fan' => $total_mobile,

                'create_time' => NOW_TIME,

                'create_ip' => get_client_ip(),

                'is_paid' => 0

            );

            $logs['log_id'] = D('Paymentlogs')->add($logs);

            $this->niuMsg('下单成功，接下来选择支付方式和配送地址！',U('mall/paycode', array('log_id' => $logs['log_id'])));

        } else {

            $this->niuMsg('下单成功，接下来选择支付方式和配送地址！',U('mall/pay', array('order_id' => $order_id)));

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

            $this->niuMsg('没有有效支付记录！');

        }

        if (!$detail = D('Paymentlogs')->find($log_id)) {

            $this->niuMsg('没有有效的支付记录！');

        }

        if ($detail['is_paid'] != 0 || empty($detail['order_ids']) || !empty($detail['order_id']) || empty($detail['need_pay'])) {

            $this->niuMsg('没有有效的支付记录！');

        }

        $order_ids = explode(',', $detail['order_ids']);

        $addr_id = (int) $this->_post('addr_id');

        if (empty($addr_id)) {

            $this->niuMsg('请选择一个要配送的地址！');

        }

        D('Order')->where(array('order_id' => array('IN', $order_ids)))->save(array('addr_id' => $addr_id));

        if (!$code = $this->_post('code')) {

            $this->niuMsg('请选择支付方式！');

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

            $this->niuMsg('恭喜您下单成功！', U('member/goods'));

        } else {

            $payment = D('Payment')->checkPayment($code);

            if (empty($payment)) {

                $this->niuMsg('该支付方式不存在');

            }

            $detail['code'] = $code;

            D('Paymentlogs')->save($detail);

            $this->niuMsg('订单设置完成，即将进入付款。',U('mall/combine', array('log_id' => $detail['log_id'])));

        }

    }



    public function combine() {

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

        $this->assign('logs', $detail);

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

            $this->niuMsg('该订单不存在');

        }



        $addr_id = (int) $this->_post('addr_id');



        if (empty($addr_id)) {

            $this->niuMsg('请选择一个要配送的地址！');

        }

        D('Order')->save(array('addr_id' => $addr_id, 'order_id' => $order_id));

        if (!$code = $this->_post('code')) {

            $this->niuMsg('请选择支付方式！');

        }

        

        $ua = D('UserAddr');

        $uaddr = $ua -> where('user_id ='.$order['user_id']) -> find();

       

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
                'url'       =>  "http://".$_SERVER['HTTP_HOST']."/mcenter/goods/index/aready/".$order_id.".html",
                'topcolor'  =>  '#F55555',
                'first'     =>  '亲,您的货到付款成功创建！',
                'remark'    =>  '更多信息,请登录http://'.$_SERVER['HTTP_HOST'].'！感谢您的惠顾！',
                'money'     =>  round($order['total_price']/100,2).'元',
                'goodsName' =>  $goods_name,
                'payType'   =>  '货到付款',
                'orderNum'  =>  '1-'.$order_id,
				'buyNum' 	=>  '请查看详单',
            );
            $order_data = Wxmesg::order($_data_order);
            $return   = Wxmesg::net($this->uid, 'OPENTM202297555', $order_data);//结束



            //====================微信支付通知==============================

            

           $this->niuMsg('恭喜您下单成功！', U('mcenter/goods/index'));

        }else{

            $payment = D('Payment')->checkPayment($code);

            if (empty($payment)) {

                $this->niuMsg('该支付方式不存在');

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

                'url'       =>  "http://".$_SERVER['HTTP_HOST']."/mcenter/goods/index/aready/".$order_id.".html",
                'topcolor'  =>  '#F55555',
           	    'first'     =>  '亲,您的在线支付订单已创建,请尽快支付！',
                'remark'    =>  '更多信息,请登录http://'.$_SERVER['HTTP_HOST'].'！再次感谢您的惠顾！',
                'money'     =>  round($order['total_price']/100,2).'元',
                'goodsName' =>  $goods_name,
                'payType'   =>  $payment['name'],
                'orderNum'  =>  '1-'.$order_id,
				'buyNum' 	=>  '请查看详单',
            );
            $order_data = Wxmesg::order($_data_order);
            $return   = Wxmesg::net($this->uid, 'OPENTM202297555', $order_data);//结束



            //====================微信支付通知==============================

            $this->niuMsg('订单设置完成，即将进入付款。', U('payment/payment', array('log_id' => $logs['log_id'])));

        }

    }






  public function pay3() {

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
			 //$this->ajaxReturn(array('status' => 'error', 'msg' => '请选择支付方式！')); 
            $this->error('请选择支付方式！');

        }

        

        $ua = D('UserAddr');

        $uaddr = $ua -> where('user_id ='.$order['user_id']) -> find();

       

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
                'url'       =>  "http://".$_SERVER['HTTP_HOST']."/mcenter/goods/index/aready/".$order_id.".html",
                'topcolor'  =>  '#F55555',
                'first'     =>  '亲,您的货到付款成功创建！',
                'remark'    =>  '更多信息,请登录http://'.$_SERVER['HTTP_HOST'].'！感谢您的惠顾！',
                'money'     =>  round($order['total_price']/100,2).'元',
                'goodsName' =>  $goods_name,
                'payType'   =>  '货到付款',
                'orderNum'  =>  '1-'.$order_id,
				'buyNum' 	=>  '请查看详单',
            );
            $order_data = Wxmesg::order($_data_order);
            $return   = Wxmesg::net($this->uid, 'OPENTM202297555', $order_data);//结束



            //====================微信支付通知==============================

            

           $this->error('恭喜您下单成功！', U('mcenter/goods/index'));

        }else{

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

                'url'       =>  "http://".$_SERVER['HTTP_HOST']."/mcenter/goods/index/aready/".$order_id.".html",
                'topcolor'  =>  '#F55555',
           	    'first'     =>  '亲,您的在线支付订单已创建,请尽快支付！',
                'remark'    =>  '更多信息,请登录http://'.$_SERVER['HTTP_HOST'].'！再次感谢您的惠顾！',
                'money'     =>  round($order['total_price']/100,2).'元',
                'goodsName' =>  $goods_name,
                'payType'   =>  $payment['name'],
                'orderNum'  =>  '1-'.$order_id,
				'buyNum' 	=>  '请查看详单',
            );
            $order_data = Wxmesg::order($_data_order);
            $return   = Wxmesg::net($this->uid, 'OPENTM202297555', $order_data);//结束



            //====================微信支付通知==============================

            $this->error('订单设置完成，即将进入付款。', U('payment/payment', array('log_id' => $logs['log_id'])));

        }

    }
	
	

  //====================添加分类开始=============================

public function cate() {
        if (!$cate_id = (int) $this->_param('cat')) {
            $this->error('没有该分类！');
        }
		$this->assign('cat',$cate_id);
		$this->display(); // 输出模板 
    }
   

}

