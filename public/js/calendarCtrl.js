function calendarCtrl($scope, destinationFty, urlFty, locationFty, dateFty, forecastFty, distanceFty) {
	
	var self = this;
	
	// show the weather description of this date for each destination
	self.selectedDate = new Date(dateFty.today);
	
	self.setSelectedDate = function(date) {
		self.selectedDate = date;
	}
	
	self.removeSingleDestination = function(index) {
		destinationFty.removeDestination(index);
		dateFty.buildDateList(destinationFty.destinationList);
		urlFty.buildUrlParamTrip(destinationFty.destinationList);
		locationFty.buildMapMarkers(destinationFty.destinationList);
		// if destination was removed from the middle of the list
		if (destinationFty.destinationList.length > 1 && 
			index > 0 &&
			index < destinationFty.destinationList.length
		) {
			// get new travel time estimation
			distanceFty.attemptGetDistance(
				destinationFty.destinationList[index - 1],
				destinationFty.destinationList[index],
				function() {
					$scope.$apply();
				}
			);
		}
	}
	
	// remove all destinations
	self.clear = function() {
		destinationFty.clearDestinations();
		urlFty.clearUrlParamTrip();
		urlFty.buildUrlParamUnits(forecastFty.units);
	}
}