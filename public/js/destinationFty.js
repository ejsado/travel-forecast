function destinationFty(dateFty, urlFty, locationFty) {
	
	var factory = {
		
		destinationList: [
			/* {
				name: "Place",
				coords: {
					lat: 123,
					lng: 123
				},
				dates: [
					date,
					date,
					date
				]
				dateRanges: [
					{
						arrival: date,
						departure: date
					}
				]
			} */
		],
		
		addDestination: function(place, arrival, departure) {
			var destAdded = false;
			for (var i = 0; i < factory.destinationList.length; i++) {
				if (place.name == factory.destinationList[i].name) {
					factory.destinationList[i].dates.push.apply(factory.destinationList[i].dates, dateFty.enumerateDateRange(arrival, departure));
					factory.destinationList[i].dates = dateFty.removeDuplicateDates(factory.destinationList[i].dates);
					factory.destinationList[i].dates.sort(dateFty.dateCompare);
					factory.destinationList[i].dateRanges.push({
						arrival: arrival,
						departure: departure
					});
					destAdded = true;
				}
			}
			if (!destAdded) {
				factory.destinationList.push({
					name: place.name,
					coords: place.coords,
					dates: dateFty.enumerateDateRange(arrival, departure),
					dateRanges: [{
						arrival: arrival,
						departure: departure
					}]
				});
			}
			locationFty.buildMapMarkers(factory.destinationList);
			dateFty.buildDateList(factory.destinationList);
			urlFty.buildUrlParam(factory.destinationList);
		},
		
		removeDestination: function(indexToRemove, rebuild) {
			factory.destinationList.splice(indexToRemove, 1);
			if (rebuild) {
				locationFty.buildMapMarkers(factory.destinationList);
				dateFty.buildDateList(factory.destinationList);
				urlFty.buildUrlParam(factory.destinationList);
			}
		},
		
		getDestinationByName: function(name) {
			for (var i = 0; i < factory.destinationList.length; i++) {
				if (name == factory.destinationList[i].name) {
					return factory.destinationList[i];
				}
			}
			return null;
		}
		
	}
	
	return factory;
	
}




















