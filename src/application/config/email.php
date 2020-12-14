<?php defined('BASEPATH') OR exit('No direct script access allowed');

// Add custom values by settings them to the $config array.
// Example: $config['smtp_host'] = 'smtp.gmail.com';
// @link https://codeigniter.com/user_guide/libraries/email.html

$config['protocol']    = 'smtp'; // or 'smtp'
$config['mailtype']    = 'html'; // or 'text'
$config['smtp_host']   = $_ENV['SMTP'];
$config['smtp_user']   = $_ENV['SMTP_USER'];
$config['smtp_pass']   = $_ENV['SMTP_PASS'];
$config['smtp_crypto'] = 'tls'; // or 'tls'
