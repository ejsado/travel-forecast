/**
* Travel Weathr - build a weather forecast calendar
* Copyright (C) 2016  Eric Sadowski
* 
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
* 
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
* 
*/

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
		
		// set common time for date comparison
		setCommonTime: function(d) {
			var dateObj = new Date(d);
			dateObj.setHours(6);
			dateObj.setMinutes(0);
			dateObj.setSeconds(0);
			dateObj.setMilliseconds(0);
			return dateObj;
		},
		
		// common times are set below
		today: new Date(),
		maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
		
		// max consecutive days per destination
		maxDateRange: 3,
		
		datesEqual: function(date1, date2) {
			return Math.abs(date1.getTime() - date2.getTime()) < 1000*60*60*8; // within 8 hours
		},
		
		// check if both dates have a maximum number of days between them
		datesWithinDays: function(date1, date2, days) {
			return Math.abs(date1.getTime() - date2.getTime()) < (1000*60*60*24*days);// + 1000*60*60*8); // within number of days of each other
		},
		
		validDate: function(d) {
			if (d == null) {
				return false;
			}
			if (d < factory.maxDate) {
				return true;
			}
			return false;
		},
		
		// create a compressed date string
		createDateString: function(dateObj) {
			return $filter('date')(dateObj, 'MMddyy');
		},
		
		createPricelineDateString: function(dateObj) {
			return $filter('date')(dateObj, 'yyyyMMdd');
		},
		
		// expand a compresssed date string
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
			console.log("date list", factory.dateList);
		},
		
		// combine consecutive dates into an array of arrays
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
		
		// find date ranges with a list of dates
		createDateRanges: function(dList) {
			var dateRanges = [];
			var arrive = dList[0];
			var depart = dList[dList.length - 1];
			for (var i = 1; i < dList.length; i++) {
				if (!factory.consecutiveDates(dList[i-1], dList[i])) {
					dateRanges.push({
						arrival: arrive,
						departure: dList[i-1]
					});
					arrive = dList[i];
				}
			}
			dateRanges.push({
				arrival: arrive,
				departure: depart
			});
			return dateRanges;
		},
		
		dateInArray: function(d, array) {
			for (var i = 0; i < array.length; i++) {
				if (factory.datesEqual(d, array[i])) {
					return true;
				}
			}
			return false;
		},
		
		// expand a date range to an array of all consecutive dates
		enumerateDateRange: function(start, end) {
			var enumDates = [];
			for (var d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
				enumDates.push(new Date(d));
			}
			enumDates.push(new Date(end));
			
			return enumDates;
		},
		
		// comparitor function for array filter
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
		
		// comparitor for sorting
		dateCompare: function(a, b) {
			return a.getTime() - b.getTime();
		},
		
		// date 2 is immediately after date 1
		consecutiveDates: function(date1, date2) {
			var d = new Date(date1);
			d.setDate(d.getDate() + 1);
			if (factory.datesEqual(d, date2)) {
				return true;
			}
			return false;
		},
		
		// compare two date lists, return exclusive dates
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
	
	factory.today = factory.setCommonTime(factory.today);
	
	factory.maxDate = factory.setCommonTime(factory.maxDate);
	
	return factory;
}






























