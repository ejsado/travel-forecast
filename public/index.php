<!DOCTYPE html>

<?php include '../protected/keys.php'; ?>

<html
	ng-app="travelForecastApp"
	ng-controller="appCtrl as appUtils">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
		
		<title ng-bind="appUtils.urlFty.getPageTitle(appUtils.destinationFty.destinationList)">
			Travel Weathr - Compare the weather for multiple destinations
		</title>
		
		<meta property="og:title" content="Travel Weathr - Compare the weather" />
		<meta property="og:type" content="website" />
		<meta property="og:url" content="http://www.travelweathr.com/" />
		<meta property="og:image" content="http://www.travelweathr.com/img/logo-colored-bg-256.png" />
		<meta property="og:description" content="Build a weather forecast calendar for multiple vacation destinations with varied arrivals and departures. Create a trip by adding destinations with arrival and departure dates, then easily find flights and hotels for each destination.">
		
		<meta name="description" content="Build a weather forecast calendar for multiple vacation destinations with varied arrivals and departures. Create a trip by adding destinations with arrival and departure dates, then easily find flights and hotels for each destination.">
		
		<link rel="shortcut icon" type="image/ico" href="/favicon.png">
		
		<link href="/css/all.min.css" rel="stylesheet" type="text/css">
		
		<script src="/js/lib/cj.js" data-desc="monetize"></script>
		
		<!-- build:angular -->
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular-animate.js"></script>
		<!-- endbuild -->
		
		<script src="https://maps.googleapis.com/maps/api/js?key=<?php echo $googleKey; ?>&libraries=places"></script>
		
		<script>
			var googleKey = "<?php echo $googleKey; ?>";
		</script>
		
		<!-- build:lib -->
		<script src="/js/lib/moment.js"></script>
		<script src="/js/lib/pikaday.js"></script>
		<!-- endbuild -->
		
		<!-- build:app -->
		<script src="/js/appCtrl.js"></script>
		<script src="/js/mapCtrl.js"></script>
		<script src="/js/formCtrl.js"></script>
		<script src="/js/calendarCtrl.js"></script>
		
		<script src="/js/forecastFty.js"></script>
		<script src="/js/locationFty.js"></script>
		<script src="/js/destinationFty.js"></script>
		<script src="/js/dateFty.js"></script>
		<script src="/js/urlFty.js"></script>
		<script src="/js/distanceFty.js"></script>
		<script src="/js/alertFty.js"></script>
		<!-- endbuild -->
		
		<script>
			angular.module( 'travelForecastApp', ['ngAnimate'] )

				.controller("appCtrl", appCtrl )
				.controller("mapCtrl", mapCtrl )
				.controller("formCtrl", formCtrl )
				.controller("calendarCtrl", calendarCtrl )
				
				.factory("forecastFty", forecastFty )
				.factory("locationFty", locationFty )
				.factory("destinationFty", destinationFty )
				.factory("dateFty", dateFty )
				.factory("urlFty", urlFty )
				.factory("distanceFty", distanceFty )
				.factory("alertFty", alertFty )
			;
		</script>
		
	</head>
	<body>
		<aside id="loading-mask"
			ng-hide="appUtils.doneLoading">
			<div id="spinner-container">
				<div class="spinner"></div>
			</div>
		</aside>
		<div id="flex-container">
			<header>
				<div id="header-wrapper" class="width-container">
					<div id="logo-container">
						<button
							ng-click="appUtils.clear()"
							ng-disabled="appUtils.destinationFty.loadingDestinations">
							<img src="/img/logo-colored-128.png" alt="">
							<span>Travel Weathr</span>
						</button>
					</div>
					<div id="url-container">
						<label for="short-url">
							Short Link
						</label>
						<input type="text" id="short-url"
							ng-model="appUtils.urlFty.shortUrl"
							ng-focus="appUtils.highlightInput($event)">
					</div>
					<div id="about-container">
						<button id="about-link"
							ng-click="appUtils.alertFty.displayModal(appUtils.alertFty.aboutModal)">
							<span id="about-link-text">
								What is this?
							</span>
							<span id="question-mark-icon">
								?
							</span>
						</button>
					</div>
				</div>
			</header>
			<main>
				<section id="map-container"
					ng-controller="mapCtrl as mapUtils">
					<input type="checkbox" id="hide-map"
						ng-model="mapUtils.hideMap"
						ng-change="appUtils.urlFty.buildUrlParamMap(mapUtils.hideMap)">
					<div id="map-drawer">
						<div id="map"></div>
						<div id="map-ad">
							<div class="money-box">
								<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
								<!-- map ad fixed -->
								<ins class="adsbygoogle"
									 style="display:inline-block;width:300px;height:600px"
									 data-ad-client="ca-pub-7172783409470168"
									 data-ad-slot="4427922737"></ins>
								<script>
									(adsbygoogle = window.adsbygoogle || []).push({});
								</script>
							</div>
						</div>
					</div>
					<label id="hide-map-switch" class="btn-link" for="hide-map">
						Map
					</label>
					<div class="width-container">
						<div class="center-inputs">
							<input id="location-search" type="text" placeholder="Search for a destination"
								ng-model="query"
								ng-model-options="{debounce: 500}"
								ng-change="mapUtils.locationSearch(query)"
								ng-click="mapUtils.showTypeAhead = true; mapUtils.highlightIndex = 0"
								ng-blur="mapUtils.delayHideTypeAhead()"
								ng-keydown="mapUtils.highlightResult($event)">
							<div id="location-type-ahead"
								ng-show="mapUtils.showTypeAhead"
								ng-mouseover="mapUtils.highlightIndex = -1">
								<button class="type-ahead-result"
									ng-repeat="result in mapUtils.typeAheadResults"
									ng-click="mapUtils.setLocation(result)"
									ng-class="{'highlight': mapUtils.highlightIndex == $index}">
									{{ result.name }}
								</button>
							</div>
						</div>
					</div>
				</section>
				<section id="form-container"
					ng-controller="formCtrl as formUtils">
					<div class="center-inputs">
						<div>
							<img id="marker" src="/img/spotlight-poi.png" alt="">
							<p class="label">
								Selected Destination
							</p>
							<h1>
								{{ appUtils.locationFty.locationDetails.name }}
							</h1>
						</div>
						<div id="destination-options">
							<div class="input-container"
								ng-click="formUtils.showStartDatePicker = true">
								<label class="label" for="start-date">
									Arrival
								</label>
								<input type="text" id="start-date" readonly>
							</div>
							<div class="input-container"
								ng-click="formUtils.showEndDatePicker = true">
								<label class="label" for="end-date">
									Departure
								</label>
								<input type="text" id="end-date" readonly>
							</div>
							<button id="add-button" class="btn"
								ng-click="formUtils.attemptAddDestination(appUtils.locationFty.locationDetails, formUtils.startDate, formUtils.endDate)"
								ng-disabled="appUtils.destinationFty.loadingDestinations">
								Add Forecast
							</button>
						</div>
						<div id="alert-message"
							ng-show="appUtils.alertFty.showMessage">
							<span id="alert-message-content"
								ng-class="appUtils.alertFty.messageCssClass">
								{{ appUtils.alertFty.messageContent }}
							</span>
						</div>
						<div class="money-box">
							<a href="http://www.backcountry.com/sc/activities" target="_top">
								<div class="money-text">
									Going on an adventure? <strong>Get the gear you need</strong>
								</div>
								<div class="money-image">
									<img src="/img/backcountry.jpg" width="120" height="60" alt="Backcountry.com Logo Banner" border="0"/>
								</div>
							</a>
						</div>
					</div>
					<div id="view-options"
						ng-hide="appUtils.destinationFty.destinationList.length == 0">
						<input type="radio" id="imperial-units" name="units" value="imperial" class="hidden-radio"
							ng-model="appUtils.forecastFty.units"
							ng-change="formUtils.unitsChanged()">
						<label class="btn btn-small btn-left btn-muted" for="imperial-units">
							F &deg;
						</label>
						<input type="radio" id="metric-units" name="units" value="metric" class="hidden-radio"
							ng-model="appUtils.forecastFty.units"
							ng-change="formUtils.unitsChanged()">
						<label class="btn btn-small btn-right btn-muted" for="metric-units">
							C &deg;
						</label>
						<div class="input-container">
							<label for="sort-by" class="label">
								Sort By
							</label>
							<select id="sort-by"
								ng-model="appUtils.destinationFty.sortBy"
								ng-options="value for value in formUtils.sortOptions"
								ng-change="formUtils.sortChanged()">
							</select>
						</div>
					</div>
					<aside id="pikaday-container">
						<div id="pikaday-background"
							ng-show="formUtils.showStartDatePicker || formUtils.showEndDatePicker"
							ng-click="formUtils.showStartDatePicker = false; formUtils.showEndDatePicker = false"></div>
						<div id="pikaday-start" class="center-pikaday"
							ng-show="formUtils.showStartDatePicker"></div>
						<div id="pikaday-end" class="center-pikaday"
							ng-show="formUtils.showEndDatePicker"></div>
					</aside>
				</section>
				<section id="calendar-container"
					ng-controller="calendarCtrl as calendarUtils">
					<div id="calendar-content">
						<div id="calendar-destinations">
							<table id="destinations-table">
								<thead>
									<tr>
										<th>
											
										</th>
										<th>
											
										</th>
										<th>
											
										</th>
									</tr>
								</thead>
								<tbody ng-repeat="destination in appUtils.destinationFty.destinationList">
									<tr>
										<td class="destination-cell">
											<div class="destination-container">
												<button class="remove-button" title="remove"
													ng-click="calendarUtils.removeSingleDestination($index)"
													ng-disabled="appUtils.destinationFty.loadingDestinations">
													&times;
												</button>
												<div class="float-left">
													<div class="marker">
														{{ $index + 1 }}
													</div>
												</div>
												<div class="destination-name" title="{{ destination.name }}">
													{{ destination.name }}
												</div>
												<div class="destination-hotels">
													<a href="{{ appUtils.urlFty.createPricelineHotelsUrl(destination) }}">
														<span>
															Find a hotel
														</span>
													</a>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td class="estimation-cell">
											<div class="estimation-container"
												ng-hide="$index == appUtils.destinationFty.destinationList.length - 1">
												<div class="float-left varr">
													&varr;
												</div>
												<div>
													Driving:
													<strong>
														{{
															appUtils.distanceFty.distanceList[destination.name]
															[appUtils.destinationFty.destinationList[$index + 1].name].duration.text
														}}
													</strong>
												</div>
												<div>
													<a href="{{ appUtils.urlFty.createDirectionsUrl([
															destination,
															appUtils.destinationFty.destinationList[$index + 1]
														]) }}">
														Get directions</a>
													&mdash;
													<a href="http://www.dpbolvw.net/click-8108989-10392969-1467996812000">
														Search flights
													</a>
												</div>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div id="calendar-weather">
							<table class="weather-table"
								ng-repeat="consecutiveDates in appUtils.dateFty.dateList">
								<thead>
									<tr>
										<th ng-repeat="travelDate in consecutiveDates">
											{{ travelDate | date: 'MMM d' }}
										</th>
									</tr>
								</thead>
								<tbody ng-repeat="destination in appUtils.destinationFty.destinationList">
									<tr>
										<td class="weather-cell"
											ng-repeat="travelDate in consecutiveDates">
											<div class="weather-container"
												ng-show="appUtils.dateFty.dateInArray(travelDate, destination.dates)"
												ng-click="calendarUtils.setSelectedDate(travelDate)">
												<div class="loading-forecast"
													ng-hide="appUtils.forecastFty.forecastList[destination.name]
															[appUtils.dateFty.createDateString(travelDate)]">
													<div class="spinner"></div>
												</div>
												<div class="weather-icon" 
													ng-class="appUtils.forecastFty.forecastList[destination.name]
														[appUtils.dateFty.createDateString(travelDate)].icon">
												</div>
												<div class="high-temp">
													&uarr;
													{{
														appUtils.forecastFty.convertDegrees(
															appUtils.forecastFty.forecastList[destination.name]
															[appUtils.dateFty.createDateString(travelDate)].high
														)
													}}&deg;
												</div>
												<div class="low-temp">
													&darr;
													{{
														appUtils.forecastFty.convertDegrees(
															appUtils.forecastFty.forecastList[destination.name]
															[appUtils.dateFty.createDateString(travelDate)].low
														)
													}}&deg;
												</div>
												<div class="rain-chance">
													&becaus;
													{{
														appUtils.forecastFty.forecastList[destination.name]
														[appUtils.dateFty.createDateString(travelDate)].precip
													}}%
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td class="weather-text-cell"
											ng-repeat="travelDate in consecutiveDates">
											<div class="weather-text-container"
												ng-show="appUtils.dateFty.dateInArray(travelDate, destination.dates) &&
													appUtils.dateFty.datesEqual(travelDate, calendarUtils.selectedDate)"
												ng-style="{'width': (appUtils.forecastFty.forecastList[destination.name]
													[appUtils.dateFty.createDateString(travelDate)].text.length / 4) + 'rem'}">
												<p class="weather-text">
													{{
														appUtils.forecastFty.forecastList[destination.name]
														[appUtils.dateFty.createDateString(travelDate)].text
													}}
												</p>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>
				<section id="main-footer">
					<div id="batch-controls"
						ng-hide="appUtils.destinationFty.destinationList.length < 2">
						<button class="btn-link btn-link-alt"
							ng-click="appUtils.clear()"
							ng-disabled="appUtils.destinationFty.loadingDestinations">
							Remove All Destinations
						</button>
						&nbsp;
						<a href="{{ appUtils.urlFty.createDirectionsUrl(appUtils.destinationFty.destinationList) }}">
							Directions to All Destinations
						</a>
					</div>
					<div class="money-box">
						<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
						<!-- small footer ad -->
						<ins class="adsbygoogle"
							 style="display:inline-block;width:320px;height:100px"
							 data-ad-client="ca-pub-7172783409470168"
							 data-ad-slot="9787968738"></ins>
						<script>
							(adsbygoogle = window.adsbygoogle || []).push({});
						</script>
					</div>
				</section>
				<section>
					<a href="http://forecast.io/" class="credit-link">
						Powered by Forecast
					</a>
					<span id="copyright">
						&copy; Eric Sadowski
					</span>
				</section>
			</main>
		</div>
		
		<aside class="modal-container"
			ng-show="appUtils.alertFty.showModal">
			<button class="modal-background"
				ng-click="appUtils.alertFty.hideModal()"></button>
			<div class="modal-box">
				<div ng-repeat="section in appUtils.alertFty.modalContent.content">
					<h3>
						{{ section.title }}
					</h3>
					<p ng-repeat="paragraph in section.text"
						ng-bind-html="paragraph">
					</p>
				</div>
				<button class="call-to-action"
					ng-click="appUtils.alertFty.hideModal()">
					{{ appUtils.alertFty.modalContent.buttonText }}
				</button>
			</div>
		</aside>
		
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-80286588-1', 'auto');
			ga('send', 'pageview');
			
		</script>
			
	</body>
</html>


















































