<?php 

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2015 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。


class MobileAction extends  CommonAction{
    protected  $_CONFIG = array();
    public function _initialize() {
        parent::_initialize();
        $this->_CONFIG = D('Setting')->fetchAll();
    }

    public function  indexTuan(){
        
        
    }
    
    public function tuan(){
        echo 0;
    }
    
    public function city(){
         
         
        $ip = get_client_ip();
        import('ORG/Net/IpLocation');
        $IpLocation = new IpLocation('UTFWry.dat'); // 实例化类 参数表示IP地址库文件
        $result = $IpLocation->getlocation($ip);
        
        $city = null;    
        $citys = D('City')->fetchAll();
        $hots = array();
        $citylists = array();
        foreach($citys as $val){
            if(count($hots) < 5 ){
                $hots[] = $val;
            }
            $a = strtoupper($val['first_letter']);
            $citylists[$a][] = $val;
            
            if (strstr($result['country'], $val['name'])) {
                $city = $val;
            }
        }	
        if(empty($city)){
            $city = $citys[$this->_CONFIG['site']['city_id']];
        }
        ksort($citylists);
        
        echo json_encode(array('lists'=>$citylists,'hots'=>$hots,'city'=>$city));
        die;
    }
    
    
    
}