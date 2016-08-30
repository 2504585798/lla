<?php
    return  array(
    'DB_TYPE'   =>  'mysql',
    'DB_HOST'   =>  '127.0.0.1',
	
    'DB_NAME'   =>  'laws',//数据库名字
    'DB_USER'   =>  'root',//数据库用户名
    'DB_PWD'    =>  'root',//数据库密码
	
   
  
    'DB_PORT'   =>   3306 ,
    'DB_CHARSET'=>  'utf8',
   // 'DB_PREFIX' =>  'bao_',
   'DB_PREFIX' =>  'sk_',
    'AUTH_KEY'  =>  '6d107312f6c254e06451363de506db62', //这个KEY只是保证部分表单在没有SESSION 的情况下判断用户本人操作的作用
   // 'BAO_KEY'   => '',
);