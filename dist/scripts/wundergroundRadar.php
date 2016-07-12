<?php
	echo exec('whoami');
	echo "Getting radar images... ";
	$wBaseUrl = "http://api.wunderground.com/api/6be50baeecbb66f7/radar/image.png?";
	
	// get USA radar
	copy($wBaseUrl . 'minlat=15&minlon=-170&maxlat=50&maxlon=-50&width=1200&height=400&noclutter=1&rainsnow=1&smooth=1', '../img/radar/usa.png');
	
	sleep(2);
	
	// Canada
	copy($wBaseUrl . 'minlat=50&minlon=-170&maxlat=75&maxlon=-50&width=1200&height=500&noclutter=1&rainsnow=1&smooth=1', '../img/radar/can.png');
	
	sleep(2);
	
	// Europe
	copy($wBaseUrl . 'minlat=35&minlon=-13&maxlat=72&maxlon=40&width=500&height=500&noclutter=1&rainsnow=1&smooth=1', '../img/radar/eur.png');
	
	sleep(2);
	
	// Australia
	copy($wBaseUrl . 'minlat=-50&minlon=110&maxlat=-5&maxlon=180&width=500&height=500&noclutter=1&rainsnow=1&smooth=1', '../img/radar/aus.png');
	
	//sleep(2);
	
	echo " Done. Probably.";
	
?>