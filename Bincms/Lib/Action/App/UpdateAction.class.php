<?php
/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。
/*
create table app_version(`id` int(10) unsigned,ver int(12),downloadurl text, appstoreurl text,info text,size varchar(10),lastupdate int(10) unsigned);
*/
class UpdateAction extends CommonAction
{

	public function check()
	{
      $where = array('k'=>'updateapp');
      $list = D('setting')->where($where)->find();
      if(!$list){
        die();
      }
      $list = unserialize($list['v']);
      $ver = addslashes($this->_get('ver'));
      $time = date('Y-m-d',$list['time']);
      if($this->_get('platform')=='0'){
           $url = $list['appstoreurl'];
      }else{
           $url = 'http://'.$_SERVER['HTTP_HOST'].'/appupdate/app.apk';
      }
      if(UpdateAction::compareVersion($list['version'],$ver)==1){
            $data = array('status' => self::BAO_REQUEST_SUCCESS,'version'=>$list['version'],'name'=>$list['name'],'url'=>$url,'time'=>$time,'info'=>$list['info']);
            $this->stringify($data);
      }
      die();
	}

   private static function compareVersion($version1, $version2) 
   {       
    if ($version1==$version2)
        {            
              return 0;      
        }        
        $version1Array = explode(".",$version1);       
        $version2Array = explode(".",$version2);
        $index = 0;        
        $l = count($version1Array);
        $l2 = count($version2Array);
        $minLen = min($l, $l2);  
        $diff = 0;        
        while ($index < $minLen && ($diff = intval($version1Array[$index]) - intval($version2Array[$index])) == 0) 
        {            
              $index ++;   
        }       
         if ($diff == 0) {           
              for($i = $index; $i < $l; $i++) {                
                if (intval($version1Array[$i]) > 0) {                   
                     return 1;         
                    }            
              }          
              for ($i = $index; $i < $l2; $i++) {               
                if (intval($version2Array[$i]) > 0) {             
                     return -1;               
                    }           
              }            
              return 0;  
              } else {          
              return $diff > 0 ? 1 : -1;        
        }    
       
 }

}