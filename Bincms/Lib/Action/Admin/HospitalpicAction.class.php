<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class HospitalpicAction extends CommonAction {

    public function index() {
        $Hospitalpic = D('Hospitalpic');
        import('ORG.Util.Page'); // 导入分页类
        $map = array();
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['title'] = array('LIKE', '%' . $keyword . '%');
            $this->assign('keyword', $keyword);
        }

        if ($hospital_id = (int) $this->_param('hospital_id')) {
            $map['hospital_id'] = $hospital_id;
            $hospital = D('Hospital')->find($hospital_id);
            $this->assign('hospital_name', $hospital['hospital_name']);
            $this->assign('hospital_id', $hospital_id);
        }
        if ($audit = (int) $this->_param('audit')) {
            $map['audit'] = ($audit === 1 ? 1 : 0);
            $this->assign('audit', $audit);
        }
        $count = $Hospitalpic->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Hospitalpic->where($map)->order(array('pic_id'=>'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $hospital_ids = array();
        foreach ($list as $k => $val) {
            if ($val['hospital_id']) {
                $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
            }
            $val['create_ip_area'] = $this->ipToArea($val['create_ip']);
            $list[$k] = $val;
        }
        if ($hospital_ids) {
            $this->assign('hospitals', D('Hospital')->itemsByIds($hospital_ids));
        }
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function delete($pic_id = 0) {
        if (is_numeric($pic_id) && ($pic_id = (int) $pic_id)) {
            $obj = D('Hospitalpic');
            $obj->delete($pic_id);
            $this->baoSuccess('删除成功！', U('hospitalpic/index'));
        } else {
            $pic_id = $this->_post('pic_id', false);
            if (is_array($pic_id)) {
                $obj = D('Hospitalpic');
                foreach ($pic_id as $id) {
                    $obj->delete($id);
                }
                $this->baoSuccess('删除成功！', U('hospitalpic/index'));
            }
            $this->baoError('请选择要删除的医院图片');
        }
    }

    public function audit($pic_id = 0) {
        if (is_numeric($pic_id) && ($pic_id = (int) $pic_id)) {
            $obj = D('Hospitalpic');
            $obj->save(array('pic_id' => $pic_id, 'audit' => 1));
            $this->baoSuccess('审核成功！', U('hospitalpic/index'));
        } else {
            $pic_id = $this->_post('pic_id', false);
            if (is_array($pic_id)) {
                $obj = D('Hospitalpic');
                foreach ($pic_id as $id) {
                    $obj->save(array('pic_id' => $id, 'audit' => 1));
                }
                $this->baoSuccess('审核成功！', U('hospitalpic/index'));
            }
            $this->baoError('请选择要审核的医院图片');
        }
    }

}
