function urlFty($location, dateFty, locationFty) {
	
	var factory = {
		
		clearUrlParam: function() {
			$location.search('s');
		},
		
		validUrlParam: function() {
			var urlParams = $location.search();
			var param = urlParams.s;
			console.log(param);
			if (param || param == undefined) {
				return true;
			}
			var forecastArray = param.split('f');
			if (forecastArray.length < 2) {
				return false;
			}
			for (var i = 1; i < forecastArray.length; i++) {
				var propertiesArray = forecastArray[i].split('r');
				var coordsArray = propertiesArray[0].split('l');
				if (coordsArray.length != 2 ||
					locationFty.validLat(Number(coordsArray[0])) ||
					locationFty.validLng(Number(coordsArray[1]))
				) {
					return false;
				}
				for (var n = 1; n < propertiesArray.length; n++) {
					var dateRangeArray = propertiesArray[n].split('d');
					if (dateRangeArray.length != 2 ||
						dateFty.validDate(dateFty.createDateFromString(dateRangeArray[0])) ||
						dateFty.validDate(dateFty.createDateFromString(dateRangeArray[1]))
					) {
						return false;
					}
				}
			}
			return true;
		},
		
		createDestinationString: function(lat, lng, dateRangeList) {
			var str = 'f';
			str += String(lat);
			str += 'l';
			str += String(lng);
			for (var i = 0; i < dateRangeList.length; i++) {
				str += 'r';
				str += dateFty.createDateString(dateRangeList[i].arrival);
				str += 'd';
				str += dateFty.createDateString(dateRangeList[i].departure);
			}
			return str;
		},
		
		buildUrlParam: function(destinationList) {
			var url = '';
			for (var i = 0; i < destinationList.length; i++) {
				url += factory.createDestinationString(
					destinationList[i].coords.lat,
					destinationList[i].coords.lng,
					destinationList[i].dateRanges
				);
			}
			$location.search('s', url);
		},
		
		getUrlDestinations: function() {
			var urlParams = $location.search();
			var param = urlParams.s;
			var destList = [];
			if (param === true || param == undefined) {
				return destList;
			}
			var forecastArray = param.split('f');
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
					var dateRangeArray = propertiesArray[n].split('d');
					destList[i-1].dateRanges.push({
						arrival: dateFty.createDateFromString(dateRangeArray[0]),
						departure: dateFty.createDateFromString(dateRangeArray[1])
					});
				}
			}
			console.log(destList);
			return destList;
		}
		
	};
	
	return factory;
	
}