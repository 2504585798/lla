<?php
/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2015 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class  CheckAction extends CommonAction{
	
    
     public function index(){
         //此工具只是比对您的数据库和官方数据库的差距在哪里！因为数据库字段不正确会有很多问题
         $cache = cache(array('type'=>'File','expire'=> 600));
         if(!$datas = $cache->get('baocms_db_name')){
            $data = M()->query("select * from information_schema.tables where  TABLE_SCHEMA = '".C('DB_NAME')."'");
            $tables = array();
            foreach($data as $val){
               $tables[$val['TABLE_NAME']] = $val['TABLE_NAME'];
            }
            $cols = array();
            foreach($tables as $val){
               $data = M()->query(" show full fields from  {$val}   ");
               foreach($data as $v){
                    $cols[$val][$v['Field']] = array(
                        'col'   => $v['Field'],
                        'type'  => $v['Type'],
                    ); 
               }             
            }
            $datas = $cols;
            $cache->set('baocms_db_name',$datas);
         }
         if(!$baoDB =$cache->get('baocms_db_name2') ){
           // $baoDB = file_get_contents("http://www.baocms.com/check/index.html?bao_key=".C('BAO_KEY'));
            if(empty($baoDB))             $this->error ('服务器连接失败');
            $baoDB = json_decode($baoDB,true);
            $cache->set('baocms_db_name2',$baoDB);
         }
         
         $bao_db = array();
         foreach($baoDB as $k=>$v){
             $k= str_replace('bao_', C('DB_PREFIX'), $k);
             $bao_db[$k]= $v;
         }
         $tableNo = $col = $coltype = array();
         foreach($bao_db  as $t=>$v){
             if(!isset($datas[$t])){
                 $tableNO[$t] = $t; 
             }
             else{
                 foreach($v as $c=>$val){ //检查字段没有的情况
                     if(!isset($datas[$t][$c])){
                         $col[$t][$c] = $val;
                     }elseif($val['type']!=$datas[$t][$c]['type']){
                         $coltype[$t][$c] = $val;
                     }                
                 }
             }
         }   
       
       
         
         $this->assign('tables',$tableNO); //不存在的数据表
         $this->assign('cols',$col); // 不存在的字段
         $this->assign('coltype',$coltype); // 字段类型不正确的
         //print_r($datas);
         $this->display();
     }
    
    
}