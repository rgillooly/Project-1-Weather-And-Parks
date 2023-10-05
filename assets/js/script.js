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
    // Fetch a list of all parks and return the response as JSON
    fetch(allParksAPI)
        .then(function (response) {\
            return response.json();
        })
        .then(function (data) {
        // Filter parks to include only the searched park     
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
            // Fetch weather forecast for the matching park
            fetchWeatherForecast(latitude,longitude);
            } else {
            // Log when no parks match
            console.log("No matching parks found");

            // Show the modal when no matching park is found
            var modal = document.getElementById("noMatchingParkModal");
            modal.style.display = "block"
        }

    })    
        // Handle errors when fetching park data
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
    // Clear previous park information when searching again
    localStorage.removeItem('weatherForecastData');
    // Api for fetching 5 day weather based on lat and long
    var openWeatherMapApiKey = '876fe47417eaaeff0f787d1ddd261473';
    var weatherForecastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherMapApiKey}&units=imperial`;
    //fetch request to open weathr api
    fetch(weatherForecastAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // Process forecast data and display on the page
            displayWeatherForecast(data);
        })
        .catch(function (error) {
            // Handle errors during API request
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

    // Append the elements in this order        
    parkDisplayContainer.appendChild(parkName);
    parkDisplayContainer.appendChild(parkURL);
    parkDisplayContainer.appendChild(parkDescription);
    parkDisplayContainer.appendChild(parkImage);

    // Store the park data in localStorage
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

    // Check if there is stored park information available
    if (storedParkName && storedParkURL && storedParkDescription && storedParkImage) {
        
        // Create an h3 element for the park's name
        var parkNameEl = document.createElement('h3');
        parkNameEl.textContent = storedParkName;

        // Create an anchor element for the park's website URL
        var parkURLEl = document.createElement('a');
        parkURLEl.href = storedParkURL;
        parkURLEl.textContent = "Visit Park Website @ National Park Service";

        // Create a paragraph element for the park's description
        var parkDescriptionEl = document.createElement('p');
        parkDescriptionEl.textContent = storedParkDescription;

        // Create an image element for the park's associated image
        var parkImageEl = document.createElement('img');
        parkImageEl.src = storedParkImage;
        parkImageEl.alt = storedParkName;

        // Set the image dimensions to maintain aspect ratio
        parkImageEl.style.width = "500px";
        parkImageEl.style.height = "auto";

        // Append elements in a specific order
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
    // Clear any existing forecast cards
    weatherForecastSection.innerHTML = '';
    // Array to store forecast data
    var forecastData = [];
    // Loop through weather and create forecast cards every 24 hours
    for (var i = 0; i < weatherData.list.length; i+=8) {
        var forecast = weatherData.list[i];

        // Create a div element for the forecast card
        var forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        // Create a paragraph for the forecast date
        var dateElement = document.createElement('p');
        dateElement.textContent = new Date(forecast.dt * 1000).toLocaleDateString();
        // Create an image element for the weather icon
        var icon = document.createElement('img');
        icon.src = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`
        // Create a paragraph for temperature
        var temperatureElement = document.createElement('p');
        temperatureElement.textContent = 'Temperature: ' + Math.round(forecast.main.temp) + '°F';
        // Create a paragraph for wind speed
        var windSpeedMetPS = forecast.wind.speed;
        var windSpeed = document.createElement("p");
        windSpeed.textContent = "Wind Speed: " + windSpeedMetPS.toFixed(1) + " mph";
        // Create a paragraph for weather description
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
    // Store the forecast data in localStorage for later use
    localStorage.setItem('weatherForecastData', JSON.stringify(forecastData));
}

    // Check if there's weather forecast data in localStorage
    var storedForecastData = localStorage.getItem('weatherForecastData');

    if (storedForecastData) {
        // Parse the stored data back into an array
        var forecastDataArray = JSON.parse(storedForecastData);

        // Get a reference to the forecast cards container
        var weatherForecastSection = document.querySelector('.forecast-cards-container');
        // Clear any existing forecast cards
        weatherForecastSection.innerHTML = '';

        // Create forecast cards and populate them with the stored data
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