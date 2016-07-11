function locationFty() {
	
	var factory = {
		
		geocoder: new google.maps.Geocoder(),
		
		// define map and center view on USA
		map: new google.maps.Map(document.getElementById('map'), {
			zoom: 4,
			center: {lat: 38.509490, lng: -96.767578},
			clickableIcons: false
		}),
		
		// list of numbered map markers (blue)
		markerList: [],
		
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
						if (!results[i].types.includes("premise") &&
							!results[i].types.includes("street_address") &&
							!results[i].types.includes("route") &&
							!results[i].types.includes("intersection") &&
							!results[i].types.includes("subpremise") &&
							!results[i].formatted_address.includes("Township")
						) {
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
	
	factory.routeLine.setMap(factory.map);
	
	return factory;
	
}




















