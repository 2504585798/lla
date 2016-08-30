<?php
/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2015 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class XingeAction extends CommonAction{


    //推送单发
    public  function single(){
         if ($this->isPost()) {
            $data = $this->checkFields($this->_post('data', false), array('plat','title', 'contents'));
            $data['title'] = htmlspecialchars($data['title']);
            $data['contents'] = htmlspecialchars($data['contents']);
            $data['type'] = htmlspecialchars($data['plat']);
            if(!empty($data['url'])){
                $data['url'] = htmlspecialchars($data['url']);
            }
            $result =  D('Xinge')->single($data);
            if(true !==$result){
                $this->baoError($result);
            }    
             $this->baoSuccess('发送成功！',U('xinge/mass'));
          } else {
              $this->display();
          }
    }
    

    //推送群发
    public function mass() {
        if ($this->isPost()) {
            $data = $this->checkFields($this->_post('data', false), array('plat','title', 'contents', 'url'));
            $data['title'] = htmlspecialchars($data['title']);
            $data['contents'] = htmlspecialchars($data['contents']);
            if(!empty($data['url'])){
                $data['url'] = htmlspecialchars($data['url']);
            }
            $data['url'] = htmlspecialchars($data['url']);
            $data['type'] = htmlspecialchars($data['plat']);
            $result =  D('Xinge')->mass($data);
            if(true !==$result){
                $this->baoError($result);
            }    
             $this->baoSuccess('发送成功！',U('xinge/mass'));
          } else {
              $this->display();
          }
    }


    
   
}
