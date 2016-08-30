<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class CityAction extends CommonAction {

    private $create_fields = array('region_name','region_id','region_type', 'parent_id');
    private $edit_fields = array('region_name','region_id','region_type', 'parent_id');

    public function index() {
        $Chinarea = D('Chinarea');
        $list = $Chinarea->order(array('region_type'=>'asc'))->fetchAll();
		//dump($list);
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function select(){
        $Chinarea = D('Chinarea');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('closed'=>array('IN','0,-1'));
        if($region_name = $this->_param('region_name','htmlspecialchars')){
            $map['region_name'] = array('LIKE','%'.$region_name.'%');
            $this->assign('region_name',$region_name);
        }
        $count = $Chinarea->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 8); // 实例化分页类 传入总记录数和每页显示的记录数
        $pager = $Page->show(); // 分页显示输出
        $list = $Chinarea->where($map)->order(array('region_id'=>'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $pager); // 赋值分页输出
        $this->display(); // 输出模板
        
    }
    
    public function create($parent_id=1) {
        if ($this->isPost()) {
            $data = $this->createCheck();
            $obj = D('Chinarea');
            $data['parent_id'] = $parent_id;
            if ($obj->add($data)) {
                $obj->cleanCache();
                $this->baoSuccess('添加成功', U('itemcate/index'));
            }
            $this->baoError('操作失败！');
        } else {
            $this->assign('parent_id',$parent_id);
            $this->display();
        }
    }
    
    
    public function child($parent_id=1){
        $datas = D('Chinarea')->fetchAll();
        $str = '';

        foreach($datas as $var){
            if($var['parent_id'] == 1 && $var['region_id'] == $parent_id){
         
                foreach($datas as $var2){

                    if($var2['parent_id'] == $var['region_id']){
                        $str.='<option value="'.$var2['region_id'].'">'.$var2['region_name'].'</option>'."\n\r";
                    }  
                }
            }           
        }
        echo $str;die;
    }
    
    private function createCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->create_fields);
        $data['region_name'] = htmlspecialchars($data['region_name']);
        $data['rate'] = (int)$data['rate'];
        if (empty($data['region_name'])) {
            $this->baoError('地区分类不能为空');
        }
        $data['orderby'] = (int) $data['orderby'];
        return $data;
    }

    public function edit($region_id = 0) {
        if ($region_id = (int) $region_id) {
            $obj = D('Chinarea');
            if (!$detail = $obj->find($region_id)) {
                $this->baoError('请选择要编辑的地区分类');
            }
            if ($this->isPost()) {
                $data = $this->editCheck();
                $data['region_id'] = $region_id;
                if (false !== $obj->save($data)) {
                    $obj->cleanCache();
                    $this->baoSuccess('操作成功', U('itemcate/index'));
                }
                $this->baoError('操作失败');
            } else {
                $this->assign('detail', $detail);
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的地区分类');
        }
    }

    private function editCheck() {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);
        $data['region_name'] = htmlspecialchars($data['region_name']);
        $data['rate'] = (int)$data['rate'];
        if (empty($data['region_name'])) {
            $this->baoError('分类不能为空');
        }
        $data['orderby'] = (int) $data['orderby'];
        return $data;
    }

    public function delete($region_id = 0) {
        if (is_numeric($region_id) && ($region_id = (int) $region_id)) {
            $obj = D('Chinarea');
            $obj->delete($region_id);
            $obj->cleanCache();
            $this->baoSuccess('删除成功！', U('itemcate/index'));
        } else {
            $region_id = $this->_post('region_id', false);
            if (is_array($region_id)) {
                $obj = D('Chinarea');
                foreach ($region_id as $id) {
                    $obj->delete($id);
                }
                $obj->cleanCache();
                $this->baoSuccess('删除成功！', U('itemcate/index'));
            }
            $this->baoError('请选择要删除的地区分类');
        }
    }
    
    public function update() {
        $orderby = $this->_post('orderby', false);
        $obj = D('Chinarea');
        foreach ($orderby as $key => $val) {
            $data = array(
                'region_id' => (int) $key,
                'orderby' => (int) $val
            );
            $obj->save($data);
        }
        $obj->cleanCache();
        $this->baoSuccess('更新成功', U('itemcate/index'));
    }

    public function hots($region_id){
        if ($region_id = (int) $region_id) {
            $obj = D('Chinarea');
            if (!$detail = $obj->find($region_id)) {
                $this->baoError('请选择要编辑的地区分类');
            }
            $detail['is_hot'] = $detail['is_hot']==0 ? 1 : 0;
            $obj->save(array('region_id'=>$region_id,'is_hot'=>$detail['is_hot'])); 
            $obj->cleanCache();
            $this->baoSuccess('操作成功', U('itemcate/index'));
        } else {
            $this->baoError('请选择要编辑的地区分类');
        }
    }
    
}

