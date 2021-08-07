"use strict"

/*function to retrieve route from local storage.
*/
function retrieveRoute()
{
  let dataObject = JSON.parse(localStorage.getItem("viewRoute"));
	// restore the global port list (localList) with the data retrieved.
  if (dataObject !== null)//if local storage has data stored...
  {
    route.fromData(dataObject);
  }
}

/*function to retrieve route list from local storage.
*/
function retrieveRouteList()
{
  let dataObject = JSON.parse(localStorage.getItem("routeList"));
	// restore the global list with the data retrieved.
  if (dataObject !== null)//if local storage has data stored...
  {
    routeList.fromData(dataObject);
  }
}


/* function to do jsonp request.
takes in base url, and query keys as parameters.
returns API result within callback function. */
function jsonpRequest(url, data)
{
	// Build URL parameters from data object.
	let params = "";
	// For each key in data object...
	for (let key in data)
	{
		if (data.hasOwnProperty(key))
		{
			if (params.length == 0)
			{
				// First parameter starts with '?'
				params += "?";
			}
			else
			{
				// Subsequent parameter separated by '&'
				params += "&";
			}

			let encodedKey = encodeURIComponent(key);
			let encodedValue = encodeURIComponent(data[key]);

			params += encodedKey + "=" + encodedValue;
		}
	}
	let script = document.createElement('script');
	script.src = url + params;
	document.body.appendChild(script);
}

/*function to receive weather data from Dark Sky API.
Takes in a coordinate as input.
obtains data as parameters to pass to callback function to execute. */
function getWeather(lat,lng)
{
		let url = "https://api.darksky.net/forecast/77316f37377c4364a6af829131d16d17/";
		url += lat + "," + lng + "/";//append coordinates into url.

		jsonpRequest(url, data);
}

/*function to overwrite weather class instance and display for user.
takes in result of API as input.
First overwrites a dummy global variable, then uses it to create a weather class instance, and displays it.*/
function obtainOriginWeather(parameter)
{
	let dayDiff = ((departureDate - currentDate)/86400000).toFixed(0); //Calculate difference in days from milliseconds

	if (dayDiff <= 7)//if date is within 7 days into the future...
	{
		dummyWeather = {
			summary: parameter.daily.data[dayDiff].summary,
			minTemp: parameter.daily.data[dayDiff].temperatureMin,
			maxTemp: parameter.daily.data[dayDiff].temperatureMax,
			humidity: parameter.daily.data[dayDiff].humidity,
			dewPoint: parameter.daily.data[dayDiff].dewPoint,
			windSpeed: parameter.daily.data[dayDiff].windSpeed,
			windBearing: parameter.daily.data[dayDiff].windBearing,
			uvIndex: parameter.daily.data[dayDiff].uvIndex,
			visibility: parameter.daily.data[dayDiff].visibility
	}

	let weather = new Weather(dummyWeather.summary,dummyWeather.minTemp,dummyWeather.maxTemp,dummyWeather.humidity,dummyWeather.dewPoint,dummyWeather.windSpeed,dummyWeather.windBearing,dummyWeather.uvIndex,dummyWeather.visibility)
	weatherOrigin = weather;//overwrite global weather variable.
	route.weatherOrigin = weatherOrigin;
	localStorage.setItem("route", JSON.stringify(route));
	let outputReference = document.getElementById("dateDisplay");
	let output = "<h4 style=\"display: inline\"><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Departure Date: </b>";
	output += departureDate.getDate() + "/" + departureDateMonth + "/" + departureDate.getFullYear() + "</h4><br/><b>Weather at Origin: </b>";
	output +=  weatherOrigin.toString() + "<br/><br/>";//uses toString method to print weather in HTML.
	outputReference.innerHTML = output;
	}
	else//if date is more than 7 days into the future...
	{
		let outputReference = document.getElementById("dateDisplay");
		let output = "<h4 style=\"display: inline\"><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Departure Date: </b>";
		output += departureDate.getDate() + "/" + departureDateMonth + "/" + departureDate.getFullYear() + "</h4><br/><b>Weather at Origin: </b>";
		output += "Weather not available until 7 days before departure.";//notify user weather data is unavailable.
		outputReference.innerHTML = output;
	}
}

