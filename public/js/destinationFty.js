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
		
		sortBy: "departure",
		
		// flag to disable buttons while destinations are loading
		loadingDestinations: false,
		
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
						if (!factory.loadingDestinations) {
							alertFty.displayMessage("Forecasts are limited to " + dateFty.maxDateRange + " days per destination.", "error");
						}
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
					if (!factory.loadingDestinations) {
						alertFty.displayMessage("I merged the dates for this destination.", "info");
					}
				}
			}
			// if too many destinations
			if (factory.destinationList.length >= 10) {
				console.log("maximum destinations reached");
				if (!factory.loadingDestinations) {
					alertFty.displayMessage("Maximum of 10 destinations. Remove a destination to add this one.", "error");
				}
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
				if (!factory.loadingDestinations) {
					alertFty.displayMessage("New destination added!", "success");
				}
				destAdded = true;
			}
			// sort destinations
			factory.destinationList.sort(factory.destinationCompare);
			// update map markers
			locationFty.drawOnMap(factory.destinationList);
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
				locationFty.drawOnMap(factory.destinationList);
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
			if (factory.sortBy == "arrival") {
				return a.dates[0].getTime() - b.dates[0].getTime();
			} else if (factory.sortBy == "name") {
				var nameA = a.name.toUpperCase(); // ignore upper and lowercase
				var nameB = b.name.toUpperCase(); // ignore upper and lowercase
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				// names must be equal
				return 0;
			} else {
				// sort by destination
				return a.dates[a.dates.length - 1].getTime() - b.dates[b.dates.length - 1].getTime();
			}
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




















