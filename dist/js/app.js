/** !save
* 
* @source:https://github.com/ejsado/travel-forecast/blob/master/dist/js/app.js
*
* Travel Weather - build a weather forecast calendar
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

function alertFty($sce, $timeout, dateFty) {
	
	var factory = {
		
		// message to display near "Get Forecast" button
		
		showMessage: false,
		
		messageContent: '',
		
		messageCssClass: '',
		
		displayMessage: function(mContent, mClass) {
			factory.messageCssClass = mClass || '';
			$timeout.cancel(factory.messageTimer);
			// set message to "Nope" if no message is set
			mContent = mContent || 'Nope.';
			factory.messageContent = mContent;
			factory.showMessage = true;
			// hide message after 9 seconds
			factory.messageTimer = $timeout(factory.hideMessage, 8000);
		},
		
		hideMessage: function() {
			factory.showMessage = false;
			//factory.messageContent = 'Nope.';
		},
		
		messageTimer: null,
		
		// modal display
		
		showModal: false,
		
		modalContent: {},
		
		// predefined modal messages
		
		defaultModal: {
			buttonText: 'Cool',
			content: [
				{
					title: 'Error?',
					text: [
						'Something went wrong.'
					]
				}
			]
		},
		
		invalidUrlModal: {
			buttonText: 'Fine',
			content: [
				{
					title: 'Invalid URL',
					text: [
						"Your URL parameters are invalid. I'm ignoring them.",
						"The URL must be a specific format, and if I can't read it, I can't load it."
					]
				}
			]
		},
		
		destinationsMergedModal: {
			buttonText: 'Lame',
			content: [
				{
					title: 'Destinations Merged',
					text: [
						"I merged some of your destinations because they were too close.",
						"This is because some of your latitude/longitude coordinates were in the same area geographically."
					]
				}
			]
		},
		
		destinationsNotFoundModal: {
			buttonText: 'Fine',
			content: [
				{
					title: 'Destinations Skipped',
					text: [
						"I skipped some of your destinations because I couldn't find them.",
						"This could be an issue with incorrect latitude/longtude coordinates or Google'e location service might be down."
					]
				}
			]
		},
		
		tooManyDestinationsModal: {
			buttonText: 'Fine',
			content: [
				{
					title: 'Too Many Destinations',
					text: [
						"Unfortunately, I can't show more than 10 destinations at a time, so I only loaded the first 10."
					]
				}
			]
		},
		
		dateRangeInvalidModal: {
			buttonText: 'Fine',
			content: [
				{
					title: 'Date Ranges Invalid',
					text: [
						"Some of your date ranges were invalid, so I skipped them.",
						"Forecasts are limited to " + dateFty.maxDateRange + " days per destination. Dates must be within 5 years in the past or future."
					]
				}
			]
		},
		
		aboutModal: {
			buttonText: 'Ok, whatever',
			content: [
				{
					title: 'What is this?',
					text: [
						"Travel Weather allows you to build a weather forecast calendar for multiple vacation destinations with varied arrivals and departures.",
						"Create a trip by adding destinations with arrival and departure dates, then bookmark the link or share it with the people you'll be travelling with. Every time you visit the link, your freshly updated forecast will be shown.",
						"Each day in your forecast calendar will show the expected high temperature (&uarr;), low temperature (&darr;), and chance of rain (&becaus;).",
						"* Note that weather predictions beyond 7 days from today are a best guess based on historical data and will not show an accurate chance of rain."
					]
				},
				{
					title: 'Who provides the data?',
					text: [
						'&bull; <a href="https://developer.forecast.io/">Dark Sky</a> provides the weather data',
						'&bull; <a href="https://developers.google.com/maps/">Google</a> provides the map and location data',
						'&bull; <a href="https://www.wunderground.com/?apiref=98798f3caba1662f">Weather Underground</a> provides the precipitation radar which is overlayed on the map',
						'* Note that radar is only available for North America, Europe, and Australia'
					]
				},
				{
					title: 'Which browsers are supported?',
					text: [
						'Uhhhhh, the latest ones?',
						"Look, I'm only one man and there are so many browser configurations. I developed this whole thing in Chrome on Windows 10, so you can expect it to work fine there. I also did some basic testing with the other popular browsers (Firefox, IE 10+, Chrome for Android) and they seem to work..."
					]
				},
				/* {
					title: 'How can I support your projects?',
					text: [
						'Disable adblock. Just kidding, no one actually does that do they?',
						'If you purchase anything from <a href="http://www.jdoqocy.com/click-8108989-10954362-1445347180000">Backcountry</a> or book anything through <a href="http://www.jdoqocy.com/click-8108989-10592070-1466085945000">Priceline</a> via my affiliate links, I get some of the profit.'
					]
				}, */
				{
					title: 'What else you got?',
					text: [
						'You can find my other projects on <a href="http://www.ericsadowski.com/">ericsadowski.com</a>. Or you can take a look at <a href="http://codepen.io/ejsado/">my codepen profile</a> for my code demos.'
					]
				}
			]
		},
		
		// convert text to trusted html
		
		trustDialogText: function(mContent) {
			mContent = mContent || factory.defaultModal;
			for (var i = 0; i < mContent.content.length; i++) {
				for (var n = 0; n < mContent.content[i].text.length; n++) {
					mContent.content[i].text[n] = $sce.trustAsHtml(mContent.content[i].text[n]);
				}
			}
			return mContent;
		},
		
		hideModal: function() {
			factory.showModal = false;
			//factory.modalContent = factory.defaultModal;
		},
		
		displayModal: function(mContent) {
			mContent = mContent || factory.defaultModal;
			factory.modalContent = mContent;
			factory.showModal = true;
		}
		
	}
	
	// need to convert all predefined messages once
	
	factory.trustDialogText(factory.defaultModal);
	factory.trustDialogText(factory.invalidUrlModal);
	factory.trustDialogText(factory.destinationsMergedModal);
	factory.trustDialogText(factory.destinationsNotFoundModal);
	factory.trustDialogText(factory.dateRangeInvalidModal);
	factory.trustDialogText(factory.aboutModal);
	
	factory.modalContent = factory.defaultModal;
	
	
	return factory;
	
}
/**
* Travel Weather - build a weather forecast calendar
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

function appCtrl($timeout, $scope, locationFty, destinationFty, forecastFty, dateFty, urlFty, distanceFty, alertFty) {
	
	angular.element(document).ready(function () {
		// run this function once, only when loaded
		document.getElementById('loading-mask').style.display = "none";
		console.log("doc ready");
	});
	
	var self = this;
	
	// add factories to scope so they can be accessed in the html
	
	self.locationFty = locationFty;
	
	self.destinationFty = destinationFty;
	
	self.forecastFty = forecastFty;
	
	self.dateFty = dateFty;
	
	self.urlFty = urlFty;
	
	self.distanceFty = distanceFty;
	
	self.alertFty = alertFty;
	
	// select input text on click
	self.highlightInput = function(e) {
		e.target.select();
	}
	
	// used when the logo is clicked
	self.resetPage = function() {
		if (destinationFty.destinationList.length > 0) {
			self.clear();
		} else {
			locationFty.openAddForecast();
		}
	}
	
	// remove all destinations
	self.clear = function() {
		destinationFty.clearDestinations();
		urlFty.clearUrlParamTrip();
		urlFty.buildUrlParamUnits(forecastFty.units);
		urlFty.buildUrlParamSort(destinationFty.sortBy);
		alertFty.displayMessage("All destinations removed. Hit your browser's back button to undo.", "warning");
		locationFty.openAddForecast();
	}
	
	// load destinations from url
	getDataFromUrl();
	
	function getDataFromUrl() {
		
		forecastFty.units = urlFty.getUrlUnits();
		
		destinationFty.sortBy = urlFty.getUrlSort();
		
		var urlDestinations = [];
	
		if (urlFty.validUrlParamTrip()) {
			urlDestinations = urlFty.getUrlDestinations();
		} else {
			console.log("invalid url");
			alertFty.displayModal(alertFty.invalidUrlModal);
		}
		
		if (urlDestinations.length > 0) {
			destinationFty.loadingDestinations = true;
		} else {
			urlFty.buildUrlParamUnits(forecastFty.units);
			urlFty.buildUrlParamSort(destinationFty.sortBy);
		}
		
		// 1 sec delay between loading destinations
		var timeDelay = 1000;
		
		destinationFty.clearDestinations();
		
		// error flags
		
		var destinationsNotFound = false;
		
		var dateRangeInvalid = false;
		
		var tooManyDestinations = false;
		
		function delayLoadDestination(latLng, dateRangeList, delay, count) {
			$timeout(function() {
				// find coordinates
				locationFty.geocodeLatLng(latLng, function(result) {
					console.log("coords found");
					// iterate through date ranges
					for (var n = 0; n < dateRangeList.length; n++) {
						// if dates are valid
						if (dateFty.validDate(dateRangeList[n].arrival) &&
							dateFty.validDate(dateRangeList[n].departure) &&
							dateFty.datesWithinDays(dateRangeList[n].arrival, dateRangeList[n].departure, dateFty.maxDateRange)
						) {
							// switch dates if departure is before arrival
							// add the destination with the date range
							if (dateRangeList[n].arrival > dateRangeList[n].departure) {
								destinationFty.addDestination(
									result,
									dateRangeList[n].departure,
									dateRangeList[n].arrival
								);
							} else {
								destinationFty.addDestination(
									result,
									dateRangeList[n].arrival,
									dateRangeList[n].departure
								);
							}
						} else {
							console.log("destination date range invalid");
							dateRangeInvalid = true;
						}
					}
					// get forecast for added destination
					forecastFty.attemptGetForecast(result.coords.lat, result.coords.lng, result.name);
					// if done adding destinations
					if (count == urlDestinations.length || count >= 10) {
						// enable buttons
						destinationFty.loadingDestinations = false;
						console.log("done loading destinations");
						// show errors, if any
						if (destinationsNotFound) {
							alertFty.displayModal(alertFty.destinationsNotFoundModal);
						} else if (dateRangeInvalid) {
							alertFty.displayModal(alertFty.dateRangeInvalidModal);
						} else if (tooManyDestinations) {
							alertFty.displayModal(alertFty.tooManyDestinationsModal);
						} else if (count != destinationFty.destinationList.length) {
							alertFty.displayModal(alertFty.destinationsMergedModal);
						}
						// rebuild url
						urlFty.buildUrlParamTrip(destinationFty.destinationList);
						// if more than 1 destination
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
						// make affiliate links
						/* $timeout(urlFty.monetizeLinks, 500); */
						locationFty.map.setZoom(6);
						locationFty.map.panToBounds(locationFty.destinationBounds);
					}
				}, function(result) {
					console.log("coords unknown, skipping location");
					destinationsNotFound = true;
				});
			}, delay);
		}		
		// for each destination in url
		for (var i = 0; i < urlDestinations.length; i++) {
			if (i >= 10) {
				tooManyDestinations = true;
				break;
			}
			var latLng = new google.maps.LatLng({
				lat: urlDestinations[i].coords.lat,
				lng: urlDestinations[i].coords.lng
			});
			// delay loading destinations to reduce server load
			delayLoadDestination(latLng, urlDestinations[i].dateRanges, timeDelay * i, i + 1);
		}
		// if at least one destination
		if (urlDestinations.length >= 1) {
			// center the map on the first destination
			locationFty.map.panTo(new google.maps.LatLng({
				lat: urlDestinations[urlDestinations.length - 1].coords.lat,
				lng: urlDestinations[urlDestinations.length - 1].coords.lng
			}));
			// minimize the Add Forecast controls
			locationFty.closeAddForecast();
		}
	}
	
	// listen for url changes
	$scope.$on('$locationChangeSuccess', function(event, url) {
		console.log("url param changed");
		if (!urlFty.paramsUpdated) {
			// url not changed by this program
			console.log("external url change");
			getDataFromUrl();
		}
		// get short url
		urlFty.buildShortUrl();
		// reset param flag
		urlFty.paramsUpdated = false;
	});
	
}





















