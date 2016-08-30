<?php



class MydiaryAction extends CommonAction {

   public function index() {
        $diary = D('diary');
        import('ORG.Util.Page');
        $map = array('user_id' => $this->uid);
        $count = $diary->where($map)->count();
        $Page = new Page($count, 16);
        $show = $Page->show();
        $list = $diary->where($map)->order('diary_id desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
       // Dump( $list);
        $diary_ids = array();
        foreach ($list as $k => $val) {
            $diary_ids[$val['diary_id']] = $val['diary_id'];
        }
        $this->assign('reviews', $v=D('Reviews')->itemsByIds($diary_ids));
		//Dump($v);
        //$this->assign('prices', D('Hospitaldetails')->itemsByIds($hospital_ids));
        $this->assign('list', $list);
        $this->assign('page', $show);
        $this->display();
    }
	
	//发布日记
   public function add() {
	   if(empty($this->uid)){
		 $url='passport/login';  
		$this->redirct($url,3,'请先登录，再发布日记');   
		   
	   }
	   
	    $diary=D('Diary');
	   if(IS_POST){
		 
		 $title=$this->_post('diary_name');//日记标题
		  if (empty($title)) {
	  	 	$this->baoError('请填写日记标题！');
	  	 		
	  	 }
         $birth_year=$this->_post('birth_year');//发布年份
		 $birth_month=$this->_post('birth_month');//月份
		 $birth_day=$this->_post('birth_day');//天
		  if (empty($birth_year)&&empty($birth_month)&&empty($birth_day)) {
	  	 	$this->baoError('请选择日记年月日！');
	  	 		
	  	 }
		  $hospital_name=$this->_post('hospital_name');//
		 if (empty($hospital_name)) {
	  	 	$this->baoError('请填写治疗医院信息！');
	  	 		
	  	 }
         $doctor_name=$this->_post('doctor_name');//
		 
		  if (empty($doctor_name)) {
	  	 	$this->baoError('请填写治疗医生信息！');
	  	 		
	  	 }
		
		 $product_name=$this->_post('product_name');//
		  if (empty($product_name)) {
	  	 	$this->baoError('请填写项目名称！');
	  	 		
	  	 }
		 $price=$this->_post('item_price');
		 if (empty($price)) {
	  	 	$this->baoError('请填写项目价格！');
	  	 		
	  	 }
		 $activity_name=$this->_post('activity_name');// 
		 $user_id=$this->uid;  
		$doctor_id=$this->_post('doctor_id');//
		$hospital_id=$this->_post('hospital_id');// 
        $product_id=$this->_post('product_id');//		
		$activity_id=$this->_post('activity_id');//   
		$is_show=$this->_post('show_type');
		$diarypic=$this->uploads();
		$data=array(
		'diary_name'=>$title,
		'doctor_name'=>$doctor_name,
		'hospital_name'=>$hospital_name,
		'item_name'=>$product_name,
		'activity_name'=>$activity_name,
		'user_id'=>$user_id,
		'diary_bg'=>$birth_year.'-'.$birth_month.'-'.$birth_day,
		'is_show'=>$is_show,   //0公开  1私密  2匿名公开 
		'doctor_id'=>$doctor_id?$doctor_id:'',
		'hospital_id'=>$hospital_id?$hospital_id:'',
		'activity_id'=>$activity_id?$activity_id:'',
		'item_id'=>$product_id?$product_id:'',
		'price'=>$price,
		'diarypic'=>serialize($diarypic),
		'add_time'=>NOW_TIME,
		'create_ip' => get_client_ip()
		
		);
		//Dump($data);
		$res=$diary->add($data);
		if($res){
			
			  $datas=array('diary_id'=>$res);
			   D('Reviews')->add($datas);
				$this->baoSuccess(' 发布日记成功',U('mydiary/index'));
			
			
		}else{
			
			$this->baoError(' 发布日记失败');
			
		}
		
		
		
		
		   
	   }else{
		   
		  $this->display();   
		   
	   }
	   
	  
	   
   }
    public function deletefavo($diary_id) {
        $diary_id = (int) $diary_id;
        if ($detial = D('diary')->find($diary_id)) {
            if ($detial['user_id'] == $this->uid) {
                D('diary')->delete($diary_id);
                $this->baoSuccess('取消关注成功!', U('diary/index'));
            }
        }
        $this->baoError('参数错误');
    }

 
public function uploads() {
	  
	  	
	  	import('ORG.Net.UploadFile');
	  	$upload = new UploadFile(); //
	  	$upload->maxSize = 3145728; // 设置附件上传大小
	  	$upload->allowExts = array('jpg', 'gif', 'png', 'jpeg'); // 设置附件上传类型
	  	$name = date('Y/m/d', NOW_TIME);
	  			$dir = BASE_PATH . '/attachs/' . $name . '/';
	  					if (!is_dir($dir)) {
	  			mkdir($dir, 0755, true);
	  			}
	  				$upload->savePath = $dir; // 设置附件上传目录
	  				if (isset($this->_CONFIG['attachs'][$model]['thumb'])) {
	  				$upload->thumb = true;
	  				if (is_array($this->_CONFIG['attachs'][$model]['thumb'])) {
	  				$prefix = $w = $h = array();
	  						foreach ($this->_CONFIG['attachs'][$model]['thumb'] as $k => $v) {
	  						$prefix[] = $k . '_';
	  						list($w1, $h1) = explode('X', $v);
	  						$w[] = $w1;
	  							$h[] = $h1;
	  						}
	  						$upload->thumbPrefix = join(',', $prefix);
	  						$upload->thumbMaxWidth = join(',', $w);
	  						$upload->thumbMaxHeight = join(',', $h);
	  						} else {
	  						$upload->thumbPrefix = 'thumb_';
	  						list($w, $h) = explode('X', $this->_CONFIG['attachs'][$model]['thumb']);
	  						$upload->thumbMaxWidth = $w;
	  						$upload->thumbMaxHeight = $h;
	  						}
	  						}
	  						if (!$upload->upload()) {// 上传错误提示错误信息
	  						$this->error($upload->getErrorMsg());
	  						} else {// 上传成功 获取上传文件信息
	  						$info = $upload->getUploadFileInfo();
	  						//var_dump($info);
	  						//exit;
	  						if (!empty($this->_CONFIG['attachs'][$model]['water'])) {
	  						import('ORG.Util.Image');
	  							$Image = new Image();
	  							$Image->water(BASE_PATH . '/attachs/' . $name . '/thumb_' . $info[0]['savename'], BASE_PATH . '/attachs/' . $this->_CONFIG['attachs']['water']);
	  							}
	  									if ($upload->thumb) {
	  										$cert=array($name . '/thumb_' . $info[0]['savename'],$name . '/thumb_' . $info[1]['savename'],$name . '/thumb_' . $info[1]['savename'],$name . '/' . $info[3]['savename']);
	  									return $cert;
	  									} else {
	  										$cert=array($name . '/' . $info[0]['savename'],$name . '/' . $info[1]['savename'],$name . '/' . $info[2]['savename'],$name . '/' . $info[3]['savename']);
	  									return  $cert ;
	  									}
	  									}
	  											
	  			}	
		
		






 
}
