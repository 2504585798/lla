<?php

/////////////////////////////////////////////////////////////////////////////
	// 这个文件是 美容整形社区项目的一部分
	//
	// Copyright (c) 2015 – 2020  QQ:1149100178
	// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
	// 或者联系qq:easyWe(2504585798)获得详细信息。

class IndexAction extends CommonAction {

    public function index() {

        $data = $this->weixin->request();
        //file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/aaa.txt', var_export($data, true));
        switch ($data['MsgType']) {//
            case 'event':

                if ($data['Event'] == 'subscribe') {
                    if (isset($data['EventKey']) && !empty($data['EventKey'])) {
                        $this->events();
                    } else {
                        $this->event();
                    }
                }
                if ($data['Event'] == 'SCAN') {
                    $this->scan();
                }
                break;
            case 'location':

                $this->location($data);
                break;

            default: //其余的类型都算关键词              
                $this->keyword($data);
                break;
        }
    }

    private function location($data) {
        $lat = addcslashes($data['Location_X']);
        $lng = addcslashes($data['Location_Y']);
        $list = D('Shop')->where(array('audit' => 1, 'closed' => 0))->order(" (ABS(lng - '{$lng}') +  ABS(lat - '" . $lat . "') )  asc ")->limit(0, 10)->select();

        if (!empty($list)) {
            $content = array();
            foreach ($list as $item) {
                $content[] = array(
                    $item['shop_name'],
                    $item['addr'],
                    $this->getImage($item['photo']),
                    __HOST__ . '/mobile/shop/detail/shop_id/' . $item['shop_id'] . '.html',
                );
            }
            $this->weixin->response($content, 'news');
        } else {
            $this->weixin->response('很抱歉没有合适的商家推荐给您', 'text');
        }
    }

    private function keyword($data) {
        if (empty($data['Content']))
            return;

        /* D('Weixinmsg')->add(array(
          'FromUserName' => $data['FromUserName'],
          'ToUserName' => $data['ToUserName'],
          'Content' => htmlspecialchars($data['Content']),
          'create_time' => NOW_TIME
          )); */

        if ($this->shop_id == 0) {

            $keyword = D('Weixinkeyword')->checkKeyword($data['Content']);
            if ($keyword) {
                switch ($keyword['type']) {
                    case 'text':
                        $this->weixin->response($keyword['contents'], 'text');
                        break;
                    case 'news':
                        $content = array();
                        $content[] = array(
                            $keyword['title'],
                            $keyword['contents'],
                            $this->getImage($keyword['photo']),
                            $keyword['url'],
                        );
                        $this->weixin->response($content, 'news');
                        break;
                }
            } else {
                $this->event();
            }
        } else {
            $keyword = D('Shopweixinkeyword')->checkKeyword($this->shop_id, $data['Content']);

            if ($keyword) {
                switch ($keyword['type']) {
                    case 'text':
                        $this->weixin->response($keyword['contents'], 'text');
                        break;
                    case 'news':
                        $content = array();
                        $content[] = array(
                            $keyword['title'],
                            $keyword['contents'],
                            $this->getImage($keyword['photo']),
                            $keyword['url'],
                        );
                        $this->weixin->response($content, 'news');
                        break;
                }
            } else {
                $this->event();
            }
        }
    }

    //响应用户的事件
    private function event() {
        if ($this->shop_id == 0) {
            if ($this->_CONFIG['weixin']['type'] == 1) {
                $this->weixin->response($this->_CONFIG['weixin']['description'], 'text');
            } else {
                $content[] = array(
                    $this->_CONFIG['weixin']['title'],
                    $this->_CONFIG['weixin']['description'],
                    $this->getImage($this->_CONFIG['weixin']['photo']),
                    $this->_CONFIG['weixin']['linkurl'],
                );
                $this->weixin->response($content, 'news');
            }
        } else { //
            $data['get'] = $_GET;
            $data['post'] = $_POST;
            $data['data'] = $this->weixin->request();
            file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/aaa.txt', var_export($data, true));
            $weixin_msg = unserialize($this->shopdetails['weixin_msg']);
            if ($weixin_msg['type'] == 1) {

                $this->weixin->response($weixin_msg['description'], 'text');
            } else {
                $content[] = array(
                    $weixin_msg['title'],
                    $weixin_msg['description'],
                    $this->getImage($weixin_msg['photo']),
                    $this->_CONFIG['weixin']['linkurl'],
                );
                $this->weixin->response($content, 'news');
            }
        }
    }

