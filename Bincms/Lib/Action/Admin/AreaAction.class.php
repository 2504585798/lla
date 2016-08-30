<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2015 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。

class AreaAction extends CommonAction {

    private $create_fields = array('region_name','region_id', 'region_type');
    private $edit_fields = array('region_name','region_id', 'region_type');

    public function index() {
         $Area = D('Chinaarea');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('region_type'=>2);
        $keyword = $this->_param('keyword','htmlspecialchars');
        if($keyword){
            $map['region_name'] = array('LIKE', '%'.$keyword.'%');
        }    
        $this->assign('keyword',$keyword);
                
        $region_id = (int)$this->_param('region_id');
        if($region_id){
            $map['region_id'] = $region_id;
        }
        $this->assign('region_id',$region_id);
        $count = $Area->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Area->where($map)->order(array('region_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->assign('citys',$v=D('ChinaArea')->select());
		//print_r($v);
        $this->display(); // 输出模板
    }

    public function create() {
        if ($this->isPost()) {
            $data = $this->createCheck();
            $obj = D('Area');
            if ($obj->add($data)) {
                $obj->cleanCache();
                $this->baoSuccess('添加成功', U('area/index'));
            }
            $this->baoError('操作失败！');
        } else {
             $this->assign('citys',D('City')->fetchAll());
            $this->display();
        }
    }

    private function createCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->create_fields);
        $data['area_name'] = htmlspecialchars($data['area_name']);
        if (empty($data['area_name'])) {
            $this->baoError('区域名称不能为空');
        } $data['orderby'] = (int) $data['orderby'];
        $data['city_id'] = (int) $data['city_id'];
        return $data;
    }

    public function edit($area_id = 0) {
        if ($area_id = (int) $area_id) {
            $obj = D('Area');
            if (!$detail = $obj->find($area_id)) {
                $this->baoError('请选择要编辑的区域管理');
            }
            if ($this->isPost()) {
                $data = $this->editCheck();
                $data['area_id'] = $area_id;
                if (false !== $obj->save($data)) {
                    $obj->cleanCache();
                    $this->baoSuccess('操作成功', U('area/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('detail', $detail);
                 $this->assign('citys',D('City')->fetchAll());
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的区域管理');
        }
    }
    
 

    private function editCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);
        $data['area_name'] = htmlspecialchars($data['area_name']);
        if (empty($data['area_name'])) {
            $this->baoError('区域名称不能为空');
        } 
        $data['orderby'] = (int) $data['orderby'];
        $data['city_id'] = (int) $data['city_id'];
        return $data;
    }

    public function delete($area_id = 0) {
        if (is_numeric($area_id) &&( $area_id = (int) $area_id) ){
            $obj = D('Area');
            $obj->delete($area_id);
            $obj->cleanCache();
            $this->baoSuccess('删除成功！', U('area/index'));
        } else {
            $area_id = $this->_post('area_id', false);
            if (is_array($area_id)) {
                $obj = D('Area');
                foreach ($area_id as $id) {
                    $obj->delete($id);
                }
                $obj->cleanCache();
                $this->baoSuccess('删除成功！', U('area/index'));
            }
            $this->baoError('请选择要删除的区域管理');
        }
    }

}