/**
* Travel Weather - build a weather forecast calendar
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
























/**
* Travel Weather - build a weather forecast calendar
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

function dateFty($filter) {
	
	var factory = {
		
		dateList: [
			/* [
				consecutive date,
				consecutive date
			],
			[
				consecutive date,
				consecutive date
			] */
		],
		
		// set common time for date comparison
		setCommonTime: function(d) {
			var dateObj = new Date(d);
			dateObj.setHours(6);
			dateObj.setMinutes(0);
			dateObj.setSeconds(0);
			dateObj.setMilliseconds(0);
			return dateObj;
		},
		
		// common times are set below
		today: new Date(),
		maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
		minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
		
		// max consecutive days per destination
		maxDateRange: 30,
		
		datesEqual: function(date1, date2) {
			return Math.abs(date1.getTime() - date2.getTime()) < 1000*60*60*8; // within 8 hours
		},
		
		// check if both dates have a maximum number of days between them
		datesWithinDays: function(date1, date2, days) {
			return Math.abs(date1.getTime() - date2.getTime()) < (1000*60*60*24*days);// + 1000*60*60*8); // within number of days of each other
		},
		
		validDate: function(d) {
			if (d == null) {
				return false;
			}
			if (d < factory.maxDate && d > factory.minDate) {
				return true;
			}
			return false;
		},
		
		// create a compressed date string
		createDateString: function(dateObj) {
			return $filter('date')(dateObj, 'MMddyy');
		},
		
		createPricelineDateString: function(dateObj) {
			return $filter('date')(dateObj, 'yyyyMMdd');
		},
		
		// expand a compresssed date string
		createDateFromString: function(dateStr) {
			if (dateStr.length == 6) {
				var d = new Date();
				var year = Number(dateStr.substr(4,2)) + 2000;
				var month = Number(dateStr.substr(0,2)) - 1;
				var day = Number(dateStr.substr(2,2));
				d.setFullYear(year, month, day);
				d = factory.setCommonTime(d);
				return d;
			}
			return null;
		},
		
		buildDateList: function(destinationList) {
			var newDateList = [];
			for (var i = 0; i < destinationList.length; i++) {
				newDateList.push.apply(newDateList, destinationList[i].dates);
			}
			newDateList = factory.removeDuplicateDates(newDateList);
			newDateList.sort(factory.dateCompare);
			factory.dateList = factory.groupDates(newDateList);
			console.log("date list", factory.dateList);
		},
		
		// combine consecutive dates in month into an array of arrays
		groupDates: function(dList) {
			var groupedDates = [[]];
			groupedDates[0].push(dList[0]);
			var n = 0;
			for (var i = 1; i < dList.length; i++) {
				if (factory.consecutiveDatesInMonth(dList[i-1], dList[i])) {
					groupedDates[n].push(dList[i]);
				} else {
					n++;
					groupedDates[n] = [];
					groupedDates[n].push(dList[i]);
				}
			}
			return groupedDates;
		},
		
		// find date ranges with a list of dates
		createDateRanges: function(dList) {
			var dateRanges = [];
			var arrive = dList[0];
			var depart = dList[dList.length - 1];
			for (var i = 1; i < dList.length; i++) {
				if (!factory.consecutiveDates(dList[i-1], dList[i])) {
					dateRanges.push({
						arrival: arrive,
						departure: dList[i-1]
					});
					arrive = dList[i];
				}
			}
			dateRanges.push({
				arrival: arrive,
				departure: depart
			});
			return dateRanges;
		},
		
		dateInArray: function(d, array) {
			for (var i = 0; i < array.length; i++) {
				if (factory.datesEqual(d, array[i])) {
					return true;
				}
			}
			return false;
		},
		
		dateInArrayIndex: function(d, array) {
			for (var i = 0; i < array.length; i++) {
				if (factory.datesEqual(d, array[i])) {
					return i;
				}
			}
			return false;
		},
		
		// expand a date range to an array of all consecutive dates
		enumerateDateRange: function(start, end) {
			var enumDates = [];
			for (var d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
				enumDates.push(new Date(d));
			}
			// iterating through dates is not perfect, add the end date if it wasn't added already
			if (!factory.dateInArray(end, enumDates)) {
				enumDates.push(new Date(end));
			}
			
			return enumDates;
		},
		
		// comparitor function for array filter
		dateDuplicate: function(item, index, array) {
			for (var i = index + 1; i < array.length; i++) {
				if (factory.datesEqual(item, array[i])) {
					//console.log("duplicate", item);
					return false;
				}
			}
			return true;
		},
		
		removeDuplicateDates: function(dateArray) {
			return dateArray.filter(factory.dateDuplicate);
		},
		
		// comparitor for sorting
		dateCompare: function(a, b) {
			return a.getTime() - b.getTime();
		},
		
		// date 2 is immediately after date 1
		consecutiveDates: function(date1, date2) {
			var d = new Date(date1);
			d.setDate(d.getDate() + 1);
			if (factory.datesEqual(d, date2)) {
				return true;
			}
			return false;
		},
		
		// date 2 is in the same month as date 1
		consecutiveDatesInMonth: function(date1, date2) {
			if (date1.getMonth() == date2.getMonth() && date1.getDate() < date2.getDate()) {
				return true;
			}
			return false;
		},
		
		// compare two date lists, return exclusive dates
		crossReferenceDates: function(destinationDates, destinationForecast) {
			var forecastDates = [];
			for (var item in destinationForecast) {
				forecastDates.push(factory.createDateFromString(item));
			}
			var remainingDates = [];
			for (var i = 0; i < destinationDates.length; i++) {
				if (!factory.dateInArray(destinationDates[i], forecastDates)) {
					remainingDates.push(new Date(destinationDates[i]));
				}
			}
			return remainingDates;
		}
	
	};
	
	factory.today = factory.setCommonTime(factory.today);
	
	factory.maxDate = factory.setCommonTime(factory.maxDate);
	
	return factory;
}































