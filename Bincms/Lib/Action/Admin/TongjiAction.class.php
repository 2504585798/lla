<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class  TongjiAction extends CommonAction{
    
    
    public function  index(){
        
        $showdata =  D('Tuanorder')->source();
        $weeks = D('Tuanorder')->weeks();
        $this->assign('weeks',$weeks);
        $this->assign('showdata',$showdata);
        $this->display();
    }
    
    
    public function quanming(){
         if(($bg_date = $this->_param('bg_date', 'htmlspecialchars') ) && ($end_date = $this->_param('end_date', 'htmlspecialchars'))){
            $bg_time = strtotime($bg_date);
            $end_time = strtotime($end_date)+86400;
           
        }else{
            $bg_date = date('Y-m-d',NOW_TIME-86400*30);
            $bg_time = strtotime($bg_date);
            $end_time = NOW_TIME;
            $end_date = TODAY;
        }
        $this->assign('bg_date',$bg_date);
        $this->assign('end_date',$end_date);

        $this->assign('tongji1',D('Quanming')->tongjiComm($bg_time,$end_time));
        $this->assign('tongji2',D('Quanming')->tongjiNum($bg_time,$end_time));
        $this->display();
    }
    
    public function money(){
        if(($bg_date = $this->_param('bg_date', 'htmlspecialchars') ) && ($end_date = $this->_param('end_date', 'htmlspecialchars'))){
            $bg_time = strtotime($bg_date);
            $end_time = strtotime($end_date)+86400;
           
        }else{
            $bg_date = date('Y-m-d',NOW_TIME-86400*30);
            $bg_time = strtotime($bg_date);
            $end_time = NOW_TIME;
        }
        $this->assign('bg_date',$bg_date);
        $this->assign('end_date',$end_date);
        $this->assign('money',D('Tuanorder')->money($bg_time,$end_time));
        $this->assign('money_yue',D('Tuanorder')->money_yue());
        $this->display();
    }
    
    
    public function  laiyuan(){
        $bg_date = $this->_param('bg_date', 'htmlspecialchars');
        $end_date = $this->_param('end_date', 'htmlspecialchars');
        if(empty($bg_date) || empty($end_date)){
            $bg_date = date('Y-m-d',NOW_TIME-86400*30);
            $end_date = TODAY;
        }
        $this->assign('bg_date',$bg_date);
        $this->assign('end_date',$end_date);
        
        $this->assign('laiyuan',D('Tongji')->laiyuan($bg_date,$end_date));
        
        $this->display();
    }
    
    public function lmoney(){
        
        $bg_date = $this->_param('bg_date', 'htmlspecialchars');
        $end_date = $this->_param('end_date', 'htmlspecialchars');
        if(empty($bg_date) || empty($end_date)){
            $bg_date = date('Y-m-d',NOW_TIME-86400*30);
            $end_date = TODAY;
        }
        $this->assign('bg_date',$bg_date);
        $this->assign('end_date',$end_date);
        
        $this->assign('laiyuan',D('Tongji')->lmoney($bg_date,$end_date));
        
        $this->display();
        
    }
    
    
    public function tuiguan(){
        
        $bg_date = $this->_param('bg_date', 'htmlspecialchars');
        $end_date = $this->_param('end_date', 'htmlspecialchars');
        if(empty($bg_date) || empty($end_date)){
            $bg_date = date('Y-m-d',NOW_TIME-86400*30);
            $end_date = TODAY;
        }
        $this->assign('bg_date',$bg_date);
        $this->assign('end_date',$end_date);
    
        $this->assign('tuiguan',D('Tongji')->tuiguan($bg_date,$end_date));
        $this->assign('tmoney',D('Tongji')->tmoney($bg_date,$end_date));
        $this->display();
    }
    
    public function keyword(){
        
        $bg_date = $this->_param('bg_date', 'htmlspecialchars');
        $end_date = $this->_param('end_date', 'htmlspecialchars');
        if(empty($bg_date) || empty($end_date)){
            $bg_date = date('Y-m-d',NOW_TIME-86400*30);
            $end_date = TODAY;
        }
        $this->assign('bg_date',$bg_date);
        $this->assign('end_date',$end_date);
    
        $this->assign('keyword',D('Tongji')->keyword($bg_date,$end_date));
        $this->assign('kmoney',D('Tongji')->kmoney($bg_date,$end_date));
        $this->display();
    }
    
    
}