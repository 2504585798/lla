<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。
class HospitalweixinkeywordAction extends CommonAction {

    private $create_fields = array('hospital_id', 'keyword', 'type', 'title', 'contents', 'url', 'photo');
    private $edit_fields = array('hospital_id', 'keyword', 'type', 'title', 'contents', 'url', 'photo');

    public function index() {
        $Hospitalweixinkeyword = D('Hospitalweixinkeyword');
        import('ORG.Util.Page'); // 导入分页类
        $map = array();
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['keyword'] = array('LIKE', '%' . $keyword . '%');
        }
        if ($hospital_id = (int) $this->_param('hospital_id')) {
            $map['hospital_id'] = $hospital_id;
            $hospital = D('Hospital')->find($hospital_id);
            $this->assign('hospital_name', $hospital['hospital_name']);
            $this->assign('hospital_id', $hospital_id);
        }
        $count = $Hospitalweixinkeyword->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 15); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Hospitalweixinkeyword->where($map)->order(array('keyword_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $hospital_ids = array();
        foreach ($list as $k => $val) {
            if ($val['hospital_id']) {
                $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
            }
        }
        if ($hospital_ids) {
            $this->assign('hospitals', D('Hospital')->itemsByIds($hospital_ids));
        }
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function create() {
        if ($this->isPost()) {
            $data = $this->createCheck();
            $obj = D('Hospitalweixinkeyword');
            if ($obj->add($data)) {
                $obj->cleanCache();
                $this->baoSuccess('添加成功', U('hospitalweixinkeyword/index'));
            }
            $this->baoError('操作失败！');
        } else {
            $this->display();
        }
    }

    private function createCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->create_fields);
        $data['hospital_id'] = (int) $data['hospital_id'];
        if (empty($data['hospital_id'])) {
            $this->baoError('请选择医院');
        }
        $data['keyword'] = htmlspecialchars($data['keyword']);
        if (empty($data['keyword'])) {
            $this->baoError('关键字不能为空');
        }
        if (D('Hospitalweixinkeyword')->checkKeyword($data['hospital_id'], $data['keyword'])) {
            $this->baoError('关键字已经存在');
        }

        if (empty($data['type'])) {
            $this->baoError('类型不能为空');
        }
        $data['title'] = htmlspecialchars($data['title']);


        if (empty($data['contents'])) {
            $this->baoError('回复内容不能为空');
        }
        if ($words = D('Sensitive')->checkWords($data['contents'])) {
            $this->baoError('内容含有敏感词：' . $words);
        }
        $data['url'] = htmlspecialchars($data['url']);
        $data['photo'] = htmlspecialchars($data['photo']);
        if (!empty($data['photo']) && !isImage($data['photo'])) {
            $this->baoError('缩略图格式不正确');
        }
        return $data;
    }

    public function edit($keyword_id = 0) {
        if ($keyword_id = (int) $keyword_id) {
            $obj = D('Hospitalweixinkeyword');
            if (!$detail = $obj->find($keyword_id)) {
                $this->baoError('请选择要编辑的微信关键字');
            }
            if ($this->isPost()) {
                $data = $this->editCheck();
                $data['keyword_id'] = $keyword_id;
                $local = $obj->checkKeyword($data['hospital_id'],$data['keyword']);
                if ($local && $local['keyword_id'] != $keyword_id) {
                    $this->baoError('关键字已经存在');
                }

                if (false !== $obj->save($data)) {
                    $obj->cleanCache();
                    $this->baoSuccess('操作成功', U('hospitalweixinkeyword/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('hospital', D('Hospital')->find($detail['hospital_id']));
                $this->assign('detail', $detail);
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的微信关键字');
        }
    }

    private function editCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);
        $data['hospital_id'] = (int) $data['hospital_id'];
        if (empty($data['hospital_id'])) {
            $this->baoError('请选择医院');
        }
        $data['keyword'] = htmlspecialchars($data['keyword']);
        if (empty($data['keyword'])) {
            $this->baoError('关键字不能为空');
        }
        if (empty($data['type'])) {
            $this->baoError('类型不能为空');
        }
        $data['title'] = htmlspecialchars($data['title']);

        if (empty($data['contents'])) {
            $this->baoError('回复内容不能为空');
        }
        if ($words = D('Sensitive')->checkWords($data['contents'])) {
            $this->baoError('内容含有敏感词：' . $words);
        }
        $data['url'] = htmlspecialchars($data['url']);
        $data['photo'] = htmlspecialchars($data['photo']);
        if (!empty($data['photo']) && !isImage($data['photo'])) {
            $this->baoError('缩略图格式不正确');
        }
        return $data;
    }

    public function delete($keyword_id = 0) {
        if (is_numeric($keyword_id) && ($keyword_id = (int) $keyword_id)) {
            $obj = D('Hospitalweixinkeyword');
            $obj->delete($keyword_id);
            $obj->cleanCache();
            $this->baoSuccess('删除成功！', U('hospitalweixinkeyword/index'));
        } else {
            $keyword_id = $this->_post('keyword_id', false);
            if (is_array($keyword_id)) {
                $obj = D('Hospitalweixinkeyword');
                foreach ($keyword_id as $id) {
                    $obj->delete($id);
                }
                $obj->cleanCache();
                $this->baoSuccess('删除成功！', U('hospitalweixinkeyword/index'));
            }
            $this->baoError('请选择要删除的微信关键字');
        }
    }

}
