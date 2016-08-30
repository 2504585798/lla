<?php

/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2016 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。

class CommonAction extends Action

{

	protected $uid = 0;

	protected $member = array();
	protected $doctor = array();
	protected $hospitalcenter = array();

	protected $_CONFIG = array();

	protected $seodatas = array();

	protected $Hospitalcates = array();
    protected $Itemcates = array();
   protected $template_setting = array();

	  



	protected function _initialize()

	{
		
		 if (is_mobile()) {
			// $url_mobile = 'http://'.$_SERVER['HTTP_HOST'].'/mobile'.$_SERVER['REQUEST_URI'];
			$url_mobile = 'http://'.$_SERVER['HTTP_HOST'].'/pchome'.$_SERVER['REQUEST_URI'];
            header('Location:'.$url_mobile);
            die;
        }
       // $this->display(); 

		define('__HOST__', 'http://' . $_SERVER['HTTP_HOST']);

		$this->_CONFIG = d('Setting')->fetchAll();
		
         //dump($this->_CONFIG);
		searchwordfrom();

		$this->uid = getuid();

		if (!empty($this->uid)) {

			$this->member = d('Users')->find($this->uid);

		}

		$this->assign('ctl', strtolower(MODULE_NAME));

		$this->assign('act', ACTION_NAME);

		$this->assign('nowtime', NOW_TIME);

		$this->getTemplateTheme();

		$this->template_setting = d('Templatesetting')->detail($this->theme);

		$this->assign('CONFIG', $this->_CONFIG);

		$this->assign('MEMBER', $this->member);
		
		$this->assign('today', TODAY);

	  $item0=d('Itemcate')->where(array('parent_id'=>0))->select();//产品顶级分类
	  
	 // dump($item0);
	 $this->assign('itemcate0',  $item0);
	 $this->Itemcates = d('Itemcate')->fetchAll();
        //dump($this->Itemcates);
	 $this->assign('itemcates', $this->Itemcates);

		

	}



	private function seo()

	{

		$seo = d('Seo')->fetchAll();

		$this->seodatas['sitename'] = $this->_CONFIG['site']['sitename'];

		$this->seodatas['tel'] = $this->_CONFIG['site']['tel'];

		$key = strtolower(MODULE_NAME . '_' . ACTION_NAME);



		if (isset($seo[$key])) {

			$this->assign('seo_title', $this->tmplToStr($seo[$key]['seo_title'], $this->seodatas));

			$this->assign('seo_keywords', $this->tmplToStr($seo[$key]['seo_keywords'], $this->seodatas));

			$this->assign('seo_description', $this->tmplToStr($seo[$key]['seo_desc'], $this->seodatas));

		}

		else {

			$this->assign('seo_title', $this->_CONFIG['site']['title']);

			$this->assign('seo_keywords', $this->_CONFIG['site']['keyword']);

			$this->assign('seo_description', $this->_CONFIG['site']['description']);

		}

	}



	private function tmplToStr($str, $datas)

	{

		return tmpltostr($str, $datas);

	}



	public function display($templateFile = '', $charset = '', $contentType = '', $content = '', $prefix = '')

	{

		$this->seo();

		parent::display($this->parseTemplate($templateFile), $charset, $contentType, $content = '', $prefix = '');

	}



	private function parseTemplate($template = '')

	{

		$depr = c('TMPL_FILE_DEPR');

		$template = str_replace(':', $depr, $template);

		$theme = $this->getTemplateTheme();

		define('NOW_PATH', BASE_PATH . '/themes/' . $theme . 'Pchome/');

		define('THEME_PATH', BASE_PATH . '/themes/default/Pchome/');

		define('APP_TMPL_PATH', __ROOT__ . '/themes/default/Pchome/');



		if ('' == $template) {

			$template = strtolower(MODULE_NAME) . $depr . strtolower(ACTION_NAME);

		}

		else if (false === strpos($template, '/')) {

			$template = strtolower(MODULE_NAME) . $depr . strtolower($template);

		}



		$file = NOW_PATH . $template . c('TMPL_TEMPLATE_SUFFIX');



		if (file_exists($file)) {

			return $file;

		}



		return THEME_PATH . $template . c('TMPL_TEMPLATE_SUFFIX');

	}



