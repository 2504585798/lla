<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 ×××× 项目的一部分
//
// Copyright (c) 2015 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class  RoleMapsModel extends CommonModel{
    
    protected $tableName =  'role_maps';
    
    public function getMenuIdsByRoleId($role_id){
        $role_id = (int) $role_id;
        $datas = $this->where(" role_id = '{$role_id}' ")->select();
        $return = array();
        foreach($datas as $val){
            $return[$val['menu_id']] = $val['menu_id'];
        }
        return $return;
    }
    
}
