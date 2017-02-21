/**
* Travel Weathr - build a weather forecast calendar
* Copyright (C) 2016  Eric Sadowski
* 
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
* 
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
* 
*/

function appCtrl($timeout, $scope, locationFty, destinationFty, forecastFty, dateFty, urlFty, distanceFty, alertFty) {
	
	angular.element(document).ready(function () {
		// run this function once, only when loaded
		document.getElementById('loading-mask').style.display = "none";
		console.log("doc ready");
	});
	
	var self = this;
	
	// add factories to scope so they can be accessed in the html
	
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
	
	// used when the logo is clicked
	self.resetPage = function() {
		if (destinationFty.destinationList.length > 0) {
			self.clear();
		} else {
			locationFty.openAddForecast();
		}
	}
	
	// remove all destinations
	self.clear = function() {
		destinationFty.clearDestinations();
		urlFty.clearUrlParamTrip();
		urlFty.buildUrlParamUnits(forecastFty.units);
		urlFty.buildUrlParamSort(destinationFty.sortBy);
		alertFty.displayMessage("All destinations removed. Hit your browser's back button to undo.", "warning");
		locationFty.openAddForecast();
	}
	
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
			destinationFty.loadingDestinations = true;
		} else {
			urlFty.buildUrlParamUnits(forecastFty.units);
			urlFty.buildUrlParamSort(destinationFty.sortBy);
		}
		
		// 1 sec delay between loading destinations
		var timeDelay = 1000;
		
		destinationFty.clearDestinations();
		
		// error flags
		
		var destinationsNotFound = false;
		
		var dateRangeInvalid = false;
		
		var tooManyDestinations = false;
		
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
							// switch dates if departure is before arrival
							// add the destination with the date range
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
						} else {
							console.log("destination date range invalid");
							dateRangeInvalid = true;
						}
					}
					// get forecast for added destination
					forecastFty.attemptGetForecast(result.coords.lat, result.coords.lng, result.name);
					// if done adding destinations
					if (count == urlDestinations.length || count >= 10) {
						// enable buttons
						destinationFty.loadingDestinations = false;
						console.log("done loading destinations");
						// show errors, if any
						if (destinationsNotFound) {
							alertFty.displayModal(alertFty.destinationsNotFoundModal);
						} else if (dateRangeInvalid) {
							alertFty.displayModal(alertFty.dateRangeInvalidModal);
						} else if (tooManyDestinations) {
							alertFty.displayModal(alertFty.tooManyDestinationsModal);
						} else if (count != destinationFty.destinationList.length) {
							alertFty.displayModal(alertFty.destinationsMergedModal);
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
						// make affiliate links
						/* $timeout(urlFty.monetizeLinks, 500); */
						locationFty.map.setZoom(6);
						locationFty.map.panToBounds(locationFty.destinationBounds);
					}
				}, function(result) {
					console.log("coords unknown, skipping location");
					destinationsNotFound = true;
				});
			}, delay);
		}		
		// for each destination in url
		for (var i = 0; i < urlDestinations.length; i++) {
			if (i >= 10) {
				tooManyDestinations = true;
				break;
			}
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
				lat: urlDestinations[urlDestinations.length - 1].coords.lat,
				lng: urlDestinations[urlDestinations.length - 1].coords.lng
			}));
			// minimize the Add Forecast controls
			locationFty.closeAddForecast();
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




















