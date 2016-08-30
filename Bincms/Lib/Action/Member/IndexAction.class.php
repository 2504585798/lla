<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class IndexAction extends CommonAction {

    public function index() {
        $Itemcode = D('Itemcode');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('user_id' => $this->uid); //这里只显示 实物
        $status = (int) $this->_param('status');
        switch ($status) {
            case 1:
                break;
            case 2:
                $map['is_used'] = 0;
                break;
            case 3:
                $map['is_used'] = 1;
                break;
        }
        $this->assign('status',$status);
        $count = $Itemcode->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Itemcode->where($map)->order(array('code_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        foreach ($list as $val) {
            $item_ids[$val['item_id']] = $val['item_id'];
        }
        $this->assign('items', D('Item')->itemsByIds($item_ids));
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function coderefund($code_id) {
        $code_id = (int) $code_id;
        if ($detail = D('Itemcode')->find($code_id)) {
            if ($detail['user_id'] != $this->uid) {
                $this->baoError('非法操作');
            }
            if ($detail['status'] != 0 || $detail['is_used'] != 0) {
                $this->baoError('该抢购券不能申请退款');
            }
            if (D('Itemcode')->save(array('code_id' => $code_id, 'status' => 1))) {
                $this->baoSuccess('申请成功！等待网站客服处理！', U('index/index'));
            }
        }
        $this->baoError('操作失败');
    }

    public function delete($code_id = 0) {//根据抢购券id删除
        if (is_numeric($code_id) && ($code_id = (int) $code_id)) {
            $obj = D('Itemcode');
            if (!$detial = $obj->find($code_id)) {
                $this->baoError('该抢购券不存在');
            }
            if ($detial['user_id'] != $this->uid) {
                $this->baoError('请不要操作他人的订单');
            }
            if($detial['status']  == 1 ){
                $this->baoError('该抢购券暂时不能删除');
            }
            if ($detial['status'] == 0) {
                if($detial['is_used'] == 0){
                    $this->baoError('该抢购券暂时不能删除');
                }
            }
            $obj->delete($code_id);
            $this->baoSuccess('删除成功！',U('index/index'));
        } else {
            $this->baoError('请选择要删除的抢购券');
        }
    }
    
}
