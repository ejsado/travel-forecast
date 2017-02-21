/**
* Travel Weather - build a weather forecast calendar
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

function mapCtrl(locationFty) {
	
	var self = this;
	
	//self.hideMap = urlFty.getUrlMap();
	
	var radarImages = [
		{
			image: "usa.png",
			bounds: {
				south: 15,
				west: -170,
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
				opacity: 0.4,
				clickable: false
			}
		);
	}
	
	
}




















