<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class ItemorderAction extends CommonAction {

    public function index() {
        $Itemorder = D('Itemorder');
        import('ORG.Util.Page'); // 导入分页类
        $map = array();
        if (($bg_date = $this->_param('bg_date', 'htmlspecialchars') ) && ($end_date = $this->_param('end_date', 'htmlspecialchars'))) {
            $bg_time = strtotime($bg_date);
            $end_time = strtotime($end_date);
            $map['create_time'] = array(array('ELT', $end_time), array('EGT', $bg_time));
            $this->assign('bg_date', $bg_date);
            $this->assign('end_date', $end_date);
        } else {
            if ($bg_date = $this->_param('bg_date', 'htmlspecialchars')) {
                $bg_time = strtotime($bg_date);
                $this->assign('bg_date', $bg_date);
                $map['create_time'] = array('EGT', $bg_time);
            }
            if ($end_date = $this->_param('end_date', 'htmlspecialchars')) {
                $end_time = strtotime($end_date);
                $this->assign('end_date', $end_date);
                $map['create_time'] = array('ELT', $end_time);
            }
        }
        if ($user_id = (int) $this->_param('user_id')) {
            $users = D('Users')->find($user_id);
            $this->assign('nickname', $users['nickname']);
            $this->assign('user_id', $user_id);
            $map['user_id'] = $user_id;
        }
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['order_id'] = array('LIKE', '%' . $keyword . '%');
            $this->assign('keyword', $keyword);
        }
        if ($hospital_id = (int) $this->_param('hospital_id')) {
            $map['hospital_id'] = $hospital_id;
            $hospital = D('Hospital')->find($hospital_id);
            $this->assign('hospital_name', $hospital['hospital_name']);
            $this->assign('hospital_id', $hospital_id);
        }
        if (isset($_GET['st']) || isset($_POST['st'])) {
            $st = (int) $this->_param('st');
            if ($st != 999) {
                $map['status'] = $st;
            }
            $this->assign('st', $st);
        } else {
            $this->assign('st', 999);
        }
        $count = $Itemorder->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 25); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $list = $Itemorder->where($map)->order(array('order_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $hospital_ids = $user_ids = $item_ids = array();
        foreach ($list as $k => $val) {
            if (!empty($val['hospital_id']))
            {
                $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
            }
            $user_ids[$val['user_id']] = $val['user_id'];
            $item_ids[$val['item_id']] = $val['item_id'];
        }
        $this->assign('users', D('Users')->itemsByIds($user_ids));
        $this->assign('hospitals', D('Hospital')->itemsByIds($hospital_ids));
        $this->assign('item', D('Item')->itemsByIds($item_ids));
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function delete($order_id = 0) {
        if (is_numeric($order_id) && ($order_id = (int) $order_id)) {
            $obj = D('Itemorder');         
			
			$orderinfo = $obj->Field('item_id,num')->find($order_id);
			$item_num = $orderinfo['num'];
			$where['item_id'] = $orderinfo['item_id'];
        	D("Item")->where($where)->setInc("num",$item_num);
		
			$obj->delete($order_id);
            $this->baoSuccess('删除成功！', U('itemorder/index'));
        } else {
            $order_id = $this->_post('order_id', false);
            if (is_array($order_id)) {
                $obj = D('Itemorder');
				$item = D("Item");
                foreach ($order_id as $id) {
				
					$orderinfo = $obj->Field('item_id,num')->find($id);
					$item_num = $orderinfo['num'];
					$where['item_id'] = $orderinfo['item_id'];
        			$item->where($where)->setInc("num",$item_num);
			
                    $obj->delete($id);
                }
                $this->baoSuccess('删除成功！', U('itemorder/index'));
            }
            $this->baoError('请选择要删除的项目订单');
        }
    }

}
