"use strict"

class Ship
{
  constructor(name,maxSpeed,range,cost,status)
  {
    this._name = name;
    this._maxSpeed = maxSpeed;
    this._range = range;
    this._cost = cost;
    this._status = status;
  }

  //get
  get name(){return this._name;}
  get maxSpeed(){return this._maxSpeed;}
  get range(){return this._range;}
  get cost(){return this._cost;}
  get status(){return this._status;}

  set status(newStatus) {this._status = newStatus;}

//methods
  fromAPI(dataShip)//assigns instance attributes from API
  {
    this._name = dataShip.name; //Assigns each attribute from parsed object into class attribute.
    this._maxSpeed = dataShip.maxSpeed;
    this._range = dataShip.range;
    this._cost = dataShip.cost;
    this._status = dataShip.status;
  }

  fromData(dataShip)//assigns atributes from local storage.
  {
    this._name = dataShip._name;
    this._maxSpeed = dataShip._maxSpeed;
    this._range = dataShip._range;
    this._cost = dataShip._cost;
    this._status = dataShip._status;
  }
}

class ListOfShips
{
  constructor(name)
  {
    this._name = name;
    this._ships = [];
  }
  //get
  get name(){return this._name}
  get ships(){return this._ships}
  //set
  set name(newName){this._name = newName}
  set ships(newShips){this._ships = newShips}

  fromData(dataObject)//restore class fom local storage
  {
    this._name = dataObject._name;
    let ships = dataObject._ships;
    for(let i=0; i<ships.length;i++)
    {
      let ship = new Ship();//for each ship, restore an instance of Ship class
      ship.fromData(ships[i]);
      this._ships.push(ship);
    }
  }

  fromAPI(dataObject)//restore class from API output.
  {
    let ships = dataObject.ships;
    for(let i=0; i<ships.length;i++)//for each ship, restore an instance of Ship class
    {
      let ship = new Ship();
      ship.fromAPI(ships[i]);
      this._ships.push(ship);
    }
  }

  _searchShip(ship) //Checks if ship is already in database.
  {
    let clearance = true; //Initialise clearance. "true" means ship is not in database.
    if (this._ships.length == 0)
    {
      return clearance; //If shipList is empty, terminate function and return true.
    }
    else if (this._ships.length >= 1)//otherside...
    {
      for (let i = 0; i < this._ships.length; i++)//for each ship in the database..
      {
        if (ship.name == this._ships[i].name)//if ship names match,
        {
          clearance = false;//the ship is no longer going to be added.
          return clearance;
        }
      }
    }
    return clearance;
  }

  addShip(ship)
  {
    if (this._searchShip(ship))//if port is not already registered...
    {
      this._ships.push(ship);
    }
  }

  pickShipFromName(name)//method to return the ship with the name of interest.
  {
    for (let i = 0; i < this._ships.length; i++)
    {
      if (this._ships[i].name == name)
      {
        return this._ships[i];//if ship is found, return the ship.
      }
    }
    console.log("No port with input name is found.");//if not, console log the result.
  }

  addressShipFromName(name)//method to set the ship with the name of interest to unavailable.
  {
    for (let i = 0; i < this._ships.length; i++)
    {
      if (this._ships[i].name == name)
      {
        this._ships[i].status = "unavailable";//if ship is found, set ship availability to unavailable.
      }
    }
  }

  liberateShipFromName(name)//method to set the ship with name of interest to available.
  {
    for (let i = 0; i < this._ships.length; i++)
    {
      if (this._ships[i].name == name)
      {
        this._ships[i].status = "available";//if ship is found, set ship availability to available.
      }
    }
  }
}

