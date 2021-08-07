"use strict";
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

/* function to retrieve list of ships from local storage */
function retrieveShipList()
{
	let dataObject = JSON.parse(localStorage.getItem("shipkey"));
	// restore the global ship list (shipList) with the data retrieved.
  if (dataObject !== null)//if local storage has data stored...
  {
    shipList.fromData(dataObject);
    storeShipList();
  }
  else //if local storage has no data...
  {
    jsonpRequest(shipUrl, data); //obtain list of ships from API.
  }
}

/* function to store list of ships into local storage. */
function storeShipList()
{
  let string = JSON.stringify(shipList);
	localStorage.setItem("shipkey", string);
}

/* callback function for jsonp request.
takes in API output as parameters.
Adds port one by one into global port list array. */
function createShipList(param)
{
  for (let i = 0; i < param.ships.length; i++)//for each ship in API output...
  {
    let newShip = new Ship();
    newShip.fromAPI(param.ships[i]);
    shipList.ships.push(newShip);
  }
  storeShipList();
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

/*function to display all routes in their tabs.
Determines status of route, then get corresponding status tab.
*/
function displayRoutes()
{

  if (routeList.routes.length !== 0)//if routes are available...
  {
    //set up table headers
    document.getElementById("confirmed").innerHTML = "<thead><tr><th class=\"mdl-data-table__cell--non-numeric\">Path</th><th>Ship</th><th>Departure Date</th><th>ETA</th><th>cost</th></tr></thead><tbody>";
    document.getElementById("inProgress").innerHTML = "<thead><tr><th class=\"mdl-data-table__cell--non-numeric\">Path</th><th>Ship</th><th>Departure Date</th><th>ETA</th><th>cost</th></tr></thead><tbody>";
    document.getElementById("complete").innerHTML = "<thead><tr><th class=\"mdl-data-table__cell--non-numeric\">Path</th><th>Ship</th><th>Departure Date</th><th>Date Arrived</th><th>cost</th></tr></thead><tbody>";

    for (let i=0; i<routeList.routes.length; i++)//for every route in routeList...
    {
      let route = routeList.routes[i];//obtain route, id, status
      let id = route.id;
      let status = route.status;
      let departureDate = new Date(route.departureDate);
      let departureDateMonth = departureDate.getMonth() + 1;
      let eta = new Date(route.eta);
      let etaMonth = eta.getMonth() + 1;
      //Update counter
      if (status == "confirmed") {confirmedCounter = confirmedCounter + 1;}
      else if (status == "inProgress") {inProgressCounter = inProgressCounter + 1;}
      else if (status == "complete") {completeCounter = completeCounter + 1;}
      //set up string to display
      let string = "<tr><td class=\"mdl-data-table__cell--non-numeric\">" + route.origin.name + " -<br> " + route.destination.name + "</td>";
      string += "<td>" + route.ship.name + "</td>";
      string += "<td>" + departureDate.getDate() + "/" + departureDateMonth + "/" + departureDate.getFullYear() + "</td>";
      string += "<td>" + eta.getDate() + "/" + etaMonth + "/" + eta.getFullYear() + "</td>";
      string += "<td>$" + route.cost + "<td>";
      string += "<td><a class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect\" onclick=\"view(\'" + id + "\')\">View</a></td></tr>";
      document.getElementById(status).innerHTML += string;
    }
    //close table
    document.getElementById("confirmed").innerHTML += "</tbody>";
    document.getElementById("inProgress").innerHTML += "</tbody>";
    document.getElementById("complete").innerHTML += "</tbody>";

    //if a table is empty, display message.
    if (confirmedCounter == 0)
    {
      document.getElementById("confirmed").innerHTML = "<thead><tr><th class=\"mdl-data-table__cell--non-numeric\">There are no upcoming shipments. To plan a new shipment, click \"Plan New Route\".</th></tr></thead><tbody></tbody>";
    }
    if (inProgressCounter == 0)
    {
      document.getElementById("inProgress").innerHTML = "<thead><tr><th class=\"mdl-data-table__cell--non-numeric\">There are currently no shipments in progress.</th></tr></thead><tbody></tbody>";
    }
    if (completeCounter == 0)
    {
      document.getElementById("complete").innerHTML = "<thead><tr><th class=\"mdl-data-table__cell--non-numeric\">There are no completed shipments.</th></tr></thead><tbody></tbody>";
    }
  }
}

/*function to create area to view route info*/
function view(id)
{
	let route = routeList.searchRouteById(id);//obtain route
	if (route != null)
	{
    let div = "";
    if (route.status == "confirmed") {div = "hiddenDialog1";}//address correct element
    else if (route.status == "inProgress") {div = "hiddenDialog2";}
    else if (route.status == "complete") {div = "hiddenDialog3";}

    localStorage.setItem("viewRoute", JSON.stringify(route));

    window.location.replace("routeInfo.html");
  }
}





//CODE for the page
//set current date
let currentDate = new Date();

//obtain ship List
let shipList = new ListOfShips();
let data = {
  callback: "createShipList"//callback function for port API
}
retrieveShipList();

//obtain and display route List

let confirmedCounter = 0;
let inProgressCounter = 0;
let completeCounter = 0;
let routeList = new ListOfRoutes();
retrieveRouteList();
routeList.updateStatus(currentDate, shipList);
localStorage.setItem("routeList", JSON.stringify(routeList));
document.getElementById("confirmed").innerHTML = "<thead><tr><th class=\"mdl-data-table__cell--non-numeric\">There are no upcoming shipments. To plan a new shipment, click \"Plan New Route\".</th></tr></thead><tbody></tbody>";
document.getElementById("inProgress").innerHTML = "<thead><tr><th class=\"mdl-data-table__cell--non-numeric\">There are currently no shipments in progress.</th></tr></thead><tbody></tbody>";
document.getElementById("complete").innerHTML = "<thead><tr><th class=\"mdl-data-table__cell--non-numeric\">There are no completed shipments.</th></tr></thead><tbody></tbody>";

displayRoutes();

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
