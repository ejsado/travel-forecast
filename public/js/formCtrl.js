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
		bound: false,
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
		bound: false,
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
					alertFty.displayMessage("Your dates were backwards, so I switched them for you.");
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
			} else {
				alertFty.displayMessage("Nah, those dates don't work for me. Try again.");
			}
		} else {
			alertFty.displayMessage("That place doesn't exist.");
		}
	}
	
	
}




















