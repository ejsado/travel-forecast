function alertFty($sce, $timeout) {
	
	var factory = {
		
		showMessage: false,
		
		messageContent: '',
		
		displayMessage: function(mContent) {
			$timeout.cancel(factory.messageTimer);
			mContent = mContent || 'Nope.';
			factory.messageContent = mContent;
			factory.showMessage = true;
			factory.messageTimer = $timeout(factory.hideMessage, 9000);
		},
		
		hideMessage: function() {
			factory.showMessage = false;
			factory.messageContent = 'Nope.';
		},
		
		messageTimer: null,
		
		showModal: false,
		
		modalContent: {},
		
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
						"It's a tool for tracking the weather at multiple locations on different dates."
					]
				},
				{
					title: 'Who provides the data?',
					text: [
						'<a href="https://developer.forecast.io/">Dark Sky</a> provides the weather data, and <a href="https://developers.google.com/maps/">Google</a> provides the map and location data.'
					]
				},
				{
					title: 'I found a bug.',
					text: [
						'Ew, just squish it.'
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
			factory.modalContent = factory.defaultModal;
		},
		
		displayModal: function(mContent) {
			mContent = mContent || factory.defaultModal;
			factory.modalContent = mContent;
			factory.showModal = true;
		}
		
	}
	
	factory.trustDialogText(factory.defaultModal);
	factory.trustDialogText(factory.invalidUrlModal);
	factory.trustDialogText(factory.destinationsMergedModal);
	factory.trustDialogText(factory.destinationsNotFoundModal);
	factory.trustDialogText(factory.dateRangeInvalidModal);
	factory.trustDialogText(factory.aboutModal);
	
	factory.modalContent = factory.defaultModal;
	
	
	return factory;
	
}