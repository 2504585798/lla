<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2015 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。

class ArticleAction extends CommonAction {

     private $create_fields = array('cate_id' ,'title', 'source', 'keywords', 'desc', 'photo', 'details', 'create_time', 'create_ip', 'views','istop','isroll');
    private $edit_fields = array('cate_id' ,'title', 'source', 'keywords', 'desc', 'photo', 'details', 'views','istop','isroll');

    public function index() {
        $Article = D('Article');
        import('ORG.Util.Page'); // 导入分页类
        $map = array();
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['title'] = array('LIKE', '%' . $keyword . '%');
            $this->assign('keyword', $keyword);
        }
        if ($parent_id = (int) $this->_param('parent_id')) {
            $this->assign('parent_id', $parent_id);
        }

        if ($cate_id = (int) $this->_param('cate_id')) {
            $map['cate_id'] = $cate_id;
            $this->assign('cate_id', $cate_id);
        }
        $count = $Article->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Article->where($map)->order(array('article_id'=>'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        foreach($list as $k=>$val){
            $val['create_ip_area'] = $this->ipToArea($val['create_ip']);
            $list[$k] = $val;
        }
        
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->assign('cates', D('Articlecate')->fetchAll());
        $this->display(); // 输出模板
    }

    public function create() {
        if ($this->isPost()) {
            $data = $this->createCheck();
            $obj = D('Article');
            if ($obj->add($data)) {
                $this->baoSuccess('添加成功', U('article/index'));
            }
            $this->baoError('操作失败！');
        } else {
            $this->assign('cates', D('Articlecate')->fetchAll());
            $this->display();
        }
    }

    private function createCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->create_fields);
         $data['cate_id'] = (int) $data['cate_id'];
        if (empty($data['cate_id'])) {
            $this->baoError('分类不能为空');
        } 
        $data['title'] = htmlspecialchars($data['title']);
        if (empty($data['title'])) {
            $this->baoError('标题不能为空');
        }
        $data['source'] = htmlspecialchars($data['source']);
        $data['keywords'] = htmlspecialchars($data['keywords']);
        $data['desc'] = htmlspecialchars($data['desc']);
        $data['photo'] = htmlspecialchars($data['photo']);
        if (!empty($data['photo']) && !isImage($data['photo'])) {
            $this->baoError('缩略图格式不正确');
        }
        $data['details'] = SecurityEditorHtml($data['details']);
        if (empty($data['details'])) {
            $this->baoError('详细内容不能为空');
        }
        if($words = D('Sensitive')->checkWords($data['details'])){
            $this->baoError('详细内容含有敏感词：'.$words);
        }

        $data['create_time'] = NOW_TIME;
        $data['create_ip'] = get_client_ip();
        $data['views'] = (int) $data['views'];
			$data['istop'] = (int)$data['istop'];//小灰灰添加
		$data['isroll'] = (int)$data['isroll'];//小灰灰添加
        return $data;
    }

    public function edit($article_id = 0) {
        if ($article_id = (int) $article_id) {
            $obj = D('Article');
            if (!$detail = $obj->find($article_id)) {
                $this->baoError('请选择要编辑的文章');
            }
            if ($this->isPost()) {
                $data = $this->editCheck();
                $data['article_id'] = $article_id;
                if (false !== $obj->save($data)) {
                    $this->baoSuccess('操作成功', U('article/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('detail', $detail);
                $this->assign('parent_id',D('Articlecate')->getParentsId($detail['cate_id']));
                $this->assign('cates', D('Articlecate')->fetchAll());
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的文章');
        }
    }

    private function editCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);
         $data['cate_id'] = (int) $data['cate_id'];
        if (empty($data['cate_id'])) {
            $this->baoError('分类不能为空');
        } 
        $data['title'] = htmlspecialchars($data['title']);
        if (empty($data['title'])) {
            $this->baoError('标题不能为空');
        }
        $data['source'] = htmlspecialchars($data['source']);
        $data['keywords'] = htmlspecialchars($data['keywords']);
        $data['desc'] = htmlspecialchars($data['desc']);
        $data['photo'] = htmlspecialchars($data['photo']);
        if (!empty($data['photo']) && !isImage($data['photo'])) {
            $this->baoError('缩略图格式不正确');
        }
        $data['details'] = SecurityEditorHtml($data['details']);
        if (empty($data['details'])) {
            $this->baoError('详细内容不能为空');
        }
        if($words = D('Sensitive')->checkWords($data['details'])){
            $this->baoError('详细内容含有敏感词：'.$words);
        }
        $data['views'] = (int) $data['views'];
			$data['istop'] = (int)$data['istop'];//小灰灰添加
		$data['isroll'] = (int)$data['isroll'];//小灰灰添加
        return $data;
    }

    public function delete($article_id = 0) {
        if (is_numeric($article_id) && ($article_id = (int) $article_id)) {
            $obj = D('Article');
            $obj->delete($article_id);
            $this->baoSuccess('删除成功！', U('article/index'));
        } else {
            $article_id = $this->_post('article_id', false);
            if (is_array($article_id)) {
                $obj = D('Article');
                foreach ($article_id as $id) {
                    $obj->delete($id);
                }
                $this->baoSuccess('删除成功！', U('article/index'));
            }
            $this->baoError('请选择要删除的文章');
        }
    }

}
