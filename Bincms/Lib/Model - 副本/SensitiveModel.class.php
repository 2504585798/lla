<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class SensitiveModel extends CommonModel{
    protected $pk   = 'words_id';
    protected $tableName =  'sensitive_words';
    protected $token = 'sensitive_words';
    protected $cacheTime = 8640000;//100天


    //return false  表示正常，否则会返回对应的敏感词
    public function checkWords($content){
        $words = $this->fetchAll();
        foreach($words as $val){
            if(strstr($content,$val['words'])) return $val['words']; 
        }    
        return false;     
    }
    
}