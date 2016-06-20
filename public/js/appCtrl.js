function appCtrl($timeout, locationFty, destinationFty, forecastFty, dateFty, urlFty) {
	
	var self = this;
	
	self.locationFty = locationFty;
	
	self.destinationFty = destinationFty;
	
	self.forecastFty = forecastFty;
	
	self.dateFty = dateFty;
	
	var urlDestinations = [];
	
	if (urlFty.validUrlParam()) {
		urlDestinations = urlFty.getUrlDestinations();
	} else {
		console.log("invalid url");
		urlFty.clearUrlParam();
	}
	
	function delayLoadDestination(latLng, dateRangeList, delay) {
		$timeout(function() {
			locationFty.geocodeLatLng(latLng, function(result) {
				console.log("coords found");
				for (var n = 0; n < dateRangeList.length; n++) {
					destinationFty.addDestination(
						result,
						dateRangeList[n].arrival,
						dateRangeList[n].departure
					);
				}
				forecastFty.attemptGetForecast(result.coords.lat, result.coords.lng, result.name);
			}, function(result) {
				console.log("coords unknown, skipping location");
			});
		}, delay);
	}
	
	var timeDelay = 1000;
	
	for (var i = 0; i < urlDestinations.length; i++) {
		var latLng = new google.maps.LatLng({
			lat: urlDestinations[i].coords.lat,
			lng: urlDestinations[i].coords.lng
		});
		delayLoadDestination(latLng, urlDestinations[i].dateRanges, timeDelay * i);
	}
	
	if (urlDestinations.length >= 1) {
		locationFty.map.panTo(new google.maps.LatLng({
			lat: urlDestinations[0].coords.lat,
			lng: urlDestinations[0].coords.lng
		}));
	}
	
}




















