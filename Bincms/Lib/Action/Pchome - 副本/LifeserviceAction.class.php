<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class LifeserviceAction extends CommonAction {

    public function _initialize() {
        parent::_initialize();
	
        $s = D('Lifeservicecate')->channel_list();
    }

    public function index() {
        $hs = D('Houseworksetting');
        $workTypes = D('Housework')->getCfg();
        $hslist = $hs->select();
        $list = array();
        foreach ($workTypes as $k => $val) {
            foreach ($hslist as $kk => $v) {
                if ($k == $v['id']) {
                    $list[$k] = $v;
                }
            }
            $list[$k]['t'] = $val;
        }
        $this->assign('list', $list);
        $this->display();
    }

    public function detail($id) {
        $id = (int) $id;
        $workTypes = D('Housework')->getCfg();
        if (empty($id)) {
            $this->baoError('该服务不存在');
        }
        $detail = D('Houseworksetting')->find($id);
        $detail['t'] = $workTypes[$id];
        $this->assign('detail', $detail);
        $h = date('H',NOW_TIME) + 1;
        $this->assign('h',$h);
        $cfg = D('Shopdingsetting')->getCfg(); //调用定做的时间设置
        $this->assign('cfg',$cfg);
		
		//更新点击量
		D('Houseworksetting')->updateCount($id, 'views');
		
		$this->assign('citys', D('City')->fetchAll());
		$this->assign('areas', D('Area')->fetchAll());	
        $this->display();
    }

    public function create($svc_id) {
        if (!$svc_id = (int) $svc_id) {
            $this->baoError('服务类型不能为空');
        }
        $workTypes = D('Housework')->getCfg();
        if (!isset($workTypes[$svc_id])) {
            $this->baoError('暂时没有该服务类型');
        }
        $data['svc_id'] = $svc_id;
        $data['date'] = htmlspecialchars($_POST['date']);
        $data['time'] = htmlspecialchars($_POST['time']);
        if(empty($data['date'])|| empty($data['time'])){
            $this->baoError('服务时间不能为空');
        }
        $data['svctime'] = $data['date']. $data['time']; 
        if (!$data['addr'] = $this->_post('addr', 'htmlspecialchars')) {
            $this->baoError('服务地址不能为空');
        }
        if (!$data['name'] = $this->_post('name', 'htmlspecialchars')) {
            $this->baoError('联系人不能为空');
        }
        if (!$data['tel'] = $this->_post('tel', 'htmlspecialchars')) {
            $this->baoError('联系电话不能为空');
        }
        if (!isMobile($data['tel']) && !isPhone($data['tel'])) {
            $this->baoError('电话号码不正确');
        }
        $data['contents'] = $this->_post('contents', 'htmlspecialchars');
        $data['create_time'] = NOW_TIME;
        $data['create_ip'] = get_client_ip();
        if (D('Housework')->add($data)) {
            $this->baoSuccess('恭喜您预约家政服务成功！网站会推荐给您最优秀的阿姨帮忙！', U('lifeservice/index'));
        }
        $this->baoError('服务器繁忙');
    }

}
