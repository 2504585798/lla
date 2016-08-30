<?php
class NearAction extends CommonAction {
	
    public function index() {

		//获取用户自定坐标
		$lat = cookie('lat_ok');
		$lng = cookie('lng_ok');
		if(empty($lat) || empty($lng)){
			$lat = cookie('lat');
			$lng = cookie('lng');
		}
		
		//获取用户数据库坐标
		if(!empty($this->uid)){
			if(empty($lat) || empty($lng)){
				$usrdata = D('Users')->find($this->uid);
				$lat = $usrdata['lat'];
				$lng = $usrdata['lng'];
			}
		}
		
		//获取系统默认坐标
		if(empty($lat) || empty($lng)){	
            $lat = $this->_CONFIG['site']['lat'];
            $lng = $this->_CONFIG['site']['lng'];
		}
		//获取地理位置
		$place = cookie('place');
		if(empty($place)){
			$place = $this->getArea($lat,$lng);
			cookie('place',$place);
		}
		
		$this->assign('place',$place);
        $this->display();
    }
	
///以下是重新添加的开始！！！！！	

	/* 通过接口将坐标转地理位置 */
function getArea($lat,$lng){

		/*$courl ='http://api.map.baidu.com/ag/coord/convert?from=0&to=4&x='.$lng.'&y='.$lat;//  校准坐标
		///echo $courl;exit;
	    $coarr = file_get_contents($courl);
		$coarr = json_decode($coarr);
        $lat = base64_decode($coarr->x);
	    $lng= base64_decode($coarr->y);*/
		//	echo $lat.'=='.$lng;exit;
	$url ='http://api.map.baidu.com/geocoder/v2/?ak=C9613fa45f450daa331d85184c920119&location='.$lat.','.$lng.'&output=json&pois=1';
	//echo $url;exit;
	$arr = file_get_contents($url);
	$arr = json_decode($arr);
	$place = $pois = $po = array();
	foreach ($arr->result->pois as $value) {
		$po['name'] = $value->name;
		$po['addr'] = $value->addr;
		$pois[] = $po;
	}
	$place['formatted_address'] = $arr->result->formatted_address;
	//$place['sematic_description'] = $arr->result->sematic_description;
	$place['pois'] = $pois;
	return $place;
}


/**
       * 腾讯地图坐标转百度地图坐标
       * @param [String] $lat 腾讯地图坐标的纬度
       * @param [String] $lng 腾讯地图坐标的经度
       * @return [Array] 返回记录纬度经度的数组
*/


function ErroToBd($lat,$lng){
	$x_pi = 3.14159265358979324 * 3000.0 / 180.0; 
	$x = $lng;
	$y = $lat;
	$z = sqrt($x * $x + $y * $y) + 0.00002 * sin($y * $x_pi);  
	$theta = atan2($y, $x) + 0.000003 * cos($x * $x_pi);
	$bd_lon = $z * cos($theta) + 0.0065;  
	$bd_lat = $z * sin($theta) + 0.006;
	
	return array('lat'=>$bd_lat,'lng'=>$bd_lon);
	
}


/*对象转换为数组*/
function object_array($array) {  
    if(is_object($array)) {  
        $array = (array)$array;  
     } if(is_array($array)) {  
         foreach($array as $key=>$value) {  
             $array[$key] = object_array($value);  
             }  
     }  
     return $array;  
}

//重复数组
function a_array_unique($array){
   $out = array();
   foreach ($array as $key=>$value){
       if (!in_array($value, $out)){
           $out[$key] = $value;
       }
   }
   return $out;
}

//坐标范围
function returnSquarePoint($lng, $lat,$distance){
    $dlng =  2 * asin(sin($distance / (2 * 6378.2)) / cos(deg2rad($lat)));
    $dlng = rad2deg($dlng);
    $dlat = $distance/6378.2;
    $dlat = rad2deg($dlat);
    return array(
		'left-top'=>array('lat'=>$lat + $dlat,'lng'=>$lng-$dlng),
		'right-top'=>array('lat'=>$lat + $dlat, 'lng'=>$lng + $dlng),
		'left-bottom'=>array('lat'=>$lat - $dlat, 'lng'=>$lng - $dlng),
		'right-bottom'=>array('lat'=>$lat - $dlat, 'lng'=>$lng + $dlng)
	);
}

//偏移换算
function placeToBaidu($lng,$lat){
	$p = 3.14159265358979324 * 6378.2 / 360.0;
	$x = $lng;
	$y = $lat;
	$z = sqrt($x * $x + $y * $y) + 0.00002 * sin($y * $p); 
	$theta = atan2($y, $x) + 0.000003 * cos($x * $p); 
	$bd_lng = $z * cos($theta) + 0.0065;
	$bd_lat = $z * sin($theta) + 0.006;
	return array('lng' => $bd_lng ,'lat' => $bd_lat);
}



///以上是重新添加的加完毕！！！！！
	
