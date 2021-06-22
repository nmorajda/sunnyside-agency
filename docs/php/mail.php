<?php
include('./config.php');

function getCaptcha($token) {
    $response = file_get_contents(RECAPTCHA_API.'?secret='.SECRET_KEY.'&response='.$token);
    $result = json_decode($response);

    return $result;
}

// Wykorzystuje funkcję mail()
// Dla home.pl
// https://pomoc.home.pl/baza-wiedzy/formularz-kontaktowy-na-stronie-www-nie-wysyla-wiadomosci
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if($_SERVER["REQUEST_METHOD"] !== "POST") {
    header('HTTP/1.1 404 Not Found');
    exit();
}

$response['body']['data'] = $_POST;
$response['body']['timestamp'] = time();

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';
$rule = $_POST['rule'] ?? '';
$subject = $_POST['subject'] ?? 'Wiadomość ze strony www';

$recaptcha = getCaptcha($_POST['g-recaptcha-response']);

if (!$recaptcha->success || $recaptcha->score < 0.5) {
    $response['status_code_header'] = 'HTTP/1.1 422 Unprocessable Entity';
    $response['body']['status'] = 'error';
    $response['body']['msg'] = 'Invalid  recaptcha: '.$recaptcha->{'error-codes'}[0];
} else {
    $error = false;

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = true;
    }
    
    if( $name === '' || $message === '' || $rule === '') {
        $error = true;
    }
    
    if ($error) {
        $response['status_code_header'] = 'HTTP/1.1 422 Unprocessable Entity';
        $response['body']['status'] = 'error';
        $response['body']['msg'] = 'Invalid input: email:'.$email.' message: '.$message.' rule:'.$rule.' recaptcha: '.$recaptcha->success;    
        
    } else {
        // To send HTML mail, the Content-type header must be set
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
        // Create email headers
        $headers .= 'From: '.EMAIL."\r\n";
        $headers .= 'Reply-To: '.$email ."\r\n";
        $headers .= 'X-Mailer: PHP/' . phpversion();

        // Compose a simple HTML email message
        $html = '';
        $html .= '<html>';
        $html .= '<body>';
        $html .= '<p style="color:#000;font-size:16px;">Nazwa: '.$name.'</p>';
        $html .= '<p style="color:#000;font-size:16px;">Email: '.$email.'</p>';    
        $html .= '<hr>';    
        $html .= '<p style="color:#000;font-size:16px;">Treść wiadomości:</p>';
        $html .= '<p style="color:#000;font-size:16px;">'.$message.'</p>';
        $html .= '</body>';
        $html .= '</html>';

        if (mail(EMAIL, mb_encode_mimeheader($subject,"UTF-8"), $html, $headers)) {
            $response['status_code_header'] = 'HTTP/1.1 201 Created';
            $response['body']['status'] = 'success';
        } else {
            $response['status_code_header'] = 'HTTP/1.1 500 Internal Server Error';
            $response['body']['status'] = 'error';  
        }        
    }
}

if (SAVE_LOG) {
    $log = file_get_contents('./'.LOG_DIR.'/mail.json');
    $logArray = json_decode($log);
    array_push($logArray, $response);
    file_put_contents('./'.LOG_DIR.'/mail.json', json_encode($logArray));
}

header($response['status_code_header']);
echo json_encode($response['body']);