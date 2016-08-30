<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class ItemdianpingpicsModel extends CommonModel{
    protected $pk   = 'pic_id';
    protected $tableName =  'item_dianping_pics';
    
    public function upload($order_id,$photos){
        $order_id = (int)$order_id;
        $this->delete(array("where"=>array('order_id'=>$order_id)));
        foreach($photos as $val){
            $this->add(array('pic'=>$val,'order_id'=>$order_id));
        }
        return true;
    }
    
   
    
    public function getPics($order_id){
        $order_id = (int)$order_id;
        return $this->where(array('order_id'=>$order_id))->select();
    }
    
}