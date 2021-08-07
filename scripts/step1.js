"use strict"

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
      //encode query keys and values
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(data[key]);

      params += encodedKey + "=" + encodedValue;
    }
  }
  let script = document.createElement('script'); //add url into html
  script.src = url + params;
  document.body.appendChild(script);
}

/* function to store list of ports into local storage. */
function storePortList()
{
  let string = JSON.stringify(localList);
	localStorage.setItem("storkey", string);
}

/* function to retrieve list of ports from local storage */
function retrievePortList()
{
	let dataObject = JSON.parse(localStorage.getItem("storkey"));
	// restore the global port list (localList) with the data retrieved.
  if (dataObject !== null)//if local storage has data stored...
  {
    localList.fromData(dataObject);
    countryList = localList.countries;//updates global country list.
    createOptions();//overwrite drop down list.
  }
  else if (dataObject == null)//if local storage has no data...
  {
    jsonpRequest(portUrl, data); //obtain list of ports from API.
  }
}

/* callback function for jsonp request.
takes in API output as parameters.
Adds port one by one into global port list array. */
function createPortList(param)
{
  for (let i = 0; i < param.ports.length; i++)//for each port in API output...
  {
    let newPort = new Port();
    newPort.fromAPI(param.ports[i]);
    localList.addPort(newPort);
  }
  countryList = localList.countries;//updates global country list.
  createOptions();
}

/* function to create drop down selections of countries.
within the already created <select> tag, create <option> tag for each country. */
function createOptions()
{
  let el = document.getElementById("countrySelect");//within <select> tag...
  let output = "<option>Select</option>";
  for (let i = 0; i < countryList.length; i++)//create <option> tag for each country.
  {
    let name = countryList[i];
    if (name == null) {name = "miscellaneous";}//placeholder for assigning ports into corresponding countries.
    output += "<option value=\"" + name + "\">" + name + "</option>";
  }
  el.innerHTML = output;
}

/* function to create markers of ports in a country of interest.
takes in list of ports of a country as parameter.
 */
function setMarkers(portList)
{
  for (let i = 0; i < portList.length; i++)
  {
    let port = portList[i];
    let coord = new mapboxgl.LngLat(port.lng, port.lat);
    if (i == 0) {map.panTo(coord);} //Using the first port to pan to the country of interest.

    let marker = new mapboxgl.Marker({"color":"#808080"});//create marker and popup for each port.
  	marker.setLngLat(coord);

  	let popup = new mapboxgl.Popup({ offset: 45});
  	let text = port.name;
  	popup.setHTML("<b><center>" + text + "</center></b><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" onclick=\"setOrigin(\'" + text + "\')\">Set Origin</button>");
  	marker.setPopup(popup);
  	marker.addTo(map);
    currentMarkers.push(marker);
  }
}

/*function to remove markers.
takes in current array of markers as parameter.
*/
function removeMarkers(currentMarkers)
{
  if (currentMarkers.length !== 0)//if there are markers on the page...
  {
    for (let i = 0; i < currentMarkers.length; i++)
    {
      currentMarkers[i].remove();//remove markers one by one.
    }
  }
}

/* function to zoom to country of interest.
Is run when selected country is changed.
 */
function newZoom()
{
  let country = document.getElementById("countrySelect").value;
  filteredPorts = localList.selectPorts(country); //picks out ports of the country from localList.
  removeMarkers(currentMarkers);
  setMarkers(filteredPorts);
}

/* function to set origin.
takes in a name of a port as input.
selects the port from localList, overwrites global variable, prints result onto web page. */
function setOrigin(name)
{
  let port = localList.pickPortFromName(name);
  origin = port;//overwrite global variable.
  originHTML();

  route.origin = origin;
  route.wayPoints = []; //remove all way points.
  route.ship = "";
  route.departureDate = "";
  route.eta = "";
  route.distCalc();
  localStorage.setItem("route", JSON.stringify(route));

  addOriginMarker();
  localStorage.setItem("origin",JSON.stringify(origin));//store origin in local storage.
  storePortList(); //store port list into local storage.
  document.getElementById("next").removeAttribute("disabled");//enable user to proceed.
}

/*Function to add origin in HTML.
*/
function originHTML()
{
  let outputRef = document.getElementById("originDisplay");
  let output = "<h3 style=\"display: inline\">Chosen Origin: ";//display chosen origin to user.
  output += origin.name + "</h3><br/>";
  output += "<b>Latitude: </b>" + origin.lat + "<br/>";
  output += "<b>Longitude: </b>" + origin.lng + "<br/>";
  outputRef.innerHTML = "";
  outputRef.innerHTML = output;
}

/*fnction to add a special coloured marker onto map for origin*/
function addOriginMarker()
{
  removeMarkers(originMarker);
  originMarker = [];

  let coord = new mapboxgl.LngLat(origin.lng, origin.lat);
  let marker = new mapboxgl.Marker({"color":"#FF8C00"});//create marker and popup for each port.
  marker.setLngLat(coord);
  marker.addTo(map);
  originMarker.push(marker);
}


//CODE for the page
let step = "planNewRoute.html";
if (typeof(Storage) !== "undefined")
{
	console.log("localStorage is available.");
	localStorage.setItem("step", step); // store user's current step.
}
else
{
	console.log("localStorage is not supported by current browser.");
}

let portUrl = "https://eng1003.monash/api/v1/ports/"; //base url for ports API
let data = {
  callback: "createPortList"//callback function for port API
}

//initialise country list, ports list(localList), filtered ports, current markers, and origin.
let countryList = [];
let localList = new ListOfPorts("List")
let filteredPorts = [];
let currentMarkers = [];
let origin = {};
let originMarker = [];
let portO = new Port();

if (typeof(Storage) !== "undefined")//Obtain list of ports from local storage (if data is stored.)
{
	console.log("localStorage is available.");
	retrievePortList(); // retrieves from local storage. otherwise, jsonprequest.
}
else
{
	console.log("localStorage is not supported by current browser.");
}

//initialise a map
mapboxgl.accessToken = "pk.eyJ1IjoiYWxleGFuZGVyNDI3IiwiYSI6ImNrMGVuNDRtbDAxZ3AzZ3BzYnJxcTE5M2cifQ.Qsm-WEsF5NzbgxQuATkFww";
let map = new  mapboxgl.Map({
   container: 'map',
  center: [144.9648731,-37.8182711],
  zoom: 1,
  style: 'mapbox://styles/mapbox/streets-v9'
});

let storedOrigin = JSON.parse(localStorage.getItem("origin"));
// restore the origin with the data retrieved.
if (storedOrigin !== null)//if local storage has data stored...
{
  portO.fromData(storedOrigin);
  origin = portO;
  map.on('style.load', function () {//initial path display.
    addOriginMarker();
    originHTML();
  })
  let coordO = new mapboxgl.LngLat(origin.lng, origin.lat);
  map.panTo(coordO);
  document.getElementById("next").removeAttribute("disabled");//enable user to proceed.
}

let route = new Route(); //Dummy route for update when origin is set.
let storedRoute = JSON.parse(localStorage.getItem("route"));
if (storedRoute !== null)//if local storage has data stored...
{
  route.fromData(storedRoute);
}
