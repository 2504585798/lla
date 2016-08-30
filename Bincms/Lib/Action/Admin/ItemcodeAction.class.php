<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。
class ItemcodeAction extends CommonAction{
    
    
    public function overdue(){
       $Itemcode = D('Itemcode');
       import('ORG.Util.Page');// 导入分页类
       $map = array('is_used'=>0,'status'=>array('IN',array(0,1)),'fail_date'=>array('ELT',TODAY));
       if(($bg_date = $this->_param('bg_date',  'htmlspecialchars') )&& ($end_date=$this->_param('end_date','htmlspecialchars'))){
           $bg_time = strtotime($bg_date);
           $end_time = strtotime($end_date);
           $map['create_time'] = array(array('ELT',$end_time),array('EGT',$bg_time));
           $this->assign('bg_date',$bg_date);
           $this->assign('end_date',$end_date);
       }else{
           if($bg_date = $this->_param('bg_date',  'htmlspecialchars')){
               $bg_time = strtotime($bg_date);
               $this->assign('bg_date',$bg_date);
               $map['create_time'] = array('EGT',$bg_time);
           }
           if($end_date = $this->_param('end_date',  'htmlspecialchars')){
               $end_time = strtotime($end_date);
               $this->assign('end_date',$end_date);
               $map['create_time'] = array('ELT',$end_time);
           }
       }
       if($user_id = (int)  $this->_param('user_id')){
           $users = D('Users')->find($user_id);
           $this->assign('nickname',$users['nickname']);
           $this->assign('user_id',$user_id);
           $map['user_id'] = $user_id;
       }
       if($keyword = $this->_param('keyword','htmlspecialchars')){
           $map['code'] = array('LIKE', '%'.$keyword.'%');
           $this->assign('keyword',$keyword);
       } 
       if($hospital_id = (int)$this->_param('hospital_id')){
            $map['hospital_id'] = $hospital_id;
            $hospital = D('Hospital')->find($hospital_id);
            $this->assign('hospital_name',$hospital['hospital_name']);
            $this->assign('hospital_id',$hospital_id);
       }

       $count      = $Itemcode->where($map)->count();// 查询满足要求的总记录数 
       $Page       = new Page($count,15);// 实例化分页类 传入总记录数和每页显示的记录数
       $show       = $Page->show();// 分页显示输出
       $list = $Itemcode->where($map)->order(array('code_id'=>'desc'))->limit($Page->firstRow.','.$Page->listRows)->select();
       $hospital_ids = $user_ids  = array();
       foreach($list as $k=>$val){
           if(!empty($val['hospital_id'])) $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
           $user_ids[$val['user_id']] = $val['user_id'];
           $item_ids[$val['item_id']] = $val['item_id'];
       }
       
       $this->assign('list',$list);// 赋值数据集
       $this->assign('page',$show);// 赋值分页输出
       $this->assign('users',D('Users')->itemsByIds($user_ids));
       $this->assign('hospitals',D('Hospital')->itemsByIds($hospital_ids));
       $this->assign('items', D('Item')->itemsByIds($item_ids));
       $this->display(); // 输出模板
        
    }
    
    
    public function  refund(){
       $Itemcode = D('Itemcode');
       import('ORG.Util.Page');// 导入分页类
       $map = array('status'=>1);
       if(($bg_date = $this->_param('bg_date',  'htmlspecialchars') )&& ($end_date=$this->_param('end_date','htmlspecialchars'))){
           $bg_time = strtotime($bg_date);
           $end_time = strtotime($end_date);
           $map['create_time'] = array(array('ELT',$end_time),array('EGT',$bg_time));
           $this->assign('bg_date',$bg_date);
           $this->assign('end_date',$end_date);
       }else{
           if($bg_date = $this->_param('bg_date',  'htmlspecialchars')){
               $bg_time = strtotime($bg_date);
               $this->assign('bg_date',$bg_date);
               $map['create_time'] = array('EGT',$bg_time);
           }
           if($end_date = $this->_param('end_date',  'htmlspecialchars')){
               $end_time = strtotime($end_date);
               $this->assign('end_date',$end_date);
               $map['create_time'] = array('ELT',$end_time);
           }
       }
       if($user_id = (int)  $this->_param('user_id')){
           $users = D('Users')->find($user_id);
           $this->assign('nickname',$users['nickname']);
           $this->assign('user_id',$user_id);
           $map['user_id'] = $user_id;
       }
       if($keyword = $this->_param('keyword','htmlspecialchars')){
           $map['code'] = array('LIKE', '%'.$keyword.'%');
           $this->assign('keyword',$keyword);
       } 
       if($hospital_id = (int)$this->_param('hospital_id')){
            $map['hospital_id'] = $hospital_id;
            $hospital = D('Hospital')->find($hospital_id);
            $this->assign('hospital_name',$hospital['hospital_name']);
            $this->assign('hospital_id',$hospital_id);
       }

       $count      = $Itemcode->where($map)->count();// 查询满足要求的总记录数 
       $Page       = new Page($count,15);// 实例化分页类 传入总记录数和每页显示的记录数
       $show       = $Page->show();// 分页显示输出
       $list = $Itemcode->where($map)->order(array('code_id'=>'desc'))->limit($Page->firstRow.','.$Page->listRows)->select();
       $hospital_ids = $user_ids  = array();
       foreach($list as $k=>$val){
           if(!empty($val['hospital_id'])) $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
           $user_ids[$val['user_id']] = $val['user_id'];
           $item_ids[$val['item_id']] = $val['item_id'];
       }
       
       $this->assign('list',$list);// 赋值数据集
       $this->assign('page',$show);// 赋值分页输出
       $this->assign('users',D('Users')->itemsByIds($user_ids));
       $this->assign('hospitals',D('Hospital')->itemsByIds($hospital_ids));
       $this->assign('items', D('Item')->itemsByIds($item_ids));
       $this->display(); // 输出模板
    }

    
    public  function index(){
       $Itemcode = D('Itemcode');
       import('ORG.Util.Page');// 导入分页类
       $map = array();
       if(($bg_date = $this->_param('bg_date',  'htmlspecialchars') )&& ($end_date=$this->_param('end_date','htmlspecialchars'))){
           $bg_time = strtotime($bg_date);
           $end_time = strtotime($end_date);
           $map['create_time'] = array(array('ELT',$end_time),array('EGT',$bg_time));
           $this->assign('bg_date',$bg_date);
           $this->assign('end_date',$end_date);
       }else{
           if($bg_date = $this->_param('bg_date',  'htmlspecialchars')){
               $bg_time = strtotime($bg_date);
               $this->assign('bg_date',$bg_date);
               $map['create_time'] = array('EGT',$bg_time);
           }
           if($end_date = $this->_param('end_date',  'htmlspecialchars')){
               $end_time = strtotime($end_date);
               $this->assign('end_date',$end_date);
               $map['create_time'] = array('ELT',$end_time);
           }
       }
       if($user_id = (int)  $this->_param('user_id')){
           $users = D('Users')->find($user_id);
           $this->assign('nickname',$users['nickname']);
           $this->assign('user_id',$user_id);
           $map['user_id'] = $user_id;
       }
       if($keyword = $this->_param('keyword','htmlspecialchars')){
           $map['code'] = array('LIKE', '%'.$keyword.'%');
           $this->assign('keyword',$keyword);
       } 
       if($hospital_id = (int)$this->_param('hospital_id')){
            $map['hospital_id'] = $hospital_id;
            $hospital = D('Hospital')->find($hospital_id);
            $this->assign('hospital_name',$hospital['hospital_name']);
            $this->assign('hospital_id',$hospital_id);
       }
       if ($is_used = (int) $this->_param('is_used')) {
            $map['is_used'] = ($is_used === 1 ? 1 : 0);
            $this->assign('is_used', $is_used);
       }
       if ($status = (int) $this->_param('status')) {
            $map['status'] = $status === 999 ? 0 :$status;
            $this->assign('status', $status);
       }
       $count      = $Itemcode->where($map)->count();// 查询满足要求的总记录数 
       $Page       = new Page($count,15);// 实例化分页类 传入总记录数和每页显示的记录数
       $show       = $Page->show();// 分页显示输出
       $list = $Itemcode->where($map)->order(array('code_id'=>'desc'))->limit($Page->firstRow.','.$Page->listRows)->select();
       $hospital_ids = $user_ids  = array();
       foreach($list as $k=>$val){
           if(!empty($val['hospital_id'])) $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
           $user_ids[$val['user_id']] = $val['user_id'];
             $item_ids[$val['item_id']] = $val['item_id'];
       }
       
       $this->assign('list',$list);// 赋值数据集
       $this->assign('page',$show);// 赋值分页输出
       $this->assign('users',D('Users')->itemsByIds($user_ids));
       $this->assign('hospitals',D('Hospital')->itemsByIds($hospital_ids));
       $this->assign('items', D('Item')->itemsByIds($item_ids));
       $this->display(); // 输出模板
    }




