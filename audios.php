<?php

print_r($_FILES); 

$errors = array();

$size = $_FILES['files']['size']; 

$input = $_FILES['files']['tmp_name']; 

$output = $_FILES['files']['name'].".wav"; 

if (!is_writable($output)) {
    echo 'The folder is not writable';
} else {
	echo 'The folder is writable';
}

$extension = "wav";                   
$ext = pathinfo($_FILES['files']['tmp_name'], PATHINFO_EXTENSION);
 
if(!in_array($ext, $extension)){
    array_push($errors, "File type is invalid, Please select '.wav' audio only");
}
 
$bytes = 1024;
// ".wav" audio is around 10.09 MB per minute, so, it's approximately 10000 KB
$allowedKB = 10000;
$totalBytes = $allowedKB * $bytes;
 
if($_FILES['files']['size'] > $totalBytes){
    array_push($errors, "File size must be less than 10000KB");
}
 
move_uploaded_file($input, $output)

?>