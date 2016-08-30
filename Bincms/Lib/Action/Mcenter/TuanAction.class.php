<?php

/*
 * 软件为合肥生活宝网络公司出品，未经授权许可不得使用！
 * 作者：baocms团队
 * 官网：www.taobao.com
 * 邮件: youge@baocms.com  QQ 800026911
 */

class TuanAction extends CommonAction {

    public function index() {
		$aready = (int) $this->_param('aready');
		$this->assign('aready', $aready);
		$this->display(); // 输出模板
	}
        
        public function  delete($order_id){
            if(!$detail = D('Tuanorder')->find($order_id)){
                $this->error('该团购不存在或者已经被删除',U('tuan/index'));
            }
            if($detail['user_id'] != $this->uid){
                $this->error('该团购不存在或者已经被删除',U('tuan/index'));
            }
            if($detail['status'] != 0){
               $this->error('该团购不存在或者已经被删除',U('tuan/index'));
            }
            D('Tuanorder')->delete($order_id);
            $this->success('取消订单成功!',U('tuan/index'));
        }


        
	public function orderloading() {
		$Tuanorder = D('Tuanorder');
		import('ORG.Util.Page'); // 导入分页类
		$map = array('user_id' => $this->uid); //这里只显示 实物
		$aready = (int) $this->_param('aready');
		if ($aready == 1) {
			$map['status'] = 1;
		}elseif ($aready == 0) {
			$map['status'] = 0;
		}else{
			$map['status'] = 0;
		}
		$count = $Tuanorder->where($map)->count(); // 查询满足要求的总记录数 
		$Page = new Page($count, 10); // 实例化分页类 传入总记录数和每页显示的记录数
		$show = $Page->show(); // 分页显示输出
		$var = C('VAR_PAGE') ? C('VAR_PAGE') : 'p';
		$p = $_GET[$var];
		if ($Page->totalPages < $p) {
			die('0');
		}
		$list = $Tuanorder->where($map)->order(array('order_id' => 'desc'))->limit($Page->firstRow . ',' . $Page->listRows)->select();
		$tuan_ids = array();
		foreach ($list as $k => $val) {
			$tuan_ids[$val['tuan_id']] = $val['tuan_id'];
		}
		$this->assign('tuans', D('Tuan')->itemsByIds($tuan_ids));
		$this->assign('list', $list); // 赋值数据集
		$this->assign('page', $show); // 赋值分页输出
		$this->display(); // 输出模板
	}
        
        public function detail($order_id){
            $order_id = (int) $order_id;
            if(empty($order_id) || !$detail = D('Tuanorder')->find($order_id)){
                $this->error('该订单不存在');
            }
            if($detail['user_id'] != $this->uid){
                $this->error('请不要操作他人的订单');
            }
            if(!$dianping = D('Tuandianping')->where(array('order_id'=>$order_id,'user_id'=>$this->uid))->find()){
                $detail['dianping'] = 0;
            }else{
                $detail['dianping'] = 1;
            }
            $this->assign('tuans',D('Tuan')->find($detail['tuan_id']));
            $this->assign('detail',$detail);
            $this->display();
        }

}