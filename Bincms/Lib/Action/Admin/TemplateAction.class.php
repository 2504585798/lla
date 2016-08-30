<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class TemplateAction extends CommonAction {

    public function index() {
        $dirs = getDirName(BASE_PATH . '/themes/');
        $template = array();
        foreach ($dirs as $val) {
            $file = BASE_PATH . '/themes/' . $val . '/config.xml';
            if (file_exists($file)) {
                $local = objectToArray(simplexml_load_file($file));
                $template[] = $local;
            }
        }
        $this->assign('themes', D('Template')->fetchAll());
        $this->assign('template', $template);
        $this->display();
    }

    public function install() {
        $theme = $this->_get('theme', 'htmlspecialchars');
        if (empty($theme)) {
            $this->baoError('请选择模版');
        }
        $file = BASE_PATH . '/themes/' . $theme . '/config.xml';

        if (!file_exists($file)) {
            $this->baoError('模版不存在！');
        }
        $datas = D('Template')->fetchAll();
        if ($datas[$theme]) {
            $this->baoError('模版已安装！');
        }
        $local = objectToArray(simplexml_load_file($file));
        $data = array(
            'name' => $local['name'],
            'theme' => $local['theme'],
            'photo' => $local['photo']
        );
        if (D('Template')->add($data)) {
            D('Template')->cleanCache();
            $this->baoSuccess('安装成功！', U('template/index'));
        }
    }

    public function uninstall() {
        $theme = $this->_get('theme', 'htmlspecialchars');
        if (empty($theme)) {
            $this->baoError('请选择模版');
        }

        $datas = D('Template')->fetchAll();
        if (!$datas[$theme]) {
            $this->baoError('模版已经卸载！');
        }
        if (D('Template')->delete(array('where' => array('theme' => $theme)))) {
            D('Template')->cleanCache();
            $this->baoSuccess('卸载成功！', U('template/index'));
        }
    }

    public function df() {
        $theme = $this->_get('theme', 'htmlspecialchars');
        if (empty($theme)) {
            $this->baoError('请选择模版');
        }
        $datas = D('Template')->fetchAll();
        if (!$datas[$theme]) {
            $this->baoError('该模版不存在！');
        }
        D('Template')->save(array('is_default' => 0), array('where' => array('is_default' => 1)));
        D('Template')->save(array('is_default' => 1), array('where' => array('theme' => $theme)));
        cookie('think_template', $theme, 864000);
        D('Template')->cleanCache();
        $this->baoSuccess('设置成功！', U('template/index'));
    }


    
    
   
    
    
    
    public function settings($theme) {
        if(empty($theme)){
            $this->baoError('模板不存在');
        }
        $details = D('Templatesetting')->detail($theme);
        if ($this->isPost()) {
            $obj = D('Templatesetting');
            $data = $this->_post('data', false);
            $data = serialize($data);
          
            $datas =  array();
            $datas['theme'] = $theme;
            $datas['setting'] = $data;
            if(!empty($details)){
                if (false !== $obj->save($datas)) {
                    $obj->cleanCache();
                    $this->baoSuccess('设置成功', U('template/settings',array('theme'=>$theme)));
                }
            }else{
                if ($obj->add($datas)) {
                    $obj->cleanCache();
                    $this->baoSuccess('设置成功', U('template/settings',array('theme'=>$theme)));
                }
            }
            $this->baoError('操作失败！');
        } else {
            $this->assign('theme',$theme);
            $this->assign('datas',$details['setting']);
            $this->display($theme);
        }
    }
    
   

}
