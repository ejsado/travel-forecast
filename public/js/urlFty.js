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






























