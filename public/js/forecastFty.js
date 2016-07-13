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
				forecast[dateStr].precip = Math.round(response.data.daily.data[i].precipProbability * 100);
				forecast[dateStr].text = response.data.daily.data[i].summary;
				forecast[dateStr].low = Math.round(response.data.daily.data[i].temperatureMin);
				forecast[dateStr].icon = response.data.daily.data[i].icon;
			}
			return forecast;
		},
		
		processDarkSkyTimeMachine: function(response) {
			var forecast = {};
			forecast.high = Math.round(response.data.daily.data[0].temperatureMax);
			if ("precipProbability" in response.data.daily.data[0]) {
				forecast.precip = Math.round(response.data.daily.data[0].precipProbability * 100);
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




















