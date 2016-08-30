<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class SettingModel extends CommonModel{
    protected $pk   = 'k';
    protected $tableName =  'setting';   
    protected $token = 'setting';
    protected $settings = null;

    public function fetchAll(){
		//parent::fetchAll();
        $cache = cache(array('type'=>'File','expire'=>  $this->cacheTime));
        if(!$data= $cache->get($this->token)){
            $result = $this->select();

            foreach($result  as $row){
                $row['v'] = unserialize($row['v']);
              
                $data[$row[$this->pk]] = $row['v'];
            }
            $cache->set($this->token,$data);
        }   
        $this->settings = $data;
        return $this->settings;
     }
     
     public function save($arr){
		 //parent::fetchAll();
         if($this->find(array("where"=>array('k'=>$arr['k'])))){
             return  parent::save($arr);
         }else{
             return $this->add($arr);
         }         
     }
     

}