<?php



class ChinaareaAction extends CommonAction {

    public function getcity($city_id) { //
     $data = = D('Chinaarea')->where(array("parent_id"=>$city_id))->select(); 
 

            if ($data) {
                $this->ajaxReturn($data ,array('status'=>1));
            } 
	   
    }
    
}
