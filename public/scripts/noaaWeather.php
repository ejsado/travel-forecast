<?php
	
	header('Content-Type: application/json');
	
	//var_dump($_POST);
	
	$lat = $_POST['lat'];
	$lng = $_POST['lng'];
	
	$json = file_get_contents('http://forecast.weather.gov/MapClick.php?lat=' . $lat . '&lon=' . $lng . '&FcstType=json');
	
	$obj = json_decode($json);
	echo json_encode($obj, JSON_PRETTY_PRINT);
	
?>