function formCtrl($scope, destinationFty, forecastFty, dateFty, urlFty, distanceFty, alertFty) {
	
	var self = this;
	
	self.startDate = new Date(dateFty.today);
	
	self.endDate = new Date(dateFty.today);
	
	self.showDatePickerBg = false;
	
	function updateStartDate() {
		self.startDate = dateFty.setCommonTime(pickStartDate.getDate());
		
		var d = new Date(self.startDate);
		d.setDate(d.getDate() + dateFty.maxDateRange);
		
		pickEndDate.setMinDate(self.startDate);
		pickEndDate.setMaxDate(d);
		
		if (pickEndDate.getDate() < pickStartDate.getDate()) {
			pickEndDate.setDate(pickStartDate.getDate());
		} else if (pickEndDate.getDate() > d) {
			pickEndDate.setDate(d);
		}
	}
	
	function updateEndDate() {
		self.endDate = dateFty.setCommonTime(pickEndDate.getDate());
	}
	
	function showDatePickerBg() {
		self.showDatePickerBg = (pickStartDate.isVisible() || pickEndDate.isVisible());
		$scope.$apply();
	}
	
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
	
	var maxEndDate = dateFty.setCommonTime(new Date());
	maxEndDate.setDate(maxEndDate.getDate() + dateFty.maxDateRange);
	
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
		
	self.unitsChanged = function() {
		urlFty.buildUrlParamUnits(forecastFty.units);
	};
	
	self.attemptAddDestination = function(place, arrival, departure) {
		if (place.coords != null) {
			if (dateFty.validDate(arrival) &&
				dateFty.validDate(departure) &&
				dateFty.datesWithinDays(arrival, departure, dateFty.maxDateRange)
			) {
				if (arrival > departure) {
					destinationFty.addDestination(place, departure, arrival);
					console.log("switched dates");
					alertFty.displayMessage("Your dates were backwards, so I switched them for you.");
				} else {
					destinationFty.addDestination(place, arrival, departure);
				}
				forecastFty.attemptGetForecast(place.coords.lat, place.coords.lng, place.name);
				if (destinationFty.destinationList.length > 1) {
					distanceFty.attemptGetDistance(
						destinationFty.destinationList[destinationFty.destinationList.length - 2],
						destinationFty.destinationList[destinationFty.destinationList.length - 1],
						function() {
							$scope.$apply();
						}
					);
				}
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




