	private function getTemplateTheme()

	{

		define('THEME_NAME', 'default');



		if ($this->theme) {

			$theme = $this->theme;

		}

		else {

			$theme = d('Template')->getDefaultTheme();



			if (c('TMPL_DETECT_THEME')) {

				$t = c('VAR_TEMPLATE');



				if (isset($_GET[$t])) {

					$theme = $_GET[$t];

				}

				else if (cookie('think_template')) {

					$theme = cookie('think_template');

				}



				if (!in_array($theme, explode(',', c('THEME_LIST')))) {

					$theme = c('DEFAULT_THEME');

				}



				cookie('think_template', $theme, 864000);

			}



			$this->theme = $theme;

		}



		return $theme ? $theme . '/' : '';

	}



	protected function baoMsg($message, $jumpUrl = '', $time = 3000, $callback = '', $parent = true)

	{

		$parents = ($parent ? 'parent.' : '');

		$str = '<script>';

		$str .= $parents . 'bmsg("' . $message . '","' . $jumpUrl . '","' . $time . '","' . $callback . '");';

		$str .= '</script>';

		exit($str);

	}

//开始

 protected function niuSuccess($message, $jumpUrl = '', $time = 3000, $parent = true) {
        $parent = $parent ? 'parent.' : '';
        $str = '<script>';
        $str .=$parent . 'success("' . $message . '",' . $time . ',\'jumpUrl("' . $jumpUrl . '")\');';
        $str.='</script>';
        exit($str);
    }
	

    protected function niuJump($jumpUrl) {
        $str = '<script>';
        $str .='parent.jumpUrl("' . $jumpUrl . '");';
        $str.='</script>';
        exit($str);
    }

    protected function niuErrorJump($message, $jumpUrl = '', $time = 3000) {
        $str = '<script>';
        $str .='parent.error("' . $message . '",' . $time . ',\'jumpUrl("' . $jumpUrl . '")\');';
        $str.='</script>';
        exit($str);
    }

    protected function niuError($message, $time = 3000, $yzm = false, $parent = true) {

        $parent = $parent ? 'parent.' : '';
        $str = '<script>';
        if ($yzm) {
            $str .=$parent . 'error("' . $message . '",' . $time . ',"yzmCode()");';
        } else {
            $str .= $parent . 'error("' . $message . '",' . $time . ');';
        }
        $str.='</script>';
        exit($str);
    }

    protected function niuLoginSuccess() { //异步登录
        $str = '<script>';
        $str .='parent.parent.LoginSuccess();';
        $str.='</script>';
        exit($str);
    }

//结束



	protected function baoOpen($message, $close = true, $style)

	{

		$str = '<script>';

		$str .= 'parent.bopen("' . $message . '","' . $close . '","' . $style . '");';

		$str .= '</script>';

		exit($str);

	}



	protected function baoSuccess($message, $jumpUrl = '', $time = 3000, $parent = true)

	{

		$this->baoMsg($message, $jumpUrl, $time, '', $parent);

	}



	protected function baoJump($jumpUrl)

	{

		$str = '<script>';

		$str .= 'parent.jumpUrl("' . $jumpUrl . '");';

		$str .= '</script>';

		exit($str);

	}



	protected function baoErrorJump($message, $jumpUrl = '', $time = 3000)

	{

		$this->baoMsg($message, $jumpUrl, $time);

	}



	protected function baoError($message, $time = 3000, $yzm = false, $parent = true)

	{

		$parent = ($parent ? 'parent.' : '');

		$str = '<script>';



		if ($yzm) {

			$str .= $parent . 'bmsg("' . $message . '","",' . $time . ',"yzmCode()");';

		}

		else {

			$str .= $parent . 'bmsg("' . $message . '","",' . $time . ');';

		}



		$str .= '</script>';

		exit($str);

	}



	protected function baoLoginSuccess()

