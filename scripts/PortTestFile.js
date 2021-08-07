"use strict";

function generatePortList(portList)//where portlist is the API result
{
  for(let i=0;i<portList.ports.length;i++)
  {
    port[i] = new Port(portList.ports[i].name,portList.ports[i].lat,portList.ports[i].lng,portList.ports[i].country);
    locallist.addPort(port[i]);
  }

    // List view section heading: Flight list
  let listHTML = "<tr> <th class=\"mdl-data-table__cell--non-numeric\">Port Name</th> <th class=\"mdl-data-table__cell--non-numeric\">Latitude</th> <th class=\"mdl-data-table__cell--non-numeric\">Longitude</th> </tr>";

    // Generate some HTML table rows for the routes array
  if(document.getElementById("portCountrySelect").value=="Select")
  {
    for (let i = 0; i < port.length; i++)
    {
      let name =  port[i].name;
      console.log(name)
      listHTML += "<tr> <td class=\"mdl-data-table__cell--non-numeric\">" + name + "</td> <td class=\"mdl-data-table__cell--non-numeric\">"+ port[i].lat + "</td> <td class=\"mdl-data-table__cell--non-numeric\">" + port[i].lng + "</td>";
      listHTML += "<td> <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" onclick=\"MapPan('"+ name +"')\">View</a></td> </tr>"
    }
  }
  else
  {
    for (let i = 0; i < port.length; i++)
    {
      let country = port[i].country
      if(country !== null)
      {
        if(country.toUpperCase() == (document.getElementById("portCountrySelect").value).toUpperCase())
        {
          let name =  port[i].name;
          console.log(name)
          listHTML += "<tr> <td class=\"mdl-data-table__cell--non-numeric\">" + name + "</td> <td class=\"mdl-data-table__cell--non-numeric\">"+ port[i].lat + "</td> <td class=\"mdl-data-table__cell--non-numeric\">" + port[i].lng + "</td>";
          listHTML += "<td> <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" onclick=\"MapPan('"+ name +"')\">View</a></td> </tr>"
        }
      }
    }
  }
  StorePortList()

    // Insert the list view elements into the flights list.
  portListElement.innerHTML = listHTML;
}

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

//Local storage
function StorePortList()
{
	localStorage.setItem("storkey",JSON.stringify(locallist))
}

function retrievePortList()
{
	// write some code here to :
	// 1. retrieve the deck from local storage
	let data = JSON.parse(localStorage.getItem("storkey"))
	// 2. restore the global deck variable (theDeck) with the data retrieved in 1.
  if (data !== null)
  {
    locallist.fromData(data)
  }
  else
  {
    let data = {
        callback: "generatePortList"
    };
    jsonpRequest("https://eng1003.monash/api/v1/ports/",data)
  }
}

function addPort(result)
{
  let name = document.getElementById("portName").value;
  let size = document.getElementById("portSize").value;
  let type = document.getElementById("portType").value;
  let lng =(Number(result.results[0].bounds.northeast.lng)+Number(result.results[0].bounds.southwest.lng))/2;
  let lat =(Number(result.results[0].bounds.northeast.lat)+Number(result.results[0].bounds.southwest.lat))/2;
  let port = new Port(name,lat,lng,result.results[0].components.country);

  if (size.length == 0 || size == null || type.length == 0 || type == null) {}
  else {
    port.size = size
    port.type = type
  }

  console.log(port)
  locallist.addPort(port);
  StorePortList()
}

