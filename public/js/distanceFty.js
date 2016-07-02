function distanceFty() {
	
	var factory = {
		
		distanceList: {},
		
		distanceMatrix: new google.maps.DistanceMatrixService(),
		
		attemptGetDistance: function(destination1, destination2, callback) {
			if (factory.distanceList[destination1.name] != null && 
				factory.distanceList[destination1.name][destination2.name] != null
			) {
				console.log("distance exists");
			} else {
				factory.getDistance(destination1, destination2, callback);
			}
		},
		
		getDistance: function(destination1, destination2, callback) {
			var origin = new google.maps.LatLng(destination1.coords.lat, destination1.coords.lng);
			var destination = new google.maps.LatLng(destination2.coords.lat, destination2.coords.lng);
			factory.distanceMatrix.getDistanceMatrix({
				origins: [origin],
				destinations: [destination],
				travelMode: google.maps.TravelMode.DRIVING,
				unitSystem: google.maps.UnitSystem.IMPERIAL
			}, function(response, status) {
				factory.processDistanceMatrix(response, status, destination1.name, destination2.name);
				callback();
			});
		},
		
		processDistanceMatrix: function(response, status, fromName, toName) {
			if (status == google.maps.DistanceMatrixStatus.OK) {
				if (factory.distanceList[fromName] == null) {
					factory.distanceList[fromName] = {};
				}
				if (response.rows[0].elements[0].status == google.maps.DistanceMatrixStatus.OK) {
					factory.distanceList[fromName][toName] = {
						distance: response.rows[0].elements[0].distance,
						duration: response.rows[0].elements[0].duration
					};
				} else {
					factory.distanceList[fromName][toName] = {
						distance: {
							text: "Unknown distance",
							value: 0
						},
						duration: {
							text: "Unknown travel time",
							value: 0
						}
					};
				}
				console.log("distance matrix results", response);
			} else {
				console.log("distance matrix failed");
			}
		}
		
	};
	
	return factory;
	
}