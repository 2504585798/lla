<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。
class  CommonAction extends  Action{
    protected  $_CONFIG = array();
    protected  $_token  = '07e9d1f8962c13a5f3366c2ca23126e0'; //默认的TOKEN
    protected  $shop_id = 0;
    protected  $shopdetails = array();
    protected  $weixin = null;
    protected  function _initialize(){ //SHOP_ID 为空的时候        
        $this->_CONFIG = D('Setting')->fetchAll();               
        define('__HOST__', 'http://'.$_SERVER['HTTP_HOST']);
        $this->shop_id = empty($_GET['shop_id']) ? 0 : (int)$_GET['shop_id'];
        if(!empty($this->shop_id)){
            $this->shopdetails = D('Shopdetails')->find($this->shop_id);
        }
        $this->_token = $this->_get_token();
       // file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/cc.txt',  $this->_token);
       // file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/aaa.txt', var_export($_GET,true));
        $this->weixin = D('Weixin');
        $this->weixin->init($this->_token); // 修改了 ThinkWechat  让他支持  主动发送微信消息
       
    }           
    
 


    protected function _get_token(){     
        if(!empty($this->shop_id)){
            return $this->shopdetails['token'];
        }
        return $this->_CONFIG['weixin']['token']; 
    }
   
    
}