//Port class. Each instance is one port from the port API.
class Port
{
  constructor(name,lat,lng,country)
  {
    this._name = name;
    this._country = country;
    this._type = "Unknown";
    this._size = "Unknown";
    this._lat = lat;
    this._lng = lng;
  }
  //get
  get name() {return this._name;}
  get country() {return this._country;}
  get type() {return this._type;}
  get size() {return this._size;}
  get lat() {return this._lat;}
  get lng() {return this._lng;}
  //set
  set name(newName) {this._name = newName;}
  set country(newCountry) {this._country = newCountry;}
  set type(newType) {this._type = newType;}
  set size(newSize) {this._size = newSize;}
  set lat(newLat) {this._lat = newLat;}
  set lng(newLng) {this._lng = newLng;}

  //methods
  fromAPI(dataPort)//assigns instance attributes from API
  {
    this._name = dataPort.name; //Assigns each attribute from parsed object into class attribute.
    this._country = dataPort.country;
    this._type = dataPort.type;
    this._size = dataPort.size;
    this._lat = dataPort.lat;
    this._lng = dataPort.lng;
  }
  fromData(dataPort)//assigns instance attributes from localStorage
  {
    this._name = dataPort._name; //Assigns each attribute from parsed object into class attribute.
    this._country = dataPort._country;
    this._type = dataPort._type;
    this._size = dataPort._size;
    this._lat = dataPort._lat;
    this._lng = dataPort._lng;
  }
}

//Class for list of ports. contains all ports as instances of the Port class.
class ListOfPorts
{
  constructor(name)
  {
    this._name = name;
    this._ports = [];
    this._countries = [];
  }
  //get
  get name() {return this._name}
  get ports() {return this._ports}
  get countries() {return this._countries;}
  //set
  set name(newName) {this._name = newName;}
  set ports(newList) {this._ports = newList}
  set countries(newList) {this._countries = newList;}
  //methods
  _searchPort(port) //Checks if port is already in database.
  {
    let clearance = true; //Initialise clearance. "true" means port is not in database.
    if (this._ports.length == 0)
    {
      return clearance; //If portList is empty, terminate function and return true.
    }
    else if (this._ports.length >= 1)//otherside...
    {
      for (let i = 0; i < this._ports.length; i++)//for each port in the database..
      {
        if (port.lng == this._ports[i].lng && port.lat == this._ports[i].lat)//if port positions match,
        {
          clearance = false;//the port is no longer going to be added.
          return clearance;
        }
      }
    }
    return clearance;
  }

  _searchCountry(country)//checks if country of a port is already registered in array.
  {
    let clearance = true;//Initialise clearance. "true" means port is not in database.
    if (this._countries.length == 0)
    {
      return clearance;//If countryList is empty, terminate function and return true.
    }
    else if (this._countries.length >= 1)//otherside...
    {
      for (let i = 0; i < this._countries.length; i++)//for each country in the array..
      {
        if (country == this._countries[i])//if country names match,
        {
          clearance = false;//the country is no longer going to be added.
          return clearance;
        }
      }
    }
    return clearance;
  }

  addPort(port)//adds a port, and adds country to array if new.
  {
    if (this._searchPort(port))//if port is not already registered...
    {
      this._ports.push(port);
      if (this._searchCountry(port.country))//if country is not already registered...
      {
        this._countries.push(port.country);
      }
    }
    this._countries.sort();//arrange list alphabetically.
  }

  selectPorts(country)//picks out all ports in a certain country.
  {
    let output = [];
    for (let i = 0; i < this._ports.length; i++)//for each port, if country matches country of interest...
    {
      if (this._ports[i].country == country)
      {
        output.push(this._ports[i]);//add it to the output array.
      }
    }
    return output;
  }

  pickPortFromName(name)//picks port with given name
  {
    for (let i = 0; i < this._ports.length; i++)
    {
      if (this._ports[i].name == name)
      {
        return this._ports[i];//if port is found, return the port.
      }
    }
    console.log("No port with input name is found.");//if not, console log the result.
  }

  fromData(dataObject)//restores class attributes from local storage
  {
    this._ports = [];
    this._name = dataObject._name;
    let data = dataObject._ports;
    for(let i=0; i<data.length;i++)//restore each port, then add into ports array.
    {
      let port = new Port();
      port.fromData(data[i]);
      this._ports.push(port);
    }
    this._countries = dataObject._countries;
  }
}


