function dateRangeCtrl(destinationFty, forecastFty, dateFty, urlFty) {
	
	var self = this;
	
	self.startDate = new Date(dateFty.today);
	
	self.endDate = new Date(dateFty.today);
	
	function updateStartDate(d) {
		self.startDate = dateFty.setCommonTime(d);
	}
	
	function updateEndDate(d) {
		self.endDate = dateFty.setCommonTime(d);
	}
	
	flatpickr('#start-date', {
		dateFormat: 'M j, Y',
		defaultDate: dateFty.today,
		minDate: dateFty.today,
		maxDate: dateFty.maxDate,
		onChange: updateStartDate
	});
	
	flatpickr('#end-date', {
		dateFormat: 'M j, Y',
		defaultDate: dateFty.today,
		minDate: dateFty.today,
		maxDate: dateFty.maxDate,
		onChange: updateEndDate
	});
	
	self.attemptAddDestination = function(place, arrival, departure) {
		if (place.coords.lat != null && 
			place.coords.lng != null
		) {
			if (dateFty.validDate(arrival) &&
				dateFty.validDate(departure)
			) {
				if (arrival > departure) {
					destinationFty.addDestination(place, departure, arrival);
					console.log("switched dates");
				} else {
					destinationFty.addDestination(place, arrival, departure);
				}
				forecastFty.attemptGetForecast(place.coords.lat, place.coords.lng, place.name);
				console.log("destination list", destinationFty.destinationList);
				console.log("date list", dateFty.dateList);
			} else {
				console.log("invalid dates");
			}
		} else {
			console.log("invalid location");
		}
	}
	
	self.clearDestinations = function(destList) {
		var len = destList.length;
		for (var i = 0; i < len; i++) {
			if (i == (len - 1)) {
				destinationFty.removeDestination(0, true);
			} else {
				destinationFty.removeDestination(0, false);
			}
		}
		urlFty.clearUrlParam();
		console.log("destination list", destinationFty.destinationList);
	}
	
}




















