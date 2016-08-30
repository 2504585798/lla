<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。
class HospitalyuyueAction extends CommonAction {

    private $create_fields = array('user_id', 'hospital_id', 'name', 'mobile','yuyue_date','yuyue_time','number', 'create_time', 'create_ip');
    private $edit_fields = array('user_id', 'hospital_id', 'name', 'mobile','yuyue_date','yuyue_time','number');

    public function index() {
        $Hospitalyuyue = D('Hospitalyuyue');
        import('ORG.Util.Page'); // 导入分页类
        $map = array();
        if($keyword = $this->_param('keyword','htmlspecialchars')){
            $map['name|mobile'] = array('LIKE','%'.$keyword.'%');
            $this->assign('keyword',$keyword);
        }
        if ($hospital_id = (int) $this->_param('hospital_id')) {
            $map['hospital_id'] = $hospital_id;
            $hospital = D('Hospital')->find($hospital_id);
            $this->assign('hospital_name', $hospital['hospital_name']);
            $this->assign('hospital_id', $hospital_id);
        }
        if ($user_id = (int) $this->_param('user_id')) {
            $map['user_id'] = $user_id;
            $user = D('Users')->find($user_id);
            $this->assign('nickname', $user['nickname']);
            $this->assign('user_id', $user_id);
        }
        $count = $Hospitalyuyue->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Hospitalyuyue->where($map)->order(array('yuyue_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $user_ids = $hospital_ids  = array();
        foreach($list  as $k=>$val){            
            $val['create_ip_area'] = $this->ipToArea($val['create_ip']);
            $list[$k] = $val;          
            $user_ids[$val['user_id']] = $val['user_id'];
            $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
        }
        if(!empty($user_ids)){
            $this->assign('users',D('Users')->itemsByIds($user_ids));
        }
        if(!empty($hospital_ids)){
            $this->assign('hospitals',D('Hospital')->itemsByIds($hospital_ids));
        }
        
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function create() {
        if ($this->isPost()) {
            $data = $this->createCheck();
            $obj = D('Hospitalyuyue');
            if ($obj->add($data)) {
                $this->baoSuccess('添加成功', U('hospitalyuyue/index'));
            }
            $this->baoError('操作失败！');
        } else {
            $this->display();
        }
    }

    private function createCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->create_fields);
        $data['user_id'] = (int) $data['user_id'];
        $data['hospital_id'] = (int) $data['hospital_id'];
        if (empty($data['hospital_id'])) {
            $this->baoError('医院不能为空');
        }
        $data['name'] = htmlspecialchars($data['name']);
        if (empty($data['name'])) {
            $this->baoError('称呼不能为空');
        } 
        $data['mobile'] = htmlspecialchars($data['mobile']);
        if (empty($data['mobile'])) {
            $this->baoError('手机不能为空');
        }
        if (!isMobile($data['mobile'])) {
            $this->baoError('手机格式不正确');
        } 
        $data['yuyue_date'] = htmlspecialchars($data['yuyue_date']);
        $data['yuyue_time'] = htmlspecialchars($data['yuyue_time']);
        if(empty($data['yuyue_date']) || empty($data['yuyue_time'])){
            $this->baoError('预定日期不能为空');           
        }
        if(!isDate($data['yuyue_date'])){
            $this->baoError('预定日期格式错误！');
        }
        $data['number'] = (int)$data['number'];        
        $data['create_time'] = NOW_TIME;
        $data['create_ip'] = get_client_ip();
        $data['code'] = D('Hospitalyuyue')->getCode();
        return $data;
    }

    public function edit($yuyue_id = 0) {
        if ($yuyue_id = (int) $yuyue_id) {
            $obj = D('Hospitalyuyue');
            if (!$detail = $obj->find($yuyue_id)) {
                $this->baoError('请选择要编辑的医院预约');
            }
            if ($this->isPost()) {
                $data = $this->editCheck();
                $data['yuyue_id'] = $yuyue_id;
                if (false !== $obj->save($data)) {
                    $this->baoSuccess('操作成功', U('hospitalyuyue/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('detail', $detail);
                $this->assign('user', D('Users')->find($detail['user_id']));
                $this->assign('hospital', D('Hospital')->find($detail['hospital_id']));
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的医院预约');
        }
    }

    private function editCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);
        $data['user_id'] = (int) $data['user_id'];
        $data['hospital_id'] = (int) $data['hospital_id'];
        if (empty($data['hospital_id'])) {
            $this->baoError('医院不能为空');
        } $data['name'] = htmlspecialchars($data['name']);
        if (empty($data['name'])) {
            $this->baoError('称呼不能为空');
        } $data['mobile'] = htmlspecialchars($data['mobile']);
        if (empty($data['mobile'])) {
            $this->baoError('手机不能为空');
        }
        if (!isMobile($data['mobile'])) {
            $this->baoError('手机格式不正确');
        }        
        $data['yuyue_date'] = htmlspecialchars($data['yuyue_date']);
        $data['yuyue_time'] = htmlspecialchars($data['yuyue_time']);
        if(empty($data['yuyue_date']) || empty($data['yuyue_time'])){
            $this->baoError('预定日期不能为空');           
        }
        if(!isDate($data['yuyue_date'])){
            $this->baoError('预定日期格式错误！');
        }
        $data['number'] = (int)$data['number'];     
        
        return $data;
    }

    public function delete($yuyue_id = 0) {
        if (is_numeric($yuyue_id) && ($yuyue_id = (int) $yuyue_id)) {
            $obj = D('Hospitalyuyue');
            $obj->delete($yuyue_id);
            $this->baoSuccess('删除成功！', U('hospitalyuyue/index'));
        } else {
            $yuyue_id = $this->_post('yuyue_id', false);
            if (is_array($yuyue_id)) {
                $obj = D('Hospitalyuyue');
                foreach ($yuyue_id as $id) {
                    $obj->delete($id);
                }
                $this->baoSuccess('删除成功！', U('hospitalyuyue/index'));
            }
            $this->baoError('请选择要删除的医院预约');
        }
    }

}