//Weather class for a location(port).
class Weather
{
  constructor(summary, minTemp, maxTemp, humidity, dewPoint, windSpeed, windBearing, uvIndex, visibility)
  {
    this._summary = summary;
    this._minTemp = minTemp;
    this._maxTemp = maxTemp;
    this._humidity = humidity;
    this._dewPoint = dewPoint;
    this._windSpeed = windSpeed;
    this._windBearing = windBearing;
    this._uvIndex = uvIndex;
    this._visibility = visibility
  }
  //get
  get summary() {return this._summary;}
  get minTemp() {return this._minTemp;}
  get maxTemp() {return this._maxTemp;}
  get humidity() {return this._humidity;}
  get dewPoint() {return this._dewPoint;}
  get windSpeed() {return this._windSpeed;}
  get windBearing() {return this._windBearing;}
  get uvIndex() {return this._uvIndex;}
  get visibility() {return this._visibility;}
  get tempRange()
  {
    let output="";
    output += this._minTemp + " ~ " + this._maxTemp;  //Create string of temperature range.
    return output;
  }
  //set
  //no need for set methods.

  //methods
  toString() //Outputs a string overview of weather.
  {
    let output="";
    output += "<u>summary</u>: " + this._summary + "<br/>";
    output += "<u>temperature range</u>: " + this.tempRange + "&deg;C<br/>";
    output += "<u>humidity</u>: " + this._humidity + " g/m<sup>3</sup><br/>";
    output += "<u>dew point</u>: " + this._dewPoint + "&deg;C<br/>";
    output += "<u>wind speed</u>: " + this._windSpeed + " m/s<br/>";
    output += "<u>wind bearing</u>: " + this._windBearing + "&deg;<br/>";
    output += "<u>uv index</u>: " + this._uvIndex + " (x25mW/m<sup>2</sup>)<br/>";
    output += "<u>visibility</u>: " + this._visibility + " m ";
    return output;
  }

  fromData(data) //Obtains attributes from JSON parse object, reassigns into weather instance.
  {
    this._summary = data._summary;
    this._minTemp = data._minTemp;
    this._maxTemp = data._maxTemp;
    this._humidity = data._humidity;
    this._dewPoint = data._dewPoint;
    this._windSpeed = data._windSpeed;
    this._windBearing = data._windBearing;
    this._uvIndex = data._uvIndex;
    this._visibility = data._visibility;
  }
}

