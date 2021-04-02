//set up variables
var searchHistoryArray = [];
var trashEl = document.querySelector("#trash")
var today = new Date();
var cityFormEl = document.querySelector("#city-form");
var cityNameInputEl = document.querySelector("#cityname");
var currentWeatherEl = document.querySelector('#current-weather');
var currentWeatherCardEl = document.querySelector("#current-weather-card")
var fiveDayCardEl = document.querySelector("#five-day-card");
var fiveDayEl = document.querySelector("#five-day-body");
var weatherStatusEl = document.querySelector('#weather-status');
var searchEl = document.querySelector('#search');
var historyButtonsEl = document.querySelector("#history-buttons");
var historyCardEl = document.querySelector("#history");

var textSubmitHandler = function (event) {
    //prevent default action
    event.preventDefault();
    //get city from user imput 
    var cityname = cityNameInputEl.nodeValue.trim();

    //store city name in LS
    if (cityname) {
        searchHistoryArray.push(cityname);
        localStorage.setItem("weatherSearch", JSON.stringify (searchHistoryArray));
        //generate history buttons
        var searchHistoryEl = document.createElement('button');
        searchHistoryEl.className = "btn";
        searchHistoryEl.setAttribute("data-city", cityname);
        searchHistoryEl.innerHTML = cityname;
        historyButtonsEl.appendChild(searchHistoryEl);
        historyCardEl.removeAttribute("style");
        getWeatherInfo(cityname);
        cityNameInputEl.value = "";
    } //add alert function
    else {
        alert("Please enter a City name");
    }
}

//setup the api and call

var getWeatherInfo = function (cityname) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=f97301447cbd41068af8623a398ba1fb";
    fetch(
        apiCityUrl
    )
        .then(function (cityResponse) {
            return cityResponse.json();
        })
        .then(function (cityResponse) {
            console.log(cityResponse)
            //hold lat and long in var
            var latitude = cityResponce.coord.lat;
            var longitude = cityResponse.coord.lon;

            var city = cityResponse.name;
            var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
            var weatherIcon = cityResponse.weather[0].icon;
            var weatherDescription = cityResponse.weather[0].description;
            var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"

            // Empty Current Weather element for new data
            currentWeatherEl.textContent = "";
            fiveDayEl.textContent = "";

            // Update <h2> element to show city, date and icon
            weatherStatusEl.innerHTML = city + " (" + date + ") " + weatherIconLink;

            // Remove class name 'hidden' to show current weather card
            currentWeatherCardEl.classList.remove("hidden");
            fiveDayCardEl.classList.remove("hidden");

            // Return a fetch request to the OpenWeather using longitude and latitude from pervious fetch
            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely,hourly&units=imperial&appid=f97301447cbd41068af8623a398ba1fb');
        })
        .then(function (response) {
            // return response in json format
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            // send response data to displayWeather function for final display 
            displayWeather(response);
        });
};

// Display the weather on page
var displayWeather = function (weather) {
    // check if api returned any weather data
    if (weather.length === 0) {
        weatherContainerEl.textContent = "No weather data found.";
        return;
    }
    // Create Temperature element
    var temperature = document.createElement('p');
    temperature.id = "temperature";
    temperature.innerHTML = "<strong>Temperature:</strong> " + weather.current.temp.toFixed(1) + "°F";
    currentWeatherEl.appendChild(temperature);

    // Create Humidity element
    var humidity = document.createElement('p');
    humidity.id = "humidity";
    humidity.innerHTML = "<strong>Humidity:</strong> " + weather.current.humidity + "%";
    currentWeatherEl.appendChild(humidity);

    // Create Wind Speed element
    var windSpeed = document.createElement('p');
    windSpeed.id = "wind-speed";
    windSpeed.innerHTML = "<strong>Wind Speed:</strong> " + weather.current.wind_speed.toFixed(1) + " MPH";
    currentWeatherEl.appendChild(windSpeed);

    // Create uv-index element
    var uvIndex = document.createElement('p');
    var uvIndexValue = weather.current.uvi.toFixed(1);
    uvIndex.id = "uv-index";
    if (uvIndexValue >= 0) {
        uvIndex.className = "uv-index-green"
    }
    if (uvIndexValue >= 3) {
        uvIndex.className = "uv-index-yellow"
    }
    if (uvIndexValue >= 8) {
        uvIndex.className = "uv-index-red"
    }
    uvIndex.innerHTML = "<strong>UV Index:</strong> <span>" + uvIndexValue + "</span>";
    currentWeatherEl.appendChild(uvIndex);

    // Get extended forecast data
    var forecastArray = weather.daily;

    // Create day cards for extended forecast
    for (let i = 0; i < forecastArray.length - 3; i++) {
        var date = (today.getMonth() + 1) + '/' + (today.getDate() + i + 1) + '/' + today.getFullYear();
        var weatherIcon = forecastArray[i].weather[0].icon;
        var weatherDescription = forecastArray[i].weather[0].description;
        var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
        var dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.innerHTML = "<p><strong>" + date + "</strong></p>" +
            "<p>" + weatherIconLink + "</p>" +
            "<p><strong>Temp:</strong> " + forecastArray[i].temp.day.toFixed(1) + "°F</p>" +
            "<p><strong>Humidity:</strong> " + forecastArray[i].humidity + "%</p>"

        fiveDayEl.appendChild(dayEl);

    }

};

// Load any past city weather searches
var loadHistory = function () {
    searchArray = JSON.parse(localStorage.getItem("weatherSearch"));

    if (searchArray) {
        searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
        for (let i = 0; i < searchArray.length; i++) {
            var searchHistoryEl = document.createElement('button');
            searchHistoryEl.className = "btn";
            searchHistoryEl.setAttribute("data-city", searchArray[i])
            searchHistoryEl.innerHTML = searchArray[i];
            historyButtonsEl.appendChild(searchHistoryEl);
            historyCardEl.removeAttribute("style");
        }

    }
}

// Search weather using search history buttons
var buttonClickHandler = function (event) {
    var cityname = event.target.getAttribute("data-city");
    if (cityname) {
        getWeatherInfo(cityname);
    }
}

// Clear Search History
var clearHistory = function (event) {
    localStorage.removeItem("weatherSearch");
    historyCardEl.setAttribute("style", "display: none");
}

cityFormEl.addEventListener("submit", textSubmitHandler);
historyButtonsEl.addEventListener("click", buttonClickHandler);
trashEl.addEventListener("click", clearHistory);

loadHistory();