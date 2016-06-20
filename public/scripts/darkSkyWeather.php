<?php
	
	header('Content-Type: application/json');
	
	//var_dump($_POST);
	
	// need to restrict domain access
	
	$lat = $_POST['lat'];
	$lng = $_POST['lng'];
	if (isset($_POST['date'])) {
		$date = ',' . $_POST['date'];
	} else {
		$date = '';
	}
	
	$json = file_get_contents('https://api.forecast.io/forecast/0933e80a33f954a1a3164e0e7dffd893/' . $lat . ',' . $lng . $date . '?units=us&exclude=minutely,hourly,flags,alerts');
	
	$obj = json_decode($json);
	echo json_encode($obj, JSON_PRETTY_PRINT);
	
?>