function calendarCtrl(destinationFty, urlFty, locationFty, dateFty, forecastFty) {
	
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
	}
	
	self.clear = function() {
		destinationFty.clearDestinations();
		urlFty.clearUrlParamTrip();
		urlFty.buildUrlParamUnits(forecastFty.units);
	}
}