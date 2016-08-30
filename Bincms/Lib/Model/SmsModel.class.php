<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。

class SmsModel extends CommonModel{
    protected $pk   = 'sms_id';
    protected $tableName =  'sms';
    protected $token  = 'bao_sms';
    
    public function sendSms($code,$mobile,$data){
        $tmpl = $this->fetchAll();
        if(!empty($tmpl[$code]['is_open'])){
            $content = $tmpl[$code]['sms_tmpl'];
            $config = D('Setting')->fetchAll();
            $data['sitename'] = $config['site']['sitename'];
            $data['tel']      = $config['site']['tel'];
            foreach($data as $k=>$val){
                 $val = str_replace('【', '', $val);
                $val = str_replace('】', '', $val);
               $content =  str_replace('{'.$k.'}', $val, $content);
            }
            if(is_array($mobile)){
                $mobile = join(',',$mobile);
            }
          
            if($config['sms']['charset']){
                $content = auto_charset($content,'UTF8','gbk');
            }
            $local = array(
                'mobile'    => $mobile,
                'content'   => $content
            );
            $http = tmplToStr($config['sms']['url'], $local);
            $res = file_get_contents($http);
            if($res == $config['sms']['code']) return true;
        }
        return false;
    }
    
    public function mallTZshop($order_id){
        if(is_numeric($order_id) &&  ($order_id = (int)$order_id)){
           $order_id = array($order_id); 
        }
        $orders = D('Order')->itemsByIds($order_id);
        $shop = array();
        foreach($orders as $val){
            $shop[$val['shop_id']] =$val['shop_id'];             
        }
        $shops = D('Shop')->itemsByIds($shop);
        foreach($shops as $val){            
            $this->sendSms('sms_shop_mall', $val['mobile'], array());
        }
        return true;
    }
    
    public function eleTZshop($order_id){
        if(is_numeric($order_id) &&  ($order_id = (int)$order_id)){
          $shop_id = D('Eleorder')->find($order_id); 
          $shop = D('Shop')->find($shop_id);
          $this->sendSms('sms_shop_ele', $shop['mobile'], array());
        }
        return true;
    }

public function dingTZshop($order_id){
        if(is_numeric($order_id) &&  ($order_id = (int)$order_id)){
          $ding_id = D('Shopdingorder')->find($order_id); //订座id
		  $shop_id=D('Shopdingyuyue')->find($ding_id['ding_id']);//商家id
		
          $shop = D('Shopdingsetting')->find($shop_id);
          $this->sendSms('sms_shop_ding', $shop['mobile'], array());
        }
        return true;
    }
    
    
     public function tuanTZshop($shop_id){
        $shop_id = (int)$shop_id;
        $shop = D('Shop')->find($shop_id);
        //file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Model/aaa.txt', var_export($shop, true));
        $this->sendSms('sms_shop_tuan', $shop['mobile'], array());
        return true;
    }
  
    
     public function fetchAll(){
        $cache = cache(array('type'=>'File','expire'=>  $this->cacheTime));
        if(!$data = $cache->get($this->token)){
            $result = $this->order($this->orderby)->select();
            $data = array();
            foreach($result  as $row){
                $data[$row['sms_key']] = $row;
            }
            $cache->set($this->token,$data);
        }   
        return $data;
     }
  
}