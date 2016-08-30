<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class ItemviewModel extends CommonModel{
    protected $pk   = 'view_id';
    protected $tableName =  'item_view';
 
    public function getViews($users_id, $item_id) {
        if (!empty($users_id)) {
            $result['user_id'] = $users_id;
            $result['item_id'] = $item_id;
            $result['create_time'] = NOW_TIME;
            $result['create_ip'] = get_client_ip();
            $res = $this->where(array('user_id' => $users_id, 'item_id' => $item_id))->find();
            if (!$res) {
                $this->add($result);
            } else {
                $result['view_id'] = $res['view_id'];
                $this->save($result);
            }
        }
    }
}