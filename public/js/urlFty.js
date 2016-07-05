function urlFty($location, $http, dateFty, locationFty) {
	
	var factory = {
		
		paramsUpdated: true,
		
		shortUrl: 'short link for bookmarking',
		
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
			factory.paramsUpdated = true;
			$location.search('u', newUnits);
		},
		
		clearUrlParamTrip: function() {
			factory.paramsUpdated = true;
			$location.search('t');
		},
		
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
		
		createDirectionsUrl: function(destinationsArray) {
			var url = "";
			if (destinationsArray.length > 1) {
				url = "https://www.google.com/maps/dir";
				for (var i = 0; i < destinationsArray.length; i++) {
					if (destinationsArray[i] != undefined &&
						destinationsArray[i] != null
					) {
						url += "/" + destinationsArray[i].coords.lat + ",";
						url += destinationsArray[i].coords.lng;
					} else {
						return "";
					}
				}
				return url;
			} else {
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
		
		buildShortUrl: function() {
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
		},
		
		getPageTitle: function(destList) {
			var title = "";
			if (destList.length > 0) {
				title += " - " + destList[0].name;
			}
			if (destList.length > 1) {
				title += " to " + destList[destList.length - 1].name;
			}
			return title;
		}
		
	};
	
	return factory;
	
}






























