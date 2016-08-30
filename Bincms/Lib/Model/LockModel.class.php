<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
//分钟级别锁！一分钟只允许过一个用户一条请求 防止用户并发恶意请求
class LockModel extends CommonModel{
    protected $pk   = 'id';
    protected $tableName =  'lock';
    
    protected $id = 0;


    public function  lock($uid){
        $uid = (int)$uid;
        $t = date('mdHi',NOW_TIME);
        $this->id= $this->add(array('uid'=>$uid,'t'=>$t));
        return $this->id;
    }
    
    public function unlock(){
        return $this->delete($this->id);
    }
}