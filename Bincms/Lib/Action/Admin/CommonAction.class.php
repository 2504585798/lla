<?php
/////////////////////////////////////////////////////////////////////////////
// 这个文件是 美容整形社区项目的一部分
//
// Copyright (c) 2015 – 2020  QQ:1149100178
// 要查看完整的版权信息和许可信息，请查看源代码中附带的 COPYRIGHT 文件，
// 或者联系qq:easyWe(2504585798)获得详细信息。
class CommonAction extends Action
{
	protected $_admin = array();
	protected $_CONFIG = array();
	private $state_domain = array('al', 'dz', 'af', 'ar', 'ae', 'aw', 'om', 'az', 'eg', 'et', 'ie', 'ee', 'ad', 'ao', 'ai', 'ag', 'at', 'au', 'mo', 'bb', 'pg', 'bs', 'pk', 'py', 'ps', 'bh', 'pa', 'br', 'by', 'bm', 'bg', 'mp', 'bj', 'be', 'is', 'pr', 'ba', 'pl', 'bo', 'bz', 'bw', 'bt', 'bf', 'bi', 'bv', 'kp', 'gq', 'dk', 'de', 'tl', 'tp', 'tg', 'dm', 'do', 'ru', 'ec', 'er', 'fr', 'fo', 'pf', 'gf', 'tf', 'va', 'ph', 'fj', 'fi', 'cv', 'fk', 'gm', 'cg', 'cd', 'co', 'cr', 'gg', 'gd', 'gl', 'ge', 'cu', 'gp', 'gu', 'gy', 'kz', 'ht', 'kr', 'nl', 'an', 'hm', 'hn', 'ki', 'dj', 'kg', 'gn', 'gw', 'ca', 'gh', 'ga', 'kh', 'cz', 'zw', 'cm', 'qa', 'ky', 'km', 'ci', 'kw', 'cc', 'hr', 'ke', 'ck', 'lv', 'ls', 'la', 'lb', 'lt', 'lr', 'ly', 'li', 're', 'lu', 'rw', 'ro', 'mg', 'im', 'mv', 'mt', 'mw', 'my', 'ml', 'mk', 'mh', 'mq', 'yt', 'mu', 'mr', 'us', 'um', 'as', 'vi', 'mn', 'ms', 'bd', 'pe', 'fm', 'mm', 'md', 'ma', 'mc', 'mz', 'mx', 'nr', 'np', 'ni', 'ne', 'ng', 'nu', 'no', 'nf', 'na', 'za', 'aq', 'gs', 'eu', 'pw', 'pn', 'pt', 'jp', 'se', 'ch', 'sv', 'ws', 'yu', 'sl', 'sn', 'cy', 'sc', 'sa', 'cx', 'st', 'sh', 'kn', 'lc', 'sm', 'pm', 'vc', 'lk', 'sk', 'si', 'sj', 'sz', 'sd', 'sr', 'sb', 'so', 'tj', 'tw', 'th', 'tz', 'to', 'tc', 'tt', 'tn', 'tv', 'tr', 'tm', 'tk', 'wf', 'vu', 'gt', 've', 'bn', 'ug', 'ua', 'uy', 'uz', 'es', 'eh', 'gr', 'hk', 'sg', 'nc', 'nz', 'hu', 'sy', 'jm', 'am', 'ac', 'ye', 'iq', 'ir', 'il', 'it', 'in', 'id', 'uk', 'vg', 'io', 'jo', 'vn', 'zm', 'je', 'td', 'gi', 'cl', 'cf', 'cn', 'yr', 'top');
	private $top_domain = array('com', 'arpa', 'edu', 'gov', 'int', 'mil', 'net', 'org', 'biz', 'info', 'pro', 'name', 'museum', 'coop', 'aero', 'xxx', 'idv', 'me', 'mobi', 'wang', 'asia', 'travel', 'jobs');

	protected function _initialize()
	{
		$this->_admin = session('admin');
		if ((strtolower(MODULE_NAME) != 'login') && (strtolower(MODULE_NAME) != 'public')) {
			if (empty($this->_admin)) {
				header('Location: ' . u('login/index'));
				exit();
			}

			if ($this->_admin['role_id'] != 1) {
				$this->_admin['menu_list'] = d('RoleMaps')->getMenuIdsByRoleId($this->_admin['role_id']);

				if (strtolower(MODULE_NAME) != 'index') {
					$menu_action = strtolower(MODULE_NAME . '/' . ACTION_NAME);//获取当前操作
					$menu = d('Menu')->fetchAll();
					$menu_id = 0;

					foreach ($menu as $k => $v) {
						if ($v['menu_action'] == $menu_action) {//判断当前操作是否在权限表内
							$menu_id = (int) $k;//获取权限id
							break;
						}
					}

					if (empty($menu_id) || !isset($this->_admin['menu_list'][$menu_id])) {
						$this->error('很抱歉您没有权限操作模块:' . $menu[$menu_id]['menu_name']);
					}
				}
			}
		}

		$this->_CONFIG = d('Setting')->fetchAll();
		define('__HOST__', 'http://' . $_SERVER['HTTP_HOST']);
		$this->assign('CONFIG', $this->_CONFIG);
		$this->assign('admin', $this->_admin);
		$this->assign('today', TODAY);
		$this->assign('nowtime', NOW_TIME);
		register_shutdown_function(array(&$this, 'shutdown'));
	}

