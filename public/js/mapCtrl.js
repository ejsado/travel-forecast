function mapCtrl($scope, $timeout, locationFty) {
	
	var self = this;
	
	var radarImages = [
		{
			image: "usa.png",
			bounds: {
				south: 15,
				west: -130,
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
				opacity: 0.4
			}
		);
	}
	
	self.typeAheadResults = [];
	
	self.showTypeAhead = false;
	
	// clicked marker (red)
	var marker = null;
	
	// throttle flag to reduce map clicks
	var throttle = false;
	
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
	
	self.setLocation = function(loc) {
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
			// limit map clicks to once a second
			$timeout(function() {
				throttle = false;
			}, 1000);
		}
	});
	
}




