function addLocalPorts()
{
	let portList = locallist._ports;
	let output = "<tr> <th class=\"mdl-data-table__cell--non-numeric\">Port Name</th> <th class=\"mdl-data-table__cell--non-numeric\">Latitude</th> <th class=\"mdl-data-table__cell--non-numeric\">Longitude</th> </tr>";

  if(document.getElementById("portCountrySelect").value=="Select")
  {
    for (let i = 0; i < portList.length; i++)
    {
      let name =  portList[i].name;
      output += "<tr> <td class=\"mdl-data-table__cell--non-numeric\">" + name + "</td> <td class=\"mdl-data-table__cell--non-numeric\">"+ portList[i].lat + "</td> <td class=\"mdl-data-table__cell--non-numeric\">" + portList[i].lng + "</td>";
      output += "<td> <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" onclick=\"MapPan('"+ name +"')\">View</a></td> </tr>"
    }
  }
  else
  {
    for (let i = 0; i < portList.length; i++)
    {
      let country = portList[i].country
      if(country !== null)
      {
        if(country.toUpperCase() == (document.getElementById("portCountrySelect").value).toUpperCase())
        {
          let name =  portList[i].name;
          output += "<tr> <td class=\"mdl-data-table__cell--non-numeric\">" + portList[i].name + "</td> <td class=\"mdl-data-table__cell--non-numeric\">"+ portList[i].lat + "</td> <td class=\"mdl-data-table__cell--non-numeric\">" + portList[i].lng + "</td>";
          output += "<td> <a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" onclick=\"MapPan('"+ name +"')\">View</a></td> </tr>"
        }
      }
    }
  }


  portListElement.innerHTML = output
}

function createOptions(portList)
{
  let el = document.getElementById("portCountrySelect");//within <select> tag...
  let output = "<option>Select</option>";
  let countryList = [];

  for(let i =0; i<portList.ports.length; i++)
  {
    let country = portList.ports[i].country
    if (countryList.includes(country) != true)
    {
      countryList.push(country)
    }
  }
  countryList.sort();

  for (let i = 0; i < countryList.length; i++)//create <option> tag for each country.
  {
    let name = countryList[i]
    if (name == null) {name = "Miscellaneous";}//placeholder for assigning ports into corresponding countries.
    output += "<option value=\"" + name + "\">" + name + "</option>";
  }
  el.innerHTML = output;
}


//Code to create list of ports
let portListElement = document.getElementById("table1")
let port = []; //global array of all ports.
let currentMarker = [];




//Code for list of ports.
let locallist = new ListOfPorts("List")

//Create list of options of countries
let data2 = {
  callback: "createOptions"
}
jsonpRequest("https://eng1003.monash/api/v1/ports/",data2)


function sortPortList()
{
  if (typeof(Storage) !== "undefined")
  {
  	console.log("localStorage is available.");
  	retrievePortList()
    addLocalPorts()
  }
  else
  {
  	console.log("localStorage is not supported by current browser.");
  }
}


function OpenCage()
{
  let name = document.getElementById("portName").value;
  let address = document.getElementById("portAddress").value;
  if (name.length == 0 || name == null || address.length == 0 || address == null)
  {
    alert("Please at least enter a name and an address for the port.")
  }
  else {
    let data3 =
    {
      q: address,
      key: "71640ac418c9421788fc5d5c9fea91f2",
      callback: "addPort"
    }
    jsonpRequest("https://api.opencagedata.com/geocode/v1/json",data3)
  }
}


mapboxgl.accessToken = "pk.eyJ1IjoiYWxleGFuZGVyNDI3IiwiYSI6ImNrMGVuNDRtbDAxZ3AzZ3BzYnJxcTE5M2cifQ.Qsm-WEsF5NzbgxQuATkFww";
let map = new  mapboxgl.Map({
  container: 'mapArea',
  center: [144.9648731,-37.8182711],
  zoom: 1,
  style: 'mapbox://styles/mapbox/streets-v9'
});


function MapPan(name)
{
  if (currentMarker.length !== 0)//if there is currently a marker, remove marker
  {
    currentMarker[0].remove();
    currentMarker = [];
  }
  let port = locallist.pickPortFromName(name)
  let markerCoord = new mapboxgl.LngLat(port.lng,port.lat)
  let marker = new mapboxgl.Marker();
  currentMarker.push(marker);
	marker.setLngLat(markerCoord);

  //Pan to Location
  map.panTo(markerCoord);

	// Display the marker.
	marker.addTo(map);

  let popup = new mapboxgl.Popup({ offset: 45});

  popup.setHTML(name);
  marker.setPopup(popup);
}
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
