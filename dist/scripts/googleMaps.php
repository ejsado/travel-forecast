<?php
	
	include '../../protected/keys.php';
	
	header('Content-Type: application/json');
	
	//var_dump($_POST);
	
	// need to restrict domain access
	
	$js = file_get_contents('https://api.forecast.io/forecast/' . $darkSkyKey . '/' . $lat . ',' . $lng . $date . '?units=us&exclude=minutely,hourly,flags,alerts');
	
	$obj = json_decode($js);
	echo json_encode($obj, JSON_PRETTY_PRINT);
	
?>