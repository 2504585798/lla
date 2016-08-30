<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。
class HospitalAction extends CommonAction {

    private $create_fields = array('user_id', 'cate_id','city_id', 'area_id', 'business_id', 'hospital_name', 'logo', 'mobile', 'photo', 'addr', 'tel', 'extension', 'contact', 'tags', 'near', 'is_pei', 'opentime','delivery_time', 'orderby', 'lng', 'lat', 'price');
    private $edit_fields = array('user_id', 'cate_id','city_id', 'area_id', 'business_id', 'hospital_name', 'mobile', 'logo', 'photo', 'addr', 'tel', 'extension', 'contact', 'tags', 'near', 'opentime','delivery_time', 'is_pei', 'orderby', 'lng', 'lat', 'price','is_ding');

    public function index() {
        $Hospital = D('Hospital');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0, 'audit' => 1);
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['hospital_name|tel'] = array('LIKE', '%' . $keyword . '%');
            $this->assign('keyword', $keyword);
        }
       /*  if ($city_id = (int) $this->_param('city_id')) {
            $map['city_id'] = $city_id;
            $this->assign('city_id', $city_id);
        } */
       /*  if ($area_id = (int) $this->_param('area_id')) {
            $map['area_id'] = $area_id;
            $this->assign('area_id', $area_id);
        } */
        if ($cate_id = (int) $this->_param('cate_id')) {
            $map['cate_id'] = array('IN', D('Hospital')->getChildren($cate_id));
            $this->assign('cate_id', $cate_id);
        }

        $count = $Hospital->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Hospital->order(array('hospital_id' => 'desc'))->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $ids = array();
        foreach ($list as $k => $val) {
            if ($val['user_id']) {
                $ids[$val['user_id']] = $val['user_id'];
            }
			 if ($val['country_id']) {
                $list[$k]['country_name'] =  D('Chinaarea')->field('region_name')->where(array('region_id'=>$val['country_id']))->find();
				
				$list[$k]['city_name'] = D('Chinaarea')->field('region_name')->where(array('region_id'=>$val['city_id']))->find();
				
            }
			
			
        }
        $this->assign('users', D('Users')->itemsByIds($ids));
       // $this->assign('citys', D('City')->fetchAll());
       // $this->assign('areas', D('Area')->fetchAll());
        $this->assign('cates', D('Hospitalcate')->fetchAll());
      //  $this->assign('business', D('Business')->fetchAll());
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function apply() {
        $Hospital = D('Hospital');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0, 'audit' => 0);
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['hospital_name|tel'] = array('LIKE', '%' . $keyword . '%');
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
            $map['cate_id'] = array('IN', D('Hospitalcate')->getChildren($cate_id));
            $this->assign('cate_id', $cate_id);
        }

        $count = $Hospital->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Hospital->order(array('hospital_id' => 'asc'))->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $ids = array();
		//$areas=array();
        foreach ($list as $k => $val) {

            if ($val['user_id']) {
                $ids[$val['user_id']] = $val['user_id'];
				
				
				
				
				
            }
			
			 if ($val['country_id']) {
                $list[$k]['country_name'] =  D('Chinaarea')->field('region_name')->where(array('region_id'=>$val['country_id']))->find();
				
				$list[$k]['city_name'] = D('Chinaarea')->field('region_name')->where(array('region_id'=>$val['city_id']))->find();
				
            }
			
			
        }
		//print_r($list);
        $this->assign('users', D('Users')->itemsByIds($ids));
		//$this->assign('area',D('Chinaarea')->itemsByIds($areas));
		//$this->assign('citym',$v=D('Chinaarea')->getChildren($areas));
		 //print_r($v);
       // $this->assign('citys', D('City')->fetchAll());
       // $this->assign('areas', D('Area')->fetchAll());
        $this->assign('cates', D('Hospitalcate')->fetchAll());
        $this->assign('business', D('Business')->fetchAll());
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function create() {
        if ($this->isPost()) {
            $data2=$data = $this->createCheck();
            $obj = D('Hospital');
            $details = $this->_post('details', 'SecurityEditorHtml');
            if ($words = D('Sensitive')->checkWords($details)) {
                $this->baoError('医院介绍含有敏感词：' . $words);
            }
            $bank = $this->_post('bank', 'htmlspecialchars');
            unset($data['near'], $data['price'], $data['business_time'],$data['delivery_time']);
            if ($hospital_id = $obj->add($data)) {
                $wei_pic = D('Weixin')->getCode($hospital_id, 1);
                $ex = array(
                    'wei_pic' => $wei_pic,
                    'details' => $details,
                    'bank' => $bank,
                    'near' => $data2['near'],
                    'price' => $data2['price'],
                    'business_time' => $data2['business_time'],
                    'delivery_time' => $data2['delivery_time'],
                );
                D('Hospitaldetails')->upDetails($hospital_id, $ex);
                $this->baoSuccess('添加成功', U('hospital/apply'));
            }
            $this->baoError('操作失败！');
        } else {
            $this->assign('cates', D('Hospitalcate')->fetchAll());
            $this->assign('business', D('Business')->fetchAll());
            $this->display();
        }
    }

    public function select() {
        $Hospital = D('Hospital');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0, 'audit' => 1);
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['hospital_name|tel'] = array('LIKE', '%' . $keyword . '%');
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
            $map['cate_id'] = array('IN', D('Hospitalcate')->getChildren($cate_id));
            $this->assign('cate_id', $cate_id);
        }
        $count = $Hospital->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Hospital->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $ids = array();
        foreach ($list as $k => $val) {

            if ($val['user_id']) {
                $ids[$val['user_id']] = $val['user_id'];
            }
        }
        $this->assign('users', D('Users')->itemsByIds($ids));
        $this->assign('citys', D('City')->fetchAll());
        $this->assign('areas', D('Area')->fetchAll());
        $this->assign('cates', D('Hospitalcate')->fetchAll());
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
        $hospital = D('Hospital')->find(array('where' => array('user_id' => $data['user_id'])));
        if (!empty($hospital)) {
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
        } $data['hospital_name'] = htmlspecialchars($data['hospital_name']);
        if (empty($data['hospital_name'])) {
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
        $data['tel'] = htmlspecialchars($data['tel']);
        $data['mobile'] = htmlspecialchars($data['mobile']);
        if (empty($data['tel']) && empty($data['mobile'])) {
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

    public function edit($hospital_id = 0) {

        if ($hospital_id = (int) $hospital_id) {
            $obj = D('Hospital');
            if (!$detail = $obj->find($hospital_id)) {
                $this->baoError('请选择要编辑的医院');
            }
            if ($this->isPost()) {
                $data = $this->editCheck($hospital_id);
                $data['hospital_id'] = $hospital_id;
                $details = $this->_post('details', 'SecurityEditorHtml');
                if ($words = D('Sensitive')->checkWords($details)) {
                    $this->baoError('医院介绍含有敏感词：' . $words);
                }
                $bank = $this->_post('bank', 'htmlspecialchars');
                $hospitaldetails = D('Hospitaldetails')->find($hospital_id);

                $ex = array(
                    'details' => $details,
                    'bank' => $bank,
                    'near' => $data['near'],
                    'price' => $data['price'],
                    'business_time' => $data['business_time'],
                );
                if (!empty($hospitaldetails['wei_pic'])) {
                    if (true !== strpos($hospitaldetails['wei_pic'], "https://mp.weixin.qq.com/")) {
                        $wei_pic = D('Weixin')->getCode($hospital_id, 1);
                        $ex['wei_pic'] = $wei_pic;
                    }
                } else {
                    $wei_pic = D('Weixin')->getCode($hospital_id, 1);
                    $ex['wei_pic'] = $wei_pic;
                }
                unset($data['near'], $data['price'], $data['business_time']);
                if (false !== $obj->save($data)) {
                    D('Hospitaldetails')->upDetails($hospital_id, $ex);
                    $this->baoSuccess('操作成功', U('hospital/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('areas', D('Area')->fetchAll());
                $this->assign('cates', D('Hospitalcate')->fetchAll());
                $this->assign('business', D('Business')->fetchAll());
                $this->assign('ex', D('Hospitaldetails')->find($hospital_id));
                $this->assign('user', D('Users')->find($detail['user_id']));
                $this->assign('detail', $detail);
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的医院');
        }
    }

    private function editCheck($hospital_id) {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);
        $data['user_id'] = (int) $data['user_id'];
        if (empty($data['user_id'])) {
            $this->baoError('管理者不能为空');
        }
        $hospital = D('Hospital')->find(array('where' => array('user_id' => $data['user_id'])));
        if (!empty($hospital) && $hospital['hospital_id'] != $hospital_id) {
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
        } $data['hospital_name'] = htmlspecialchars($data['hospital_name']);
        if (empty($data['hospital_name'])) {
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
        } $data['tel'] = htmlspecialchars($data['tel']);
        $data['mobile'] = htmlspecialchars($data['mobile']);
        if (empty($data['tel']) && empty($data['mobile'])) {
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

    public function delete($hospital_id = 0) {
        if (is_numeric($hospital_id) && ($hospital_id = (int) $hospital_id)) {
            $obj = D('Hospital');
            $obj->save(array('hospital_id' => $hospital_id, 'closed' => 1));
            $this->baoSuccess('删除成功！', U('hospital/index'));
        } else {
            $hospital_id = $this->_post('hospital_id', false);
            if (is_array($hospital_id)) {
                $obj = D('Hospital');
                foreach ($hospital_id as $id) {
                    $obj->save(array('hospital_id' => $id, 'closed' => 1));
                }
                $this->baoSuccess('删除成功！', U('hospital/index'));
            }
            $this->baoError('请选择要删除的医院');
        }
    }

    public function audit($hospital_id = 0) {
        if (is_numeric($hospital_id) && ($hospital_id = (int) $hospital_id)) {
            $obj = D('Hospital');
            $obj->save(array('hospital_id' => $hospital_id, 'audit' => 1));
            $this->baoSuccess('审核成功！', U('hospital/apply'));
        } else {
            $hospital_id = $this->_post('hospital_id', false);
            if (is_array($hospital_id)) {
                $obj = D('Hospital');
                foreach ($hospital_id as $id) {
                    $obj->save(array('hospital_id' => $id, 'audit' => 1));
                }
                $this->baoSuccess('审核成功！', U('hospital/apply'));
            }
            $this->baoError('请选择要审核的医院');
        }
    }

    public function login($hospital_id) {
        $obj = D('Hospital');
        if (!$detail = $obj->find($hospital_id)) {
            $this->error('请选择要编辑的医院');
        }
        if (empty($detail['user_id'])) {
            $this->error('该用户没有绑定管理者');
        }
        setUid($detail['user_id']);
        header("Location:" . U('hospitalcenter/index/index'));
        die;
    }
    
    
    public function ding($hospital_id){
        $obj = D('Hospital');
        if (!$detail = $obj->find($hospital_id)) {
            $this->error('请选择要编辑的医院');
        }
        $data = array('is_ding'=>0,'hospital_id'=>$hospital_id);
        if($detail['is_ding'] == 0){
            $data['is_ding'] = 1;
        }
        $obj->save($data);
        $this->baoSuccess('操作成功',U('hospital/index'));
    }
    
    public function pei($hospital_id){
        $obj = D('Hospital');
        if (!$detail = $obj->find($hospital_id)) {
            $this->error('请选择要编辑的医院');
        }
        $data = array('is_pei'=>0,'hospital_id'=>$hospital_id);
        if($detail['is_pei'] == 0){
            $data['is_pei'] = 1;
        }
        $obj->save($data);
        $this->baoSuccess('操作成功',U('hospital/index'));
    }
  

}