    public function dingwei() {
		$lat = cookie('lat');
		$lng = cookie('lng');
		if(cookie('localed')!=2 || empty($lat) || empty($lng)){
			$local = array($this->_param('lat'),$this->_param('lng'));
			cookie('lat_ok',$local[0],3600);
			cookie('lng_ok',$local[1],3600);
			cookie('lat',$local[0],3600);
			cookie('lng',$local[1],3600);
			$addr = $this->getArea($local[0],$local[1]);//修改方法getArea，提示错误，以前是云端验证
			cookie('addr',$addr,3600);
			if(!empty($addr)){
				cookie('localed',2);
			}
		}
		echo '1';
    }
	
	public function address(){
		$addr = cookie('addr');
		echo $addr['formatted_address'];//.'('.$addr['sematic_description'].')';
	}
	
	
	
	public function reset(){
		$local = array($this->_param('lat'),$this->_param('lng'));//现在是云端校准坐标，需要二次开发到本地校准
		cookie('lat_ok',$local['0'],3600);
		cookie('lng_ok',$local['1'],3600);
		cookie('lat',$local['0'],3600);
		cookie('lng',$local['1'],3600);
  //print_r($local);exit;
		$addr = $this->getArea($local['0'],$local['1']);//修改方法getArea，提示错误，以前是云端验证
	    //$addr = $addr['formatted_address'];
		cookie('addr',$addr,3600);
		if(!empty($addr)){
			cookie('localed',1);
		}
		
		echo $addr['formatted_address'];//.'('.$addr['sematic_description'].')';
	}
	
	
	
	public function search() {
		$keyword = urlencode($this->_param('keyword', 'htmlspecialchars'));
		$this->assign('nextpage', LinkTo('near/loaddata', array('keyword' => $keyword, 't' => NOW_TIME, 'p' => '0000')));
		$this->assign('keyword',urldecode($keyword));
		$this->display();
	}
	
	
    public function loaddata() {
		set_time_limit(0);
		$lat = cookie('lat');
		$lng = cookie('lng');
		
		if(empty($lat) || empty($lng)){
			die;
		}
		
		$keyword = $this->_param('keyword');
		import('ORG.Util.Page'); // 导入分页类
        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];

		//验证城市信息
		if(session('city_code')==''){
			$place = D('Cloud')->GetAddress($lat,$lng);
			$place = json_decode($place);
		//print_r($place);exit;
			$city_code = $place->result->addressComponent->city;
			session('city_code',$city_code);
		}else{
			$city_code =session('city_code');
		}
		
		// 获取周边信息
		$key = urldecode($keyword);
		$arr = D('Cloud')->NearData($lat,$lng,$key,$p);
		
