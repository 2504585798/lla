<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。
class HospitalmoneyAction extends CommonAction{


    
    public  function index(){
       $Hospitalmoney = D('Hospitalmoney');
       import('ORG.Util.Page');// 导入分页类
       $map = array();
        if(($bg_date = $this->_param('bg_date',  'htmlspecialchars') )&& ($end_date=$this->_param('end_date','htmlspecialchars'))){
           $bg_time = strtotime($bg_date);
           $end_time = strtotime($end_date) + 86400;
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
               $end_time = strtotime($end_date)+ 86400;
               $this->assign('end_date',$end_date);
               $map['create_time'] = array('ELT',$end_time);
           }
       }

       if($keyword = $this->_param('keyword','htmlspecialchars')){
           $map['order_id'] = array('LIKE', '%'.$keyword.'%');
           $this->assign('keyword',$keyword);
       } 
       if($hospital_id = (int)$this->_param('hospital_id')){
            $map['hospital_id'] = $hospital_id;
            $hospital = D('Hospital')->find($hospital_id);
            $this->assign('hospital_name',$hospital['hospital_name']);
            $this->assign('hospital_id',$hospital_id);
        }
       
       
       $count      = $Hospitalmoney->where($map)->count();// 查询满足要求的总记录数 
       $Page       = new Page($count,15);// 实例化分页类 传入总记录数和每页显示的记录数
       $show       = $Page->show();// 分页显示输出
       $list = $Hospitalmoney->where($map)->order(array('money_id'=>'desc'))->limit($Page->firstRow.','.$Page->listRows)->select();
       $hospital_ids = array();
       foreach($list as  $val){
           $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
       }
       $this->assign('hospitals',D('Hospital')->itemsByIds($hospital_ids));
       $this->assign('list',$list);// 赋值数据集
       $this->assign('page',$show);// 赋值分页输出
       $this->display(); // 输出模板
    }
    
    
    public function tjmonth(){
        $Hospitalmoney = D('Hospitalmoney');
       import('ORG.Util.Page');// 导入分页类
        if($month = $this->_param('month',  'htmlspecialchars')){
            $this->assign('month',$month);
        }
        if($hospital_id = (int)$this->_param('hospital_id')){
            $map['hospital_id'] = $hospital_id;
            $hospital = D('Hospital')->find($hospital_id);
            $this->assign('hospital_name',$hospital['hospital_name']);
            $this->assign('hospital_id',$hospital_id);
        }
        $count      = $Hospitalmoney->tjmonthCount($month,$hospital_id);// 查询满足要求的总记录数 
        $Page       = new Page($count,15);// 实例化分页类 传入总记录数和每页显示的记录数
        $show       = $Page->show();// 分页显示输出
        $list = $Hospitalmoney->tjmonth($month,$hospital_id,$Page->firstRow,$Page->listRows);
        $hospital_ids = array();
        foreach($list as  $val){
            $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
        }
        $this->assign('hospitals',D('Hospital')->itemsByIds($hospital_ids));
        $this->assign('list',$list);// 赋值数据集
        $this->assign('page',$show);// 赋值分页输出
        $this->display();
    }
    
    public function tjyear(){
        $Hospitalmoney = D('Hospitalmoney');
       import('ORG.Util.Page');// 导入分页类
        if($year = $this->_param('year',  'htmlspecialchars')){
            $this->assign('year',$year);
        }
        if($hospital_id = (int)$this->_param('hospital_id')){
            $map['hospital_id'] = $hospital_id;
            $hospital = D('Hospital')->find($hospital_id);
            $this->assign('hospital_name',$hospital['hospital_name']);
            $this->assign('hospital_id',$hospital_id);
        }
        $count      = $Hospitalmoney->tjyearCount($year,$hospital_id);// 查询满足要求的总记录数 
        $Page       = new Page($count,15);// 实例化分页类 传入总记录数和每页显示的记录数
        $show       = $Page->show();// 分页显示输出
        $list = $Hospitalmoney->tjyear($year,$hospital_id,$Page->firstRow,$Page->listRows);
        $hospital_ids = array();
        foreach($list as  $val){
            $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
        }
        $this->assign('hospitals',D('Hospital')->itemsByIds($hospital_ids));
        $this->assign('list',$list);// 赋值数据集
        $this->assign('page',$show);// 赋值分页输出
        $this->display();
    }
    
    public function tjday(){
          $Hospitalmoney = D('Hospitalmoney');
       import('ORG.Util.Page');// 导入分页类
        if($day = $this->_param('day',  'htmlspecialchars')){
            $this->assign('day',$day);
        }
        if($hospital_id = (int)$this->_param('hospital_id')){
            $map['hospital_id'] = $hospital_id;
            $hospital = D('Hospital')->find($hospital_id);
            $this->assign('hospital_name',$hospital['hospital_name']);
            $this->assign('hospital_id',$hospital_id);
        }
        $count      = $Hospitalmoney->tjdayCount($day,$hospital_id);// 查询满足要求的总记录数 
        $Page       = new Page($count,15);// 实例化分页类 传入总记录数和每页显示的记录数
        $show       = $Page->show();// 分页显示输出
        $list = $Hospitalmoney->tjday($day,$hospital_id,$Page->firstRow,$Page->listRows);
        $hospital_ids = array();
        foreach($list as  $val){
            $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
        }
        $this->assign('hospitals',D('Hospital')->itemsByIds($hospital_ids));
        $this->assign('list',$list);// 赋值数据集
        $this->assign('page',$show);// 赋值分页输出
        $this->display();
        
    }
    
    public function create(){
        if($this->isPost()){
            $data = $this->_post('data',false);
            $add = array('create_time'=>NOW_TIME,'create_ip'=>  get_client_ip());
            if(!$data['hospital_id']){
                $this->baoError('请选择医院');
            }
            $add['hospital_id'] = (int)$data['hospital_id'];
            if(!$data['money']){
                $this->baoError('请数据MONEY');
            }
            $add['money'] = (int)($data['money']*100);
            if(!$data['type']){
                $this->baoError('请选择类型');
            }
            $add['type'] = htmlspecialchars($data['type']);
            if(!$data['order_id']){
                $this->baoError('请填写原始订单');
            }
            $add['order_id'] = (int)$data['order_id'];
            if(!$data['intro']){
                $this->baoError('请填写说明');
            }
            $add['intro'] =htmlspecialchars($data['intro']);
            D('Hospitalmoney')->add($add);
            $hospital = D('Hospital')->find($add['hospital_id']);
            D('Users')->addMoney($hospital['user_id'], $add['money'], $add['intro']);
            $this->baoSuccess('操作成功',U('hospitalmoney/index'));
        }else{
            $this->display(); 
        }      
    }



    
   
}
