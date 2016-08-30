<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class IndexAction extends CommonAction{
    
     public function index(){
         $menu = D('Menu')->fetchAll();
         if ($this->_admin['role_id'] != 1) {
            if ($this->_admin['menu_list']) {
                foreach ($menu as $k => $val) {
                    if (!empty($val['menu_action']) && !in_array($k, $this->_admin['menu_list'])) {
                        unset($menu[$k]);
                    }
                }
                foreach ($menu as $k1 => $v1) {
                    if ($v1['parent_id'] == 0) {
                        foreach ($menu as $k2 => $v2) {
                            if ($v2['parent_id'] == $v1['menu_id']) {
                                $unset = true;
                                foreach ($menu as $k3 => $v3) {
                                    if ($v3['parent_id'] == $v2['menu_id']) {
                                        $unset = false;
                                    }
                                }
                                if ($unset)
                                    unset($menu[$k2]);
                            }
                        }
                    }
                }
                foreach ($menu as $k1 => $v1) {
                    if ($v1['parent_id'] == 0) {
                        $unset = true;
                        foreach ($menu as $k2 => $v2) {
                            if ($v2['parent_id'] == $v1['menu_id']) {
                                $unset = false;
                            }
                        }
                        if ($unset)
                            unset($menu[$k1]);
                    }
                }
            }else {
                $menu = array();
            }
        }
         $this->assign('menuList',$menu);
         $this->display();
     }
     
     public function main(){
        $bg_time = strtotime(TODAY);
        $counts['totay_order'] = (int)D('Order')->where(array(
            'type' => 'goods',
            'create_time'=> array(
                array('ELT',NOW_TIME),
                array('EGT',$bg_time),
            ),'status' => array(
                'EGT',0
            ),
        ))->count();
        $counts['order'] = (int)D('Order')->where(array(
            'type' => 'goods',
           'status' => array(
                'EGT',0
            ),
        ))->count();
        
        $counts['totay_gold'] = (int)D('Order')->where(array(
            'type' => 'gold',
            'create_time'=> array(
                array('ELT',NOW_TIME),
                array('EGT',$bg_time),
            ),'status' => array(
                'EGT',0
            ),
        ))->count();
        $counts['gold'] = (int)D('Order')->where(array(
            'type' => 'gold',
           'status' => array(
                'EGT',0
            ),
        ))->count();
        
        $counts['today_yuyue'] = (int)D('Shopyuyue')->where(array(
            'create_time'=> array(
                array('ELT',NOW_TIME),
                array('EGT',$bg_time),
            )))->count();
         $counts['yuyue'] = (int)D('Shopyuyue')->where(array(
            'create_time'=> array(
                array('ELT',NOW_TIME),
                array('EGT',$bg_time),
            )))->count();
         
         
         $counts['today_coupon'] = (int)D('Coupondownload')->where(array(
                 'create_time'=> array(
                array('ELT',NOW_TIME),
                array('EGT',$bg_time),
            )))->count();
         $counts['coupon'] = (int)D('Coupondownload')->count();
         $counts['dianping'] = (int)D('Shopdianping')->count();
         $counts['users'] = (int)D('Users')->count();
         $counts['shops'] = (int)D('Shop')->count();
         $counts['post'] = (int)D('Post')->count();
         $v = require BASE_PATH.'/version.php';//
         $this->assign('v',$v);
         $this->assign('counts',$counts);
         $this->display();
     }
     
     public function check(){ //后期获得通知使用！
         die('1');
     }
     
}