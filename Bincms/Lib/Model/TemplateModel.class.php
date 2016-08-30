<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class TemplateModel extends CommonModel{
    protected $pk   = 'template_id';
    protected $tableName =  'template';
    protected $token = 'template';
    
     public function fetchAll(){
        $cache = cache(array('type'=>'File','expire'=>  $this->cacheTime));
        if(!$data = $cache->get($this->token)){
            $result = $this->order($this->orderby)->select();
            $data = array();
            foreach($result  as $row){
                $data[$row['theme']] = $row;
            }
            $cache->set($this->token,$data);
        }   
        return $data;
     }
    
     public function getDefaultTheme(){
         $data = $this->fetchAll();
         foreach ($data as $k=>$v){
             if($v['is_default']) return $v['theme'];
         }
         return C('DEFAULT_THEME');
     }
     
}