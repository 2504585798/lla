<?php
class EmailModel extends CommonModel {

    protected $pk = 'email_id';
    protected $tableName = 'email';
    protected $token = 'email';
    protected $mailobj = null;

    public function fetchAll() {
        $cache = cache(array('type' => 'File', 'expire' => $this->cacheTime));
        if (!$data = $cache->get($this->token)) {
            $result = $this->order($this->orderby)->select();
            $data = array();
            foreach ($result as $row) {
                $data[$row['email_key']] = $row;
            }
            $cache->set($this->token, $data);
        }
        return $data;
    }

    public function sendMail($code, $email, $title, $datas) {
        $tmpl = $this->fetchAll();
        if (!empty($tmpl[$code]['is_open'])) {
            $content = $tmpl[$code]['email_tmpl'];
            $config = D('Setting')->fetchAll();
            $datas['sitename'] = $config['site']['sitename'];
            $datas['tel'] = $config['site']['tel'];
            foreach ($datas as $k => $val) {
                $content = str_replace('{' . $k . '}', $val, $content);
            }
            if ($this->mailobj == null) {
                $this->mailobj = $this->mail($config);
            }
            if (is_array($email)) {
                foreach ($email as $m) {
                    $this->mailobj->addAddress($m);
                }
            } else {
                $this->mailobj->addAddress($email);
            }
            $this->mailobj->Subject = $title;
            $this->mailobj->Body = $content;
            return $this->mailobj->send();
        }
        return false;
    }

    private function mail($config) {
        Vendor("phpmailer.PHPMailerAutoload");
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = $config['mail']['smtp'];
        $mail->SMTPAuth = true;
        $mail->CharSet = "utf-8";
        $mail->Username = $config['mail']['username'];
        $mail->Password = $config['mail']['password'];
        $mail->Port = $config['mail']['port'];
        $mail->From = $config['mail']['from'];
        $mail->FromName = $config['site']['sitename'];
        $mail->isHTML(true);
        return $mail;
    }

    public function getEorrer() {

        return $this->mailobj->ErrorInfo;
    }

}