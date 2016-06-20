function locationFty() {
	
	var factory = {
		
		geocoder: new google.maps.Geocoder(),
		
		map: new google.maps.Map(document.getElementById('map'), {
			zoom: 4,
			center: {lat: 38.509490, lng: -96.767578},
			clickableIcons: false
		}),
		
		markerList: [],
		
		locationDetails: {
			name: "Search for a location or select one on the map.",
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
			return {
				name: address,
				coords: {
					lat: latLng ? latLng.lat() : null,
					lng: latLng ? latLng.lng() : null
				}
			};
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
					icon: {
						path: google.maps.SymbolPath.CIRCLE,
						clickable: false,
						fillColor: 'blue',
						fillOpacity: 100,
						strokeColor: 'white',
						strokeWeight: 2,
						scale: 6
					}
				});
				factory.markerList.push(marker);
			}
		},
		
		geocodeAddress: function(address, successCallback, errorCallback) {
			factory.geocoder.geocode({'address': address}, angular.bind(this, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					console.log("address found", results[0]);
					var locDetails = factory.createLocationDetails(results[0].formatted_address, results[0].geometry.location);
					successCallback(locDetails);
				} else {
					console.log('Geocode address failed: ' + status);
					var locDetails = factory.createLocationDetails("Location not found. Try selecting it on the map.", null);
					errorCallback(locDetails);
				}
			}));
		},
		
		geocodeLatLng: function(latLng, successCallback, errorCallback) {
			factory.geocoder.geocode({'location': latLng}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					console.log("location found", results);
					var resultMatch;
					for (var i = 0; i < results.length; i++) {
						if (results[i].address_components.length <= 4 
							&& !results[i].formatted_address.includes("Township")) {
							resultMatch = results[i];
							break;
						}
					}
					var locDetails = factory.createLocationDetails(resultMatch.formatted_address, resultMatch.geometry.location);
					successCallback(locDetails);
				} else {
					console.log('Geocode latLng failed: ' + status);
					var locDetails = factory.createLocationDetails("Unknown location", null);
					errorCallback(locDetails);
				}
			});
		}
	};
	
	return factory;
	
}




















