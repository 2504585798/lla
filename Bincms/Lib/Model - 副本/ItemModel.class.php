<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class ItemModel extends CommonModel {

    protected $pk = 'item_id';
    protected $tableName = 'item';

    public function _format($data) {
        $data['save'] = round(($data['price'] - $data['item_price']) / 100, 2);
        $data['price'] = round($data['price'] / 100, 2);
        $data['item_price'] = round($data['item_price'] / 100, 2);
        $data['mobile_fan'] = round($data['mobile_fan'] / 100, 2);
        $data['settlement_price'] = round($data['settlement_price'] / 100, 2);
        $data['discount'] = round($data['item_price'] * 10 / $data['price'], 1);
        return $data;
    }

    public function CallDataForMat($items) { //专门针对CALLDATA 标签处理的
        if (empty($items))
            return array();
        $obj = D('Hospital');
        $hospital_ids = array();
        foreach ($items as $k => $val) {
            $hospital_ids[$val['hospital_id']] = $val['hospital_id'];
        }
        $hospitals = $obj->itemsByIds($hospital_ids);
        foreach ($items as $k => $val) {
            $val['hospital'] = $hospitals[$val['hospital_id']];
            $items[$k] = $val;
        }
        return $items;
    }

}