//Route class for compactifying info of user shipment plans
class Route
{
  constructor(origin, destination)
  {
    this._id = 0;
    this._origin = origin;
    this._destination = destination;
    this._wayPoints = [];
    this._distance = 0;
    this._cost = 0;
    this._time = 0;
    this._ship = "";
    this._status = "";
    this._departureDate = "";
    this._eta = "";
    this._weatherOrigin = {};
    this._weatherDest = {};
  }
  //get
  get id() {return this._id;}
  get origin() {return this._origin;}
  get destination() {return this._destination;}
  get wayPoints() {return this._wayPoints;}
  get distance() {return this._distance;}
  get cost() {return this._cost;}
  get time() {return this._time;}
  get ship() {return this._ship;}
  get status() {return this._status;}
  get departureDate() {return this._departureDate;}
  get eta() {return this._eta;}
  get weatherOrigin() {return this._weatherOrigin;}
  get weatherDest() {return this._weatherDest;}
  //set
  set id(newId) {this._id = newId;}
  set origin(newOrigin) {this._origin = newOrigin;}
  set destination(newDest) {this._destination = newDest;}
  set ship(ship) {this._ship = ship;}
  set wayPoints(newPoints) {this._wayPoints = newPoints;}
  set status(newStat) {this._status = newStat;}
  set departureDate(newDate) {this._departureDate = newDate;}
  set eta(newDate) {this._eta = newDate;}
  set weatherOrigin(newWeather) {this._weatherOrigin = newWeather;}
  set weatherDest(newWeather) {this._weatherDest = newWeather;}
  //methods
  distCalc() //Calculate route distance
  {
    if (this._origin != undefined && this._destination != undefined) //If there exists an origin and destination...
    {
      let sumDist = 0; //Initialise total distance
      let lat1 = 0; //Initialise variables for later calculations
      let lng1 = 0;
      let lat2 = 0;
      let lng2 = 0;
      if (this._wayPoints.length == 0) //If no wayPoints...
      {
        lat1 = Number(this._origin.lat); //Calculate with origin and destination coords.
        lng1 = Number(this._origin.lng);
        lat2 = Number(this._destination.lat);
        lng2 = Number(this._destination.lng);
        sumDist = sumDist + twoPointDist(lat1, lng1, lat2, lng2); //Update sum for total distance
      }
      else if (this.wayPoints.length != 0) //Else, if wayPoints have been set...
      {
        lat1 = Number(this._origin.lat); //Calculate with origin and first wayPoint.
        lng1 = Number(this._origin.lng);
        lat2 = Number(this._wayPoints[0].lat);
        lng2 = Number(this._wayPoints[0].lng);
        sumDist = sumDist + twoPointDist(lat1, lng1, lat2, lng2); //Update sum for total distance

        for (let i = 1; i < this._wayPoints.length - 1; i++) //for each wayPoint between second to second last...
        {
          lat1 = Number(this._wayPoints[i-1].lat); //Calculate with current and previous wayPoint.
          lng1 = Number(this._wayPoints[i-1].lng);
          lat2 = Number(this._wayPoints[i].lat);
          lng2 = Number(this._wayPoints[i].lng);
          sumDist = sumDist + twoPointDist(lat1, lng1, lat2, lng2); //Update sum for total distance.
        }
        lat1 = Number(this._wayPoints[this._wayPoints.length - 1].lat); //Calculate with last wayPoint and destination.
        lng1 = Number(this._wayPoints[this._wayPoints.length - 1].lng);
        lat2 = Number(this._destination.lat);
        lng2 = Number(this._destination.lng);
        sumDist = sumDist + twoPointDist(lat1, lng1, lat2, lng2); //Update sum for total distance.
      }
      this._distance = sumDist; //assign total distance to _distance attribute in kilometres.
    }
  }

  costCalc()  //Calculate cost with distance and cost of ship per km.
  {
    if (this._distance != 0 && this._ship !== "") //If distance and ship is well defined...
    {
      let cost = this._distance*this._ship.cost;
      this._cost = cost.toFixed(2);
    }
  }

  timeCalc()  //Calculate time with distance and speed of ship.
  {
    if (this._distance != 0 && this._ship !== "") //If distance and ship is well defined...
    {
      let time = this._distance/(this._ship.maxSpeed*knotsToKmh)/24;
      this._time = time.toFixed(0);
    }
  }

  addWayPoint(point)
  {
    this._wayPoints.push(point); //push new point into wayPoints array
  }

  resetWayPoints()
  {
    this._wayPoints = []; //reset waypoints into empty array
  }

  fromData(data) //restore attributes from local storage data
  {
    this._id = data._id;

    if (data._origin !== undefined)
    {
      let origin = new Port(); //instantiate new port and restore attributes
      origin.fromData(data._origin);
      this._origin = origin;
    }

    if (data._destination !== undefined)
    {
      let destination = new Port(); //instantiate new port and restore attributes
      destination.fromData(data._destination);
      this._destination = destination;
    }

    if (data._wayPoints !== undefined)
    {
      this._wayPoints = data._wayPoints;
    }

    if (data._distance !== undefined)
    {
      this._distance = data._distance;
    }

    if (data._cost !== undefined)
    {
      this._cost = data._cost;
    }

    if(data._time !== undefined)
    {
      this._time = data._time;
    }

    if (data._ship !== undefined)
    {
      let ship = new Ship(); //instantiate new ship and restore attributes
      ship.fromData(data._ship);
      this._ship = ship;
    }

    if (data._status !== undefined)
    {
      this._status = data._status;
    }

    if (data._departureDate !== undefined)
    {
      this._departureDate = data._departureDate;
    }

    if (data._eta !== undefined)
    {
      this._eta = data._eta;
    }

    if (data._weatherOrigin !== undefined)
    {
      let weather = new Weather();
      weather.fromData(data._weatherOrigin);
      this._weatherOrigin = weather;
    }

    if (data._weatherDest !== undefined)
    {
      let weather = new Weather();
      weather.fromData(data._weatherDest);
      this._weatherDest = weather;
    }
  }
}


