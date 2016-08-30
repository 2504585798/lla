<?php
class ChinaareaModel extends CommonModel{
    protected $pk   = 'region_id';
    protected $tableName ='china_area';
    protected $token = 'area';
    protected $orderby = array('region_type'=>'asc');
   
    public function setToken($token)
    {
        $this->token = $token;
    }
	
	public function getParentsId($id) {
        $data = $this->fetchAll();
        $parent_id = $data[$id]['parent_id']; 
        return $parent_id;
    }

    public function getChildren($id) {
        $local = array();
        //暂时 只支持 2级分类
        $data = $this->fetchAll();
        $local[] = $id;
        foreach ($data as $val) {
            if ($val['parent_id'] == $id) {
                $local[] = $val['region_id'];
            }
        }
        return $local;
    }
	
	
 
}