    private function events() {
        $data['get'] = $_GET;
        $data['post'] = $_POST;
        $data['data'] = $this->weixin->request();
        //file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/aaa.txt', var_export($data['data'], true));
        if (!empty($data['data'])) {
            $datas = explode('_', $data['data']['EventKey']);
            $id = $datas[1];
            if (!$detail = D('Weixinqrcode')->find($id)) {
                die();
            }
            $type = $detail['type'];
            if ($type == 1) {
                $shop_id = $detail['soure_id'];
                $shop = D('Shop')->find($shop_id);
                $content[] = array(
                    $shop['shop_name'],
                    $shop['addr'],
                    $this->getImage($shop['photo']),
                    __HOST__ . '/mobile/shop/detail/shop_id/' . $shop_id . '.html',
                );
                //file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/bbb.txt', var_export($content, true));
                $result = D('Connect')->getConnectByOpenid('weixin', $data['data']['FromUserName']);
                if (!empty($result)) {
                    $user_id = $result['uid'];
                    $ymd = date('Y-m-d', NOW_TIME);
                    $ymdarr = explode('-', $ymd);
                    if (!$de = D('Census')->where(array('user_id' => $user_id))->find()) {
                        $datac = array(
                            'user_id' => $user_id,
                            'year' => $ymdarr[0],
                            'month' => $ymdarr[1],
                            'day' => $ymdarr[2],
                        );
                        D('Census')->add($datac);
                    }
                    if (!$fans = D('Shopfavorites')->where(array('user_id' => $user_id, 'shop_id' => $shop_id))->find()) {
                        $dataf = array(
                            'user_id' => $user_id,
                            'shop_id' => $shop_id,
                            'create_time' => NOW_TIME,
                            'create_ip' => get_client_ip(),
                        );
                        D('Shopfavorites')->add($dataf);
                        D('Shop')->updateCount($shop_id, 'fans_num');
                    } else {
                        if($fans['closed'] == 1){
                            D('Shopfavorites')->save(array('favorites_id'=>$fans['favorites_id'],'closed'=>0));
                        }
                    }
                }
                $this->weixin->response($content, 'news');
            } elseif ($type == 2) { //抢购
                $tuan_id = $detail['soure_id'];
                $tuan = D('Tuan')->find($tuan_id);
                $content[] = array(
                    $tuan['title'],
                    $tuan['intro'],
                    $this->getImage($tuan['photo']),
                    __HOST__ . '/mobile/tuan/detail/tuan_id/' . $tuan_id . '.html',
                );
                file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/bbb.txt', var_export($content, true));
                $result = D('Connect')->getConnectByOpenid('weixin', $data['data']['FromUserName']);
                if (!empty($result)) {
                    $user_id = $result['uid'];
                    $ymd = date('Y-m-d', NOW_TIME);
                    $ymdarr = explode('-', $ymd);
                    if (!$de = D('Census')->where(array('user_id' => $user_id))->find()) {
                        $datac = array(
                            'user_id' => $user_id,
                            'year' => $ymdarr[0],
                            'month' => $ymdarr[1],
                            'day' => $ymdarr[2],
                        );
                        D('Census')->add($datac);
                    }
                    if (!$fans = D('Shopfavorites')->where(array('user_id' => $user_id, 'shop_id' =>$tuan['shop_id']))->find()) {
                        $dataf = array(
                            'user_id' => $user_id,
                            'shop_id' => $tuan['shop_id'],
                            'create_time' => NOW_TIME,
                            'create_ip' => get_client_ip(),
                        );
                        D('Shopfavorites')->add($dataf);
                        D('Shop')->updateCount($tuan['shop_id'], 'fans_num');
                    } else {
                        if($fans['closed'] == 1){
                            D('Shopfavorites')->save(array('favorites_id'=>$fans['favorites_id'],'closed'=>0));
                        }
                    }
                }
                $this->weixin->response($content, 'news');
            }elseif ($type == 9) { //活动
               $activity_id = $detail['soure_id'];
                $activity = D('Activity')->find($activity_id);
                $content[] = array(
                    $activity['title'],
                    $activity['intro'],
                    $this->getImage($activity['photo']),
                    __HOST__ . '/mobile/huodong/detail/activity_id/' . $activity_id . '.html',
                );
                //file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/bbb.txt', var_export($content, true));
                $result = D('Connect')->getConnectByOpenid('weixin', $data['data']['FromUserName']);
               
                
                $this->weixin->response($content, 'news');
            }elseif($type == 3){ //购物
                $goods_id = $detail['soure_id'];
                $goods = D('Goods')->find($goods_id);
                $shops = D('Shop')->find($goods['shop_id']); 
                $content[] = array(
                    $goods['title'],
                    $shops['shop_name'],
                    $this->getImage($goods['photo']),
                    __HOST__ . '/mobile/mall/detail/goods_id/' . $goods_id . '.html',
                );
                //file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/bbb.txt', var_export($content, true));
                $result = D('Connect')->getConnectByOpenid('weixin', $data['data']['FromUserName']);
                if (!empty($result)) {
                    $user_id = $result['uid'];
                    $ymd = date('Y-m-d', NOW_TIME);
                    $ymdarr = explode('-', $ymd);
                    if (!$de = D('Census')->where(array('user_id' => $user_id))->find()) {
                        $datac = array(
                            'user_id' => $user_id,
                            'year' => $ymdarr[0],
                            'month' => $ymdarr[1],
                            'day' => $ymdarr[2],
                        );
                        D('Census')->add($datac);
                    }
                    if (!$fans = D('Shopfavorites')->where(array('user_id' => $user_id, 'shop_id' =>$goods['shop_id']))->find()) {
                        $dataf = array(
                            'user_id' => $user_id,
                            'shop_id' => $goods['shop_id'],
                            'create_time' => NOW_TIME,
                            'create_ip' => get_client_ip(),
                        );
                        D('Shopfavorites')->add($dataf);
                        D('Shop')->updateCount($goods['shop_id'], 'fans_num');
                    } else {
                        if($fans['closed'] == 1){
                            D('Shopfavorites')->save(array('favorites_id'=>$fans['favorites_id'],'closed'=>0));
                        }
                    }
                }
                $this->weixin->response($content, 'news');
            }
        }
    }

