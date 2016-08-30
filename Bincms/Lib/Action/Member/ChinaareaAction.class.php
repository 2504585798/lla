<?php



class ChinaareaAction extends CommonAction {
    //$city_id=31;
    public function getcity($city_id) { //
	
     $data= D('ChinaArea')->where(array("parent_id"=>$city_id))->select(); 
   // dump($data);
	//exit;

            if ($data) {
                $this->ajaxReturn(array('status' => '1', 'data' => $data) );
            } 
	   
    }
    
}