/**
* Travel Weather - build a weather forecast calendar
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

function destinationFty(dateFty, urlFty, locationFty, alertFty) {
	
	var factory = {
		
		destinationList: [
			/* {
				name: "Place",
				coords: {
					lat: 123,
					lng: 123
				},
				dates: [
					date,
					date,
					date
				]
				dateRanges: [
					{
						arrival: date,
						departure: date
					}
				]
			} */
		],
		
		sortBy: "departure",
		
		// flag to disable buttons while destinations are loading
		loadingDestinations: false,
		
		addDestination: function(place, arrival, departure) {
			var destAdded = false;
			// iterate through destination list
			for (var i = 0; i < factory.destinationList.length; i++) {
				// if destination exists
				if (place.name == factory.destinationList[i].name) {
					console.log("destination exists");
					// make new date list
					var newDateList = dateFty.enumerateDateRange(arrival, departure);
					// add dates from destination
					Array.prototype.push.apply(newDateList, factory.destinationList[i].dates);
					// remove duplicate dates
					newDateList = dateFty.removeDuplicateDates(newDateList);
					// if date list too large
					if (newDateList.length > dateFty.maxDateRange) {
						console.log("destination date count greater than max days");
						// show message
						if (!factory.loadingDestinations) {
							alertFty.displayMessage("Forecasts are limited to " + dateFty.maxDateRange + " days per destination. You have " + (dateFty.maxDateRange - factory.destinationList[i].dates.length) + " day(s) left here.", "error");
						}
						return destAdded;
					} else {
						// replace date list
						factory.destinationList[i].dates = newDateList;
						// sort dates
						factory.destinationList[i].dates.sort(dateFty.dateCompare);
						// rebuild date ranges
						factory.destinationList[i].dateRanges = dateFty.createDateRanges(factory.destinationList[i].dates);
						destAdded = true;
						if (!factory.loadingDestinations) {
							alertFty.displayMessage("I merged the dates for this destination.", "info");
						}
					}
				}
			}
			// if too many destinations
			if (factory.destinationList.length >= 10) {
				console.log("maximum destinations reached");
				if (!factory.loadingDestinations) {
					alertFty.displayMessage("Maximum of 10 destinations. Remove a destination to add this one.", "error");
				}
				return destAdded;
			}
			// if destination was not added yet
			if (!destAdded) {
				// add new destination
				factory.destinationList.push({
					name: place.name,
					coords: place.coords,
					dates: dateFty.enumerateDateRange(arrival, departure),
					dateRanges: [{
						arrival: arrival,
						departure: departure
					}]
				});
				console.log("new destination added");
				if (!factory.loadingDestinations) {
					alertFty.displayMessage("New destination added!", "success");
				}
				destAdded = true;
			}
			// sort destinations
			factory.destinationList.sort(factory.destinationCompare);
			// update map markers
			locationFty.drawOnMap(factory.destinationList);
			// rebuild date list
			dateFty.buildDateList(factory.destinationList);
			// return if the destination was successfully added
			console.log("destination list", factory.destinationList);
			return destAdded;
		},
		
		removeDateFromDestination: function(dateToRemove, destinationName) {
			// iterate through destination list
			for (var i = 0; i < factory.destinationList.length; i++) {
				// if destination exists
				if (destinationName == factory.destinationList[i].name) {
					// remove date at index
					factory.destinationList[i].dates.splice(dateFty.dateInArrayIndex(dateToRemove, factory.destinationList[i].dates), 1);
					if (factory.destinationList[i].dates.length == 0) {
						// remove destination if all dates are removed
						factory.removeDestination(i, false);
						alertFty.displayMessage("Destination removed because there were no dates left. Hit your browser's back button to undo.", "warning");
					} else {
						// rebuild date ranges
						factory.destinationList[i].dateRanges = dateFty.createDateRanges(factory.destinationList[i].dates);
						alertFty.displayMessage("Date removed. Hit your browser's back button to undo.", "warning");
						console.log("destination date removed", factory.destinationList);
					}
					// sort destinations
					factory.destinationList.sort(factory.destinationCompare);
					// update map markers
					locationFty.drawOnMap(factory.destinationList);
					// rebuild date list
					dateFty.buildDateList(factory.destinationList);
				}
			}
		},
		
		removeDestination: function(indexToRemove, rebuild) {
			factory.destinationList.splice(indexToRemove, 1);
			if (rebuild) {
				// resort
				factory.destinationList.sort(factory.destinationCompare);
				locationFty.drawOnMap(factory.destinationList);
				dateFty.buildDateList(factory.destinationList);
			}
		},
		
		getDestinationByName: function(name) {
			for (var i = 0; i < factory.destinationList.length; i++) {
				if (name == factory.destinationList[i].name) {
					return factory.destinationList[i];
				}
			}
			return null;
		},
		
		getDestinationIndexByName: function(name) {
			for (var i = 0; i < factory.destinationList.length; i++) {
				if (name == factory.destinationList[i].name) {
					return i;
				}
			}
			return null;
		},
		
		// compare destinations for sorting
		destinationCompare: function(a, b) {
			if (factory.sortBy == "arrival") {
				return a.dates[0].getTime() - b.dates[0].getTime();
			} else if (factory.sortBy == "name") {
				var nameA = a.name.toUpperCase(); // ignore upper and lowercase
				var nameB = b.name.toUpperCase(); // ignore upper and lowercase
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				// names must be equal
				return 0;
			} else {
				// sort by destination
				return a.dates[a.dates.length - 1].getTime() - b.dates[b.dates.length - 1].getTime();
			}
		},
		
		// remove all destinations
		clearDestinations: function() {
			var len = factory.destinationList.length;
			for (var i = 0; i < len; i++) {
				if (i == (len - 1)) {
					factory.removeDestination(0, true);
				} else {
					factory.removeDestination(0, false);
				}
			}
			console.log("destination list", factory.destinationList);
		}
		
	}
	
	return factory;
	
}





















