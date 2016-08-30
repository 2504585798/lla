<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 ×××× 项目的一部分
//
// Copyright (c) 2015 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。

class DoctorcateAction extends CommonAction {

    private $create_fields = array('cate_name','d1','d2','d3','title', 'orderby');
    private $edit_fields = array('cate_name','d1','d2','d3','title', 'orderby');

    public function index() {
        $Doctorcate = D('Doctorcate');
        $list = $Doctorcate->fetchAll();
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function create($parent_id=0) {
        if ($this->isPost()) {
            $data = $this->createCheck();
            $obj = D('Doctorcate');
            $data['parent_id'] = $parent_id;
            if ($obj->add($data)) {
                $obj->cleanCache();
                $this->baoSuccess('添加成功', U('doctorcate/index'));
            }
            $this->baoError('操作失败！');
        } else {
            $this->assign('parent_id',$parent_id);
            $this->display();
        }
    }
    
    public function hots($cate_id){
        if ($cate_id = (int) $cate_id) {
            $obj = D('Doctorcate');
            if (!$detail = $obj->find($cate_id)) {
                $this->baoError('请选择要编辑的医生分类');
            }
            $detail['is_hot'] = $detail['is_hot']==0 ? 1 : 0;
            $obj->save(array('cate_id'=>$cate_id,'is_hot'=>$detail['is_hot'])); 
            $obj->cleanCache();
            $this->baoSuccess('操作成功', U('doctorcate/index'));
        } else {
            $this->baoError('请选择要编辑的医生分类');
        }
    }
    
 
    
    private function createCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->create_fields);
        $data['cate_name'] = htmlspecialchars($data['cate_name']);
        if (empty($data['cate_name'])) {
            $this->baoError('分类不能为空');
        }
        $data['d1'] = htmlspecialchars($data['d1']);
        $data['d2'] = htmlspecialchars($data['d2']);
        $data['d3'] = htmlspecialchars($data['d3']);
        $data['title'] = htmlspecialchars($data['title']);
        $data['orderby'] = (int) $data['orderby'];
        return $data;
    }

    public function edit($cate_id = 0) {
        if ($cate_id = (int) $cate_id) {
            $obj = D('Doctorcate');
            if (!$detail = $obj->find($cate_id)) {
                $this->baoError('请选择要编辑的医生分类');
            }
            if ($this->isPost()) {
                $data = $this->editCheck();
                $data['cate_id'] = $cate_id;
                if (false !== $obj->save($data)) {
                    $obj->cleanCache();
                    $this->baoSuccess('操作成功', U('doctorcate/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('detail', $detail);
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的医生分类');
        }
    }

    private function editCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);
        $data['cate_name'] = htmlspecialchars($data['cate_name']);
       
        if (empty($data['cate_name'])) {
            $this->baoError('分类不能为空');
        }
        $data['d1'] = htmlspecialchars($data['d1']);
        $data['d2'] = htmlspecialchars($data['d2']);
        $data['d3'] = htmlspecialchars($data['d3']);
        $data['title'] = htmlspecialchars($data['title']);
        $data['orderby'] = (int) $data['orderby'];
        return $data;
    }

    public function delete($cate_id = 0) {
        if (is_numeric($cate_id) && ($cate_id = (int) $cate_id)) {
            $obj = D('Doctorcate');
            $obj->delete($cate_id);
            $obj->cleanCache();
            $this->baoSuccess('删除成功！', U('doctorcate/index'));
        } else {
            $cate_id = $this->_post('cate_id', false);
            if (is_array($cate_id)) {
                $obj = D('Doctorcate');
                foreach ($cate_id as $id) {
                    $obj->delete($id);
                }
                $obj->cleanCache();
                $this->baoSuccess('删除成功！', U('doctorcate/index'));
            }
            $this->baoError('请选择要删除的医生分类');
        }
    }
    
    public function update() {
        $orderby = $this->_post('orderby', false);
        $obj = D('Doctorcate');
        foreach ($orderby as $key => $val) {
            $data = array(
                'cate_id' => (int) $key,
                'orderby' => (int) $val
            );
            $obj->save($data);
        }
        $obj->cleanCache();
        $this->baoSuccess('更新成功', U('doctorcate/index'));
    }

}
