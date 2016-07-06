function mapCtrl($scope, $timeout, locationFty) {
	
	var self = this;
	
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
	
	function addressFound(result) {
		console.log("address found");
		locationFty.locationDetails = result;
		centerMap(locationFty.map, result.coords);
		zoomMap(locationFty.map, 10);
		replaceMapMarker(locationFty.map, result.coords);
		$scope.$apply();
	}
	
	function addressNotFound(result) {
		console.log("address not found");
		locationFty.locationDetails = result;
		removeMarker();
		$scope.$apply();
	}
	
	function coordsFound(result) {
		console.log("coords found");
		locationFty.locationDetails = result;
		$scope.$apply();
	}
	
	function coordsUnknown(result) {
		console.log("coords unknown", result);
		locationFty.locationDetails = result;
		$scope.$apply();
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




