	{

		$str = '<script>';

		$str .= 'parent.parent.LoginSuccess();';

		$str .= '</script>';

		exit($str);

	}



	protected function ajaxLogin()

	{

		if ($mini = $this->_get('mini')) {

			exit('0');

		}



		$str = '<script>';

		$str .= 'parent.ajaxLogin();';

		$str .= '</script>';

		exit($str);

	}



	protected function checkFields($data = array(), $fields = array())

	{

		foreach ($data as $k => $val) {

			if (!in_array($k, $fields)) {

				unset($data[$k]);

			}

		}



		return $data;

	}



	protected function ipToArea($_ip)

	{

		return iptoarea($_ip);

	}



	protected function getMenus()

	{

		$menus = $this->memberMenu();

		return $menus;

	}



	protected function memberMenu()

	{

		return array(

	'account' => array(

		'name'  => '账户管理',

		'url'   => u('member/password'),

		'items' => array(

			'info' => array(

				'name'  => '我的账户',

				'items' => array(

					array('name' => '昵称设置', 'url' => u('member/nickname')),

					array('name' => '修改密码', 'url' => u('member/password')),

					array('name' => '修改头像', 'url' => u('member/face')),

					array('name' => '收货地址', 'url' => u('member/myaddress'))

					)

				),

			'auth' => array(

				'name'  => '认证管理',

				'items' => array(

					array('name' => '手机认证', 'url' => u('member/mobile')),

					array('name' => '邮件认证', 'url' => u('member/email'))

					)

				),

			'logs' => array(

				'name'  => '日志管理',

				'items' => array(

					array('name' => '积分日志', 'url' => u('member/integral')),

					array('name' => '金块日志', 'url' => u('member/goldlogs')),

					array('name' => '余额日志', 'url' => u('member/moneylogs')),

					array('name' => '代金券日志', 'url' => u('member/rechargecard'))

					)

				)

			)

		),

	'consume' => array(

		'name'  => '消费管理',

		'url'   => u('member/order'),

		'items' => array(

			'order' => array(

				'name'  => '我的订单',

				'items' => array(

					array('name' => '抢购订单', 'url' => u('member/order')),

					array('name' => '订餐订单', 'url' => u('member/eleorder')),

					array('name' => '商城订单', 'url' => u('member/goods'))

					)

				),

			'card'  => array(

				'name'  => '票券积分',

				'items' => array(

					array('name' => '我的抢购券', 'url' => u('member/ordercode')),

					array('name' => '优惠券下载', 'url' => u('member/coupon')),

					array('name' => '我的兑换', 'url' => u('member/exchange')),

					array('name' => '我的预约', 'url' => u('member/yuyue'))

					)

				)

			)

		),

	'other'   => array(

		'name'  => '其他管理',

		'url'   => u('member/order'),

		'items' => array(

			'order'    => array(

				'name'  => '充值管理',

				'items' => array(

					array('name' => '余额充值', 'url' => u('member/money')),

					array('name' => '代金券充值', 'url' => u('member/recharge')),

					array('name' => '金块充值', 'url' => u('member/gold'))

					)

				),

			'cash'     => array(

				'name'  => '提现管理',

				'items' => array(

					array('name' => '提现记录', 'url' => u('member/cashlog')),

					array('name' => '申请提现', 'url' => u('member/cash'))

					)

				),

			'huodong'  => array(

				'name'  => '活动信息',

				'items' => array(

					array('name' => '我的活动', 'url' => u('member/myactivity')),

					array('name' => '我的信息', 'url' => u('member/life')),

					array('name' => '我的点评', 'url' => u('member/dianping')),

					array('name' => '我的关注', 'url' => u('member/favorites')),

					array('name' => '我的分享', 'url' => u('member/bbs'))

					)

				),

			'tuiguang' => array(

				'name'  => '代理商',

				'items' => array(

					array('name' => '商户列表', 'url' => u('member/myshop')),

					array('name' => '代理成果', 'url' => u('member/tongji'))

					)

				)

			)

		)

	);

	}

}



?>

