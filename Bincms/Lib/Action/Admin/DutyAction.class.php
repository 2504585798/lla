<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class DutyAction extends CommonAction {

    private $create_fields = array('duty_id', 'name','dutyorder');
    private $edit_fields = array('duty_id', 'name','dutyorder');

    public function index() {
        $duty = D('Duty');
        import('ORG.Util.Page'); // 导入分页类
      
        $keyword = $this->_param('keyword', 'htmlspecialchars');
        if ($keyword) {
            $map['name'] = array('LIKE', '%' . $keyword . '%');
            $this->assign('keyword', $keyword);
        }

        $count = $duty->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 15); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $duty->where($map)->order(array('dutyorder' => 'asc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function create() {
        if ($this->isPost()) {
            $data = $this->createCheck();
            $obj = D('Duty');
           
			$datas['name'] = $data['name'];
		    $datas['dutyorder'] = $data['dutyorder'];
		    $duty_id = $obj->add($datas);
	   
            if (!empty($duty_id)) {
                $this->baoSuccess('添加成功', U('duty/index'));
            } else {
                $this->baoError('操作失败！');
            }
        } else {
            $this->display();
        }
    }

    public function edit($duty_id = 0) {
        if ($duty_id = (int) $duty_id) {
            $obj = D('Duty');
            if (!$detail = $obj->find($duty_id)) {
                $this->baoError('请选择要编辑的职务');
            }
            if ($this->isPost()) {
                $data = $this->editCheck();
                $data['duty_id'] = $duty_id;
                if (false !== $obj->save($data)) {
                    //$obj->cleanCache();
                    $this->baoSuccess('操作成功', U('duty/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('detail', $detail);
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的职务');
        }
    }

    private function editCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);
        $data['name'] = htmlspecialchars($data['name']);
       
        if (empty($data['name'])) {
            $this->baoError('职务不能为空');
        }
        $data['dutyorder'] = (int) $data['dutyorder'];
        return $data;
    }
  

    public function delete($duty_id = 0) {
        if (is_numeric($duty_id) && ($duty_id = (int) $duty_id)) {
            $obj = D('Duty');
            $obj->delete($duty_id);
            $this->baoSuccess('删除成功！', U('duty/index'));
        } else {
            $duty_id = $this->_post('duty_id', false);
            if (is_array($duty_id)) {
                $obj = D('Duty');
                foreach ($duty_id as $id) {
                    $obj->delete($id);
                }
                $this->baoSuccess('删除成功！', U('duty/index'));
            }
            $this->baoError('请选择要删除的职务');
        }
    }


}