/**
* Travel Weather - build a weather forecast calendar
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

function distanceFty() {
	
	var factory = {
		
		// save travel estimations for each destination pair
		distanceList: {},
		
		distanceMatrix: new google.maps.DistanceMatrixService(),
		
		getDistances: function(destinationList, callback) {
			var destinations = [];
			for (var i = 0; i < destinationList.length; i++) {
				destinations.push(new google.maps.LatLng(destinationList[i].coords.lat, destinationList[i].coords.lng));
			}
			factory.distanceMatrix.getDistanceMatrix({
				origins: destinations,
				destinations: destinations,
				travelMode: google.maps.TravelMode.DRIVING,
				unitSystem: google.maps.UnitSystem.IMPERIAL
			}, function(response, status) {
				factory.processDistanceMatrix(response, status, destinationList);
				callback();
			});
		},
		
		processDistanceMatrix: function(response, status, destinationList) {
			if (status == google.maps.DistanceMatrixStatus.OK) {
				var origins = response.originAddresses;
				for (var i = 0; i < origins.length; i++) {
					factory.distanceList[destinationList[i].name] = {};
					var results = response.rows[i].elements;
					for (var n = 0; n < results.length; n++) {
						if (results[n].status == google.maps.DistanceMatrixStatus.OK) {
							factory.distanceList[destinationList[i].name][destinationList[n].name] = {
								distance: results[n].distance,
								duration: results[n].duration
							};
							//factory.distanceList[destinationList[i].name][destinationList[n].name].duration.text += " driving";
						} else {
							factory.distanceList[destinationList[i].name][destinationList[n].name] = {
								distance: {
									text: "unknown distance",
									value: 0
								},
								duration: {
									text: "unknown duration",
									value: 0
								}
							};
						}
					}
				}
				console.log("distance matrix results", response);
			} else {
				console.log("distance matrix failed");
			}
		}
		
	};
	
	return factory;
	
}
/**
* Travel Weather - build a weather forecast calendar
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

function forecastFty($http, $timeout, dateFty, destinationFty) {
	
	var factory = {
		
		// save forecast for each destination
		forecastList: {},
		
		units: 'imperial',
		
		convertDegrees: function(degrees) {
			if (degrees != null && degrees != undefined) {
				if (factory.units == 'metric') {
					return Math.round((degrees - 32) * (5 / 9));
				} else {
					return degrees;
				}
			}
		},
		
		// not used
		getHttpForecast: function(url, data, successFn, failureFn) {
			console.log("http forecast", url);
			$http.get(url).then(function (response) {
				successFn(response, data);
			}, function(response) {
				failureFn(response, data);
			});
		},
		
		// get forecast from php script
		getPhpForecast: function(url, data, successFn, failureFn) {
			console.log("php forecast");
			$http({
				method: 'POST',
				url: url,
				data: data,
				// need to transform the data to a string for php to accept it
				transformRequest: function(obj) {
					var str = [];
					for (var p in obj) {
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					}
					return str.join("&");
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function (response) {
				successFn(response, data);
			}, function(response) {
				failureFn(response, data);
			});
		},
		
		// make call to dark sky script
		darkSkyForecast: function(data) {
			factory.getPhpForecast(
				'/scripts/darkSkyWeather.php', 
				data,
				function(response, data) {
					console.log("dark sky response", response);
					factory.forecastList[data.name] = factory.processDarkSkyForecast(response);
					console.log("forecastList", factory.forecastList);
					var dest = destinationFty.getDestinationByName(data.name);
					if (dest != null) {
						factory.getExtendedForecast(
							data, 
							dateFty.crossReferenceDates(
								dest.dates, 
								factory.forecastList[data.name]
							)
						);
					}
				},
				function(response, data) {
					console.log("Dark Sky forecast response failed");
					factory.forecastList[data.name] = null;
				}
			);
		},
		
		attemptGetForecast: function(lat, lng, name) {
			if (factory.forecastList[name] == null) {
				factory.darkSkyForecast({
					lat: lat,
					lng: lng,
					name: name
				});
				/* factory.getHttpForecast(
					'http://forecast.weather.gov/MapClick.php?lat=' + lat + '&lon=' + lng + '&FcstType=json', 
					{
						lat: lat,
						lng: lng,
						name: name
					},
					function(response, data) {
						console.log(response);
						if (response.data.success != false) {
							factory.forecastList[data.name] = factory.processNoaaForecast(response);
							console.log("forecastList", factory.forecastList);
							factory.getExtendedForecast(
								data, 
								dateFty.crossReferenceDates(
									destinationFty.getDestinationByName(data.name).dates, 
									factory.forecastList[data.name]
								)
							);
						} else {
							factory.darkSkyForecast(data);
						}
					},					
					function(response, data) {
						console.log("NOAA response failed");
						factory.darkSkyForecast(data);
					}
				); */
			} else {
				console.log("forecast exists");
				var dest = destinationFty.getDestinationByName(name);
				// if destination forecast exists
				if (dest != null) {
					// get forecast for remaining days
					factory.getExtendedForecast(
						{
							lat: lat,
							lng: lng,
							name: name
						}, 
						dateFty.crossReferenceDates(
							dest.dates, 
							factory.forecastList[name]
						)
					);
				}
			}
		},
		
		// make time machine call to dark sky forecast
		getExtendedForecast: function(data, dateList) {
			var timeDelay = 500;
			function delayRequest(date, delay) {
				$timeout(function() {
					factory.getPhpForecast(
						'/scripts/darkSkyWeather.php', 
						{
							lat: data.lat,
							lng: data.lng,
							name: data.name,
							date: Math.round(date.getTime() / 1000)
						},
						function(response, data) {
							console.log(response);
							factory.forecastList[data.name][dateFty.createDateString(date)] = factory.processDarkSkyTimeMachine(response);
							console.log("forecastList", factory.forecastList);
						},
						function(response, data) {
							console.log("Dark Sky time machine response failed");
						}
					);
				}, delay);
			}
			for (var i = 0; i < dateList.length; i++) {
				delayRequest(dateList[i], timeDelay * (i + 1));
			}
			return timeDelay * dateList.length;
		},
		
		/* processNoaaForecast: function(response) {
			var forecast = {};
			for (var i = 0; i < response.data.time.startValidTime.length; i++) {
				var dateStr = dateFty.createDateString(new Date(response.data.time.startValidTime[i]));
				forecast[dateStr] = forecast[dateStr] || {};
				if (response.data.time.tempLabel[i] == "High") {
					forecast[dateStr].high = response.data.data.temperature[i];
					forecast[dateStr].precip = response.data.data.pop[i];
					forecast[dateStr].text = response.data.data.weather[i];
				} else if (response.data.time.tempLabel[i] == "Low") {
					forecast[dateStr].low = response.data.data.temperature[i];
					forecast[dateStr].text = forecast[dateStr].text || response.data.data.weather[i];
				} else {
					console.log("NOAA: could not determine the temperature label");
				}
				
			}
			return forecast;
		}, */
		
		processDarkSkyForecast: function(response) {
			var forecast = {};
			for (var i = 0; i < response.data.daily.data.length; i++) {
				var dateStr = dateFty.createDateString(new Date(response.data.daily.data[i].time * 1000));
				forecast[dateStr] = forecast[dateStr] || {};
				forecast[dateStr].high = Math.round(response.data.daily.data[i].temperatureMax);
				forecast[dateStr].precip = Math.ceil(response.data.daily.data[i].precipProbability * 10) * 10;
				forecast[dateStr].text = response.data.daily.data[i].summary;
				forecast[dateStr].low = Math.round(response.data.daily.data[i].temperatureMin);
				forecast[dateStr].icon = response.data.daily.data[i].icon;
				forecast[dateStr].alerts = [];
			}
			if ("alerts" in response.data) {
				for (var i = 0; i < response.data.alerts.length; i++) {
					var startDate = dateFty.setCommonTime(new Date(response.data.alerts[i].time * 1000));
					var endDate = dateFty.setCommonTime(new Date(response.data.alerts[i].expires * 1000));
					console.log("alert range", startDate, endDate);
					var alertDates = dateFty.enumerateDateRange(startDate, endDate);
					console.log("alert dates", alertDates);
					for (var n = 0; n < alertDates.length; n++) {
						var dateStr = dateFty.createDateString(alertDates[n]);
						if (dateStr in forecast) {
							forecast[dateStr].alerts.push(response.data.alerts[i]);
						}
					}
				}
			}
			return forecast;
		},
		
		processDarkSkyTimeMachine: function(response) {
			var forecast = {};
			forecast.high = Math.round(response.data.daily.data[0].temperatureMax);
			if ("precipProbability" in response.data.daily.data[0]) {
				forecast.precip = Math.ceil(response.data.daily.data[0].precipProbability * 10) * 10;
			} else {
				forecast.precip = 0;
			}
			forecast.text = response.data.daily.data[0].summary;
			forecast.low = Math.round(response.data.daily.data[0].temperatureMin);
			forecast.icon = response.data.daily.data[0].icon;
			return forecast;
		}
		
	};
	
	return factory;
	
}





















