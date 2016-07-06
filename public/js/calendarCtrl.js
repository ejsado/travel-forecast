function calendarCtrl($scope, destinationFty, urlFty, locationFty, dateFty, forecastFty, distanceFty) {
	
	var self = this;
	
	self.selectedDate = new Date(dateFty.today);
	
	self.setSelectedDate = function(date) {
		self.selectedDate = date;
	}
	
	self.removeSingleDestination = function(index) {
		destinationFty.removeDestination(index);
		dateFty.buildDateList(destinationFty.destinationList);
		urlFty.buildUrlParamTrip(destinationFty.destinationList);
		locationFty.buildMapMarkers(destinationFty.destinationList);
		if (destinationFty.destinationList.length > 1 && 
			index > 0 &&
			index < destinationFty.destinationList.length
		) {
			distanceFty.attemptGetDistance(
				destinationFty.destinationList[index - 1],
				destinationFty.destinationList[index],
				function() {
					$scope.$apply();
				}
			);
		}
	}
	
	self.clear = function() {
		destinationFty.clearDestinations();
		urlFty.clearUrlParamTrip();
		urlFty.buildUrlParamUnits(forecastFty.units);
	}
}