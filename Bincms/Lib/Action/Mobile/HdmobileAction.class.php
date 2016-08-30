<?php

/*
 * 软件为合肥生活宝网络公司出品，未经授权许可不得使用！
 * 作者：baocms团队
 * 官网：www.taobao.com
 * 邮件: youge@baocms.com  QQ 800026911
 */

class HdmobileAction extends CommonAction {

    protected function _initialize() {
        parent::_initialize();
        $getHuoCate = D('Huodong')->getHuoCate();
        $this->assign('getHuoCate', $getHuoCate);
        $getPeopleCate = D('Huodong')->getPeopleCate();
        $this->assign('getPeopleCate', $getPeopleCate);
    }
    public function index() {
        $keyword = $this->_param('keyword', 'htmlspecialchars');
        $this->assign('keyword', $keyword);
        $cate_id = (int) $this->_param('cat');
        $this->assign('cat', $cate_id);
        $this->assign('nextpage', LinkTo('hdmobile/loaddata', array('cat' => $cate_id, 't' => NOW_TIME, 'keyword' => $keyword, 'p' => '0000')));
        $user_id = (int) $this->$user_id;
        $this->display(); // 输出模板
    }

    public function loaddata() {
        $huodong = D('Huodong');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('audit' => 1, 'closed' => 0);
        if ($keyword = $this->_param('keyword', 'htmlspecialchars')) {
            $map['title'] = array('LIKE', '%' . $keyword . '%');
        }
        $cat = (int)$this->_param('cat');
        if ($cat) {
            $map['cate_id'] = $cat;
        }
        $map['city_id']= $this->city_id;
        $count = $huodong->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出

        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }

        $list = $huodong->where($map)->order('time desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
        foreach ($list as $k => $val) {
            $sign = D('Huodongsign')->where(array('user_id' => $this->uid, 'huodong_id' => $val['huodong_id']))->find();
            if (!empty($sign)) {
                $list[$k]['sign'] = 1;
            } else {
                $list[$k]['sign'] = 0;
            }
        }
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

    public function sign($huodong_id) {
        if (empty($this->uid)) {
            $this->error('登录状态失效!', U('passport/login'));
        }
        $huodong_id = (int) $huodong_id;
        $detail = D('Huodong')->find($huodong_id);
        if (empty($detail)) {
             $this->error('报名的活动不存在');
        }
        if ($detail['audit'] != 1 || $detail['closed'] != 0) {
            $this->error('活动不存在');
        }
        if ($this->isPost()) {
            $data = $this->checkSign();
            $data['huodong_id'] = $huodong_id;
            $data['create_time'] = NOW_TIME;
            $data['create_ip'] = get_client_ip();
            $obj = D('Huodongsign');
            if ($obj->add($data)) {
                D('Huodong')->updateCount($huodong_id, 'sign_num');
                $this->niuMsg('恭喜您报名成功', U('hdmobile/index'));
            }
             $this->niuMsg('操作失败！');
        } else {
            $this->assign('detail', $detail);
            $this->display();
        }
    }

    public function checkSign() {
        $data = $this->checkFields($this->_post('data', false), array('name', 'mobile', 'num'));
        $data['user_id'] = (int) $this->uid;
        $data['name'] = $data['name'];
        if (empty($data['name'])) {
            $this->niuMsg('联系人不能为空');
        }
        $data['mobile'] = htmlspecialchars($data['mobile']);
        if (empty($data['mobile'])) {
            $this->niuMsg('联系电话不能为空');
        }
        if (!isPhone($data['mobile']) && !isMobile($data['mobile'])) {
            $this->niuMsg('联系电话格式不正确');
        }
        $data['num'] = (int) $data['num'];
        if (empty($data['num'])) {
            $this->niuMsg('活动人数不能为空');
        }
        return $data;
    }

    public function detail() {
        $huodong_id = (int) $this->_get('huodong_id');
		$find=D('Huodong')->where(array('huodong_id' => $huodong_id))->find();
		$map=array('user_id'=>$find['user_id']);
		$find=D("Users")->where($map)->find();
		$this->assign('user',$find);
		
        if (empty($huodong_id)) {
            $this->baoMsg('该活动信息不存在！');
            die;
        }
        if (!$detail = D('Huodong')->find($huodong_id)) {
            $this->baoMsg('该活动信息不存在！');
            die;
        }
        if ($detail['closed'] != 0 ||$detail['audit'] != 1) {
            $this->baoMsg('该活动信息不存在！');
            die;
        }
        $sign = D('Huodongsign')->where(array('user_id' => $this->uid, 'huodong_id' => $huodong_id))->select();
        if (!empty($sign)) {
            $detail['sign'] = 1;
        } else {
            $detail['sign'] = 0;
        }
		
        $this->assign('detail', $detail);
        $this->display();
    }

public function hdfabu() {
	//dump($this->uid);
		if (empty($this->uid)) {
			$this->error('登录状态失效!', U('passport/login'));
		}
		if ($this->isPost()) {
			$data = $this->fabuCheck();
			$obj = D('Huodong');
			if ($obj->add($data)) {
				$this->baoMsg('添加成功', U('mcenter/hdmobile/index'));
			}
			$this->baoMsg('操作失败！');
		} else {
			$getHuoCate = D('Huodong')->getHuoCate();
			$this->assign('getHuoCate', $getHuoCate);
			$getPeopleCate = D('Huodong')->getPeopleCate();
			$this->assign('getPeopleCate', $getPeopleCate);
			$this->display();
		}
	}

	public function fabuCheck() {
		$data = $this->checkFields($this->_post('data', false), array('title', 'addr', 'intro', 'sex', 'photo', 'cate_id', 'time'));
		$data['user_id'] = $this->uid;
		
		$data['cate_id'] = (int)$data['cate_id'];
		$data['sex'] = (int) $data['sex'];
     
		$data['title'] = trim(htmlspecialchars($data['title']));
		if (empty($data['title'])) {
			$this->baoMsg('活动标题不能为空！');
		}
		$data['intro'] = trim(htmlspecialchars($data['intro']));
		if (empty($data['intro'])) {
			$this->baoMsg('详情不能为空！');
		}
		$data['photo'] = htmlspecialchars($data['photo']);
		if (empty($data['photo'])) {
			$this->baoMsg('请上传缩略图');
		}
		if (!isImage($data['photo'])) {
			$this->baoMsg('缩略图格式不正确');
		}
		$data['audit'] = 1;
		$data['create_time'] = NOW_TIME;
		$data['create_ip'] = get_client_ip();
		return $data;
	}


}