/**
* Travel Weather - build a weather forecast calendar
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

function formCtrl($scope, $timeout, destinationFty, forecastFty, dateFty, urlFty, distanceFty, alertFty, locationFty) {
	
	var self = this;
	
	self.typeAheadResults = [];
	
	self.showTypeAhead = false;
	
	self.highlightIndex = 0;
	
	// clicked marker (red)
	var marker = null;
	
	// throttle flag to reduce map clicks
	var throttle = false;
	
	// set default dates
	
	self.startDate = new Date(dateFty.today);
	
	self.endDate = new Date(dateFty.today);
	
	// show or hide the date pickers
	
	self.showStartDatePicker = false;
	
	self.showEndDatePicker = false;
	
	function removeMarker() {
		if (marker) {
			marker.setMap(null);
			marker = null;
		}
	}
	
	function replaceMapMarker(map, position) {
		console.log("replace marker");
		removeMarker();
		marker = new google.maps.Marker({
			map: map,
			position: position,
			zIndex: 100
		});
	}
	
	function centerMap(map, position) {
		console.log("center map");
		map.panTo(position);
	}
	
	function zoomMap(map, zoomLevel) {
		map.setZoom(zoomLevel);
	}
	
	function addressFound(resultsList) {
		//console.log("addresses found");
		self.typeAheadResults = resultsList;
		//self.showTypeAhead = true;
		$scope.$apply();
	}
	
	function addressNotFound(result) {
		//console.log("address not found");
		locationFty.locationDetails = result;
		removeMarker();
		$scope.$apply();
	}
	
	function coordsFound(result) {
		//console.log("coords found");
		locationFty.locationDetails = result;
		$scope.$apply();
	}
	
	function coordsUnknown(result) {
		//console.log("coords unknown", result);
		locationFty.locationDetails = result;
		$scope.$apply();
	}
	
	self.highlightResult = function(e) {
		//console.log("key pressed", e.which);
		if (e.which == 40) {
			// down key pressed
			e.preventDefault();
			if (self.highlightIndex < (self.typeAheadResults.length - 1)) {
				self.highlightIndex++;
			}
		} else if (e.which == 38) {
			// up key pressed
			e.preventDefault();
			if (self.highlightIndex > 0) {
				self.highlightIndex--;
			}
		} else if (e.which == 13) {
			// enter key pressed
			if (self.highlightIndex < 0) {
				self.highlightIndex = 0;
			}
			self.setLocation(self.typeAheadResults[self.highlightIndex]);
		} else {
			self.highlightIndex = 0;
		}
	}
	
	self.setLocation = function(loc) {
		self.query = loc.name;
		locationFty.locationDetails = loc;
		centerMap(locationFty.map, loc.coords);
		zoomMap(locationFty.map, 10);
		replaceMapMarker(locationFty.map, loc.coords);
		self.showTypeAhead = false;
	}
	
	self.delayHideTypeAhead = function() {
		$timeout(function() {
			self.showTypeAhead = false;
		}, 100);
	}
	
	self.locationSearch = function(query) {
		if (query.length > 3) {
			console.log("search for " + query);
			locationFty.geocodeAddress(query, addressFound, addressNotFound);
		}
	}
	
	locationFty.map.addListener('click', function(e) {
		if (!throttle) {
			throttle = true;
			replaceMapMarker(locationFty.map, e.latLng);
			locationFty.geocodeLatLng(e.latLng, coordsFound, coordsUnknown);
			locationFty.openAddForecast();
			// limit map clicks to once a second
			$timeout(function() {
				throttle = false;
			}, 1000);
		}
	});
	
	// user chooses an arrival date in the date picker
	function updateStartDate() {
		// set start date
		self.startDate = dateFty.setCommonTime(pickStartDate.getDate());
		
		// find max date range
		var d = new Date(self.startDate);
		d.setDate(d.getDate() + dateFty.maxDateRange - 1);
		
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
	maxEndDate.setDate(maxEndDate.getDate() + dateFty.maxDateRange - 1);
	
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
	
	var mainElement = document.getElementById("main");
	var mainElementHeight = mainElement.getBoundingClientRect().height;
	
	function scrollToBottom() {
		//console.log("scroll begin");
		mainElementHeight = mainElement.getBoundingClientRect().height;
		$timeout(function() {
			mainElement.scrollTop = mainElement.scrollTop + 30;
			if ((mainElement.scrollTop + mainElementHeight) < mainElement.scrollHeight) {
				//console.log("scroll recursive");
				scrollToBottom();
			} else {
				//console.log("scroll end");
				window.scrollTo(0, mainElement.scrollHeight);
			}
		}, 30);
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
					//alertFty.displayMessage("Your dates were backwards, so I switched them for you.", "info");
				} else {
					destinationFty.addDestination(place, arrival, departure);
				}
				// get forecast for added destination
				forecastFty.attemptGetForecast(place.coords.lat, place.coords.lng, place.name);
				// if more than one destination
				if (destinationFty.destinationList.length > 1) {
					// pan to all destinations
					locationFty.map.setZoom(6);
					locationFty.map.panToBounds(locationFty.destinationBounds);
					// get estimated travel time between destinations
					distanceFty.getDistances(
						destinationFty.destinationList,
						function() {
							// apply changes because $apply does not run after ajax calls
							$scope.$apply();
						}
					);
				} else {
					// if this is the first destination added
					scrollToBottom();
				}
				// add destination to url by rebuilding it
				urlFty.buildUrlParamTrip(destinationFty.destinationList);
				//console.log("destination list", destinationFty.destinationList);
				console.log("date list", dateFty.dateList);
				/* urlFty.monetizeLinks(); */
			} else {
				alertFty.displayMessage("Your date range is invalid. Forecasts are limited to " + dateFty.maxDateRange + " days per destination.", "error");
			}
		} else {
			alertFty.displayMessage("That place doesn't exist.", "error");
		}
	}
	
	
}





