//Constants for distance calculation
const kmhToKnots = 0.539957;
const knotsToKmh = 1.852;
const rEarth = 6371; //radius of earth in kilometres.
const toRad = Math.PI/180; //Degrees to radians conversion.
const toDeg = 180/Math.PI; //Radians to degrees conversion.
//Function to calculate distance between coords using haversine formula.
function twoPointDist(lat1, lng1, lat2, lng2)
{
  let phi1 = lat1*toRad; //declare variables for calculation
  let phi2 = lat2*toRad;
  let phiDiff = phi2 - phi1;
  let lambdaDiff = (lng2 - lng1)*toRad;
  let a = Math.pow(Math.sin(phiDiff/2), 2) + Math.cos(phi1)*Math.cos(phi2)*
  Math.pow(Math.sin(lambdaDiff/2), 2); //first line of haversine formula
  let c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); //second line of haversine formula
  let distance = rEarth*c;
  return distance;
}

function onlyOne(checkbox) {
    var checkboxes = document.getElementsByName('check')
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })
    //change the name of the checked element to 'selected' so that it can be pulled in the future
}

//Class for all confirmed routes
class ListOfRoutes
{
  constructor()
  {
    this._idCounter = 0;
    this._routes = [];
  }
  get routes() {return this._routes;}
  get idCounter() {return this._idCounter;}
  set routes(newList) {this._routes = newList;}
  set idCounter(newId) {this._idCounter = newId;}

  updateStatus(currentDate, shipList)//updates status of all routes upon loading
  {
    for (let i=0; i<this._routes.length; i++)
    {//obtain departure date and eta:
      let departureDate = this._routes[i].departureDate;
      let eta = this._routes[i].eta;
      if ((departureDate - currentDate) <= 0)//if departure date has gone past...
      {
        if ((eta - currentDate) <= 0)//if eta has gone past...
        {
          this._routes[i].status = "complete";//route is complete.
          let shipName = this._routes[i].ship.name;
          shipList.liberateShipFromName(shipName);
        }
        else //if eta has not gone past...
        {
          this._routes[i].status = "inProgress";//route is in progress.
        }
      }
    }
  }

  addRoute(route)
  {
    this._idCounter = this._idCounter + 1;
    route.id = this._idCounter;
    route.status = "confirmed";
    route.ship.status = "unavailable";
    this._routes.push(route);
  }

  searchRouteById(id)//picks the route with the same id as input
  {
    for (let i = 0; i < this._routes.length; i++)
    {
      if (this._routes[i].id == id)
      {
        return this._routes[i];//if Route is found, return the Route.
      }
    }
    console.log("No route with input id is found.");//if not, console log the result.
  }

  cancelRouteById(id, shipList)
  {
    for (let i = 0; i < this._routes.length; i++)
    {
      if (this._routes[i].id == id)
      {
        let shipName = this._routes[i].ship.name;
        shipList.liberateShipFromName(shipName);
        this._routes.splice(i, 1);//if Route is found, return the Route.
      }
    }
    console.log("No route with input id is found.");//if not, console log the result.
  }

  fromData(data) //restore attributes from local storage data
  {
    this._idCounter = data._idCounter;
    for (let i=0; i<data._routes.length; i++)
    {
      let route = new Route(); //instantiate new route and restore attributes
      route.fromData(data._routes[i]);
      this._routes.push(route);
    }
  }
}
