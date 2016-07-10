function appCtrl($timeout, $scope, locationFty, destinationFty, forecastFty, dateFty, urlFty, distanceFty, alertFty) {
	
	angular.element(document).ready(function () {
		// run this function once, only when loaded
		//document.getElementById('loadingMask').style.display = "none";
	});
	
	var self = this;
	
	// add factories to scope to they can be accessed in the html
	
	self.locationFty = locationFty;
	
	self.destinationFty = destinationFty;
	
	self.forecastFty = forecastFty;
	
	self.dateFty = dateFty;
	
	self.urlFty = urlFty;
	
	self.distanceFty = distanceFty;
	
	self.alertFty = alertFty;
	
	// select input text on click
	self.highlightInput = function(e) {
		e.target.select();
	}
	
	// remove all destinations
	self.clear = function() {
		destinationFty.clearDestinations();
		urlFty.clearUrlParamTrip();
		//urlFty.buildUrlParamUnits(forecastFty.units);
	}
	
	// flag to disable buttons while destinations are loading
	self.loadingDestinations = false;
	
	// load destinations from url
	getDataFromUrl();
	
	function getDataFromUrl() {
		
		forecastFty.units = urlFty.getUrlUnits();
		
		destinationFty.sortBy = urlFty.getUrlSort();
		
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
			//urlFty.buildUrlParamUnits(forecastFty.units);
		}
		
		// 1 sec delay between loading destinations
		var timeDelay = 1000;
		
		destinationFty.clearDestinations();
		
		// error flags
		
		var destinationsNotFound = false;
		
		var dateRangeInvalid = false;
		
		function delayLoadDestination(latLng, dateRangeList, delay, count) {
			$timeout(function() {
				// find coordinates
				locationFty.geocodeLatLng(latLng, function(result) {
					console.log("coords found");
					// iterate through date ranges
					for (var n = 0; n < dateRangeList.length; n++) {
						// if dates are valid
						if (dateFty.validDate(dateRangeList[n].arrival) &&
							dateFty.validDate(dateRangeList[n].departure) &&
							dateFty.datesWithinDays(dateRangeList[n].arrival, dateRangeList[n].departure, dateFty.maxDateRange)
						) {
							// do not add dates before today
							if (dateRangeList[n].arrival < dateFty.today) {
								dateRangeList[n].arrival = new Date(dateFty.today);
							}
							if (dateRangeList[n].departure < dateFty.today) {
								dateRangeList[n].departure = new Date(dateFty.today);
							}
							// switch dates if one departure is before arrival
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
							// get forecast for added destination
							forecastFty.attemptGetForecast(result.coords.lat, result.coords.lng, result.name);
						} else {
							console.log("destination date range invalid");
							dateRangeInvalid = true;
						}
					}
					// if done adding destinations
					if (count == urlDestinations.length) {
						// enable buttons
						self.loadingDestinations = false;
						console.log("done loading destinations");
						// show errors, if any
						if (count != destinationFty.destinationList.length) {
							if (destinationsNotFound) {
								alertFty.displayModal(alertFty.destinationsNotFoundModal);
							} else if (dateRangeInvalid) {
								alertFty.displayModal(alertFty.dateRangeInvalidModal);
							} else {
								alertFty.displayModal(alertFty.destinationsMergedModal);
							}
						}
						// rebuild url
						urlFty.buildUrlParamTrip(destinationFty.destinationList);
						// if more than 1 destination
						if (destinationFty.destinationList.length > 1) {
							// get estimated travel time between destinations
							distanceFty.getDistances(
								destinationFty.destinationList,
								function() {
									// apply changes because $apply does not run after ajax calls
									$scope.$apply();
								}
							);
						}
					}
				}, function(result) {
					console.log("coords unknown, skipping location");
					destinationsNotFound = true;
				});
			}, delay);
		}		
		// for each destination in url
		for (var i = 0; i < urlDestinations.length; i++) {
			var latLng = new google.maps.LatLng({
				lat: urlDestinations[i].coords.lat,
				lng: urlDestinations[i].coords.lng
			});
			// delay loading destinations to reduce server load
			delayLoadDestination(latLng, urlDestinations[i].dateRanges, timeDelay * i, i + 1);
		}
		// if at least one destination
		if (urlDestinations.length >= 1) {
			// center the map on the first destination
			locationFty.map.panTo(new google.maps.LatLng({
				lat: urlDestinations[0].coords.lat,
				lng: urlDestinations[0].coords.lng
			}));
		}
	}
	
	// listen for url changes
	$scope.$on('$locationChangeSuccess', function(event, url) {
		console.log("url param changed");
		if (!urlFty.paramsUpdated) {
			// url not changed by this program
			console.log("external url change");
			getDataFromUrl();
		}
		// get short url
		urlFty.buildShortUrl();
		// reset param flag
		urlFty.paramsUpdated = false;
	});
	
}




