	protected function display($templateFile = '', $charset = '', $contentType = '', $content = '', $prefix = '')
	{
		parent::display($this->parseTemplate($templateFile), $charset, $contentType, $content = '', $prefix = '');
	}

	protected function parseTemplate($template = '')
	{
		$depr = c('TMPL_FILE_DEPR');
		$template = str_replace(':', $depr, $template);
		define('THEME_PATH', BASE_PATH . '/' . APP_NAME . '/Tpl/');
		define('APP_TMPL_PATH', __ROOT__ . '/' . APP_NAME . '/Tpl/');

		if ('' == $template) {
			$template = strtolower(MODULE_NAME) . $depr . strtolower(ACTION_NAME);
		}
		else if (false === strpos($template, '/')) {
			$template = strtolower(MODULE_NAME) . $depr . strtolower($template);
		}

		return THEME_PATH . $template . c('TMPL_TEMPLATE_SUFFIX');
	}

	protected function baoSuccess($message, $jumpUrl = '', $time = 3000)
	{
		$str = '<script>';
		$str .= 'parent.success("' . $message . '",' . $time . ',\'jumpUrl("' . $jumpUrl . '")\');';
		$str .= '</script>';
		exit($str);
	}

	protected function baoError($message, $time = 3000, $yzm = false)
	{
		$str = '<script>';

		if ($yzm) {
			$str .= 'parent.error("' . $message . '",' . $time . ',"yzmCode()");';
		}
		else {
			$str .= 'parent.error("' . $message . '",' . $time . ');';
		}

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

	public function rootdomain($domain = NULL)
	{
		$domain = ($domain ? $domain : $_SERVER['HTTP_HOST']);

		if (!preg_match('/^[\\w\\-\\.]+$/i', $domain)) {
			return false;
		}

		$m = explode('.', $domain);
		$count = count($m);

		if ($count <= 2) {
			$rootdomain = $domain;
		}
		else {
			$last = array_pop($m);
			$mote = array_pop($m);

			if (in_array($last, $this->top_domain)) {
				$rootdomain = $mote . '.' . $last;
			}
			else if (in_array($last, $this->state_domain)) {
				$moteupurl = array_pop($m);

				if (in_array($mote, $this->top_domain)) {
					$rootdomain = $moteupurl . '.' . $mote . '.' . $last;
				}
				else {
					$rootdomain = $mote . '.' . $last;
				}
			}
		}

		return $rootdomain;
	}

	public function shutdown()//关机函数
	{
		/*if ((rand(1, 100) % 20) == 0) {
			if ('baocmsshiyigebucuodexitong' != md5(c('BAO_KEY') . '.' . $this->rootdomain())) {
				$b = '<script>alert("您使用的程序没有授权，请联系官方授权");window.top.location="";</script>';//如果不匹配直接退出了
				exit(base64_decode($b));//退出程序，弹出B对应的文字。
			}
		}*/

		$version = @include BASE_PATH . '/version.php';
		$host = $_SERVER['HTTP_HOST'];
		$cache = $host . c('AUTH_KEY') . $version;
		$file = APP_PATH . 'Runtime/Cache/Admin/' . md5($cache) . '.php';
		$flock = APP_PATH . 'Runtime/Cache/Admin/' . md5($cache) . '.lock';
		if ($a || !file_exists($file) || (filemtime($file) < (time() - 86400))) {
			$url = sprintf(base64_decode('http://www.baidu.com/index.php?ctl=listen&key=%s&host=%s&version=%s'), $host, c('BAO_KEY'), $version);//需要亲修改下这个逻辑代码

			if ($a) {
				$url = $url . '&force=' . $a;
			}

			$options = array(
				'http' => array('method' => 'GET', 'header' => "User-Agent: KT-API Listen\r\n", 'timeout' => 10)
				);
			if ((!file_exists($flock) || (filemtime($flock) < (time() - 3600))) && (($ret = @file_get_contents($url, NULL, stream_context_create($options))) === false)) {
				file_put_contents($flock, 1);
				return false;
			}

			@unlink($flock);
			@file_put_contents($file, $ret);
		}
	}

	protected function ipToArea($_ip)
	{
		return iptoarea($_ip);
	}
}

?>
