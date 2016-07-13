/** !save
* 
* @source:https://github.com/ejsado/travel-forecast/blob/master/dist/js/app.js
*
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

function alertFty($sce, $timeout) {
	
	var factory = {
		
		// message to display near "Get Forecast" button
		
		showMessage: false,
		
		messageContent: '',
		
		messageCssClass: '',
		
		displayMessage: function(mContent, mClass) {
			factory.messageCssClass = mClass || '';
			$timeout.cancel(factory.messageTimer);
			// set message to "Nope" if no message is set
			mContent = mContent || 'Nope.';
			factory.messageContent = mContent;
			factory.showMessage = true;
			// hide message after 9 seconds
			factory.messageTimer = $timeout(factory.hideMessage, 800000);
		},
		
		hideMessage: function() {
			factory.showMessage = false;
			//factory.messageContent = 'Nope.';
		},
		
		messageTimer: null,
		
		// modal display
		
		showModal: false,
		
		modalContent: {},
		
		// predefined modal messages
		
		defaultModal: {
			buttonText: 'Cool',
			content: [
				{
					title: 'Error?',
					text: [
						'Something went wrong.'
					]
				}
			]
		},
		
		invalidUrlModal: {
			buttonText: 'Fine',
			content: [
				{
					title: 'Invalid URL',
					text: [
						"Your URL parameters are invalid. I'm ignoring them."
					]
				}
			]
		},
		
		destinationsMergedModal: {
			buttonText: 'Lame',
			content: [
				{
					title: 'Destinations Merged',
					text: [
						"I merged some of your destinations because they were too close."
					]
				}
			]
		},
		
		destinationsNotFoundModal: {
			buttonText: 'Fine',
			content: [
				{
					title: 'Destinations Skipped',
					text: [
						"I skipped some of your destinations because I couldn't find them."
					]
				}
			]
		},
		
		dateRangeInvalidModal: {
			buttonText: 'Fine',
			content: [
				{
					title: 'Date Ranges Invalid',
					text: [
						"Some of your date ranges were invalid, so I skipped them."
					]
				}
			]
		},
		
		aboutModal: {
			buttonText: 'Ok, whatever',
			content: [
				{
					title: 'What is this?',
					text: [
						"Travel Weathr allows you to build a weather forecast calendar for all of your vacation destinations with varied arrivals and departures.",
						"Create a trip by adding destinations with arrival and departure dates, then bookmark the link or share it with the people you'll be travelling with. Every time you visit the link, your freshly updated forecast will be shown."
					]
				},
				{
					title: 'Who provides the data?',
					text: [
						'<a href="https://developer.forecast.io/">Dark Sky</a> provides the weather data',
						'<a href="https://developers.google.com/maps/">Google</a> provides the map and location data',
						'<a href="https://www.wunderground.com/?apiref=98798f3caba1662f">Weather Underground</a> provides the precipitation radar which is overlayed on the map',
						'* Note that radar is only available for North America, Europe, and Australia'
					]
				},
				{
					title: 'I found a bug.',
					text: [
						'Ew, just squish it. Or report it on the <a href="https://github.com/ejsado/travel-forecast/issues">github page</a>.'
					]
				},
				{
					title: 'What else you got?',
					text: [
						'You can find my other projects on <a href="http://www.ericsadowski.com/">my website</a>. Or you can take a look at <a href="http://codepen.io/ejsado/">my codepen profile</a> for my code demos.'
					]
				}
			]
		},
		
		// convert text to trusted html
		
		trustDialogText: function(mContent) {
			mContent = mContent || factory.defaultModal;
			for (var i = 0; i < mContent.content.length; i++) {
				for (var n = 0; n < mContent.content[i].text.length; n++) {
					mContent.content[i].text[n] = $sce.trustAsHtml(mContent.content[i].text[n]);
				}
			}
			return mContent;
		},
		
		hideModal: function() {
			factory.showModal = false;
			//factory.modalContent = factory.defaultModal;
		},
		
		displayModal: function(mContent) {
			mContent = mContent || factory.defaultModal;
			factory.modalContent = mContent;
			factory.showModal = true;
		}
		
	}
	
	// need to convert all predefined messages once
	
	factory.trustDialogText(factory.defaultModal);
	factory.trustDialogText(factory.invalidUrlModal);
	factory.trustDialogText(factory.destinationsMergedModal);
	factory.trustDialogText(factory.destinationsNotFoundModal);
	factory.trustDialogText(factory.dateRangeInvalidModal);
	factory.trustDialogText(factory.aboutModal);
	
	factory.modalContent = factory.defaultModal;
	
	
	return factory;
	
}