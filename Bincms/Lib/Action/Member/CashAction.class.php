<?php

/*
 * 软件为合肥生活宝网络公司出品，未经授权许可不得使用！
 * 作者：baocms团队
 * 84922.com
 * 邮件: youge@baocms.com  QQ 800026911
 */

class CashAction extends CommonAction {

    public function index() {
        $Users = D('Users');
        $userMoney = $this->member['banlance'] / 100;
        if (IS_POST){
            $money = (float)($_POST['money'] * 100);
            if ($money <= 0) {
                $this->error('请填写正确的提现金额(必须大于0,小于' . $userMoney . ')！');
            }
            if ($money > $userMoney * 100) {
                $this->error('对不起你最大可提现金额为' . $userMoney . '！');
            }
            if(!$data['bank_name'] = htmlspecialchars($_POST['bank_name'])){
                $this->error('开户行不能为空'); 
            }
            if(!$data['bank_num'] = htmlspecialchars($_POST['bank_num'])){
                $this->error('银行账号不能为空'); 
            }
            
            if(!$data['bank_realname'] = htmlspecialchars($_POST['bank_realname'])){
                $this->error('开户姓名不能为空'); 
            }
            $data['bank_branch'] = htmlspecialchars($_POST['bank_branch']);
            $data['user_id'] = $this->uid;			
            if ($this->member['interest_banlance'] <= $money) {
                $logMoney = $money - $this->member['interest_banlance'];
                $logInterest = $this->member['interest_banlance'];
            }
            else {
                $logMoney = 0;
                $logInterest = $money;
            }
            $arr = array();
            $arr['user_id'] = $this->uid;
            $arr['money'] = $logMoney;
            $arr['interest'] = $logInterest;
            $arr['addtime'] = NOW_TIME;
            $arr['account'] = $this->member['account'];
            $logId = D('Userscash')->add($arr);
            if ($logId) {
				$Users->updateCount($this->uid, 'withdrawal_money', $logMoney);
				D('Usersex')->save($data);
                $intro = '用户申请提现，提现记录ID：' . $logId;
                $Users->addMoney($this->uid, -$logMoney, $intro);
                $Users->addInterest($this->uid, 0, -$logInterest, $intro, $logId);
                $this->success('申请成功！等待网站管理员处理！', U('cash/cashlog'));
            }
        } else {
			$this->assign('info',D('Usersex')->getUserex($this->uid));
            $this->assign('money', $this->member['money'] / 100);
			$this->assign('userMoney', $userMoney);
            $this->display();
        }
    }

    public function cashlog() {
        $this->display();
    }

    public function cashlogloaddata() {
        $Userscash = D('Userscash');
        import('ORG.Util.Page'); // 导入分页类
        $map = array('user_id' => $this->uid);
        $count = $Userscash->where($map)->count(); // 查询满足要求的总记录数 
        $Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
        $show = $Page->show(); // 分页显示输出
        $var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
        $p = $_GET[$var];
        if ($Page->totalPages < $p) {
            die('0');
        }
        $list = $Userscash->where($map)->order(array('cash_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
        $this->assign('list', $list); // 赋值数据集
        $this->assign('page', $show); // 赋值分页输出
        $this->display(); // 输出模板
    }

}