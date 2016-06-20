<?php
	
	header('Content-Type: application/json');
	
	//var_dump($_POST);
	
	$lat = $_POST['lat'];
	$lng = $_POST['lng'];
	
	$json = file_get_contents('http://api.openweathermap.org/data/2.5/forecast/daily?lat=' . $lat . '&lon=' . $lng . '&units=imperial&appid=b5bc8ea8a8d753fa7e3bff2b4905204e');
	
	$obj = json_decode($json);
	echo json_encode($obj, JSON_PRETTY_PRINT);
	
?>