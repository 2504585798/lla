<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class LinksModel extends CommonModel{
    protected $pk   = 'link_id';
    protected $tableName =  'links';
    
    protected $token = 'links';
    protected $orderby = array('orderby'=>'asc');

}