    public function scan() {
        $data['data'] = $this->weixin->request();
        //file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/ccc.txt', var_export($data['data'], true));
        if (!empty($data['data'])) {
            $id = $data['data']['EventKey'];
            if (!$detail = D('Weixinqrcode')->find($id)) {
                die();
            }
            $type = $detail['type'];
            if ($type == 1) {
                $shop_id = $detail['soure_id'];
                $shop = D('Shop')->find($shop_id);
                $content[] = array(
                    $shop['shop_name'],
                    $shop['addr'],
                    $this->getImage($shop['photo']),
                    __HOST__ . '/mobile/shop/detail/shop_id/' . $shop_id . '.html',
                );
                //file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/bbb.txt', var_export($content, true));
                $result = D('Connect')->getConnectByOpenid('weixin', $data['data']['FromUserName']);
                if (!empty($result)) {
                    $user_id = $result['uid'];
                    $ymd = date('Y-m-d', NOW_TIME);
                    $ymdarr = explode('-', $ymd);
                    if (!$fans = D('Shopfavorites')->where(array('user_id' => $user_id, 'shop_id' => $shop_id))->find()) {
                        $dataf = array(
                            'user_id' => $user_id,
                            'shop_id' => $shop_id,
                            'create_time' => NOW_TIME,
                            'create_ip' => get_client_ip(),
                        );
                        D('Shopfavorites')->add($dataf);
                        D('Shop')->updateCount($shop_id, 'fans_num');
                    } else {
                        if($fans['closed'] == 1){
                            D('Shopfavorites')->save(array('favorites_id'=>$fans['favorites_id'],'closed'=>0));
                        }
                    }
                }
                $this->weixin->response($content, 'news');
            } elseif ($type == 2) { //抢购
                $tuan_id = $detail['soure_id'];
                $tuan = D('Tuan')->find($tuan_id);
                $content[] = array(
                    $tuan['title'],
                    $tuan['intro'],
                    $this->getImage($tuan['photo']),
                    __HOST__ . '/mobile/tuan/detail/tuan_id/' . $tuan_id . '.html',
                );
                //file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/aaa.txt', var_export($content, true));
                $result = D('Connect')->getConnectByOpenid('weixin', $data['data']['FromUserName']);
                if (!empty($result)) {
                    $user_id = $result['uid'];
                    if (!$fans = D('Shopfavorites')->where(array('user_id' => $user_id, 'shop_id' =>$tuan['shop_id']))->find()) {
                        $dataf = array(
                            'user_id' => $user_id,
                            'shop_id' => $tuan['shop_id'],
                            'create_time' => NOW_TIME,
                            'create_ip' => get_client_ip(),
                        );
                        D('Shopfavorites')->add($dataf);
                        D('Shop')->updateCount($tuan['shop_id'], 'fans_num');
                    } else {
                        if($fans['closed'] == 1){
                            D('Shopfavorites')->save(array('favorites_id'=>$fans['favorites_id'],'closed'=>0));
                        }
                    }
                }
                $this->weixin->response($content, 'news');
            }elseif ($type == 9) { //活动
				$activity_id = $detail['soure_id'];
                $activity = D('Activity')->find($activity_id);
                $content[] = array(
                    $activity['title'],
                    $activity['intro'],
                    $this->getImage($activity['photo']),
                    __HOST__ . '/mobile/huodong/detail/activity_id/' . $activity_id . '.html',
                );
				 $result = D('Connect')->getConnectByOpenid('weixin', $data['data']['FromUserName']);
				$this->weixin->response($content, 'news'); 
			}elseif($type == 3){ //购物
                $goods_id = $detail['soure_id'];
                $goods = D('Goods')->find($goods_id);
                $shops = D('Shop')->find($goods['shop_id']);
                $content[] = array(
                    $goods['title'],
                    $shops['shop_name'],
                    $this->getImage($goods['photo']),
                    __HOST__ . '/mobile/mall/detail/goods_id/' . $goods_id . '.html',
                );
                //file_put_contents('/www/web/bao_baocms_cn/public_html/Baocms/Lib/Action/Weixin/aaa.txt', var_export($content, true));
                $result = D('Connect')->getConnectByOpenid('weixin', $data['data']['FromUserName']);
                if (!empty($result)) {
                    $user_id = $result['uid'];
                    if (!$fans = D('Shopfavorites')->where(array('user_id' => $user_id, 'shop_id' =>$goods['shop_id']))->find()) {
                        $dataf = array(
                            'user_id' => $user_id,
                            'shop_id' => $goods['shop_id'],
                            'create_time' => NOW_TIME,
                            'create_ip' => get_client_ip(),
                        );
                        D('Shopfavorites')->add($dataf);
                        D('Shop')->updateCount($goods['shop_id'], 'fans_num');
                    } else {
                        if($fans['closed'] == 1){
                            D('Shopfavorites')->save(array('favorites_id'=>$fans['favorites_id'],'closed'=>0));
                        }
                    }
                }
                $this->weixin->response($content, 'news');
            }
        }
    }

    private function getImage($img) {
        return __HOST__ . '/attachs/' . $img;
    }

}
