<?php
class CommonModel extends Model{
    protected $pk   = '';
    protected $tableName =  '';
    protected $token = '';
    protected $cacheTime = 86400;
    protected $orderby = array(); //针对全部查询出的数据的排序

    public function updateCount($id,$col,$num = 1){
        $id = (int)$id;
        
        return $this->execute(" update ".$this->getTableName()." set {$col} = ({$col} + '{$num}') where ".$this->pk." = '{$id}' ");
    }
    
    public  function  itemsByIds($ids = array()){
        if(empty($ids)) return array();
        $data = $this->where(array($this->pk=>array('IN',$ids)))->select();
        $return = array();
        foreach($data as $val){
            $return[$val[$this->pk]] = $val;
        }
        return $return;
    }
   
    public function fetchAll($field = '*', $where = array()){
        $cache = cache(array('type'=>'File','expire'=>  $this->cacheTime));
        if(!$data = $cache->get($this->token)){
            $result = $this->field($field);
            if ( ! empty($where))
            {
                $result = $result->where($where);
            }
            $result = $result->order($this->orderby)->select();
            $data = array();
            foreach($result  as $row){
                $data[$row[$this->pk]] = $this->_format($row);
            }
            $cache->set($this->token,$data);
        }   
        return $data;
     }
     
     public function cleanCache(){
         $cache = cache(array('type'=>'File','expire'=>$this->cacheTime));
         $cache->rm($this->token);
     }
    
    public  function _format($data){
        return $data;
    }
}