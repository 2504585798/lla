<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。

class SeoModel extends CommonModel{
    protected $pk   = 'seo_id';
    protected $tableName ='seo';
    protected $token = 'sk_seo';
    
    

    public function fetchAll(){
      $cache = cache(array('type'=>'File','expire'=>  $this->cacheTime));
      if(!$data = $cache->get($this->token)){
          $result = $this->order($this->orderby)->select();
          $data = array();
          foreach($result  as $row){
              $data[$row['seo_key']] = $row;
          }
          $cache->set($this->token,$data);
      }   
      return $data;
   }
  
    
}