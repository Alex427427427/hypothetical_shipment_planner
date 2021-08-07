"use strict"

/*function to retrieve route from local storage.
*/
function retrieveRoute()
{
  let dataObject = JSON.parse(localStorage.getItem("route"));
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
function confirmRoute()
{
  routeList.addRoute(route);
  shipList.addressShipFromName(route.ship.name);
  localStorage.setItem("routeList", JSON.stringify(routeList));//store route list.
  localStorage.setItem("shipList", JSON.stringify(shipList));//store ship list.
  localStorage.removeItem("route");//clear all other stored data.
  localStorage.removeItem("origin");
  localStorage.removeItem("destination");
  localStorage.setItem("step", "planNewRoute.html");//Reset use progress back to step 1.
  window.location.replace("confirmedRoutes.html");
}

/*function to reset all progress*/
function resetRoute()
{
  localStorage.removeItem("route");
  localStorage.removeItem("origin");
  localStorage.removeItem("destination");
  localStorage.setItem("step", "planNewRoute.html");//Reset use progress back to step 1.
  window.location.replace("planNewRoute.html");
}



//CODE for the page
//instantiate route
let route = new Route();
let routeList = new ListOfRoutes();
let shipList = new ListOfShips();
//current step
let step = "step6.html";
if (typeof(Storage) !== "undefined")
{
	console.log("localStorage is available.");
	localStorage.setItem("step", step); // store user's current step.
}
else
{
	console.log("localStorage is not supported by current browser.");
}

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

let outputRef = document.getElementById("displayArea");//write into displayArea
let output = "";
output += "<h4><b>Origin: </b>" + route.origin.name + "</h4>";
output += "<h4><b>Destination: </b>" + route.destination.name + "</h4>";
output += "<h4><b>Ship: </b>" + route.ship.name + "</h4>";
output += "<h4><b>Total cost: </b>$" + route.cost + "</h4>";
output += "<h4><b>Departure Date: </b>" + departString + "</h4>";
output += "<h4><b>ETA: </b>" + etaString + "</h4>";
outputRef.innerHTML = output;




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
