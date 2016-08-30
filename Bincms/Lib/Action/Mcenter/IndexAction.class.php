<?php



class IndexAction extends CommonAction {

   public function index(){
		if(empty($this->uid)){
			redirect('mobile/passport/login');
		}else{
			redirect('/mcenter/member');
		}
   		
   }

}
