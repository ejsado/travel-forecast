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

function formCtrl($scope, destinationFty, forecastFty, dateFty, urlFty, distanceFty, alertFty) {
	
	var self = this;
	
	// set default dates
	
	self.startDate = new Date(dateFty.today);
	
	self.endDate = new Date(dateFty.today);
	
	// show or hide the date pickers
	
	self.showStartDatePicker = false;
	
	self.showEndDatePicker = false;
	
	// user chooses an arrival date in the date picker
	function updateStartDate() {
		// set start date
		self.startDate = dateFty.setCommonTime(pickStartDate.getDate());
		
		// find max date range
		var d = new Date(self.startDate);
		d.setDate(d.getDate() + dateFty.maxDateRange);
		
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
	maxEndDate.setDate(maxEndDate.getDate() + dateFty.maxDateRange);
	
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
	
	// user chose new units (F or C)
	self.unitsChanged = function() {
		urlFty.buildUrlParamUnits(forecastFty.units);
	};
	
	self.sortOptions = ["departure", "arrival", "name"];
	
	self.sortChanged = function() {
		urlFty.buildUrlParamSort(destinationFty.sortBy);
		destinationFty.destinationList.sort(destinationFty.destinationCompare);
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
					alertFty.displayMessage("Your dates were backwards, so I switched them for you.", "info");
				} else {
					destinationFty.addDestination(place, arrival, departure);
				}
				// get forecast for added destination
				forecastFty.attemptGetForecast(place.coords.lat, place.coords.lng, place.name);
				// if more than one destination
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
				// add destination to url by rebuilding it
				urlFty.buildUrlParamTrip(destinationFty.destinationList);
				console.log("destination list", destinationFty.destinationList);
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




