		//print_r($arr);exit;
		$num = intval($arr->status);
		$result = $arr->results;
		
//print_r($result);exit;
		if($num == 0 ){
			foreach ($result as $value){
				$data = array();
				$data['uid'] = $value->uid;
				$data['name'] = $value->name;
				$data['type'] = $value->detail_info->type;
				$data['lat'] = $value->location->lat;
				$data['lng'] = $value->location->lng;
				$data['telephone']= $value->telephone;
				$data['address']= $value->address;
				$data['tag']= $value->detail_info->tag;
				$data['orderby']= 0;
				$data['create_time']= NOW_TIME;

				if($this->_CONFIG['site']['citycode'] == $city_code ){
					// 查询数据库是否有记录,有:大于30天更新，没有则录入数据
					$pois = D('Near')->where(array('uid' => $value->uid))->find();
					if(!empty($pois['pois_id'])){
						$data['pois_id'] = $pois['pois_id'];
						$creat_time = intval($pois['create_time']);
						$time_plus = NOW_TIME - $creat_time;
						if( $time_plus >1314871 && $pois['is_lock']==0){
							D('Near')->save($data);
						}
					}else{
						D('Near')->add($data);
					}
				}
				$poi[] = $data; 
			}
			
		}
		$this->assign('lat',$lat);
		$this->assign('lng',$lng);
		$this->assign('keyword',urldecode($keyword));
		$this->assign('poi',$poi);
		$this->display();
    }
	
	
	
	public function detail($id){

		//获取用户自定坐标
		//$local = D('Near')->GetLocation();以前的方法
		$local = $this->location();//修改后现在的方法
		$lat = $local['lat'];
		$lng = $local['lng'];
		
		//判断查询类型
		if(is_numeric($id)){
			$detail = D('Near')->where(array('pois_id' => $id))->find();
		}else{
			$detail = D('Near')->where(array('uid' => $id))->find();
		}
		//如果是入驻商家
		if(!empty($detail['shop_id'])){
			$shop = D('Shop')->find($detail['shop_id']);
			$this->assign('shop',$shop);
		}
		//本地没有数据到远程获取
		if(empty($detail) && !is_numeric($id) ){
			$bdurl = 'http://api.map.baidu.com/place/v2/detail?uid='.$id.'&ak=C9613fa45f450daa331d85184c920119&output=json&scope=2';
			$bdtxt = file_get_contents($bdurl);
			$bdarr = json_decode($bdtxt);
			$detail['uid'] = $bdarr->result->uid;
			$detail['name'] = $bdarr->result->name;
			$detail['type'] = $bdarr->result->detail_info->type;
			$detail['lat'] = $bdarr->result->location->lat;
			$detail['lng'] = $bdarr->result->location->lng;
			$detail['telephone']= $bdarr->result->telephone;
			$detail['address']= $bdarr->result->address;
			$detail['tag']= $bdarr->result->detail_info->tag;
		}

		$distance = getDistanceCN($detail['lat'],$detail['lng'],$lat,$lng);
		$this->assign('distance',$distance);
		$this->assign('detail',$detail);
		$this->assign('lat',$lat);
		$this->assign('lng',$lng);
		$this->display();
	}


	public function gps($id){
		
		//获取用户自定坐标
		$local = $this->location();/////////////////////修改后现在的方法，以前是云端验证
		$lat = $local['lat'];
		$lng = $local['lng'];
		
		//判断查询类型
		if(is_numeric($id)){
			$detail = D('Near')->where(array('pois_id' => $id))->find();
		}else{
			$detail = D('Near')->where(array('uid' => $id))->find();
		}

		//本地没有数据到远程获取
		if(empty($detail) && !is_numeric($id) ){
			$bdurl = 'http://api.map.baidu.com/place/v2/detail?uid='.$id.'&ak=C9613fa45f450daa331d85184c920119&output=json&scope=2';
			$bdtxt = file_get_contents($bdurl);
			$bdarr = json_decode($bdtxt);
			$detail['uid'] = $bdarr->result->uid;
			$detail['name'] = $bdarr->result->name;
			$detail['type'] = $bdarr->result->detail_info->type;
			$detail['lat'] = $bdarr->result->location->lat;
			$detail['lng'] = $bdarr->result->location->lng;
			$detail['telephone']= $bdarr->result->telephone;
			$detail['address']= $bdarr->result->address;
			$detail['tag']= $bdarr->result->detail_info->tag;
		}

		$this->assign('detail',$detail);
		$this->assign('lat',$lat);
		$this->assign('lng',$lng);
		$this->display();
	}
	
	
	
    public function select() {
		
		//获取用户自定坐标
		$lat = cookie('lat_ok');
		$lng = cookie('lng_ok');
		if(empty($lat) || empty($lng)){
			$lat = cookie('lat');
			$lng = cookie('lng');
		}
		
		
		//获取用户数据库坐标
		if(!empty($this->uid)){
			if(empty($lat) || empty($lng)){
				$usrdata = D('Users')->find($this->uid);
				$lat = $usrdata['lat'];
				$lng = $usrdata['lng'];
			}
		}

		
		//获取系统默认坐标
		if(empty($lat) || empty($lng)){	
            $lat = $this->_CONFIG['site']['lat'];
            $lng = $this->_CONFIG['site']['lng'];
		}
		//获取地理位置
		$place = cookie('place');
		if(empty($place)){
			$place = getArea($lat,$lng);
			cookie('place',$place);
		}
		
		//获取地址推荐
		$url = 'http://api.map.baidu.com/geocoder/v2/?ak=C9613fa45f450daa331d85184c920119&location='.$lat.','.$lng.'&output=json&pois=1';
		$json = file_get_contents($url);
		$geo = object_array(json_decode($json));
		
		$this->assign('geo',$geo);
		$this->assign('place',$place);
		$this->assign('lat',$lat);
		$this->assign('lng',$lng);
		$this->display();
	}
	
	
	
	
    public function load() {
		$lat = $this->_param('lat', 'htmlspecialchars');
		$lng = $this->_param('lng', 'htmlspecialchars');
		//获取地址推荐
		$url = 'http://api.map.baidu.com/geocoder/v2/?ak=C9613fa45f450daa331d85184c920119&location='.$lat.','.$lng.'&output=json&pois=1';
		$json = file_get_contents($url);
		$geo = object_array(json_decode($json));
	
		$this->assign('geo',$geo);
        $this->display(); // 输出模板
    }
	
	
	
    public function selected() {
		$lat = $this->_param('lat', 'htmlspecialchars');
		$lng = $this->_param('lng', 'htmlspecialchars');
		
		cookie('lat_ok',null);
		cookie('lng_ok',null);
		cookie('lat_ok',$lat);
		cookie('lng_ok',$lng);
		$this->niuAlert('您的位置已经重置，请返回继续浏览！',U('index/index'));
	}
	public function location(){
	
		//获取用户自定坐标
		$lat = cookie('lat_ok');
		$lng = cookie('lng_ok');
		if(empty($lat) || empty($lng)){
			$lat = cookie('lat');
			$lng = cookie('lng');
		}
		
		//获取用户数据库坐标
		if(!empty($this->uid)){
			if(empty($lat) || empty($lng)){
				$usrdata = D('Users')->find($this->uid);
				$lat = $usrdata['lat'];
				$lng = $usrdata['lng'];
			}
		}
		
		//获取系统默认坐标
		if(empty($lat) || empty($lng)){	
            $lat = $this->_CONFIG['site']['lat'];
            $lng = $this->_CONFIG['site']['lng'];
		}
		
		$arr = array('lat'=>$lat,'lng'=>$lng);
		return $arr;
	}
	
	
}