/*function to overwrite weather class instance and display for user.
takes in result of API as input.
First overwrites a dummy global variable, then uses it to create a weather class instance, and displays it.*/
function obtainDestWeather(parameter)
{
	let dayDiff = ((eta - currentDate)/86400000).toFixed(0); //Calculate difference in days from milliseconds

	if (dayDiff <= 7)
	{
		dummyWeather = {
			summary: parameter.daily.data[dayDiff].summary,
			minTemp: parameter.daily.data[dayDiff].temperatureMin,
			maxTemp: parameter.daily.data[dayDiff].temperatureMax,
			humidity: parameter.daily.data[dayDiff].humidity,
			dewPoint: parameter.daily.data[dayDiff].dewPoint,
			windSpeed: parameter.daily.data[dayDiff].windSpeed,
			windBearing: parameter.daily.data[dayDiff].windBearing,
			uvIndex: parameter.daily.data[dayDiff].uvIndex,
			visibility: parameter.daily.data[dayDiff].visibility
		}

		let weather2 = new Weather(dummyWeather.summary,dummyWeather.minTemp,dummyWeather.maxTemp,dummyWeather.humidity,dummyWeather.dewPoint,dummyWeather.windSpeed,dummyWeather.windBearing,dummyWeather.uvIndex,dummyWeather.visibility)
		weatherDest = weather2;//overwrite global weather variable.
		route.weatherDest = weatherDest;
		localStorage.setItem("route", JSON.stringify(route));
		let outputReference2 = document.getElementById("dateDisplay2");
		let output2 = "<h4 style=\"display: inline\"><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Arrival Date: </b>";
		output2 += eta.getDate() + "/" + etaMonth + "/" + eta.getFullYear() + "</h4><br/><b>Weather at Destination: </b>";
		output2 +=  weatherDest.toString() + "<br/><br/>";//uses toString method to print weather in HTML.
		outputReference2.innerHTML = output2;
		//display();
	}
	else//if date is more than 7 days into the future...
	{
		let outputReference2 = document.getElementById("dateDisplay2");
		let output2 = "<h4 style=\"display: inline\"><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Arrival Date: </b>";
		output2 += eta.getDate() + "/" + etaMonth + "/" + eta.getFullYear() + "</h4><br/><b>Weather at Destination: </b>";
		output2 += "Weather not available until 7 days before departure.";//notify user weather data is unavailable.
		outputReference2.innerHTML = output2;
	}
}


/*function to display the route.
Creates a coordinates array from all way points.
Then creates a geojson line object and displays on map.*/
function displayRoute()
{
  let coordinates = [];//initialise coordinates array
  let originPoint = [route.origin.lng, route.origin.lat];
  coordinates.push(originPoint);//first point is the origin.
  if (route.wayPoints.length > 0)
  {
    for (let i = 0; i < route.wayPoints.length; i++)//add all way points in order.
    {
      let point = [route.wayPoints[i].lng, route.wayPoints[i].lat];
      coordinates.push(point);
    }
  }
  let destPoint = [route.destination.lng, route.destination.lat];
  coordinates.push(destPoint);//last point is the destination.
  pointList = coordinates;

  geoObject.data.geometry.coordinates = coordinates;

  if (layerState == true) //if layer already exists, remove layer.
  {
    map.removeLayer("route");
    map.removeSource("route");
  }

  removeMarkers(); // Remove, then add all markers.
  setMarkers();

  map.addLayer({
  id: "route",
  type: "line",
  source: geoObject,
  layout: { "line-join": "round", "line-cap": "round" },
  paint: { "line-color": "#888", "line-width": 6 }
  });
  layerState = true; //layer now exists on map.
}

/* function to create markers of waypoints.
takes in list of waypoints of a route as parameter.
 */
function setMarkers()
{
  for (let i = 1; i < pointList.length-1; i++)
  {
    let coord = pointList[i];
    let marker = new mapboxgl.Marker({"color":"#808080"});//create marker and popup for each port.
  	marker.setLngLat(coord);
  	marker.addTo(map);
    currentMarkers.push(marker);
  }
}

/*function to remove markers.
takes in current array of markers as parameter.
*/
function removeMarkers()
{
  if (currentMarkers.length !== 0)//if there are markers on the page...
  {
    for (let i = 0; i < currentMarkers.length; i++)
    {
      currentMarkers[i].remove();//remove markers one by one.
    }
  }
}

/*function to write route into route list.*/
function back()
{
  localStorage.removeItem("viewRoute");//clear all other stored data.
  window.location.replace("confirmedRoutes.html");
}

/*function to reset all progress*/
function cancelShipment()
{
  routeList.cancelRouteById(route.id, shipList);
  localStorage.setItem("routeList", JSON.stringify(routeList));
  localStorage.removeItem("viewRoute");
  window.location.replace("confirmedRoutes.html");
}



//CODE for the page
//instantiate route
let route = new Route();
let routeList = new ListOfRoutes();
let shipList = new ListOfShips();

if (typeof(Storage) !== "undefined")//Obtain route from local storage (if data is stored.)
{
	console.log("localStorage is available.");
	retrieveRoute();
  retrieveRouteList();
  shipList.fromData(JSON.parse(localStorage.getItem("shipkey")));
}
else
{
	console.log("localStorage is not supported by current browser.");
}



