<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2015 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。

class BillcateAction extends CommonAction {

    public function index() {
         $Billcate = D('Billcate');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed' => 0,);
        $keyword = $this->_param('keyword', 'htmlspecialchars');
        if ($keyword) {
            $map['cate_name'] = array('LIKE', '%' . $keyword . '%');
            $this->assign('keyword', $keyword);
        }
        $count = $Billcate->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 15); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Billcate->where($map)->order(array('cate_id' => 'asc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();

        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板 
    }
    public function create() {
        if ($this->isPost()) {

            $data = $this->createCheck();
            $obj = D('Billcate');
         
            if ($obj->add($data)) {
                $this->baoSuccess('添加成功', U('billcate/index'));
            }
            $this->baoError('操作失败！');
        } else {
            $this->display();
        }
    }
     public function createCheck() {
        $data = $this->checkFields($this->_post('data', false), array('cate_name', 'orderby', 'photo'));
        $data['cate_name'] = trim(htmlspecialchars($data['cate_name']));
        $data['orderby'] = (int)($data['orderby']);
        if (empty($data['cate_name'])) {
            $this->baoError('题不能为空！');
        } 
        $data['photo'] = htmlspecialchars($data['photo']);
        if (empty($data['photo'])) {
            $this->baoError('请上传缩略图');
        }
        if (!isImage($data['photo'])) {
            $this->baoError('缩略图格式不正确');
        }


        return $data;
    }
        public function edit($cate_id = 0) {

        if ($cate_id = (int) $cate_id) {

            $obj = D('Billcate');

            if (!$detail = $obj->find($cate_id)) {
                $this->baoError('请选择要编辑的榜单分类');
            }
            if ($this->isPost()) {
                $data = $this->editCheck();
                $data['cate_id'] = $cate_id;
                if (false !== $obj->save($data)) {
                    $this->baoSuccess('操作成功', U('billcate/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('detail', $detail);

                $this->display();
            }
        }
    }
        public function editCheck() {
        $data = $this->checkFields($this->_post('data', false), array('cate_name', 'orderby', 'photo'));
        $data['cate_name'] = trim(htmlspecialchars($data['cate_name']));
        $data['orderby'] = (int)($data['orderby']);
        if (empty($data['cate_name'])) {
            $this->baoError('题不能为空！');
        } 
        $data['photo'] = htmlspecialchars($data['photo']);
        if (empty($data['photo'])) {
            $this->baoError('请上传缩略图');
        }
        if (!isImage($data['photo'])) {
            $this->baoError('缩略图格式不正确');
        }

        return $data;
    }
       public function delete($cate_id = 0) {
        if (is_numeric($cate_id) && ($cate_id = (int) $cate_id)) {
            $obj = D('Billcate');
            $obj->delete($cate_id);
            $this->baoSuccess('删除成功！', U('billcate/index'));
        } else {
            $cate_id = $this->_post('$cate_id', false);
            if (is_array($cate_id)) {
                $obj = D('Billcate');
                foreach ($cate_id as $id) {
                    $obj->delete($id);
                }
                $this->baoSuccess('删除成功！', U('billcate/index'));
            }
            $this->baoError('请选择要删除的榜单分类');
        }
    }

}
