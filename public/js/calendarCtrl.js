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

function calendarCtrl($scope, $anchorScroll, $filter, destinationFty, urlFty, locationFty, dateFty, forecastFty, distanceFty, alertFty) {
	
	var self = this;
	
	// user chose new units (F or C)
	self.unitsChanged = function() {
		urlFty.buildUrlParamUnits(forecastFty.units);
	};
	
	self.sortOptions = ["departure", "arrival", "name"];
	
	self.sortChanged = function() {
		urlFty.buildUrlParamSort(destinationFty.sortBy);
		destinationFty.destinationList.sort(destinationFty.destinationCompare);
		locationFty.drawOnMap(destinationFty.destinationList);
	}
	
	self.calendarView = urlFty.getUrlView();
	
	urlFty.buildUrlParamView(self.calendarView);
	
	self.viewOptions = ["timeline", "stack"];
	
	self.viewChanged = function() {
		urlFty.buildUrlParamView(self.calendarView);
	}
	
	self.newMonth = function(dest, index) {
		if (index == 0) {
			return true;
		}
		if (dest.dates[index - 1].getMonth() != dest.dates[index].getMonth()) {
			return true;
		}
		return false;
	}
	
	// show the weather description of this date for each destination
	self.selectedDate = new Date(dateFty.today);
	
	self.setSelectedDate = function(date) {
		self.selectedDate = date;
	}
	
	self.selectDestination = function(index) {
		locationFty.locationDetails.name = destinationFty.destinationList[index].name;
		locationFty.locationDetails.coords = destinationFty.destinationList[index].coords;
		locationFty.openAddForecast();
		$anchorScroll('form-top');
	}
	
	self.removeDate = function(dateToRemove, destName) {
		// remove date
		destinationFty.removeDateFromDestination(dateToRemove, destName);
		// rebuild url
		urlFty.buildUrlParamTrip(destinationFty.destinationList);
	}
	
	self.showAlerts = function(destName, dateStr) {
		var forecastAlerts = forecastFty.forecastList[destName][dateStr].alerts;
		var alertContent = [];
		for (var i = 0; i < forecastAlerts.length; i++) {
			var alertText = {
				title: forecastAlerts[i].title,
				text: [
					forecastAlerts[i].description,
					"<strong>Begins:</strong> " + $filter('date')(new Date(forecastAlerts[i].time * 1000), 'MMMM d, yyyy h:mm a'),
					"<strong>Expires:</strong> " + $filter('date')(new Date(forecastAlerts[i].expires * 1000), 'MMMM d, yyyy h:mm a')
				]
			};
			alertContent.push(alertText);
		}
		var weatherAlertModal = {
			buttonText: "Got it",
			content: alertContent
		};
		alertFty.displayModal(alertFty.trustDialogText(weatherAlertModal));
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