//CODE to display route info
//create date strings
let departureDate = new Date(route.departureDate);
let departureDateMonth = departureDate.getMonth() + 1;
let departString = departureDate.getDate() + "/" + departureDateMonth + "/" + departureDate.getFullYear();
let eta = new Date(route.eta);
let etaMonth = eta.getMonth() + 1;
let etaString = eta.getDate() + "/" + etaMonth + "/" + eta.getFullYear();
let status = "";
let cancelAllowed = false;
if (route.status == "confirmed") {status = "upcoming"; cancelAllowed = true;}
else if (route.status == "inProgress") {status = "in progress";}
else if (route.status == "complete") {status = "complete";}

let outputRef = document.getElementById("displayArea");//write into displayArea
let output = "";
output += "<h4><b>  &nbsp;&nbsp;&nbsp;&nbsp;  Origin: </b>" + route.origin.name + "</h4>";
output += "<h4><b>  &nbsp;&nbsp;&nbsp;&nbsp;  Destination: </b>" + route.destination.name + "</h4>";
output += "<h4><b>  &nbsp;&nbsp;&nbsp;&nbsp;  Ship: </b>" + route.ship.name + "</h4>";
output += "<h4><b>  &nbsp;&nbsp;&nbsp;&nbsp;  Total cost: </b>$" + route.cost + "</h4>";
output += "<h4><b>  &nbsp;&nbsp;&nbsp;&nbsp;  Status: </b>" + status + "</h4>";
outputRef.innerHTML = output;

if (cancelAllowed)
{
  document.getElementById("buttons").innerHTML = "<button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--red-500 mdl-color-text--white\" onclick=\"cancelShipment()\">Cancel Shipment</button>      ";
}
document.getElementById("buttons").innerHTML += "<button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"back()\">Back</button>";



//CODE for weather update
//Initialise all variables
let currentDate = new Date();

let weatherOrigin = "";
let weatherDest = "";

let dummyWeather = {}; //create dummy variable for later computation

let data = {//data for jsonprequest
	exclude: "minutely,hourly",
	units: "si",
	callback: ""
};
data.callback = "obtainOriginWeather";
getWeather(route.origin.lat, route.origin.lng);
data.callback = "obtainDestWeather";
getWeather(route.destination.lat, route.destination.lng);



//CODE for map display
//Prepare global variables for map display
let pointList = [];
let currentMarkers = [];
//Prepare global variables of origin and destination for map display.
let origin = route.origin;
let destination = route.destination;

mapboxgl.accessToken = "pk.eyJ1IjoiYWxleGFuZGVyNDI3IiwiYSI6ImNrMGVuNDRtbDAxZ3AzZ3BzYnJxcTE5M2cifQ.Qsm-WEsF5NzbgxQuATkFww";

//Initialise map, zoomed into origin.
let map = new  mapboxgl.Map({
   container: 'map',
  center: [route.origin.lng,route.origin.lat],
  zoom: 2,
  style: 'mapbox://styles/mapbox/streets-v9'
});

let markerOrigin = new mapboxgl.Marker(); //Display marker for oirigin
markerOrigin.setLngLat([route.origin.lng,route.origin.lat]);
let popupOrigin = new mapboxgl.Popup({ offset: 45});
popupOrigin.setText("Origin: " + origin.name);
markerOrigin.setPopup(popupOrigin);
markerOrigin.addTo(map);
popupOrigin.addTo(map);

let markerDest = new mapboxgl.Marker({"color":"#FF8C00"});//display marker for destination
markerDest.setLngLat([route.destination.lng,route.destination.lat]);
let popupDest = new mapboxgl.Popup({ offset: 45});
popupDest.setText("Destination: " + destination.name);
markerDest.setPopup(popupDest);
markerDest.addTo(map);
popupDest.addTo(map);

let geoObject = { // initialise geojson object
  type: "geojson",
  data: {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: []
    }
  }
};
let layerState = false; //variable to determine whether a layer exists and needs to be removed.
map.on('style.load', function () {//initial path display.
  displayRoute();
})

//Determine current user progress in planning route
let step = "planNewRoute.html";
if (typeof(Storage) !== "undefined")
{
	console.log("localStorage is available.");
	step = localStorage.getItem("step"); // store user's current step.
}
else
{
	console.log("localStorage is not supported by current browser.");
}
//Set navigation for plan routes, with saved Progress
let stepNav = "<a class=\"mdl-navigation__link\" href=\"" + step + "\"><i class=\"material-icons\">library_books</i> <b>Plan New Route</b></a>";
document.getElementById("stepNav").innerHTML = stepNav;
let stepDrawer = "<a class=\"mdl-navigation__link\" href=\"" + step + "\"><i class=\"material-icons\">library_books</i> <b>Plan New Route</b></a>";
document.getElementById("stepDrawer").innerHTML = stepDrawer;
