<?php

class TiebaAction extends CommonAction {

	public function index() {
		
		$Post = D('Post');
		import('ORG.Util.Page');
		$map = array('user_id' => $this->uid); 
		$count = $Post->where($map)->count();
		$Page = new Page($count, 25);
		$show = $Page->show();
		$list = $Post->where($map)->order('post_id desc')->limit($Page->firstRow . ',' . $Page->listRows)->select();
		foreach ($list as $k => $val) {
			$ids = array();
			if ($val['user_id']) {
				$ids[$val['user_id']] = $val['user_id'];
				$ids[$val['last_id']] = $val['last_id'];
			}
			$list[$k] = $val;
		}
		$this->assign('users', D('Users')->itemsByIds($ids));
		$this->assign('list', $list);
		$this->assign('page', $show);
		$this->display();

	}
	
	public function postedit($post_id = 0) {
		if ($post_id = (int) $post_id) {
			$obj = D('Post');
			if (!$detail = $obj->find($post_id)) {
				$this->niuError('请选择要编辑的帖子');
			}
			if ($detail['user_id'] != $this->uid) {
				$this->error('请不要试图操作其他人的内容');
				die;
			}
			if ($this->isPost()) {
				$data = $this->postCheck();
				$data['post_id'] = $post_id;
				if (false !== $obj->save($data)) {
					$this->niuSuccess('操作成功', U('member/bbs'));
				}
				$this->niuError('操作失败');
			} else {
				$this->assign('detail', $detail);
				$this->assign('cates', D('Sharecate')->fetchAll());
				$this->display();
			}
		} else {
			$this->niuError('请选择要编辑的帖子');
		}
	}

	private function postCheck() {
		$data = $this->checkFields($this->_post('data', false), array('title', 'cate_id', 'details'));
		$data['title'] = htmlspecialchars($data['title']);
		if (empty($data['title'])) {
			$this->error('标题不能为空');
		}
		$data['user_id'] = (int) $this->uid;
		$data['cate_id'] = (int) $data['cate_id'];
		if (empty($data['cate_id'])) {
			$this->error('分类不能为空');
		}
		$data['details'] = SecurityEditorHtml($data['details']);
		if (empty($data['details'])) {
			$this->error('详细内容不能为空');
		}
		if ($words = D('Sensitive')->checkWords($data['details'])) {
			$this->error('详细内容含有敏感词：' . $words);
		}
		return $data;
	}

	public function post() {

		if ($this->isPost()) {
			$data = $this->postCheck();
			$obj = D('Post');
			$photos = $this->_post('photo');
			$photo = $val = '';
			if(!empty($photos)){
				foreach($photos as $val){
					if (isImage($val) && $val !=''){
						$photo = $photo.','.$val;
					}
				}
			}
			$data['pic'] = ltrim($photo,',');
			$data['create_time'] = NOW_TIME;
			$data['create_ip'] = get_client_ip();
			$data['audit'] = 1;
			if ($obj->add($data)) {
				D('Users')->prestige($this->uid, 'share');
				$this->niuSuccess('添加成功', U('member/tieba'));
			}
			$this->niuError('操作失败！');
		} else {
			$this->assign('cates', D('Sharecate')->fetchAll());
			$this->display();
		}
	}

	public function postreply($post_id = 0) {
		if ($post_id = (int) $post_id) {
			$obj = D('Post');
			if (!$detail = $obj->find($post_id)) {
				$this->niuError('请选择要编辑的消费分享');
			}
			if ($this->isPost()) {
				$data = $this->checkFields($this->_post('data', false), array('contents'));
				$data['post_id'] = $post_id;
				$data['user_id'] = $this->uid;
				$data['contents'] = SecurityEditorHtml($data['contents']);
				if (empty($data['contents'])) {
					$this->niuError('内容不能为空');
				}
				if ($words = D('Sensitive')->checkWords($data['contents'])) {
					$this->niuError('详细内容含有敏感词：' . $words);
				}
				$photos = $this->_post('photo');
				$photo = $val = '';
				if(!empty($photos)){
					foreach($photos as $val){
						if (isImage($val) && $val !=''){
							$photo = $photo.','.$val;
						}
					}
				}
				$data['pic'] = ltrim($photo,',');
				$data['create_time'] = NOW_TIME;
				$data['create_ip'] = get_client_ip();
				$data['audit'] = 1;
				$obj = D('Postreply');
				if ($obj->add($data)) {
					D('Post')->save(array('post_id' => $post_id, 'last_id' => $this->uid, 'last_time' => NOW_TIME));
					D('Users')->prestige($this->uid, 'reply');
					$this->niuSuccess('回复成功', U('tieba/detail', array('post_id' => $post_id)));
				}
				$this->niuError('操作失败！');
			} else {
				$this->assign('detail', $detail);
				$this->display();
			}
		} else {
			$this->error('请选择要编辑的消费分享');
		}
	}

	

}