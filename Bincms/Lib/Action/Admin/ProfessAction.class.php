<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class ProfessAction extends CommonAction {

    private $create_fields = array('profess_id', 'name','professorder');
    private $edit_fields = array('profess_id', 'name','professorder');

    public function index() {
        $profess = D('Profess');
        import('ORG.Util.Page'); // 导入分页类
      
        $keyword = $this->_param('keyword', 'htmlspecialchars');
        if ($keyword) {
            $map['name'] = array('LIKE', '%' . $keyword . '%');
            $this->assign('keyword', $keyword);
        }

        $count = $profess->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 15); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $profess->where($map)->order(array('professorder' => 'asc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function create() {
        if ($this->isPost()) {
            $data = $this->createCheck();
            $obj = D('Profess');
           
			$datas['name'] = $data['name'];
		    $datas['professorder'] = $data['professorder'];
		    $profess_id = $obj->add($datas);
	   
            if (!empty($profess_id)) {
                $this->baoSuccess('添加成功', U('profess/index'));
            } else {
                $this->baoError('操作失败！');
            }
        } else {
            $this->display();
        }
    }

    public function edit($profess_id = 0) {
        if ($profess_id = (int) $profess_id) {
            $obj = D('Profess');
            if (!$detail = $obj->find($profess_id)) {
                $this->baoError('请选择要编辑的职称');
            }
            if ($this->isPost()) {
                $data = $this->editCheck();
                $data['profess_id'] = $profess_id;
                if (false !== $obj->save($data)) {
                    //$obj->cleanCache();
                    $this->baoSuccess('操作成功', U('profess/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('detail', $detail);
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的职称');
        }
    }

    private function editCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);
        $data['name'] = htmlspecialchars($data['name']);
       
        if (empty($data['name'])) {
            $this->baoError('职称不能为空');
        }
        $data['professorder'] = (int) $data['professorder'];
        return $data;
    }
  

    public function delete($profess_id = 0) {
        if (is_numeric($profess_id) && ($profess_id = (int) $profess_id)) {
            $obj = D('Profess');
            $obj->delete($profess_id);
            $this->baoSuccess('删除成功！', U('profess/index'));
        } else {
            $profess_id = $this->_post('profess_id', false);
            if (is_array($profess_id)) {
                $obj = D('Profess');
                foreach ($profess_id as $id) {
                    $obj->delete($id);
                }
                $this->baoSuccess('删除成功！', U('profess/index'));
            }
            $this->baoError('请选择要删除的职称');
        }
    }


}
