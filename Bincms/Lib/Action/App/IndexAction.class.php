<?php
/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。
class IndexAction extends CommonAction
{
	public function index()
	{
		echo 'Hello';
	}
	//列表首页
	public function items()
	{
		//接收BAO筛选条件
        $aready  = (int) $this->_param('aready');
        //接收BAO城市ID
        $city_id = (int) $this->_param('city_id');

        if ($aready == 1) {
            $order = 'create_time desc';
        } elseif ($aready == 2) {
            $order = 'sold_num desc';
        } elseif ($aready == 3) {
            $order = 'views desc';
        }

        $map = array('audit' => 1, 'closed' => 0, 'city_id' => $city_id, 'end_date' => array('EGT', TODAY));

        $tuan= D('Tuan');
        //分页功能
		$count = $tuan->where($map)->count();
		$limit = 10;
		$pages = ceil($count/$limit);
		$page  = $this->_param('page');
		$page  = $page<=$pages?($page>=1?$page:1):$pages;

		$_page = $page--;
        $tuan_list = $tuan->where($map)->order($order)->limit($_page.','.$limit)->select();

        $this->stringify(array('status'=>self::BAO_REQUEST_SUCCESS,'tuan_list'=>$tuan_list,'page'=>$page+1));
	}

	// 这里的代码在mobile首页被调用。新版6.0重新编写
	public function push() {  
	  	//uid,lat,lng,
        $lat = $this->lat;//CommonAction获取
        $lng = $this->lng;//CommonAction获取

        if ($this->uid) {
            $looks = D('Userslook')->where(array('user_id' => $this->uid))->order(array('look_id' => 'desc'))->limit(0, 50)->select();
            if (count($looks) > 20) { //保险起见
                $shop_ids = array();
                foreach ($looks as $val) {
                    $shop_ids[$val['shop_id']] = $val['shop_id'];
                }
                $tuans = D('Tuan')->order(" (ABS(lng - '{$lng}') +  ABS(lat - '{$lat}') ) asc ")->where(array('shop_id' => array('IN', $shop_ids), 'closed' => 0,'city_id'=>$this->city_id, 'audit' => 1, 'bg_date' => array('ELT', TODAY), 'end_date' => array('EGT', TODAY)))->limit(0, 10)->select();
            } else {
                $tuans = D('Tuan')->order(" (ABS(lng - '{$lng}') +  ABS(lat - '{$lat}') ) asc ")->where(array('closed' => 0,'city_id'=>$this->city_id, 'audit' => 1, 'bg_date' => array('ELT', TODAY), 'end_date' => array('EGT', TODAY)))->limit(0, 10)->select();
            }
        } else {
            $tuans = D('Tuan')->order(" (ABS(lng - '{$lng}') +  ABS(lat - '{$lat}') ) asc ")->where(array('closed' => 0,'city_id'=>$this->city_id, 'audit' => 1, 'bg_date' => array('ELT', TODAY), 'end_date' => array('EGT', TODAY)))->limit(0, 10)->select();
        }

        foreach ($tuans as $k => $val) {
            $tuans[$k]['d'] = getDistance($lat, $lng, $val['lat'], $val['lng']);
        }
        if($tuans){
        	$this->stringify(array('status'=>self::BAO_REQUEST_SUCCESS,'tuan_list'=>$tuans));
        }else{
        	$this->stringify(array('status'=>self::BAO_DETAIL_NO_EXSITS,'msg'=>'没有数据！'));
        }
    }


    public function search() {
        $keys = D('Keyword')->fetchAll();
        $keytype = D('Keyword')->getKeyType();
        $this->stringify(array('status'=>self::BAO_REQUEST_SUCCESS,'keys'=>$keys,'keytype'=>$keytype));
    }
}