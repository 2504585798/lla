<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class WeidianAction extends CommonAction {

    private $edit_fields = array('user_id', 'cate_id', 'city_id', 'area_id', 'weidian_name', 'addr', 'logo', 'pic', 'business_time', 'details', 'lng', 'lat', 'cate_id', 'audit', 'city_id', 'area_id', 'audit', 'update_time');

    public function _initialize() {
        parent::_initialize();
        $mcates = $this->_CONFIG['mall'];
        $cates = array();
        for ($i = 1; $i <= count($mcates); $i+=1) {
            if ($i % 2 == 0) {
                $ii = $i / 2;
                if (!empty($mcates['ming' . $ii]) && !empty($mcates['dian' . $ii])) {
                    $cates[$mcates['dian' . $ii]] = array('cate_name' => $mcates['ming' . $ii], 'cate_id' => $mcates['dian' . $ii]);
                }
            }
        }
        //dump($cates);
        $this->assign('cates', $cates);
    }

    public function index() {
        $wd = D('WeidianDetails');
        import('ORG.Util.Page'); // 导入分页类
        $map = array();
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['weidian_name'] = array('LIKE', '%' . $keyword . '%');
            $this->assign('keyword', $keyword);
        }
        if ($city_id = (int) $this->_param('city_id')) {
            $map['city_id'] = $city_id;
            $this->assign('city_id', $city_id);
        }
        if ($area_id = (int) $this->_param('area_id')) {
            $map['area_id'] = $area_id;
            $this->assign('area_id', $area_id);
        }
        if ($cate_id = (int) $this->_param('cate_id')) {
            $map['cate_id'] = $cate_id;
            $this->assign('cate_id', $cate_id);
        }
        $count = $wd->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $wd->order(array('id' => 'desc'))->where($map)->limit($Page->firstRow . ',' . $Page->listRows)->select();

        $this->assign('citys', D('City')->fetchAll());
        $this->assign('areas', D('Area')->fetchAll());
        $this->assign('business', D('Business')->fetchAll());
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function audit($wd_id = 0) {
        if (is_numeric($wd_id) && ($wd_id = (int) $wd_id)) {
            $obj = D('WeidianDetails');

            $obj->save(array('id' => $wd_id, 'audit' => 1, 'update_time' => time()));

            $this->baoSuccess('审核成功！', U('weidian/index'));
        } else {
            $error = 0;
            $wd_id = $this->_post('id', false);

            if (is_array($wd_id)) {
                $obj = D('WeidianDetails');
                foreach ($wd_id as $id) {
                    $r = $obj->save(array('id' => $id, 'audit' => 1, 'update_time' => time()));

                    if (!$r) {
                        $error = $error + 1;
                    }
                }
                if ($error > 0) {
                    $this->baoSuccess($error . '条审核失败！', U('weidian/index'));
                } else {
                    $this->baoSuccess('审核成功！', U('weidian/index'));
                }
            }
            $this->baoError('请选择要审核的微医院');
        }
    }

    public function edit($hospital_id = 0) {
        if ($hospital_id = (int) $hospital_id) {
            $obj = D('WeidianDetails');
            if (!$detail = $obj->where(array('hospital_id' => $hospital_id))->find()) {
                $this->baoError('请选择要编辑的微医院');
            }
            if ($this->isPost()) {
                $data = $this->editCheck($hospital_id);
                $data['hospital_id'] = $hospital_id;
                //$details = $this->_post('details', 'SecurityEditorHtml');
                if ($words = D('Sensitive')->checkWords($details)) {
                    $this->baoError('医院介绍含有敏感词：' . $words);
                }
                $robj = $obj->where('hospital_id=' . $hospital_id)->save($data);
                if ($robj) {
                    //D('Shopdetails')->upDetails($hospital_id, $ex);
                    $this->baoSuccess('操作成功', U('weidian/index'));
                } else {
                    $this->baoError('操作失败' . $obj->getLastSql());
                }
            } else {
                $this->assign('citys', D('City')->fetchAll());
                $this->assign('areas', D('Area')->fetchAll());
                $this->assign('business', D('Business')->fetchAll());
                $this->assign('detail', $detail);
                $this->display();
            }
        } else {
            $this->baoError('请选择要编辑的医院');
        }
    }

    private function editCheck($hospital_id) {
        $data = $this->checkFields($this->_post('data', false), $this->edit_fields);


        $hospital = D('WeidianDetails')->find(array('where' => array('hospital_id' => $data['hospital_id'])));
        if (!empty($hospital) && $hospital['hospital_id'] != $hospital_id) {
            $this->baoError('该管理已经拥有医院了');
        }

        $data['audit'] = intval($data['audit']);

        if ($hospital['audit'] != $data['audit']) {
            $data['update_time'] = time();
        }

        $data['weidian_name'] = htmlspecialchars($data['weidian_name']);
        if (empty($data['weidian_name'])) {
            $this->baoError('微医院名称不能为空');
        }

        $data['addr'] = htmlspecialchars($data['addr']);
        if (empty($data['addr'])) {
            $this->baoError('店铺地址不能为空');
        }

        $data['details'] = SecurityEditorHtml($data['details']);

        $data['business_time'] = htmlspecialchars($data['business_time']);
        if (empty($data['business_time'])) {
            $this->baoError('营业时间不能为空');
        }


        $data['pic'] = htmlspecialchars($data['pic']);
        if (empty($data['pic'])) {
            $this->baoError('请上传微医院形象照');
        }
        if (!isImage($data['pic'])) {
            $this->baoError('微医院形象照格式不正确');
        }

        $data['logo'] = htmlspecialchars($data['logo']);
        if (empty($data['logo'])) {
            $this->baoError('请上传微医院LOGO');
        }
        if (!isImage($data['logo'])) {
            $this->baoError('微医院LOGO格式不正确');
        }


        $data['cate_id'] = (int) $data['cate_id'];
        if (empty($data['cate_id'])) {
            $this->baoError('分类不能为空');
        }
        $data['city_id'] = (int) $data['city_id'];
        $data['area_id'] = (int) $data['area_id'];
        if (empty($data['area_id']) || empty($data['city_id'])) {
            $this->baoError('所在城市和区域不能为空');
        }

        $data['lng'] = htmlspecialchars($data['lng']);
        $data['lat'] = htmlspecialchars($data['lat']);
        return $data;
    }

}
