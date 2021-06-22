<?php
include('./config.php');

$subject = $_GET['subject'] ?? 'Wiadomość ze strony www';

header('Location: mailto:'.EMAIL.'?subject='.$subject);