<?php



class AdsiteModel extends CommonModel {

    protected $pk = 'site_id';
    protected $tableName = 'ad_site';
    protected $token = 'ad_site';

    public function getType() {
        return array(1 => '文字广告', 2 => '图片广告', 3 => '代码广告');
    }

    public function getPlace() {
        return array(
            1 => 'PC首页',
            2 => 'PC项目',
            3 => 'PC活动',
           
            4 => 'PC专题',
            
           
            5 => '手机APP首页',
        );
    }

}
