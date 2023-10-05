//Sets up the National Park Service API key and open weather below it
var apiKey = "a5TRtoX59To11woolQUJEs2WY34dc0AZ6MppUzci";

// Get a reference to the "Search" button.
var searchBtn = document.getElementById("search-button");
// Add click event listener to the Search button
searchBtn.addEventListener("click", fetchParkData);

// Function to fetch park data
function fetchParkData() {
    // Clear previous park information when a new search is initiated
    localStorage.removeItem('parkName');
    localStorage.removeItem('parkURL');
    localStorage.removeItem('parkDescription');
    localStorage.removeItem('parkImage');

    // Get the input in lowercase (most people type lowercase)
    var parkName = document.getElementById("search").value.toLowerCase();
    // Log the park name to the console (debugging)
    console.log(parkName);
    // Variable to hold url to fetch a list of all parks
    var allParksAPI = "https://developer.nps.gov/api/v1/parks?limit=500&api_key=" + apiKey + "&units=imperial";
    // Fetch list of all parks and return response in json format
    fetch(allParksAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
    // Filter parks including just only the searched park    
        var matchingParks = data.data.filter(function (park) {
// Check if the park's name matches (most type in lowercase)
            return park.fullName.toLowerCase().includes(parkName);
        });
// If there is a matching park
            if (matchingParks.length > 0) {
                console.log(matchingParks);
// Get the gps lat and lon of the first park in the array
            var latitude = matchingParks[0].latitude;
            var longitude = matchingParks[0].longitude;

// Display the first matching park's information
                displayParkInfo(matchingParks[0]);

            fetchWeatherForecast(latitude,longitude);
            } else {
        // Log if there are no matching parks
            console.log("No matching parks found");

    // Show the modal when no matching park is found
            var modal = document.getElementById("noMatchingParkModal");
            modal.style.display = "block"
        }

    })    
    // Error handler variable contains an object with information about the error
        .catch(function(error) {
            console.error("Error fetching park data:", error);
        });
       // Close the modal when clicking the close x    
        var closeModalBtn = document.getElementById("noMatchingParkModal");
        if (closeModalBtn) {
        closeModalBtn.addEventListener("click", function () {
            var modal = document.getElementById("noMatchingParkModal");
            modal.style.display = "none";
        });
    }
        // Close the modal when clicking outside the modal
        window.addEventListener("click", function (event) {
        var modal = document.getElementById("noMatchingParkModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}
// Function to fetch the weather forecast
function fetchWeatherForecast(latitude, longitude) {
    // Clear previous park information when a new search is initiated
    localStorage.removeItem('weatherForecastData');
    
    var openWeatherMapApiKey = '876fe47417eaaeff0f787d1ddd261473';
    var weatherForecastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherMapApiKey}&units=imperial`;

    fetch(weatherForecastAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
    // Process the weather forecast data here and display it on your webpage
            displayWeatherForecast(data);
        })
        .catch(function (error) {
            console.error('Error fetching weather forecast: ', error);
        });
}
// Function that displays park info on the screen
function displayParkInfo(park) {
    var parkDisplayContainer = document.getElementById("park-display-container");

    // Clear any previous content
    parkDisplayContainer.innerHTML = "";

    // Create a h3 element and add park name content
    var parkName = document.createElement("h3");
    parkName.textContent = park.fullName;

    // Create a p element and add description content
    var parkDescription = document.createElement("p");
    parkDescription.textContent = park.description;

    // Create anchor element for the park URL
    var parkURL = document.createElement("a");
    parkURL.href = park.url;
    parkURL.textContent = "Visit Park Website @National Park Service";

    // Create an image element for the image associated with the park website
    var parkImage = document.createElement("img");
    parkImage.src = park.images[0].url;
    parkImage.alt = park.fullName;

    // Scale image set to auto for aspect ratio
    parkImage.style.width = "500px";
    parkImage.style.height = "auto";

    // Append the elements from top to bottom        
    parkDisplayContainer.appendChild(parkName);
    parkDisplayContainer.appendChild(parkURL);
    parkDisplayContainer.appendChild(parkDescription);
    parkDisplayContainer.appendChild(parkImage);

    // Store the park information in localStorage
    localStorage.setItem('parkName', parkName.textContent);
    localStorage.setItem('parkURL', parkURL.href);
    localStorage.setItem('parkDescription', parkDescription.textContent);
    localStorage.setItem('parkImage', parkImage.src);
    }

    // Function to display park information from localStorage
    function displayStoredParkInfo() {
    var parkDisplayContainer = document.getElementById("park-display-container");

    // Retrieve park information from localStorage
    var storedParkName = localStorage.getItem('parkName');
    var storedParkURL = localStorage.getItem('parkURL');
    var storedParkDescription = localStorage.getItem('parkDescription');
    var storedParkImage = localStorage.getItem('parkImage');

    if (storedParkName && storedParkURL && storedParkDescription && storedParkImage) {
        // Create elements to display the stored park information
        var parkNameEl = document.createElement('h3');
        parkNameEl.textContent = storedParkName;

        var parkURLEl = document.createElement('a');
        parkURLEl.href = storedParkURL;
        parkURLEl.textContent = "Visit Park Website @ National Park Service";

        var parkDescriptionEl = document.createElement('p');
        parkDescriptionEl.textContent = storedParkDescription;

        var parkImageEl = document.createElement('img');
        parkImageEl.src = storedParkImage;
        parkImageEl.alt = storedParkName;

        // Scale image set to auto for aspect ratio
        parkImageEl.style.width = "500px";
        parkImageEl.style.height = "auto";

        // Append elements to the park display container
        parkDisplayContainer.appendChild(parkNameEl);
        parkDisplayContainer.appendChild(parkURLEl);
        parkDisplayContainer.appendChild(parkDescriptionEl);
        parkDisplayContainer.appendChild(parkImageEl);
    }
}

// Call the function to display stored park information when the page loads
window.addEventListener('load', displayStoredParkInfo);

// Function the display 5 day forcast
function displayWeatherForecast(weatherData) {
    // Variable references forcast cards container class
    var weatherForecastSection = document.querySelector('.forecast-cards-container');
    weatherForecastSection.innerHTML = '';

    var forecastData = [];

    for (var i = 0; i < weatherData.list.length; i+=8) {
        var forecast = weatherData.list[i];

        // Create HTML elements to display the forecast data
        var forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');

        var dateElement = document.createElement('p');
        dateElement.textContent = new Date(forecast.dt * 1000).toLocaleDateString();

        var icon = document.createElement('img');
        icon.src = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`

        var temperatureElement = document.createElement('p');
        temperatureElement.textContent = 'Temperature: ' + Math.round(forecast.main.temp) + '°F';

        var windSpeedMetPS = forecast.wind.speed;
        var windSpeed = document.createElement("p");
        windSpeed.textContent = "Wind Speed: " + windSpeedMetPS.toFixed(1) + " mph";

        var descriptionElement = document.createElement('p');
        descriptionElement.textContent = 'Description: ' + forecast.weather[0].description;

        // Append elements to the forecast card
        forecastCard.appendChild(dateElement);
        forecastCard.appendChild(icon);
        forecastCard.appendChild(temperatureElement);
        forecastCard.appendChild(windSpeed);
        forecastCard.appendChild(descriptionElement);

        // Append the forecast card to the weather forecast section
        weatherForecastSection.appendChild(forecastCard);
        //Push data to store in an array
        forecastData.push({
            date: dateElement.textContent,
            icon: `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`,
            temperature: temperatureElement.textContent,
            windSpeed: windSpeed.textContent,
            description: descriptionElement.textContent
        });
    }
    localStorage.setItem('weatherForecastData', JSON.stringify(forecastData));
}

    // Check if there's weather forecast data in localStorage
    var storedForecastData = localStorage.getItem('weatherForecastData');

    if (storedForecastData) {
        // Parse the stored data back into an array
        var forecastDataArray = JSON.parse(storedForecastData);

        // Create forecast cards and populate them with the stored data
        var weatherForecastSection = document.querySelector('.forecast-cards-container');
        weatherForecastSection.innerHTML = '';

        forecastDataArray.forEach(function (forecastData) {
            var forecastCard = document.createElement('div');
            forecastCard.classList.add('forecast-card');
        
            // Create and populate HTML elements with forecast data
            var dateElement = document.createElement('p');
            dateElement.textContent = forecastData.date;

            var icon = document.createElement('img');
            icon.src = forecastData.icon;
        
            var temperatureElement = document.createElement('p');
            temperatureElement.textContent = forecastData.temperature;
        
            var windSpeedElement = document.createElement('p');
            windSpeedElement.textContent = forecastData.windSpeed;
        
            var descriptionElement = document.createElement('p');
            descriptionElement.textContent = forecastData.description;
        
            // Append elements to the forecast card
            forecastCard.appendChild(dateElement);
            forecastCard.appendChild(icon);
            forecastCard.appendChild(temperatureElement);
            forecastCard.appendChild(windSpeedElement);
            forecastCard.appendChild(descriptionElement);
        
            // Append the forecast card to the weather forecast section
            weatherForecastSection.appendChild(forecastCard);
        });
    }
    
// Clear the park-display section
clearParkDisplay();

// Function that Clears content from the park-display
function clearParkDisplay() {
    var parkDisplayContainer = document.getElementById("park-display-container");
// Clears any content from the park-display
    parkDisplayContainer.innerHTML = "";
}