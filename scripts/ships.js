"use strict";

function generateShipList(shipList)
{
  for(let i=0;i<shipList.ships.length;i++)
  {
    ship[i] = new Ship(shipList.ships[i].name,shipList.ships[i].maxSpeed,shipList.ships[i].range,shipList.ships[i].cost,shipList.ships[i].status)
    locallist.addShip(ship[i])
  }
    // List view section heading: Flight list
    let listHTML = "";

    // Generate some HTML table rows for the routes array
    for (let i = 0; i < ship.length; i++)
    {
        listHTML += "<tr> <td class=\"mdl-data-table__cell--non-numeric\">" + ship[i].name + "</td> <td>" + ship[i].maxSpeed + " </td> <td> " + ship[i].range + "</td> <td>" + ship[i].cost + "</td> <td>" + ship[i].status + "</td>";
    }

    // Insert the list view elements into the flights list.
    shipListElement.innerHTML += listHTML;
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
function storeShipList()
{
	localStorage.setItem("shipkey",JSON.stringify(locallist))
}

function retrieveShipList()
{
	// write some code here to :
	// 1. retrieve the deck from local storage
	let data = JSON.parse(localStorage.getItem("shipkey"))
	// 2. restore the global deck variable (theDeck) with the data retrieved in 1.
  if (data !== null)
  {
    locallist.fromData(data)
  }
  else
  {
    let data = {
        callback: "generateShipList"
    };
    jsonpRequest("https://eng1003.monash/api/v1/ships/",data)
  }
}

function addShip()
{
  let output = ""
  let ship = new Ship(document.getElementById("shipName").value,(document.getElementById("shipSpeed").value)*kmhToKnots,document.getElementById("range").value,document.getElementById("rentCost").value,"available");
  locallist.addShip(ship);
  console.log(locallist)
  storeShipList();
  output += "<tr> <td class=\"mdl-data-table__cell--non-numeric\">" + ship.name + "</td> <td>" + (ship.maxSpeed*knotsToKmh).toFixed(2) + " </td> <td> " + ship.range + "</td> <td>" + ship.cost + "</td> <td>" + ship.status + "</td>";
  document.getElementById("listOfShipTable").innerHTML += output
}


function addLocalShips()
{
	let shipList = locallist._ships;
	let output = "";
	for (let i = 0; i < shipList.length; i++)
	{
    output += "<tr> <td class=\"mdl-data-table__cell--non-numeric\">" + shipList[i].name + "</td> <td>" + (shipList[i].maxSpeed*knotsToKmh).toFixed(2) + " </td> <td> " + shipList[i].range + "</td> <td>" + shipList[i].cost + "</td> <td>" + shipList[i].status + "</td>";
  }
	return output;
}

//code to create list of ship
let shipListElement = document.getElementById("listOfShipTable")
let ship = []




//Code for list of ships.
let locallist = new ListOfShips("List")
if (typeof(Storage) !== "undefined")
{
	console.log("localStorage is available.");
	retrieveShipList()
	document.getElementById("listOfShipTable").innerHTML += addLocalShips();
}
else
{
	console.log("localStorage is not supported by current browser.");
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
