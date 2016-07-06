function destinationFty(dateFty, urlFty, locationFty, alertFty) {
	
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
			// iterate through destination list
			for (var i = 0; i < factory.destinationList.length; i++) {
				// if destination exists
				if (place.name == factory.destinationList[i].name) {
					console.log("destination exists");
					// if date range too large
					if (!dateFty.datesWithinDays(factory.destinationList[i].dates[0], departure, dateFty.maxDateRange)) {
						console.log("destination date range greater than 30 days");
						// show message
						alertFty.displayMessage("Staying for more than " + dateFty.maxDateRange + " days? That's absurd.");
						return destAdded;
					}
					// add all dates within date range
					factory.destinationList[i].dates.push.apply(factory.destinationList[i].dates, dateFty.enumerateDateRange(arrival, departure));
					// remove duplicate dates
					factory.destinationList[i].dates = dateFty.removeDuplicateDates(factory.destinationList[i].dates);
					// sort dates
					factory.destinationList[i].dates.sort(dateFty.dateCompare);
					// rebuild date ranges
					factory.destinationList[i].dateRanges = dateFty.createDateRanges(factory.destinationList[i].dates);
					destAdded = true;
					alertFty.displayMessage("This destination exists, so I merged the dates.");
				}
			}
			// if too many destinations
			if (factory.destinationList.length > 10) {
				console.log("maximum destinations reached");
				alertFty.displayMessage("More than 10 destinations? That's ridiculous.");
				return destAdded;
			}
			// if destination was not added yet
			if (!destAdded) {
				// add new destination
				factory.destinationList.push({
					name: place.name,
					coords: place.coords,
					dates: dateFty.enumerateDateRange(arrival, departure),
					dateRanges: [{
						arrival: arrival,
						departure: departure
					}]
				});
				console.log("new destination added");
				destAdded = true;
			}
			// sort destinations by departure date
			factory.destinationList.sort(factory.destinationCompare);
			// update map markers
			locationFty.buildMapMarkers(factory.destinationList);
			// rebuild date list
			dateFty.buildDateList(factory.destinationList);
			// return if the destination was successfully added
			return destAdded;
		},
		
		removeDestination: function(indexToRemove, rebuild) {
			factory.destinationList.splice(indexToRemove, 1);
			if (rebuild) {
				// resort
				factory.destinationList.sort(factory.destinationCompare);
				locationFty.buildMapMarkers(factory.destinationList);
				dateFty.buildDateList(factory.destinationList);
			}
		},
		
		getDestinationByName: function(name) {
			for (var i = 0; i < factory.destinationList.length; i++) {
				if (name == factory.destinationList[i].name) {
					return factory.destinationList[i];
				}
			}
			return null;
		},
		
		getDestinationIndexByName: function(name) {
			for (var i = 0; i < factory.destinationList.length; i++) {
				if (name == factory.destinationList[i].name) {
					return i;
				}
			}
			return null;
		},
		
		// compare destinations for sorting
		destinationCompare: function(a, b) {
			// compare by departure date
			return a.dates[a.dates.length - 1].getTime() - b.dates[b.dates.length - 1].getTime();
		},
		
		// remove all destinations
		clearDestinations: function() {
			var len = factory.destinationList.length;
			for (var i = 0; i < len; i++) {
				if (i == (len - 1)) {
					factory.removeDestination(0, true);
				} else {
					factory.removeDestination(0, false);
				}
			}
			console.log("destination list", factory.destinationList);
		}
		
	}
	
	return factory;
	
}




















