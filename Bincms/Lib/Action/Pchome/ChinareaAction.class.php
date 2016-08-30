<?php



class ChinaareaAction extends CommonAction {

    public function getcity($city_id) { //
     $data= D('Chinaarea')->where(array("parent_id"=>$city_id))->select(); 
 

            if ($data) {
                $this->ajaxReturn($data ,array('status'=>1));
            } 
	   
    }
    
	
	 public function getcitys($region_id){
        
         if(IS_AJAX){
            
            $region_id = I('val',0,'intval,trim');
           $t = D('ChinaArea');
            $map = array(
                'region_id'=>$region_id,
        
            );
            $list = $t->where($map)->select();
            
            if($list){
                $this->ajaxReturn(array('code'=>'200','list'=>$list));
            }else{
                $this->ajaxReturn(array('code'=>'204'));
            }
            
        }
        
    }
}
