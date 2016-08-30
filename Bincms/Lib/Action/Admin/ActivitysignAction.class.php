<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 ×××× 项目的一部分
//
// Copyright (c) 2015 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class ActivitysignAction extends CommonAction{


    
    public  function index(){
       $Activitysign = D('Activitysign');
       import('ORG.Util.Page');// 导入分页类
       $map = array();
       $keyword = $this->_param('keyword','htmlspecialchars');
       if($keyword){
           $map['name|mobile'] = array('LIKE', '%'.$keyword.'%');
           $this->assign('keyword',$keyword);
       }
       $activity_id = (int)$this->_param('activity_id');
       if($activity_id){
           $map['activity_id'] = $activity_id;
       }
       $count      = $Activitysign->where($map)->count();// 查询满足要求的总记录数 
       $Page       = new Page($count,25);// 实例化分页类 传入总记录数和每页显示的记录数
       $show       = $Page->show();// 分页显示输出
       $list = $Activitysign->where($map)->order(array('sign_id'=>'desc'))->limit($Page->firstRow.','.$Page->listRows)->select();
       $activity_ids = array();
       foreach($list as  $val){
           $activity_ids[$val['activity_id']] = $val['activity_id'];
       }
       $this->assign('activity',D('Activity')->itemsByIds($activity_ids));
       $this->assign('list',$list);// 赋值数据集
       $this->assign('page',$show);// 赋值分页输出
       $this->display(); // 输出模板
    }




    
   
}
