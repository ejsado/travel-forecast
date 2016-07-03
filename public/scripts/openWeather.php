<?php
	
	$referer = $_SERVER['HTTP_REFERER'];
	
	$url = parse_url($referer);
	
	if ($url['host'] == 'ericsadowski.com' ||
		$url['host'] == 'www.ericsadowski.com' ||
		substr($url['host'], 0, 3) == '192') {
		
		include '../../protected/keys.php';
		
		header('Content-Type: application/json');
		
		//var_dump($_POST);
		
		$lat = $_POST['lat'];
		$lng = $_POST['lng'];
		
		$json = file_get_contents('http://api.openweathermap.org/data/2.5/forecast/daily?lat=' . $lat . '&lon=' . $lng . '&units=imperial&appid=' . $openWeatherKey);
		
		$obj = json_decode($json);
		echo json_encode($obj, JSON_PRETTY_PRINT);
		
	} else {
		echo "Unauthorized domain.";
	}
	
?>