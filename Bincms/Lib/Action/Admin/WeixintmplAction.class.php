<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class WeixintmplAction extends CommonAction {

	public function index()
	{
		if($data = $this->_post('data',false)){
			$on = true;
			$tmpl = D('Weixintmpl');
			foreach($data as $item){
				$is = isset($item['tmpl_id']);
				if($is){
					$item['update_time'] = time();
				}else{
					$item['create_time'] = time();
				}
				if(!$tmpl->create($item)){
					$this->baoError($tmpl->getError());
					continue;
				}else{
					if($is){
						if(!$tmpl->save()){
							$on = false;
							$this->baoError('编辑失败！');
							continue;
						}
					}else{
						if(!$tmpl->add()){
							$on = false;
							$this->baoError('添加失败！');
							continue;
						}
					}
				}
			}		
			if($on){
				$this->baoSuccess('操作成功！',U('Weixintmpl/index'));
			}	
		}else{

            D('Weixin')->tmplmesg($tmpl_data);

			$list = D('Weixintmpl')->select();
			$this->assign('list',$list);
			$this->display();
		}
	}
}
