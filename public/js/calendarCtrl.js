function calendarCtrl($scope, destinationFty, urlFty, locationFty, dateFty, forecastFty, distanceFty, alertFty) {
	
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
		urlFty.buildUrlParamUnits(forecastFty.units);
		urlFty.buildUrlParamSort(destinationFty.sortBy);
		locationFty.drawOnMap(destinationFty.destinationList);
		alertFty.displayMessage("Destination removed. Hit your browser's back button to undo.", "warning");
	}
}