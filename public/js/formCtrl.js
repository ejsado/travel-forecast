function formCtrl($scope, destinationFty, forecastFty, dateFty, urlFty, distanceFty, alertFty) {
	
	var self = this;
	
	// set default dates
	
	self.startDate = new Date(dateFty.today);
	
	self.endDate = new Date(dateFty.today);
	
	// show or hide the date picker background
	self.showDatePickerBg = false;
	
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
		if (pickEndDate.getDate() < pickStartDate.getDate()) {
			pickEndDate.setDate(pickStartDate.getDate());
		} else if (pickEndDate.getDate() > d) {
			pickEndDate.setDate(d);
		}
	}
	
	// user chooses a departure date in the date picker
	function updateEndDate() {
		self.endDate = dateFty.setCommonTime(pickEndDate.getDate());
	}
	
	// show the background if the user opens either date picker
	function showDatePickerBg() {
		self.showDatePickerBg = (pickStartDate.isVisible() || pickEndDate.isVisible());
		// must $apply because date pickers do not (non angular pickers)
		$scope.$apply();
	}
	
	// set arrival date picker
	var pickStartDate = new Pikaday({
		field: document.getElementById('start-date'),
		container: document.getElementById('pikaday-container'),
		format: 'MMM D, YYYY',
		defaultDate: dateFty.today,
		setDefaultDate: true,
		minDate: dateFty.today,
		maxDate: dateFty.maxDate,
		onSelect: updateStartDate,
		onOpen: showDatePickerBg,
		onClose: showDatePickerBg,
		position: 'bottom left',
		reposition: false
	});
	
	// find max date for departure
	var maxEndDate = dateFty.setCommonTime(new Date());
	maxEndDate.setDate(maxEndDate.getDate() + dateFty.maxDateRange);
	
	// set departure date picker
	var pickEndDate = new Pikaday({
		field: document.getElementById('end-date'),
		container: document.getElementById('pikaday-container'),
		format: 'MMM D, YYYY',
		defaultDate: dateFty.today,
		setDefaultDate: true,
		minDate: dateFty.today,
		maxDate: maxEndDate,
		onSelect: updateEndDate,
		onOpen: showDatePickerBg,
		onClose: showDatePickerBg,
		position: 'bottom left',
		reposition: false
	});
	
	// user chose new units (F or C)
	self.unitsChanged = function() {
		urlFty.buildUrlParamUnits(forecastFty.units);
	};
	
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
					var destIndex = destinationFty.getDestinationIndexByName(place.name);
					// if destination wasn't added at the end
					if (destIndex < (destinationFty.destinationList.length - 1)) {
						// get travel estimation from new destination to next one
						distanceFty.attemptGetDistance(
							destinationFty.destinationList[destIndex],
							destinationFty.destinationList[destIndex + 1],
							function() {
								$scope.$apply();
							}
						);
					}
					// if destination wasn't added at the beginning
					if (destIndex > 0) {
						// get travel estimation from previous destination to new destination
						distanceFty.attemptGetDistance(
							destinationFty.destinationList[destIndex - 1],
							destinationFty.destinationList[destIndex],
							function() {
								$scope.$apply();
							}
						);
					}
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




















