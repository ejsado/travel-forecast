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