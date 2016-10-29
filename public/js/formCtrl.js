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

function formCtrl($scope, $timeout, destinationFty, forecastFty, dateFty, urlFty, distanceFty, alertFty, locationFty) {
	
	var self = this;
	
	self.typeAheadResults = [];
	
	self.showTypeAhead = false;
	
	self.highlightIndex = 0;
	
	// clicked marker (red)
	var marker = null;
	
	// throttle flag to reduce map clicks
	var throttle = false;
	
	// set default dates
	
	self.startDate = new Date(dateFty.today);
	
	self.endDate = new Date(dateFty.today);
	
	// show or hide the date pickers
	
	self.showStartDatePicker = false;
	
	self.showEndDatePicker = false;
	
	function removeMarker() {
		if (marker) {
			marker.setMap(null);
			marker = null;
		}
	}
	
	function replaceMapMarker(map, position) {
		console.log("replace marker");
		removeMarker();
		marker = new google.maps.Marker({
			map: map,
			position: position,
			zIndex: 100
		});
	}
	
	function centerMap(map, position) {
		console.log("center map");
		map.panTo(position);
	}
	
	function zoomMap(map, zoomLevel) {
		map.setZoom(zoomLevel);
	}
	
	function addressFound(resultsList) {
		//console.log("addresses found");
		self.typeAheadResults = resultsList;
		//self.showTypeAhead = true;
		$scope.$apply();
	}
	
	function addressNotFound(result) {
		//console.log("address not found");
		locationFty.locationDetails = result;
		removeMarker();
		$scope.$apply();
	}
	
	function coordsFound(result) {
		//console.log("coords found");
		locationFty.locationDetails = result;
		$scope.$apply();
	}
	
	function coordsUnknown(result) {
		//console.log("coords unknown", result);
		locationFty.locationDetails = result;
		$scope.$apply();
	}
	
	self.highlightResult = function(e) {
		//console.log("key pressed", e.which);
		if (e.which == 40) {
			// down key pressed
			e.preventDefault();
			if (self.highlightIndex < (self.typeAheadResults.length - 1)) {
				self.highlightIndex++;
			}
		} else if (e.which == 38) {
			// up key pressed
			e.preventDefault();
			if (self.highlightIndex > 0) {
				self.highlightIndex--;
			}
		} else if (e.which == 13) {
			// enter key pressed
			if (self.highlightIndex < 0) {
				self.highlightIndex = 0;
			}
			self.setLocation(self.typeAheadResults[self.highlightIndex]);
		} else {
			self.highlightIndex = 0;
		}
	}
	
	self.setLocation = function(loc) {
		self.query = loc.name;
		locationFty.locationDetails = loc;
		centerMap(locationFty.map, loc.coords);
		zoomMap(locationFty.map, 10);
		replaceMapMarker(locationFty.map, loc.coords);
		self.showTypeAhead = false;
	}
	
	self.delayHideTypeAhead = function() {
		$timeout(function() {
			self.showTypeAhead = false;
		}, 100);
	}
	
	self.locationSearch = function(query) {
		if (query.length > 3) {
			console.log("search for " + query);
			locationFty.geocodeAddress(query, addressFound, addressNotFound);
		}
	}
	
	locationFty.map.addListener('click', function(e) {
		if (!throttle) {
			throttle = true;
			replaceMapMarker(locationFty.map, e.latLng);
			locationFty.geocodeLatLng(e.latLng, coordsFound, coordsUnknown);
			locationFty.openAddForecast();
			// limit map clicks to once a second
			$timeout(function() {
				throttle = false;
			}, 1000);
		}
	});
	
	// user chooses an arrival date in the date picker
	function updateStartDate() {
		// set start date
		self.startDate = dateFty.setCommonTime(pickStartDate.getDate());
		
		// find max date range
		var d = new Date(self.startDate);
		d.setDate(d.getDate() + dateFty.maxDateRange - 1);
		
		// restrict end (departure) date picker
		pickEndDate.setMinDate(self.startDate);
		pickEndDate.setMaxDate(d);
		
		// set end (departure) date if outside of restrictions
		if (pickEndDate.getDate() < self.startDate) {
			pickEndDate.setDate(self.startDate);
			self.endDate = dateFty.setCommonTime(new Date(self.startDate));
		} else if (pickEndDate.getDate() > d) {
			pickEndDate.setDate(d);
			self.endDate = dateFty.setCommonTime(new Date(d));
		}
		self.showStartDatePicker = false;
		$scope.$apply();
	}
	
	// user chooses a departure date in the date picker
	function updateEndDate() {
		self.endDate = dateFty.setCommonTime(pickEndDate.getDate());
		self.showEndDatePicker = false;
		$scope.$apply();
	}
	
	// set arrival date picker
	var pickStartDate = new Pikaday({
		field: document.getElementById('start-date'),
		bound: true,
		container: document.getElementById('pikaday-start'),
		format: 'MMM D, YYYY',
		defaultDate: dateFty.today,
		setDefaultDate: true,
		minDate: dateFty.today,
		maxDate: dateFty.maxDate,
		onSelect: updateStartDate,
		//onOpen: showDatePickerBg,
		//onClose: showDatePickerBg,
		//position: 'bottom left',
		//reposition: false
	});
	
	// find max date for departure
	var maxEndDate = dateFty.setCommonTime(new Date());
	maxEndDate.setDate(maxEndDate.getDate() + dateFty.maxDateRange - 1);
	
	// set departure date picker
	var pickEndDate = new Pikaday({
		field: document.getElementById('end-date'),
		bound: true,
		container: document.getElementById('pikaday-end'),
		format: 'MMM D, YYYY',
		defaultDate: dateFty.today,
		setDefaultDate: true,
		minDate: dateFty.today,
		maxDate: maxEndDate,
		onSelect: updateEndDate,
		//onOpen: showDatePickerBg,
		//onClose: showDatePickerBg,
		//position: 'bottom left',
		//reposition: false
	});
	
	var mainElement = document.getElementById("main");
	var mainElementHeight = mainElement.getBoundingClientRect().height;
	
	function scrollToBottom() {
		//console.log("scroll begin");
		mainElementHeight = mainElement.getBoundingClientRect().height;
		$timeout(function() {
			mainElement.scrollTop = mainElement.scrollTop + 30;
			if ((mainElement.scrollTop + mainElementHeight) < mainElement.scrollHeight) {
				//console.log("scroll recursive");
				scrollToBottom();
			} else {
				//console.log("scroll end");
				window.scrollTo(0, mainElement.scrollHeight);
			}
		}, 30);
	}
	
	self.attemptAddDestination = function(place, arrival, departure) {
		// if place exists
		if (place.coords != null) {
			// if dates are valid
			if (dateFty.validDate(arrival) &&
				dateFty.validDate(departure) &&
				dateFty.datesWithinDays(arrival, departure, dateFty.maxDateRange)
			) {
				// switch dates if departure is before arrival
				if (arrival > departure) {
					destinationFty.addDestination(place, departure, arrival);
					console.log("switched dates");
					//alertFty.displayMessage("Your dates were backwards, so I switched them for you.", "info");
				} else {
					destinationFty.addDestination(place, arrival, departure);
				}
				// get forecast for added destination
				forecastFty.attemptGetForecast(place.coords.lat, place.coords.lng, place.name);
				// if more than one destination
				if (destinationFty.destinationList.length > 1) {
					// pan to all destinations
					locationFty.map.setZoom(6);
					locationFty.map.panToBounds(locationFty.destinationBounds);
					// get estimated travel time between destinations
					distanceFty.getDistances(
						destinationFty.destinationList,
						function() {
							// apply changes because $apply does not run after ajax calls
							$scope.$apply();
						}
					);
				} else {
					// if this is the first destination added
					scrollToBottom();
				}
				// add destination to url by rebuilding it
				urlFty.buildUrlParamTrip(destinationFty.destinationList);
				//console.log("destination list", destinationFty.destinationList);
				console.log("date list", dateFty.dateList);
				urlFty.monetizeLinks();
			} else {
				alertFty.displayMessage("Your date range is invalid. Forecasts are limited to " + dateFty.maxDateRange + " days per destination.", "error");
			}
		} else {
			alertFty.displayMessage("That place doesn't exist.", "error");
		}
	}
	
	
}




















