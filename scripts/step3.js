"use strict";
/* function to retrieve origin and destination from local storage.*/
function retrievePorts()
{
  origin.fromData(JSON.parse(localStorage.getItem("origin"))); //overwrites origin and destination global var.
  destination.fromData(JSON.parse(localStorage.getItem("destination")));
}

/* function to store list of ports into local storage. */
function storeRoute()
{
  let string = JSON.stringify(route);
	localStorage.setItem("route", string);
}

/*function to retrieve route from local storage.
*/
function retrieveRoute()
{
  let dataObject = JSON.parse(localStorage.getItem("route"));
	// restore the global port list (localList) with the data retrieved.
  if (dataObject !== null)//if local storage has data stored...
  {
    route.fromData(dataObject);
    route.origin = origin;
    route.destination = destination;
  }
  else if (dataObject == null)//if local storage has no data...
  {
    route.distCalc();
  }
}

/*function to write html display of all way points. */
function showWayPoints()
{
  if (route.wayPoints.length !== 0)
  {
    let outputRef = document.getElementById("waypointDisplay");
    let output = "";
    output += "<h3 style=\"display: inline\">Chosen Waypoints:</h3><br/>";
    for (let i = 0; i < route.wayPoints.length; i++) //for each way point, print its position
    {
      let j = i+1;
      output += "<b>Waypoint " + j + ": </b>longitude = " + route.wayPoints[i].lng + ", latitude = " + route.wayPoints[i].lat + "<br/>";
    }
    output += "<br/>"
    //add a button to reset waypoints.
    output += "<button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color-text--white mdl-color--red-500\" onclick=\"resetWayPoints()\">Reset Waypoints</button><br/><br/>"
    outputRef.innerHTML = output;
  }
}

/* function to add a way point on click.
Uses route class method to append way point into route instance.
Displays chosen waypoints. */
function addWaypoint()
{
  let lng = document.getElementById("lng").value;
  let lat = document.getElementById("lat").value;

  let coords = {
    lng: lng,
    lat: lat
  }
  route.addWayPoint(coords);// class method to append way point.
  showWayPoints();//Display all way points in HTMl.

  route.distCalc();
  route.ship = "";//reset any other future step attribute
  route.departureDate = "";
  route.eta = "";
  displayRoute();
  displayDist();
  storeRoute();
}

/*function to reset all way points.
clears the waypoints array in route class instance.
removes display of chosen waypoints.*/
function resetWayPoints()
{
  route.wayPoints = [];
  route.ship = "";//reset any other future step attribute
  route.departureDate = "";
  route.eta = "";
  pointList = [];
  removeMarkers();
  route.distCalc();
  displayDist();
  let outputRef = document.getElementById("waypointDisplay");
  let output = "";
  outputRef.innerHTML = output;

  displayRoute();
  storeRoute();
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

/*function to display the distance of the route.
Uses route class method to calculate distance
Then prints into html.*/
function displayDist()
{
  let outputRef = document.getElementById("other");
  let output = "";
  output += "<b>Total distance: </b>" + Math.round(route.distance) + "km<br/>";
  outputRef.innerHTML = output;
}

/*function to reset all progress of user*/
function resetRoute()
{
  localStorage.removeItem("route");//remove all stored data
  localStorage.removeItem("origin");
  localStorage.removeItem("destination");
  localStorage.setItem("step", "planNewRoute.html");//Reset use progress back to step 1.
  window.location.replace("planNewRoute.html");
}





//CODE for the page
let pointList = [];
let currentMarkers = [];
let step = "step3.html";
if (typeof(Storage) !== "undefined")
{
	console.log("localStorage is available.");
	localStorage.setItem("step", step); // store user's current step.
}
else
{
	console.log("localStorage is not supported by current browser.");
}

//Declare new ports for origin and destination
let origin = new Port();
let destination = new Port();

if (typeof(Storage) !== "undefined")//Obtain origin and destination from local storage (if data is stored.)
{
	console.log("localStorage is available.");
	retrievePorts();
}
else
{
	console.log("localStorage is not supported by current browser.");
}

//Create new Route class with the obtained origin and destination.
let route = new Route(origin, destination);
if (typeof(Storage) !== "undefined")//Obtain route from local storage (if data is stored.)
{
	console.log("localStorage is available.");
	retrieveRoute();
  route.distCalc();
  storeRoute();
}
else
{
	console.log("localStorage is not supported by current browser.");
}

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
  displayDist();
})

//Display way points.
showWayPoints();

//CODE to allow setting waypoint by clicking
//first, display current mouse position
map.on('mousemove', function (e) {
document.getElementById('info').innerHTML =

// e.lngLat is the longitude, latitude geographical position of the event
JSON.stringify(e.lngLat.wrap());


});
//then, obtain mouseposition and add to waypoints
map.on('click', function(e) {
  let coords = e.lngLat;
  route.addWayPoint(coords);// class method to append way point.
  showWayPoints();//Display all way points in HTMl.

  route.distCalc();
  route.ship = "";//reset any other future step attribute
  route.departureDate = "";
  route.eta = "";
  displayRoute();
  displayDist();
  storeRoute();
})