/**
* Travel Weather - build a weather forecast calendar
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

function locationFty() {
	
	var factory = {
		
		geocoder: new google.maps.Geocoder(),
		
		// define map and center view on USA
		map: new google.maps.Map(document.getElementById('map'), {
			zoom: 3,
			center: {lat: 38.509490, lng: -96.767578},
			clickableIcons: false
		}),
		
		// list of numbered map markers (blue)
		markerList: [],
		
		// map bounds that contain all destinations
		destinationBounds: new google.maps.LatLngBounds(),
		
		showAddForecast: true,
		
		showAddForecastText: "Hide Options",
		
		openAddForecast: function() {
			factory.showAddForecast = true;
			factory.showAddForecastText = "Hide Options";
		},
		
		closeAddForecast: function() {
			factory.showAddForecast = false;
			factory.showAddForecastText = "Show Options";
		},
		
		toggleAddForecast: function() {
			factory.showAddForecast = !factory.showAddForecast;
			if (factory.showAddForecast) {
				factory.showAddForecastText = "Hide Options";
			} else {
				factory.showAddForecastText = "Show Options";
			}
		},
		
		// line between destination markers
		routeLine: new google.maps.Polyline({
			path: [],
			geodesic: true,
			strokeColor: 'blue',
			strokeOpacity: 0.5,
			strokeWeight: 2
		}),
		
		// saved location details
		locationDetails: {
			name: "Search for a location or select one on the map",
			coords: null
		},
		
		validLat: function(lat) {
			if (-90 <= lat <= 90) {
				return true;
			}
			return false;
		},
		
		validLng: function(lng) {
			if (-180 <= lat <= 180) {
				return true;
			}
			return false;
		},
		
		createLocationDetails: function(address, latLng) {
			var loc = {
				name: address
			};
			if (latLng) {
				loc.coords = {
					lat: latLng.lat(),
					lng: latLng.lng()
				};
			} else {
				loc.coords = null;
			}
			return loc;
		},
		
		drawOnMap: function(destList) {
			factory.buildMapMarkers(destList);
			factory.buildRouteLine(destList);
			factory.buildBoundingBox(destList);
		},
		
		buildMapMarkers: function(destList) {
			for (var i = 0; i < factory.markerList.length; i++) {
				factory.markerList[i].setMap(null);
			}
			factory.markerList = [];
			for (var i = 0; i < destList.length; i++) {
				var marker = new google.maps.Marker({
					position: destList[i].coords,
					map: factory.map,
					title: destList[i].name,
					label: {
						text: String(i + 1),
						color: 'white'
					},
					icon: {
						path: google.maps.SymbolPath.CIRCLE,
						clickable: false,
						fillColor: 'blue',
						fillOpacity: 100,
						strokeColor: 'white',
						strokeWeight: 2,
						scale: 11
					}
				});
				factory.markerList.push(marker);
			}
		},
		
		buildRouteLine: function(destList) {
			var coordsList = [];
			for (var i = 0; i < destList.length; i++) {
				coordsList.push(destList[i].coords);
			}
			factory.routeLine.setPath(coordsList);
		},
		
		buildBoundingBox: function(destList) {
			var bounds = new google.maps.LatLngBounds();
			for (var i = 0; i < destList.length; i++) {
				bounds.extend(new google.maps.LatLng(destList[i].coords.lat, destList[i].coords.lng));
			}
			console.log("bounds", bounds);
			factory.destinationBounds = bounds;
		},
		
		// find text query
		geocodeAddress: function(address, successCallback, errorCallback) {
			factory.geocoder.geocode({'address': address}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					console.log("addresses found", results);
					var locList = [];
					for (var i = 0; i < results.length; i++) {
						locList.push(factory.createLocationDetails(results[i].formatted_address, results[i].geometry.location));
					}
					successCallback(locList);
				} else {
					console.log('Geocode address failed: ' + status);
					var locDetails = factory.createLocationDetails("Location not found. Try selecting it on the map.", null);
					errorCallback(locDetails);
				}
			});
		},
		
		// find coordinates
		geocodeLatLng: function(latLng, successCallback, errorCallback) {
			factory.geocoder.geocode({'location': latLng}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					console.log("location found", results);
					var resultMatch;
					for (var i = 0; i < results.length; i++) {
						if (results[i].types.indexOf("premise") < 0 &&
							results[i].types.indexOf("street_address") < 0 &&
							results[i].types.indexOf("route") < 0 &&
							results[i].types.indexOf("intersection") < 0 &&
							results[i].types.indexOf("subpremise") < 0 &&
							results[i].formatted_address.indexOf("Township") < 0
						) {
							resultMatch = results[i];
							break;
						}
					}
					var locDetails = factory.createLocationDetails(resultMatch.formatted_address, latLng);
					successCallback(locDetails);
				} else {
					console.log('Geocode latLng failed: ' + status);
					var locDetails = factory.createLocationDetails("Unknown location", null);
					errorCallback(locDetails);
				}
			});
		}
	};
	
	factory.routeLine.setMap(factory.map);
	
	return factory;
	
}





















/**
* Travel Weather - build a weather forecast calendar
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

function mapCtrl(locationFty) {
	
	var self = this;
	
	//self.hideMap = urlFty.getUrlMap();
	
	var radarImages = [
		{
			image: "usa.png",
			bounds: {
				south: 15,
				west: -170,
				north: 50,
				east: -50
			}
		},
		{
			image: "can.png",
			bounds: {
				south: 50,
				west: -170,
				north: 75,
				east: -50
			}
		},
		{
			image: "eur.png",
			bounds: {
				south: 35,
				west: -13,
				north: 72,
				east: 40
			}
		},
		{
			image: "aus.png",
			bounds: {
				south: -50,
				west: 110,
				north: -5,
				east: 180
			}
		}
	];
	
	for (var i = 0; i < radarImages.length; i++) {
		radarImages[i].overlay = new google.maps.GroundOverlay(
			"/img/radar/" + radarImages[i].image,
			radarImages[i].bounds,
			{
				map: locationFty.map,
				opacity: 0.4,
				clickable: false
			}
		);
	}
	
	
}





















/**
* Travel Weather - build a weather forecast calendar
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

function urlFty($timeout, $location, $http, dateFty, locationFty) {
	
	var factory = {
		
		// flag for parameters updated by app
		paramsUpdated: true,
		
		// short url string (displayed at top of ui)
		shortUrl: 'for bookmarking',
		
		getUrlUnits: function() {
			var urlParams = $location.search();
			var param = urlParams.u;
			if (param == 'c' || param == 'C') {
				return 'metric';
			} else {
				return 'imperial';
			}
		},
		
		buildUrlParamUnits: function(units) {
			var newUnits = 'f';
			if (units == 'metric') {
				newUnits = 'c';
			}
			console.log("add url units");
			factory.paramsUpdated = true;
			$location.search('u', newUnits);
		},
		
		getUrlSort: function() {
			var urlParams = $location.search();
			var param = urlParams.s;
			if (param == 'a' || param == 'A') {
				return 'arrival';
			} else if (param == 'n' || param == 'N') {
				return 'name';
			} else {
				return 'departure';
			}
		},
		
		buildUrlParamSort: function(sortBy) {
			var newSort = 'd';
			if (sortBy == 'arrival') {
				newSort = 'a';
			} else if (sortBy == 'name') {
				newSort = 'n';
			}
			console.log("add url sort");
			factory.paramsUpdated = true;
			$location.search('s', newSort);
		},
		
		getUrlView: function() {
			var urlParams = $location.search();
			var param = urlParams.v;
			if (param == 't' || param == 'T') {
				return 'timeline';
			} else {
				return 'stack';
			}
		},
		
		buildUrlParamView: function(units) {
			var newView = 's';
			if (units == 'timeline') {
				newView = 't';
			}
			console.log("add url view");
			factory.paramsUpdated = true;
			$location.search('v', newView);
		},
		
		clearUrlParamTrip: function() {
			factory.paramsUpdated = true;
			$location.search('t');
		},
		
		// check if t param is valid
		validUrlParamTrip: function() {
			var urlParams = $location.search();
			var param = urlParams.t;
			if (param || param == undefined) {
				return true;
			}
			var forecastArray = param.split('d');
			if (forecastArray.length < 2) {
				return false;
			}
			for (var i = 1; i < forecastArray.length; i++) {
				var propertiesArray = forecastArray[i].split('r');
				var coordsArray = propertiesArray[0].split('l');
				if (coordsArray.length != 2 ||
					!locationFty.validLat(Number(coordsArray[0])) ||
					!locationFty.validLng(Number(coordsArray[1]))
				) {
					return false;
				}
				for (var n = 1; n < propertiesArray.length; n++) {
					var dateRangeArray = propertiesArray[n].split('e');
					if (dateRangeArray.length != 2 ||
						!dateFty.validDate(dateFty.createDateFromString(dateRangeArray[0])) ||
						!dateFty.validDate(dateFty.createDateFromString(dateRangeArray[1]))
					) {
						return false;
					}
				}
			}
			return true;
		},
		
		createDestinationString: function(lat, lng, dateRangeList) {
			var str = 'd';
			str += String(lat);
			str += 'l';
			str += String(lng);
			for (var i = 0; i < dateRangeList.length; i++) {
				str += 'r';
				str += dateFty.createDateString(dateRangeList[i].arrival);
				str += 'e';
				str += dateFty.createDateString(dateRangeList[i].departure);
			}
			return str;
		},
		
		buildUrlParamTrip: function(destinationList) {
			var url = '';
			for (var i = 0; i < destinationList.length; i++) {
				url += factory.createDestinationString(
					destinationList[i].coords.lat,
					destinationList[i].coords.lng,
					destinationList[i].dateRanges
				);
			}
			if (url == '') {
				factory.clearUrlParamTrip();
			} else {
				factory.paramsUpdated = true;
				$location.search('t', url);
			}
		},
		
		getUrlDestinations: function() {
			var urlParams = $location.search();
			var param = urlParams.t;
			var destList = [];
			if (param === true || param == undefined) {
				return destList;
			}
			var forecastArray = param.split('d');
			for (var i = 1; i < forecastArray.length; i++) {
				var propertiesArray = forecastArray[i].split('r');
				var coordsArray = propertiesArray[0].split('l');
				destList[i-1] = {
					coords: {
						lat: Number(coordsArray[0]),
						lng: Number(coordsArray[1])
					},
					dateRanges: []
				};
				for (var n = 1; n < propertiesArray.length; n++) {
					var dateRangeArray = propertiesArray[n].split('e');
					destList[i-1].dateRanges.push({
						arrival: dateFty.createDateFromString(dateRangeArray[0]),
						departure: dateFty.createDateFromString(dateRangeArray[1])
					});
				}
			}
			console.log("url destinations", destList);
			return destList;
		},
		
		// create a url to link to google maps directions
		createDirectionsUrl: function(destinationsArray) {
			var url = "";
			// if more than one destination
			if (destinationsArray.length > 1) {
				// create link for directions to each one
				url = "https://www.google.com/maps/dir";
				for (var i = 0; i < destinationsArray.length; i++) {
					if (destinationsArray[i] != undefined &&
						destinationsArray[i] != null
					) {
						var placeName = destinationsArray[i].name;
						placeName = placeName.split(' ').join('+');
						placeName = placeName.split(',').join('');
						url += "/" + placeName;
					} else {
						return "";
					}
				}
				return url;
			} else {
				// only one destination
				// just link to that destination on the map
				url = "https://www.google.com/maps/place/";
				if (destinationsArray[0] != undefined &&
						destinationsArray[0] != null
				) {
					var placeName = destinationsArray[0].name;
					placeName = placeName.split(' ').join('+');
					placeName = placeName.split(',').join('');
					url += placeName;
					return url;
				} else {
					return "";
				}
			}
		},
		
		createPricelineHotelsUrl: function(destination) {
			var url = "https://www.priceline.com/stay/#/search/hotels/";
			var placeName = destination.name.split(' ').join('+');
			url += placeName + "/";
			var startDate = destination.dates[0];
			var endDate = destination.dates[destination.dates.length - 1];
			if (dateFty.datesEqual(startDate, endDate)) {
				endDate = new Date(endDate);
				endDate.setDate(endDate.getDate() + 1);
			}
			url += dateFty.createPricelineDateString(startDate) + "/" + dateFty.createPricelineDateString(endDate) + "/";
			url += "1?searchType=CITY&page=1";
			return url;
		},
		
		shortUrlThrottle: false,
		
		buildShortUrl: function() {
			if (!factory.shortUrlThrottle) {
				factory.shortUrlThrottle = true;
				$http.post('https://www.googleapis.com/urlshortener/v1/url?key=' + googleKey, {
					"longUrl": $location.absUrl()
				}).then (function(response) {
					console.log("short url response", response);
					if ("id" in response.data) {
						factory.shortUrl = response.data.id;
					}
				}, function(response) {
					console.log("short url error", response);
				});
				// limit url calls
				$timeout(function() {
					factory.shortUrlThrottle = false;
				}, 100);
			}
		},
		
		// build dynamic page title
		getPageTitle: function(destList) {
			var title = "Travel Weather";
			if (destList.length > 0) {
				title += " - " + destList[0].name;
			}
			if (destList.length > 1) {
				title += " to " + destList[destList.length - 1].name;
			}
			return title;
		},
		
		monetizeLinks: function() {
			var head = document.getElementsByTagName('head')[0];
			var currentScripts = head.getElementsByTagName('script');
			var oldScript = null;
			var scriptUrl = "";
			for (var i = 0; i < currentScripts.length; i++) { 
				var desc = currentScripts[i].dataset.desc; 
				if ( desc == "monetize" ) { 
					oldScript = currentScripts[i];
				}
			}
			if (oldScript != null) {
				console.log("old script", oldScript);
				scriptUrl = oldScript.src;
				head.removeChild(oldScript);
			}
			var script = document.createElement('script');
			script.src = scriptUrl;
			script.dataset.desc = "monetize";
			head.appendChild(script);
			console.log("added monetization script");
		}
		
	};
	
	return factory;
	
}






























