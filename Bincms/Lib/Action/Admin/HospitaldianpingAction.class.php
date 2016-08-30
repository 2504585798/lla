<?php
/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2015 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class HospitaldianpingAction extends CommonAction {

    private $create_fields = array('user_id', 'reply','hospital_id', 'score', 'cost', 'contents', 'show_date');
    private $edit_fields = array('user_id', 'reply','hospital_id', 'score', 'cost', 'contents', 'show_date');

    public function index() {
        $Hospitaldianping = D('Hospitaldianping');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0);
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
        $count = $Hospitaldianping->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Hospitaldianping->where($map)->order(array('dianping_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
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
            $obj = D('Hospitaldianping');
            if ($dianping_id = $obj->add($data)) {
                $photos = $this->_post('photos',false);
                $local = array();
                foreach($photos as $val){
                    if(isImage($val)) $local[] = $val;
                }
                if(!empty($local)) D('Hospitaldianpingpics')->upload($dianping_id,$data['hospital_id'],$local);
                $this->baoSuccess('添加成功', U('hospitaldianping/index'));
            }
            $this->baoError('操作失败！');
        } else {
            $this->display();
        }
    }

    private function createCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->create_fields);
        $data['user_id'] = (int) $data['user_id'];
        if (empty($data['user_id'])) {
            $this->baoError('用户不能为空');
        }
        $data['hospital_id'] = (int) $data['hospital_id'];
        if (empty($data['hospital_id'])) {
            $this->baoError('商家不能为空');
        }
        $data['score'] = (int) $data['score'];
        if (empty($data['score'])) {
            $this->baoError('评分不能为空');
        }
        $data['cost'] = (int) $data['cost'];
        $data['contents'] = htmlspecialchars($data['contents']);
        if (empty($data['contents'])) {
            $this->baoError('评价内容不能为空');
        }
        $data['show_date'] = htmlspecialchars($data['show_date']);
        if (empty($data['show_date'])) {
            $this->baoError('生效日期不能为空');
        }
        if (!isDate($data['show_date'])) {
            $this->baoError('生效日期格式不正确');
        }
        $data['reply'] = htmlspecialchars($data['reply']);
        $data['create_time'] = NOW_TIME;
        $data['create_ip'] = get_client_ip();
        
       

        return $data;
    }

    public function edit($dianping_id = 0) {
        if ($dianping_id = (int) $dianping_id) {
            $obj = D('Hospitaldianping');
            if (!$detail = $obj->find($dianping_id)) {
                $this->baoError('请选择要编辑的医院点评');
            }
            if ($this->isPost()) {
                $data = $this->editCheck();
                $data['dianping_id'] = $dianping_id;
                if (false !== $obj->save($data)) {
                    $photos = $this->_post('photos',false);
                    $local = array();
                    foreach($photos as $val){
                        if(isImage($val)) $local[] = $val;
                    }
                    if(!empty($local)) D('Hospitaldianpingpics')->upload($dianping_id,$data['hospital_id'],$local);
                    $this->baoSuccess('操作成功', U('hospitaldianping/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('detail', $detail);
                $this->assign('user', D('Users')->find($detail['user_id']));
                $this->assign('hospital', D('Hospital')->find($detail['hospital_id']));
             
                $this->assign('photos', D('Hospitaldianpingpics')->getPics($dianping_id));
                
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的医院点评');
        }
    }

    private function editCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);
        $data['user_id'] = (int) $data['user_id'];
        if (empty($data['user_id'])) {
            $this->baoError('用户不能为空');
        }
        $data['hospital_id'] = (int) $data['hospital_id'];
        if (empty($data['hospital_id'])) {
            $this->baoError('商家不能为空');
        }
        $data['score'] = (int) $data['score'];
        if (empty($data['score'])) {
            $this->baoError('评分不能为空');
        }
        $data['cost'] = (int) $data['cost'];
        $data['contents'] = htmlspecialchars($data['contents']);
        if (empty($data['contents'])) {
            $this->baoError('评价内容不能为空');
        }
        $data['show_date'] = htmlspecialchars($data['show_date']);
        if (empty($data['show_date'])) {
            $this->baoError('生效日期不能为空');
        }
        if (!isDate($data['show_date'])) {
            $this->baoError('生效日期格式不正确');
        }
        $data['reply'] = htmlspecialchars($data['reply']);
        $photos = $this->_post('photos',false);
        $local = array();
        foreach($photos as $val){
            if(isImage($val)) $local[] = $val;
        }
        $data['photos'] = json_encode($local);
        return $data;
    }

    public function delete($dianping_id = 0) {
        if (is_numeric($dianping_id) && ($dianping_id = (int) $dianping_id)) {
            $obj = D('Hospitaldianping');
            $obj->save(array('dianping_id'=>$dianping_id,'closed'=>1));
            $this->baoSuccess('删除成功！', U('hospitaldianping/index'));
        } else {
            $dianping_id = $this->_post('dianping_id', false);
            if (is_array($dianping_id)) {
                $obj = D('Hospitaldianping');
                foreach ($dianping_id as $id) {
                    $obj->save(array('dianping_id'=>$id,'closed'=>1));
                }
                $this->baoSuccess('删除成功！', U('hospitaldianping/index'));
            }
            $this->baoError('请选择要删除的医院点评');
        }
    }

}
