<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。
class JpushAction extends CommonAction{

    //推送单发
    public function single(){
        if ($this->isPost()) {
            $data = $this->checkFields($this->_post('data', false), array('uid','plat','title','contents', 'url'));
            $data['contents'] = htmlspecialchars($data['contents']);
            if(!empty($data['url'])){
                $data['url'] = htmlspecialchars($data['url']);
            }
            $data['url'] = htmlspecialchars($data['url']);
            $data['type'] = htmlspecialchars($data['plat']);
            $data['sendtime'] = time();
            if($data['type']=='0'){
              $data['type'] = 'android';
            }else if($data['type']=='1'){
              $data['type'] = 'ios';
            }else{
              $data['type'] = 'all';
            }
            $data['photo'] = htmlspecialchars($data['photo']);
            if (!empty($data['photo']) && !isImage($data['photo'])) {
               $this->baoError('缩略图格式不正确');
            }else{
               $data['photo'] = $this->_server('HTTP_HOST').'/attachs/'.$data['photo'];
            }

            import("@/Net.Jpush");
            $PushService = new Jpush();
            //群发信息
            if($id = D('push_history')->add($data)){
                $data['sendno'] = $id;
                $data['sendtype'] = '1';  //发送类型通知
                $data['platform'] = 'android,ios'; //全平台
                /**组装需要的参数
                    $receive = 'all';//全部
                    $receive = array('tag'=>array('2401','2588','9527'));//标签
                    $receive = array('alias'=>array('93d78b73611d886a74*****88497f501'));//别名
                    $content = '这是一个测试的推送数据....测试....Hello World...';
                    $m_type = 'http';
                    $m_txt = 'http://www.iqujing.com/';
                    $m_time = '600';        //离线保留时间
                **/    
                $receive = array('alias'=>array($data['uid']));//别名
                $ret = $PushService->send_pub($receive,$data['contents'],'http',$data['url']);
                $this->baoSuccess($ret);
            }else{
                $this->baoError('发送失败!');
            }
          } else {
              $this->display();
          }
    }
    

    //推送群发
    public function mass() {
        if ($this->isPost()) {

            $data = $this->checkFields($this->_post('data', false), array('plat','title','contents', 'url'));
            $data['contents'] = htmlspecialchars($data['contents']);
            if(!empty($data['url'])){
                $data['url'] = htmlspecialchars($data['url']);
            }
            $data['url'] = htmlspecialchars($data['url']);
            $data['type'] = htmlspecialchars($data['plat']);
            $data['sendtime'] = time();
            if($data['type']=='0'){
              $data['type'] = 'android';
            }else if($data['type']=='1'){
              $data['type'] = 'ios';
            }else{
              $data['type'] = 'all';
            }
            $data['photo'] = htmlspecialchars($data['photo']);
            if (!empty($data['photo']) && !isImage($data['photo'])) {
               $this->baoError('缩略图格式不正确');
            }else{
               $data['photo'] = urlencode($this->_server('HTTP_HOST').'/attachs/'.$data['photo']);
            }

            import("@/Net.Jpush");
            $PushService = new Jpush();
            $data['sendtype'] = '1';  //发送类型通知
            //群发信息
            if($id = D('push_history')->add($data)){
                $data['sendno'] = $id;
                $data['sendtype'] = '1';  //发送类型通知
                $data['platform'] = 'android,ios'; //全平台
                /**组装需要的参数
                    $receive = 'all';//全部
                    $receive = array('tag'=>array('2401','2588','9527'));//标签
                    $receive = array('alias'=>array('93d78b73611d886a74*****88497f501'));//别名
                    $content = '这是一个测试的推送数据....测试....Hello World...';
                    $m_type = 'http';
                    $m_txt = 'http://www.iqujing.com/';
                    $m_time = '600';        //离线保留时间
                **/    
                $ret = $PushService->send_pub('all',$data['contents'],'http',$data['url']);
                $this->baoSuccess($ret);

                if($ret){
                  $this->baoSuccess('发送成功!',U('jpush/single'));
                }else{
                  $this->baoError('发送失败!');
                }
            }else{
                $this->baoError('发送失败!');
            }
          } else {
              $this->display();
          }
    }



    public function history(){
       $push_history = D('push_history');
       import('ORG.Util.Page');// 导入分页类
       $map = array();
       $count      = $push_history->where($map)->count();// 查询满足要求的总记录数 
       

       $Page       = new Page($count,15);// 实例化分页类 传入总记录数和每页显示的记录数
       $show       = $Page->show();// 分页显示输出
       $list = $push_history->where($map)->order(array('id'=>'desc'))->limit($Page->firstRow.','.$Page->listRows)->select();
       $this->assign('list',$list);// 赋值数据集
       $this->assign('page',$show);// 赋值分页输出
       $this->display(); // 输出模板
    }

}
