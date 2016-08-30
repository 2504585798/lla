<?php
class LifeserviceAction extends CommonAction
{
    public function _initialize()
    {
        parent::_initialize();
        $s = D('Lifeservicecate')->channel_list();
    }
    public function index()
    {
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
    public function detail($id)
    {
        $id = (int) $id;
        $workTypes = D('Housework')->getCfg();
        if (empty($id)) {
            $this->baoError('该服务不存在');
        }
        $detail = D('Houseworksetting')->find($id);
        $detail['t'] = $workTypes[$id];
        $this->assign('detail', $detail);
        $h = date('H', NOW_TIME) + 1;
        $this->assign('h', $h);
        $cfg = D('Shopdingsetting')->getCfg();
        //调用定做的时间设置
        $this->assign('cfg', $cfg);
        //更新点击量
        D('Houseworksetting')->updateCount($id, 'views');
        $this->assign('citys', D('City')->fetchAll());
        $this->assign('areas', D('Area')->fetchAll());
        $this->display();
    }
	
	
	
	 public function yuyue($svc_id) {
        if(!$svc_id=(int)$svc_id){
            $this->error('服务类型不能为空');
        }
        $workTypes = D('Housework')->getCfg();
        if(!isset($workTypes[$svc_id])){
            $this->error('暂时没有该服务类型');
        }
        $this->assign('workTypes',$workTypes);
        $this->assign('svc_id',$svc_id);
        $this->display();
    }
    
	
	
	
	
    public function create($svc_id)
    {
        if (!($svc_id = (int) $svc_id)) {
            $this->error('服务类型不能为空');
        }
        $workTypes = D('Housework')->getCfg();
        if (!isset($workTypes[$svc_id])) {
            $this->error('暂时没有该服务类型');
        }
        $data['svc_id'] = $svc_id;
        $data['date'] = htmlspecialchars($_POST['date']);
        $data['time'] = htmlspecialchars($_POST['time']);
        if (empty($data['date']) || empty($data['time'])) {
            $this->error('服务时间不能为空');
        }
        $data['svctime'] = $data['date'] . $data['time'];
        if (!($data['addr'] = $this->_post('addr', 'htmlspecialchars'))) {
            $this->error('服务地址不能为空');
        }
        if (!($data['name'] = $this->_post('name', 'htmlspecialchars'))) {
            $this->error('联系人不能为空');
        }
        if (!($data['tel'] = $this->_post('tel', 'htmlspecialchars'))) {
            $this->error('联系电话不能为空');
        }
        if (!isMobile($data['tel']) && !isPhone($data['tel'])) {
            $this->error('电话号码不正确');
        }
        $data['contents'] = $this->_post('contents', 'htmlspecialchars');
        $data['create_time'] = NOW_TIME;
        $data['create_ip'] = get_client_ip();
        if (D('Housework')->add($data)) {
            $this->niuSuccess('恭喜您预约家政服务成功！网站会推荐给您最优秀的阿姨帮忙！', U('lifeservice/index'));
        }
        $this->error('服务器繁忙');
    }
}