<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。
class DoctorAction extends CommonAction {

    private $create_fields = array('user_id', 'cate_id','country_id','city_id', 'area_id', 'business_id', 'doctor_name', 'logo', 'mobile', 'photo', 'addr', 'docphone', 'extension', 'contact', 'tags', 'near', 'is_pei', 'opentime','delivery_time', 'orderby', 'lng', 'lat', 'price');
    private $edit_fields = array('user_id', 'cate_id','city_id', 'area_id', 'business_id', 'doctor_name', 'mobile', 'logo', 'photo', 'addr', 'docphone', 'extension', 'contact', 'tags', 'near', 'opentime','delivery_time', 'is_pei', 'orderby', 'lng', 'lat', 'price','is_ding');

    public function index() {
        $Doctor = D('Doctor');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0, 'audit' => 1);
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['doctor_name|docphone'] = array('LIKE', '%' . $keyword . '%');
            $this->assign('keyword', $keyword);
        }
       /*  if ($city_id = (int) $this->_param('city_id')) {
            $map['city_id'] = $city_id;
            $this->assign('city_id', $city_id);
        }
        if ($area_id = (int) $this->_param('area_id')) {
            $map['area_id'] = $area_id;
            $this->assign('area_id', $area_id);
        } */
        if ($cate_id = (int) $this->_param('cate_id')) {
            $map['cate_id'] = array('IN', D('Doctor')->getChildren($cate_id));
            $this->assign('cate_id', $cate_id);
        }

        $count = $Doctor->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Doctor->order(array('doctor_id' => 'desc'))->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $ids = array();
        foreach ($list as $k => $val) {
            if ($val['user_id']) {
                $ids[$val['user_id']] = $val['user_id'];
            }
        }
        $this->assign('users', D('Users')->itemsByIds($ids));
         $duty=D('Duty')->where(array('status'=>1))->select();
		 $this->assign('duty', $duty);
	   
       $this->assign('area',D('Country')->fetchAll());
	   $this->assign('hos', D('Hospital')->fetchAll());
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function apply() {
        $Doctor = D('Doctor');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0, 'audit' => 0);
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['doctor_name|docphone'] = array('LIKE', '%' . $keyword . '%');
            $this->assign('keyword', $keyword);
        }
        if ($city_id = (int) $this->_param('city_id')) {
            $map['city_id'] = $city_id;
            $this->assign('city_id', $city_id);
        }
        if ($area_id = (int) $this->_param('area_id')) {
            $map['area_id'] = $area_id;
            $this->assign('area_id', $area_id);
        }
        if ($cate_id = (int) $this->_param('cate_id')) {
            $map['cate_id'] = array('IN', D('Doctorcate')->getChildren($cate_id));
            $this->assign('cate_id', $cate_id);
        }

        $count = $Doctor->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Doctor->order(array('doctor_id' => 'asc'))->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();
       //dump( $list);

	   $ids = array();
        foreach ($list as $k => $val) {

            if ($val['user_id']) {
                $ids[$val['user_id']] = $val['user_id'];
            }
			/* $list[$k]['country_name']=D('Chinarea')->field('region_name')->where(array(region_id=>$val['country_id']))->find();
			$list[$k]['city_name']=D('Chinarea')->field('region_name')->where(array(region_id=>$val['city_id']))->find();
			$list[$k]['area_name']=D('Chinarea')->field('region_name')->where(array(region_id=>$val['area_id']))->find();
			 */
        }
		// dump( $list);

        $this->assign('users',D('Users')->itemsByIds($ids));
		 $duty=D('Duty')->where(array('status'=>1))->select();
		 $this->assign('duty', $duty);
	   
       $this->assign('area',D('Country')->fetchAll());
	   $this->assign('hos', D('Hospital')->fetchAll());
	
  //$this->assign('area',$m=list_to_tree($area,$pk = 'region_id', $pid = 'parent_id', $child = '_child', $root = 0) );
		
        $this->assign('cates', D('Doctorcate')->fetchAll());
        $this->assign('business', D('Business')->fetchAll());
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function create() {
        if ($this->isPost()) {
            $data2=$data = $this->createCheck();
            $obj = D('Doctor');
            $details = $this->_post('details', 'SecurityEditorHtml');
            if ($words = D('Sensitive')->checkWords($details)) {
                $this->baoError('医院介绍含有敏感词：' . $words);
            }
            $bank = $this->_post('bank', 'htmlspecialchars');
            unset($data['near'], $data['price'], $data['business_time'],$data['delivery_time']);
            if ($doctor_id = $obj->add($data)) {
                $wei_pic = D('Weixin')->getCode($doctor_id, 1);
                $ex = array(
                    'wei_pic' => $wei_pic,
                    'details' => $details,
                    'bank' => $bank,
                    'near' => $data2['near'],
                    'price' => $data2['price'],
                    'business_time' => $data2['business_time'],
                    'delivery_time' => $data2['delivery_time'],
                );
                D('Doctordetails')->upDetails($doctor_id, $ex);
                $this->baoSuccess('添加成功', U('doctor/apply'));
            }
            $this->baoError('操作失败！');
        } else {
            $this->assign('cates', D('Doctorcate')->fetchAll());
            $this->assign('business', D('Business')->fetchAll());
            $this->display();
        }
    }

    public function select() {
        $Doctor = D('Doctor');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0, 'audit' => 1);
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['doctor_name|docphone'] = array('LIKE', '%' . $keyword . '%');
            $this->assign('keyword', $keyword);
        }
        if ($city_id = (int) $this->_param('city_id')) {
            $map['city_id'] = $city_id;
            $this->assign('city_id', $city_id);
        }
        if ($area_id = (int) $this->_param('area_id')) {
            $map['area_id'] = $area_id;
            $this->assign('area_id', $area_id);
        }

        if ($cate_id = (int) $this->_param('cate_id')) {
            $map['cate_id'] = array('IN', D('Doctorcate')->getChildren($cate_id));
            $this->assign('cate_id', $cate_id);
        }
        $count = $Doctor->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Doctor->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $ids = array();
        foreach ($list as $k => $val) {

            if ($val['user_id']) {
                $ids[$val['user_id']] = $val['user_id'];
            }
        }
		
		//dump($duty);
        $this->assign('users', D('Users')->itemsByIds($ids));
        $this->assign('citys', D('City')->fetchAll());
		
        $this->assign('areas', D('Area')->fetchAll());
        $this->assign('cates', D('Doctorcate')->fetchAll());
        $this->assign('business', D('Business')->fetchAll());
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    private function createCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->create_fields);
        $data['user_id'] = (int) $data['user_id'];
        if (empty($data['user_id'])) {
            $this->baoError('管理者不能为空');
        }
        $doctor = D('Doctor')->find(array('where' => array('user_id' => $data['user_id'])));
        if (!empty($doctor)) {
            $this->baoError('该管理者已经拥有医院了');
        }

        $data['cate_id'] = (int) $data['cate_id'];
        if (empty($data['cate_id'])) {
            $this->baoError('分类不能为空');
        } 
        $data['city_id'] = (int) $data['city_id'];
        $data['area_id'] = (int) $data['area_id'];
        if (empty($data['area_id'])) {
            $this->baoError('所在区域不能为空');
        } $data['business_id'] = (int) $data['business_id'];
        if (empty($data['business_id'])) {
            $this->baoError('所在商圈不能为空');
        } $data['doctor_name'] = htmlspecialchars($data['doctor_name']);
        if (empty($data['doctor_name'])) {
            $this->baoError('医院名称不能为空');
        } $data['logo'] = htmlspecialchars($data['logo']);
        if (empty($data['logo'])) {
            $this->baoError('请上传医院LOGO');
        }
        if (!isImage($data['logo'])) {
            $this->baoError('医院LOGO格式不正确');
        } $data['photo'] = htmlspecialchars($data['photo']);
        if (empty($data['photo'])) {
            $this->baoError('请上传医院缩略图');
        }
        if (!isImage($data['photo'])) {
            $this->baoError('医院缩略图格式不正确');
        }
        $data['addr'] = htmlspecialchars($data['addr']);
        if (empty($data['addr'])) {
            $this->baoError('医院地址不能为空');
        }
        $data['docphone'] = htmlspecialchars($data['docphone']);
        $data['mobile'] = htmlspecialchars($data['mobile']);
        if (empty($data['docphone']) && empty($data['mobile'])) {
            $this->baoError('医院电话不能为空');
        }

        $data['extension'] = htmlspecialchars($data['extension']);
        $data['contact'] = htmlspecialchars($data['contact']);
        $data['tags'] = str_replace(',', '，', htmlspecialchars($data['tags']));
        $data['near'] = htmlspecialchars($data['near']);
        $data['business_time'] = htmlspecialchars($data['business_time']);
        $data['orderby'] = (int) $data['orderby'];
        $data['price'] = (int) $data['price'];
        $data['is_pei'] = (int) $data['is_pei'];
        $data['lng'] = htmlspecialchars($data['lng']);
        $data['lat'] = htmlspecialchars($data['lat']);
        $data['create_time'] = NOW_TIME;
        $data['create_ip'] = get_client_ip();
        return $data;
    }

    public function edit($doctor_id = 0) {

        if ($doctor_id = (int) $doctor_id) {
            $obj = D('Doctor');
            if (!$detail = $obj->find($doctor_id)) {
                $this->baoError('请选择要编辑的医院');
            }
            if ($this->isPost()) {
                $data = $this->editCheck($doctor_id);
                $data['doctor_id'] = $doctor_id;
                $details = $this->_post('details', 'SecurityEditorHtml');
                if ($words = D('Sensitive')->checkWords($details)) {
                    $this->baoError('医院介绍含有敏感词：' . $words);
                }
                $bank = $this->_post('bank', 'htmlspecialchars');
                $doctordetails = D('Doctordetails')->find($doctor_id);

                $ex = array(
                    'details' => $details,
                    'bank' => $bank,
                    'near' => $data['near'],
                    'price' => $data['price'],
                    'business_time' => $data['business_time'],
                );
                if (!empty($doctordetails['wei_pic'])) {
                    if (true !== strpos($doctordetails['wei_pic'], "https://mp.weixin.qq.com/")) {
                        $wei_pic = D('Weixin')->getCode($doctor_id, 1);
                        $ex['wei_pic'] = $wei_pic;
                    }
                } else {
                    $wei_pic = D('Weixin')->getCode($doctor_id, 1);
                    $ex['wei_pic'] = $wei_pic;
                }
                unset($data['near'], $data['price'], $data['business_time']);
                if (false !== $obj->save($data)) {
                    D('Doctordetails')->upDetails($doctor_id, $ex);
                    $this->baoSuccess('操作成功', U('doctor/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('areas', D('Area')->fetchAll());
                $this->assign('cates', D('Doctorcate')->fetchAll());
                $this->assign('business', D('Business')->fetchAll());
                $this->assign('ex', D('Doctordetails')->find($doctor_id));
                $this->assign('user', D('Users')->find($detail['user_id']));
                $this->assign('detail', $detail);
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的医院');
        }
    }

    private function editCheck($doctor_id) {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);
        $data['user_id'] = (int) $data['user_id'];
        if (empty($data['user_id'])) {
            $this->baoError('管理者不能为空');
        }
        $doctor = D('Doctor')->find(array('where' => array('user_id' => $data['user_id'])));
        if (!empty($doctor) && $doctor['doctor_id'] != $doctor_id) {
            $this->baoError('该管理者已经拥有医院了');
        }
        $data['cate_id'] = (int) $data['cate_id'];
        if (empty($data['cate_id'])) {
            $this->baoError('分类不能为空');
        } 
        $data['city_id'] = (int) $data['city_id'];
        $data['area_id'] = (int) $data['area_id'];
        if (empty($data['area_id'])) {
            $this->baoError('所在区域不能为空');
        } $data['business_id'] = (int) $data['business_id'];
        if (empty($data['business_id'])) {
            $this->baoError('所在商圈不能为空');
        } $data['doctor_name'] = htmlspecialchars($data['doctor_name']);
        if (empty($data['doctor_name'])) {
            $this->baoError('医院名称不能为空');
        } $data['logo'] = htmlspecialchars($data['logo']);
        if (empty($data['logo'])) {
            $this->baoError('请上传医院LOGO');
        }
        if (!isImage($data['logo'])) {
            $this->baoError('医院LOGO格式不正确');
        }
        $data['photo'] = htmlspecialchars($data['photo']);
        if (empty($data['photo'])) {
            $this->baoError('请上传医院缩略图');
        }
        if (!isImage($data['photo'])) {
            $this->baoError('医院缩略图格式不正确');
        } $data['addr'] = htmlspecialchars($data['addr']);
        if (empty($data['addr'])) {
            $this->baoError('医院地址不能为空');
        } $data['docphone'] = htmlspecialchars($data['docphone']);
        $data['mobile'] = htmlspecialchars($data['mobile']);
        if (empty($data['docphone']) && empty($data['mobile'])) {
            $this->baoError('医院电话不能为空');
        }

        $data['contact'] = htmlspecialchars($data['contact']);
        $data['tags'] = htmlspecialchars($data['tags']);
        $data['near'] = htmlspecialchars($data['near']);
        $data['business_time'] = htmlspecialchars($data['business_time']);
        $data['orderby'] = (int) $data['orderby'];
        $data['lng'] = htmlspecialchars($data['lng']);
        $data['lat'] = htmlspecialchars($data['lat']);
        $data['price'] = (int) $data['price'];
        $data['is_pei'] = (int) $data['is_pei'];
        return $data;
    }

    public function delete($doctor_id = 0) {
        if (is_numeric($doctor_id) && ($doctor_id = (int) $doctor_id)) {
            $obj = D('Doctor');
            $obj->save(array('doctor_id' => $doctor_id, 'closed' => 1));
            $this->baoSuccess('删除成功！', U('doctor/index'));
        } else {
            $doctor_id = $this->_post('doctor_id', false);
            if (is_array($doctor_id)) {
                $obj = D('Doctor');
                foreach ($doctor_id as $id) {
                    $obj->save(array('doctor_id' => $id, 'closed' => 1));
                }
                $this->baoSuccess('删除成功！', U('doctor/index'));
            }
            $this->baoError('请选择要删除的医院');
        }
    }

    public function audit($doctor_id = 0) {
        if (is_numeric($doctor_id) && ($doctor_id = (int) $doctor_id)) {
            $obj = D('Doctor');
            $obj->save(array('doctor_id' => $doctor_id, 'audit' => 1));
            $this->baoSuccess('审核成功！', U('doctor/apply'));
        } else {
            $doctor_id = $this->_post('doctor_id', false);
            if (is_array($doctor_id)) {
                $obj = D('Doctor');
                foreach ($doctor_id as $id) {
                    $obj->save(array('doctor_id' => $id, 'audit' => 1));
                }
                $this->baoSuccess('审核成功！', U('doctor/apply'));
            }
            $this->baoError('请选择要审核的医院');
        }
    }

    public function login($doctor_id) {
        $obj = D('Doctor');
        if (!$detail = $obj->find($doctor_id)) {
            $this->error('请选择要编辑的医院');
        }
        if (empty($detail['user_id'])) {
            $this->error('该用户没有绑定管理者');
        }
        setUid($detail['user_id']);
        header("Location:" . U('doctor/index/index'));
        die;
    }
    
    
    public function ding($doctor_id){
        $obj = D('Doctor');
        if (!$detail = $obj->find($doctor_id)) {
            $this->error('请选择要编辑的医院');
        }
        $data = array('is_ding'=>0,'doctor_id'=>$doctor_id);
        if($detail['is_ding'] == 0){
            $data['is_ding'] = 1;
        }
        $obj->save($data);
        $this->baoSuccess('操作成功',U('doctor/index'));
    }
    
    public function pei($doctor_id){
        $obj = D('Doctor');
        if (!$detail = $obj->find($doctor_id)) {
            $this->error('请选择要编辑的医院');
        }
        $data = array('is_pei'=>0,'doctor_id'=>$doctor_id);
        if($detail['is_pei'] == 0){
            $data['is_pei'] = 1;
        }
        $obj->save($data);
        $this->baoSuccess('操作成功',U('doctor/index'));
    }
  

}
