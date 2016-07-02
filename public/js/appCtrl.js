function appCtrl($timeout, $scope, locationFty, destinationFty, forecastFty, dateFty, urlFty, distanceFty, alertFty) {
	
	angular.element(document).ready(function () {
		//document.getElementById('loadingMask').style.display = "none";
	});
	
	var self = this;
	
	self.locationFty = locationFty;
	
	self.destinationFty = destinationFty;
	
	self.forecastFty = forecastFty;
	
	self.dateFty = dateFty;
	
	self.urlFty = urlFty;
	
	self.distanceFty = distanceFty;
	
	self.alertFty = alertFty;
	
	self.loadingDestinations = false;
	
	getDataFromUrl();
	
	function getDataFromUrl() {
		
		forecastFty.units = urlFty.getUrlUnits();
		
		var urlDestinations = [];
	
		if (urlFty.validUrlParamTrip()) {
			urlDestinations = urlFty.getUrlDestinations();
		} else {
			console.log("invalid url");
			alertFty.displayModal(alertFty.invalidUrlModal);
		}
		
		if (urlDestinations.length > 0) {
			self.loadingDestinations = true;
		} else {
			urlFty.buildUrlParamUnits(forecastFty.units);
		}
		
		var timeDelay = 1000;
		
		destinationFty.clearDestinations();
		
		var destinationsNotFound = false;
		
		var dateRangeInvalid = false;
		
		function delayLoadDestination(latLng, dateRangeList, delay, count) {
			$timeout(function() {
				locationFty.geocodeLatLng(latLng, function(result) {
					console.log("coords found");
					for (var n = 0; n < dateRangeList.length; n++) {
						if (dateFty.validDate(dateRangeList[n].arrival) &&
							dateFty.validDate(dateRangeList[n].departure) &&
							dateFty.datesWithinDays(dateRangeList[n].arrival, dateRangeList[n].departure, dateFty.maxDateRange)
						) {
							if (dateRangeList[n].arrival > dateRangeList[n].departure) {
								destinationFty.addDestination(
									result,
									dateRangeList[n].departure,
									dateRangeList[n].arrival
								);
							} else {
								destinationFty.addDestination(
									result,
									dateRangeList[n].arrival,
									dateRangeList[n].departure
								);
							}
							forecastFty.attemptGetForecast(result.coords.lat, result.coords.lng, result.name);
						} else {
							console.log("destination date range invalid");
							dateRangeInvalid = true;
						}
					}
					if (destinationFty.destinationList.length > 1) {
						distanceFty.attemptGetDistance(
							destinationFty.destinationList[destinationFty.destinationList.length - 2],
							destinationFty.destinationList[destinationFty.destinationList.length - 1],
							function() {}
						);
					}
					if (count == urlDestinations.length) {
						self.loadingDestinations = false;
						console.log("done loading destinations");
						if (count != destinationFty.destinationList.length) {
							if (destinationsNotFound) {
								alertFty.displayModal(alertFty.destinationsNotFoundModal);
							} else if (dateRangeInvalid) {
								alertFty.displayModal(alertFty.dateRangeInvalidModal);
							} else {
								alertFty.displayModal(alertFty.destinationsMergedModal);
							}
						}
						urlFty.buildUrlParamTrip(destinationFty.destinationList);
						$scope.$apply();
					}
				}, function(result) {
					console.log("coords unknown, skipping location");
					destinationsNotFound = true;
				});
			}, delay);
		}		
		
		for (var i = 0; i < urlDestinations.length; i++) {
			var latLng = new google.maps.LatLng({
				lat: urlDestinations[i].coords.lat,
				lng: urlDestinations[i].coords.lng
			});
			delayLoadDestination(latLng, urlDestinations[i].dateRanges, timeDelay * i, i + 1);
		}
		
		if (urlDestinations.length >= 1) {
			locationFty.map.panTo(new google.maps.LatLng({
				lat: urlDestinations[0].coords.lat,
				lng: urlDestinations[0].coords.lng
			}));
		}
	}
	
	$scope.$on('$locationChangeSuccess', function(event, url) {
		console.log("url param changed");
		if (!urlFty.paramsUpdated) {
			console.log("external url change");
			getDataFromUrl();
		}
		urlFty.paramsUpdated = false;
	});
	
}




















