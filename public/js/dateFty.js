function dateFty($filter) {
	
	var factory = {
		
		dateList: [
			/* [
				consecutive date,
				consecutive date
			],
			[
				consecutive date,
				consecutive date
			] */
		],
		
		setCommonTime: function(d) {
			var dateObj = new Date(d);
			dateObj.setHours(8);
			dateObj.setMinutes(0);
			dateObj.setSeconds(0);
			dateObj.setMilliseconds(0);
			return dateObj;
		},
		
		today: new Date(new Date().setHours(8, 0, 0, 0)),
		
		maxDate: new Date("December 31, 2099"),
		
		datesEqual: function(date1, date2) {
			return Math.abs(date1.getTime() - date2.getTime()) < 1000*60*60*8; // within 8 hours
		},
		
		validDate: function(d) {
			if (d == null) {
				return false;
			}
			if (d < factory.maxDate) {
				if (d < factory.today) {
					return false;
				}
				return true;
			}
			return false;
		},
		
		createDateString: function(dateObj) {
			return $filter('date')(dateObj, 'MMddyy');
		},
		
		createDateFromString: function(dateStr) {
			if (dateStr.length == 6) {
				var d = new Date();
				var year = Number(dateStr.substr(4,2)) + 2000;
				var month = Number(dateStr.substr(0,2)) - 1;
				var day = Number(dateStr.substr(2,2));
				d.setFullYear(year, month, day);
				d = factory.setCommonTime(d);
				return d;
			}
			return null;
		},
		
		buildDateList: function(destinationList) {
			var newDateList = [];
			for (var i = 0; i < destinationList.length; i++) {
				newDateList.push.apply(newDateList, destinationList[i].dates);
			}
			newDateList = factory.removeDuplicateDates(newDateList);
			newDateList.sort(factory.dateCompare);
			factory.dateList = factory.groupDates(newDateList);
		},
		
		groupDates: function(dList) {
			var groupedDates = [[]];
			groupedDates[0].push(dList[0]);
			var n = 0;
			for (var i = 1; i < dList.length; i++) {
				if (factory.consecutiveDates(dList[i-1], dList[i])) {
					groupedDates[n].push(dList[i]);
				} else {
					n++;
					groupedDates[n] = [];
					groupedDates[n].push(dList[i]);
				}
			}
			return groupedDates;
		},
		
		dateInArray: function(d, array) {
			for (var i = 0; i < array.length; i++) {
				if (factory.datesEqual(d, array[i])) {
					return true;
				}
			}
			return false;
		},
		
		enumerateDateRange: function(start, end) {
			var enumDates = [];
			for (var d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
				enumDates.push(new Date(d));
			}
			enumDates.push(new Date(end));
			
			//console.log("enumerate", enumDates);
			return enumDates;
		},
		
		dateDuplicate: function(item, index, array) {
			for (var i = index + 1; i < array.length; i++) {
				if (factory.datesEqual(item, array[i])) {
					//console.log("duplicate", item);
					return false;
				}
			}
			return true;
		},
		
		removeDuplicateDates: function(dateArray) {
			return dateArray.filter(factory.dateDuplicate);
		},
		
		dateCompare: function(a, b) {
			return a.getTime() - b.getTime();
		},
		
		consecutiveDates: function(date1, date2) {
			var d = new Date(date1);
			d.setDate(d.getDate() + 1);
			if (factory.datesEqual(d, date2)) {
				return true;
			}
			return false;
		},
		
		crossReferenceDates: function(destinationDates, destinationForecast) {
			var forecastDates = [];
			for (var item in destinationForecast) {
				forecastDates.push(factory.createDateFromString(item));
			}
			var remainingDates = [];
			for (var i = 0; i < destinationDates.length; i++) {
				if (!factory.dateInArray(destinationDates[i], forecastDates)) {
					remainingDates.push(new Date(destinationDates[i]));
				}
			}
			return remainingDates;
		}
	
	};
	
	return factory;
}






