    public function delete($code_id = 0){
         if(is_numeric($code_id) && ($code_id = (int)$code_id)){
             $obj =D('Itemcode');
             $obj->delete($code_id);
             $this->baoSuccess('删除成功！',U('Itemcode/index'));
         }else{
            $code_id = $this->_post('code_id',false);
            if(is_array($code_id)){     
                $obj = D('Itemcode');
                foreach($code_id as $id){
                    $obj->delete($id);
                }                
                $this->baoSuccess('删除成功！', U('Itemcode/index'));
            }
            $this->baoError('请选择要删除的抢购券');
         }
         
    }
    
    public function overdueing($code_id = 0){
        if(is_numeric($code_id) && ($code_id = (int)$code_id)){
            $detail = D('Itemcode')->find($code_id);
            if(($detail['status'] == 1 ||$detail['status'] == 0) && (int)$detail['is_used'] === 0 ){
                if(D('Itemcode')->save(array('code_id'=>$code_id,'status'=>2))){ //将内容变成
                    $obj = D('Users');
                    if($detail['real_money'] >0){
                        $obj->addMoney($detail['user_id'],$detail['real_money'],'抢购券退款:'.$detail['code']);
                    }
                    if($detail['real_integral'] >0){
                        $obj->addIntegral($detail['user_id'],$detail['real_integral'],'抢购券退款:'.$detail['code']);
                    }
                }                
            }
            
        }else{
           $code_id = $this->_post('code_id',false); 
           if(is_array($code_id)){     
                $obj = D('Users');
                $itemcode = D('Itemcode');
               foreach($code_id as $id){
                   $detail = $itemcode->find($id);
                    if(($detail['status'] == 1 ||$detail['status'] == 0)&& (int)$detail['is_used'] === 0 ){
                        if(D('Itemcode')->save(array('code_id'=>$id,'status'=>2))){ //将内容变成

                            if($detail['real_money'] >0){
                                $obj->addMoney($detail['user_id'],$detail['real_money'],'抢购券退款:'.$detail['code']);
                            }
                            if($detail['real_integral'] >0){
                                $obj->addIntegral($detail['user_id'],$detail['real_integral'],'抢购券退款:'.$detail['code']);
                            }
                        }                
                    }
               }
           }
            
        }
         $this->baoSuccess('退款成功！', U('Itemcode/refund'));
    }
    
    
    public function refunding($code_id = 0){
        if(is_numeric($code_id) && ($code_id = (int)$code_id)){
            $detail = D('Itemcode')->find($code_id);
            if($detail['status'] == 1 && (int)$detail['is_used'] === 0 ){
                if(D('Itemcode')->save(array('code_id'=>$code_id,'status'=>2))){ //将内容变成
                    $obj = D('Users');
                    if($detail['real_money'] >0){
                        $obj->addMoney($detail['user_id'],$detail['real_money'],'抢购券退款:'.$detail['code']);
                    }
                    if($detail['real_integral'] >0){
                        $obj->addIntegral($detail['user_id'],$detail['real_integral'],'抢购券退款:'.$detail['code']);
                    }
                }                
            }
            
        }else{
           $code_id = $this->_post('code_id',false); 
           if(is_array($code_id)){     
                $obj = D('Users');
                $itemcode = D('Itemcode');
               foreach($code_id as $id){
                   $detail = $itemcode->find($id);
                    if($detail['status'] == 1 && (int)$detail['is_used'] === 0 ){
                        if(D('Itemcode')->save(array('code_id'=>$id,'status'=>2))){ //将内容变成

                            if($detail['real_money'] >0){
                                $obj->addMoney($detail['user_id'],$detail['real_money'],'抢购券退款:'.$detail['code']);
                            }
                            if($detail['real_integral'] >0){
                                $obj->addIntegral($detail['user_id'],$detail['real_integral'],'抢购券退款:'.$detail['code']);
                            }
                        }                
                    }
               }
           }
            
        }
		
		 $where['item_id'] = $detail['item_id'];
       $item_num = D("Itemorder")->where($where)->getField("num");
       D("Item")->where($where)->setInc("num",$item_num);  // 修复退款后增加库存
         $this->baoSuccess('退款成功！', U('Itemcode/refund'));
    }
    
   
}
