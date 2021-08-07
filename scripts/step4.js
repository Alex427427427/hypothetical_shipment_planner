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

/* function to store list of ships into local storage. */
function storeShipList()
{
  let string = JSON.stringify(localList);
	localStorage.setItem("shipkey", string);
}

/* function to retrieve list of ships from local storage */
function retrieveShipList()
{
	let dataObject = JSON.parse(localStorage.getItem("shipkey"));
	// restore the global ship list (localList) with the data retrieved.
  if (dataObject !== null)//if local storage has data stored...
  {
    localList.fromData(dataObject);
    storeShipList();
    showShipInfo();
    generateOptions();
  }
  else //if local storage has no data...
  {
    jsonpRequest(shipUrl, data); //obtain list of ships from API.
  }
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
    localList.ships.push(newShip);
  }
  storeShipList();
  showShipInfo();
  generateOptions();
}

/*function to generate each ship as a table row with a radio button.*/
function generateOptions()
{
  let outputRef = document.getElementById("generatedList");
  let output = "";
  for (let i = 0; i < localList.ships.length; i++) //for each ship...
  {
    let shipX = localList.ships[i];
    //create a table row with radio button options
    output += "<tr><th><label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"" + shipX.name + "\""
    if (shipX.status !== "available" || shipX.range < route.distance) //if unavailable or sunk, disable label
    {
      output += " disabled";
    }
    if (shipX.name == route.ship.name) // If this ship is the current confirmed ship, set checked.
    {
      output += " checked=\"checked\"";
    }
    output += ">";
    output += "<input type=\"radio\" class=\"mdl-radio__button\" onchange=\"setShip()\" name=\"ship\" id=\"" + shipX.name + "\" value=\"" + shipX.name + "\"";
    if (shipX.status !== "available" || shipX.range < route.distance) //if unavailable or sunk, disable input
    {
      output += " disabled";
    }
    if (shipX.name == route.ship.name)// If this ship is the current confirmed ship, set checked.
    {
      output += " checked=\"checked\"";
    }
    output += ">";
    output += "</label></th><td class=\"mdl-data-table__cell--non-numeric\">" + shipX.name + "</td>";
    output += "<td>" + (shipX.maxSpeed*knotsToKmh).toFixed(2) + "</td>";
    output += "<td>" + shipX.range + "</td>";
    output += "<td>$" + Number(shipX.cost).toFixed(2) + "</td><td>";
    if (shipX.range < route.distance) //If ship range is not enough, display status as "insufficient range".
    {
      output += "insufficient range ";
    }
    else if (shipX.range >= route.distance) //if ship range is enough, display status as is.
    {
      output += shipX.status;
    }
    output += "</td></tr>";
  }
  outputRef.innerHTML = output;
}

/*Function to set and display the ship.
Obtains value from Radio options, then use value to do name search within ship list.
Prints info into HTML.*/
function setShip()
{
  let shipName = "";
  let shipRef = document.getElementsByName("ship");
  for (let i=0; i<shipRef.length; i++)//for each button...
  {
    if (shipRef[i].checked)//if button is selected...
    {
      shipName = shipRef[i].value;
    }
  }

  let ship = localList.pickShipFromName(shipName);
  chosenShip = ship;//overwrite global variable.
  route.ship = chosenShip;//overwrite route of ship.
  route.costCalc();
  route.timeCalc();
  localStorage.setItem("route", JSON.stringify(route));

  showShipInfo();

  document.getElementById("next").removeAttribute("disabled");//enable user to proceed.
}

/*function to display ship info into HTMl*/
function showShipInfo()
{
  if (route.ship.name != undefined)//if route has a ship...
  {
    let outputRef = document.getElementById("chosenShip");
    let output = "<h3 style=\"display: inline\">Chosen Ship: " + route.ship.name + "</h3><br/>";//display chosen destination to user.
    output += "<b>Speed: </b>" + (route.ship.maxSpeed*knotsToKmh).toFixed(2) + " km/h<br/>";
    output += "<b>Range: </b>" + route.ship.range + " km<br/>";
    output += "<b>Cost: </b>$" + route.ship.cost.toFixed(2) + " per km<br/><br/>";
    output += "<b>Total Cost: </b>$" + route.cost + "<br/>";
    output += "<b>Total Time: </b>" + route.time + " days<br/><br/>";
    outputRef.innerHTML = "";
    outputRef.innerHTML = output;
    document.getElementById("next").removeAttribute("disabled");//enable user to proceed.
  }
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

let step = "step4.html";
if (typeof(Storage) !== "undefined")
{
	console.log("localStorage is available.");
	localStorage.setItem("step", step); // store user's current step.
}
else
{
	console.log("localStorage is not supported by current browser.");
}

let route = new Route();
let chosenShip = {};
let shipUrl = "https://eng1003.monash/api/v1/ships/"; //base url for ships API
let data = {
  callback: "createShipList"//callback function for port API
}

//initialise country list, ports list(localList), filtered ports, current markers, and origin.
let localList = new ListOfShips("List")

if (typeof(Storage) !== "undefined")//Obtain list of ports from local storage (if data is stored.)
{
	console.log("localStorage is available.");
  route.fromData(JSON.parse(localStorage.getItem("route")));
	retrieveShipList(); // retrieves from local storage. otherwise, jsonprequest.

}
else
{
	console.log("localStorage is not supported by current browser.");
}
