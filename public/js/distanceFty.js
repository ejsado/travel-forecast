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
						} else {
							factory.distanceList[destinationList[i].name][destinationList[n].name] = {
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