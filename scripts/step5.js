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

			let encodedKey = encodeURIComponent(key);
			let encodedValue = encodeURIComponent(data[key]);

			params += encodedKey + "=" + encodedValue;
		}
	}
	let script = document.createElement('script');
	script.src = url + params;
	document.body.appendChild(script);
}

/*function to set departure date, calculate eta, obtain weather and display for the user.
uses jsonprequest and dark sky API.
updates instance of route and stores into localStorage.*/
function setDepartureDate()
{
	let departDate = new Date(document.getElementById("departure").value);
	departureDate = departDate; //overwrite departure global variable
	departureDateMonth = departureDate.getMonth() + 1;
	let departMillisec = departDate.getTime();
	route.departureDate = departMillisec;//set departure date in route.

	//getWeather(route.lat,route.lng,departuredate);
	data.callback = "obtainOriginWeather";//adjust callback function for jsonprequest.
	getWeather(route.origin.lat, route.origin.lng);


	let arrDate = new Date();
	arrDate.setDate(departDate.getDate() + parseInt(route.time));
	eta = arrDate; //overwrite eta global variable
	etaMonth = arrDate.getMonth() + 1;
	let etaMillisec = arrDate.getTime();
	route.eta = etaMillisec;//set eta date in route

	data.callback = "obtainDestWeather";//adjust callback function for jsonprequest
	getWeather(route.destination.lat, route.destination.lng);

	localStorage.setItem("route", JSON.stringify(route));//store route into local storage, and
	document.getElementById("next").removeAttribute("disabled");//allow user to proceed.
};

/*function to receive weather data from Dark Sky API.
Takes in a coordinate as input.
obtains data as parameters to pass to callback function to execute. */
function getWeather(lat,lng)
{
	if (lat == 0 && lng == 0)//if coordinates are non existent...
	{
		alert("please first set origin and destination.")
	}
	else
	{
		let url = "https://api.darksky.net/forecast/77316f37377c4364a6af829131d16d17/";
		url += lat + "," + lng + "/";//append coordinates into url.

		jsonpRequest(url, data);
	}
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
	let output = "<h3 style=\"display: inline\">Departure Date: ";
	output += departureDate.getDate() + "/" + departureDateMonth + "/" + departureDate.getFullYear() + "</h3><br/><b>Weather at Origin: </b>";
	output +=  weatherOrigin.toString() + "<br/><br/>";//uses toString method to print weather in HTML.
	outputReference.innerHTML = output;
	}
	else//if date is more than 7 days into the future...
	{
		let outputReference = document.getElementById("dateDisplay");
		let output = "<h3 style=\"display: inline\">Departure Date: ";
		output += departureDate.getDate() + "/" + departureDateMonth + "/" + departureDate.getFullYear() + "</h3><br/><b>Weather at Origin: </b>";
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
		let output2 = "<h3 style=\"display: inline\">ETA: ";
		output2 += eta.getDate() + "/" + etaMonth + "/" + eta.getFullYear() + "</h3><br/><b>Weather at Destination: </b>";
		output2 +=  weatherDest.toString() + "<br/><br/>";//uses toString method to print weather in HTML.
		outputReference2.innerHTML = output2;
		//display();
	}
	else//if date is more than 7 days into the future...
	{
		let outputReference2 = document.getElementById("dateDisplay2");
		let output2 = "<h3 style=\"display: inline\">ETA: ";
		output2 += eta.getDate() + "/" + etaMonth + "/" + eta.getFullYear() + "</h3><br/><b>Weather at Destination: </b>";
		output2 += "Weather not available until 7 days before departure.";//notify user weather data is unavailable.
		outputReference2.innerHTML = output2;
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
//Initialise all variables
let currentDate = new Date();

let departureDate = "";
let eta = "";

let departureDateMonth = "";
let etaMonth = "";

let weatherOrigin = "";
let weatherDest = "";

let dummyWeather = {}; //create dummy variable for later computation
let route = new Route();

let data = {//data for jsonprequest
	exclude: "minutely,hourly",
	units: "si",
	callback: ""
};


let step = "step5.html";//current step is 5.
if (typeof(Storage) !== "undefined")
{
	console.log("localStorage is available.");
	localStorage.setItem("step", step); // store user's current step.
	route.fromData(JSON.parse(localStorage.getItem("route")));
	if (route.departureDate !== "")//if date has already been set...
	{
		let dateO = new Date(route.departureDate);
		departureDate = dateO;//overwrite departure and eta
		departureDateMonth = departureDate.getMonth() + 1;
		let dateD = new Date(route.eta);
		eta = dateD;
		etaMonth = eta.getMonth() + 1;
		//run obtain weather function to display for user
		data.callback = "obtainOriginWeather";
		getWeather(route.origin.lat, route.origin.lng);
		data.callback = "obtainDestWeather";
		getWeather(route.destination.lat, route.destination.lng);
		document.getElementById("next").removeAttribute("disabled");
	}
}
else
{
	console.log("localStorage is not supported by current browser.");
}
