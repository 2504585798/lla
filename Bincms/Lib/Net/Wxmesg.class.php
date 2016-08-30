<?php 
/*+=================================================
  +==============微信模板消息数据格式封装===========
  +=================================================
  */
class Wxmesg{
	/**
	 * 网络发送数据
	 * @param string $uid,用户的openid
	 * @param string $serial,模板编号
	 * @param array  $data ,填充模板数据
	 */
	static public function net($uid,$serial=null,$data=null)
	{
		if(!$uid) throw new Exception("Uid参数不正确！");

		$openid = D('Connect')->where("type='weixin'")->getFieldByUid($uid,'open_id'); 
		if($openid){
			if(!$serial)     throw new Exception("模板编号参数不正确！", 1000);
			if(empty($data)) throw new Exception("没有数据可供发送！");
            $data['template_id'] = D('Weixintmpl')->getFieldBySerial($serial,'template_id');//支付成功模板
            $data['touser']  = $openid;
            return D('Weixin')->tmplmesg($data);
		}
		return false;
	}
	/**
	 * 下单成功模板
	 */
	static public function order($data=null)
	{
		if(empty($data)) throw new Exception("微信模板消息没有数据！",1001);
		return array(
			'touser'       => '',
			'url'          => $data['url'],
			'template_id'  => '',
			'topcolor'     => $data['topcolor'],
			'data'		   => array(
				'first'   =>array('value'=>	$data['first'],    'color'=>'#000000'),
				'keyword1'=>array('value'=> $data['orderNum'], 'color'=>'#000000'), //订单号
				'keyword2'=>array('value'=> $data['goodsName'],'color'=>'#000000'), //商品名称
				'keyword3'=>array('value'=> $data['buyNum'],   'color'=>'#000000'), //订购数量
				'keyword4'=>array('value'=> $data['money'],    'color'=>'#000000'), //订单金额
				'keyword5'=>array('value'=> $data['payType'],  'color'=>'#000000'), //付款方式
				'remark'  =>array('value'=> $data['remark'],   'color'=>'#000000')
			)
		);
	}
	//支付成功
	static public function pay($data=null)
	{
		if(empty($data)) throw new Exception("微信模板消息没有数据！",1002);
		return array(
			'touser'       => '',
			'url'          => $data['url'],
			'template_id'  => '',
			'topcolor'     => $data['topcolor'],
			'data'		   => array(
				'first'   =>array('value'=>$data['first'],   'color'=>'#000000'),
				'keyword1'=>array('value'=>$data['money'],   'color'=>'#000000'), //订单金额
				'keyword2'=>array('value'=>$data['orderInfo'],'color'=>'#000000'), //订单详情
				'keyword3'=>array('value'=>$data['addr'],    'color'=>'#000000'), //收货信息
				'keyword4'=>array('value'=>$data['orderNum'],'color'=>'#000000'), //订单编号
				'remark'  =>array('value'=>$data['remark'],  'color'=>'#000000')
			)
		);
	}
	//订单取消
	static public function cancle($data=null)
	{
		if(empty($data)) throw new Exception("微信模板消息没有数据！");
		return array(
			'touser'       => '',
			'url'          => $data['url'],
			'template_id'  => '',
			'topcolor'     => $data['topcolor'],
			'data'		   => array(
				'first'   =>array('value'=>$data['first'],              'color'=>'#000000'),
				'orderProductPrice'=>array('value'=>$data['money'],     'color'=>'#000000'),  //订单金额
				'orderProductName' =>array('value'=>$data['orderInfo'], 'color'=>'#000000'), //商品详情
				'orderAddress'     =>array('value'=>$data['addr'],      'color'=>'#000000'), //收货地址
				'orderName'        =>array('value'=>$data['orderNum'],  'color'=>'#000000'), //订单编号
				'remark'           =>array('value'=>$data['remark'],    'color'=>'#000000')
			)
		);
	}
	//商家确认
	static public function sure($data=null)
	{
		if(empty($data)) throw new Exception("微信模板消息没有数据！");
		return array(
			'touser'       => '',
			'url'          => $data['url'],
			'template_id'  => '',
			'topcolor'     => $data['topcolor'],
			'data'		   => array(
				'first'   =>array('value'=> $data['first'],     'color'=>'#000000'),
				'keyword1'=>array('value'=> $data['orderNum'],  'color'=>'#000000'), //订单编号
				'keyword2'=>array('value'=> $data['money'],     'color'=>'#000000'), //订单金额
				'keyword3'=>array('value'=> $data['orderDate'], 'color'=>'#000000'), //订单时间
				'remark'  =>array('value'=> $data['remark'],    'color'=>'#000000')
			)
		);
	}
	//已发货
	static public function deliver($data=null)
	{
		if(empty($data)) throw new Exception("微信模板消息没有数据！");
		return array(
			'touser'       => '',
			'url'          => $data['url'],
			'template_id'  => '',
			'topcolor'     => $data['topcolor'],
			'data'		   => array(
				'first'   =>array('value'=> $data['first'],     'color'=>'#000000'),
				'keyword1'=>array('value'=> $data['orderInfo'], 'color'=>'#000000'), //订单内容
				'keyword2'=>array('value'=> $data['wuliu'],     'color'=>'#000000'), //物流服务
				'keyword3'=>array('value'=> $data['wuliuNum'],  'color'=>'#000000'), //快递单号
				'keyword4'=>array('value'=> $data['addr'],      'color'=>'#000000'), //收货信息
				'remark'  =>array('value'=> $data['remark'],    'color'=>'#000000')
			)
		);
	}
	//确认收货
	static public function take($data=null)
	{
		if(empty($data)) throw new Exception("微信模板消息没有数据！");
		return array(
			'touser'       => '',
			'url'          => $data['url'],
			'template_id'  => '',
			'topcolor'     => $data['topcolor'],
			'data'		   => array(
				'first'   =>array('value'=> $data['first'],    'color'=>'#000000'),
				'keyword1'=>array('value'=> $data['orderNum'], 'color'=>'#000000'), //订单号
				'keyword2'=>array('value'=> $data['goodsName'],'color'=>'#000000'), //商品名称
				'keyword3'=>array('value'=> $data['orderDate'],'color'=>'#000000'), //下单时间
				'keyword4'=>array('value'=> $data['sendDate'], 'color'=>'#000000'), //发货时间
				'keyword5'=>array('value'=> $data['sureDate'], 'color'=>'#000000'), //收货时间
				'remark'  =>array('value'=> $data['remark'],   'color'=>'#000000')
			)
		);
	}
	//余额变动
	static public function balance($data=null)
	{
		if(empty($data)) throw new Exception("微信模板消息没有数据！");
		return array(
			'touser'       => '',
			'url'          => $data['url'],
			'template_id'  => '',
			'topcolor'     => $data['topcolor'],
			'data'		   => array(
				'first'   =>array('value'=> $data['first'],       'color'=>'#000000'),
				'keyword1'=>array('value'=> $data['accountType'], 'color'=>'#000000'), //账户类型
				'keyword2'=>array('value'=> $data['operateType'], 'color'=>'#000000'), //操作类型
				'keyword3'=>array('value'=> $data['operateInfo'], 'color'=>'#000000'), //操作内容
				'keyword4'=>array('value'=> $data['limit'],       'color'=>'#000000'), //变动额度
				'keyword5'=>array('value'=> $data['balance'],     'color'=>'#000000'), //账户余额
				'remark'  =>array('value'=> $data['remark'],      'color'=>'#000000')
			)
		);
	}
}


 // $_data = array(
 //            'url'        => 'http://www.baocms.cn',
 //            'topcolor'   => '#FF0000',
 //            'first'      => '亲,您的订单创建成功,详情如下:',
 //            'remark'     => '更多惊喜,请登录www.baocms.cn！',
 //            'orderNum'   => '100039890',
 //            'goodsName'  => '小米note4G电信版Android智能手机',
 //            'buyNum'     => '1',
 //            'money'      => '1599元',
 //            'payType'    => '货到付款',
 //        );
 //        $_data_pay = array(
 //            'url'       =>  'http://www.baocms.cn',
 //            'topcolor'  =>  '#F55555',
 //            'first'     =>  '亲,您的支付订单我们已经收到',
 //            'remark'    =>  '更多淘货,请登录http://www.baocms.cn',
 //            'money'     =>  '500元',
 //            'orderInfo' =>  '小米智能Watch3.0',
 //            'addr'      =>  '安徽合肥蜀山区望江东路',
 //            'orderNum'  =>  '100056-098'
 //        );
 //        $_data_cancle = array(
 //            'url'       =>  'http://www.baocms.cn',
 //            'topcolor'  =>  '#F55555',
 //            'first'     =>  '亲,您的生活宝订单已取消',
 //            'remark'    =>  '有疑问请联系客服：0551-6897668',
 //            'money'     =>  '1500元',
 //            'orderInfo' =>  '捷安特GIANTE山地自行车套装系列',
 //            'addr'      =>  '安徽合肥政务区华润五彩城国际9层' ,
 //            'orderNum'  =>  '10089977-99'
 //        );
 //        $_data_sure = array(
 //            'url'       =>  'http://www.baocms.cn',
 //            'topcolor'  =>  '#F55555',
 //            'first'     =>  '亲,您的订单卖家已收到',
 //            'remark'    =>  '有疑问请联系卖家：0551-6897668',
 //            'orderNum'  =>  '1009899000',
 //            'money'     =>  '2000元',
 //            'orderDate' =>   date('Y年m月d日 H:i:s')
 //        );
 //        $_data_deliver  = array(
 //            'url'       =>  'http://www.baocms.cn',
 //            'topcolor'  =>  '#F55555',
 //            'first'     =>  '亲,卖家已经发货了,注意查收哦',
 //            'remark'    =>  '有疑问请联系卖家：0551-6897668',
 //            'orderInfo' =>  '三星笔记本电脑Nxc679超极本系列',
 //            'wuliu'     =>  '顺丰快递',
 //            'wuliuNum'  =>  'E090909ET789',
 //            'addr'      =>  '广东省东莞市奇楠路888号'
 //        );
 //        $_data_balance = array(
 //            'url'       =>  'http://www.baocms.cn',
 //            'topcolor'  =>  '#F55555',
 //            'first'     =>  '亲,您的生活宝账户有变动',
 //            'remark'    =>  '有疑问请联系生活宝：0551-6897689',
 //            'accountType' => '生活宝VIP贵宾账户',
 //            'operateType' => '费用支出',
 //            'operateInfo' => '在南国购买捷安特山地自行车',
 //            'limit'       => '-1599元',
 //            'balance'     => '25000元'
 //        );
 //        $_data_take = array(
 //            'url'       =>  'http://www.baocms.cn',
 //            'topcolor'  =>  '#F55555',
 //            'first'     =>  '亲,您的订单已确认收货',
 //            'remark'    =>  '有疑问请联系生活宝：0551-6897689',
 //            'orderNum'  =>  '1009890',
 //            'goodsName' =>  '美国B2型隐形战机',
 //            'orderDate' =>  '2014年01月05日',
 //            'sureDate'  =>  '2015年09月01日',
 //            'sendDate'  =>  '2015年05月01日'
 //        );


//include_once "/Baocms/Lib/Net/Wxmesg.class.php";
//$order_data = Wxmesg::order($_data);OPENTM202297558
// $pay_data  = Wxmesg::pay($_data_pay); OPENTM201490088
// $cancle_data = Wxmesg::cancle($_data_cancle); TM9990998
//$sure_data = Wxmesg::sure($_data_sure);OPENTM201495678
// $deliver_data = Wxmesg::deliver($_data_deliver);OPENTM201495888
//$balance_data = Wxmesg::balance($_data_balance);OPENTM201495900
//$take_data = Wxmesg::take($_data_take);
//$return = Wxmesg::net($this->uid, 'TM99900000', $take_data);