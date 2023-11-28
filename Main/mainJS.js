const apiKey = '8892493b7ce9e7fdbf0ba96f8380cb318';

// Main Function
document.querySelector('.search-box button').addEventListener("click", () => {
    const cityName = document.getElementById("search-inputbox").value;

    console.log(cityName);
    
    const zipcode = document.getElementById("zipcode").value;

    // Geocoding Api Call
    const geocodeApi = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
    fetch(geocodeApi)
        .then(response => response.json())
        .then(data => {

            const city = data[0];
            // This displays the city name (Line 16) and calls the two functions to update weather image and weather details (Uses line 13. Json response data is an array)
            document.querySelector('.city-name').innerText = city.name;
            updateWeatherImage(city.lat, city.lon);
            updateWeatherDetails(city.lat, city.lon);
        })
        .catch(error => {
            console.error('Fetching Geocoding Api Error:', error);
            alert('Error fetching geocoding data. TRY AGAIN!');
            document.querySelector('.invalid-search').style.display = 'block';
        });
        
});

// This function updates the weather image by calling & fetching the api, display image and catches errors
function updateWeatherImage(lat, lon) {
    const currentweatherdataApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(currentweatherdataApi)
        .then(response => response.json())
        .then(weatherData => {
            
            console.log('Weather Data:', weatherData);

            const weatherImage = getWeatherImage(weatherData.weather[0].description);

            document.querySelector('.current-weatherimg h2').innerText = 'Current Weather Img';
            document.querySelector('.current-weatherimg img').src = weatherImage;
        })
        .catch(error => {
            console.error('Fetching Current-Weather-Data-Api (Weather Image) Error:', error);

        });
}

// Current Weather Image Function (Uses switch case with api response data given)
function getWeatherImage(condition) {
    let imageWeather;

    switch (condition.toLowerCase()) {
        case 'rain':
            imageWeather = 'images/rain.png';
            break;
        case 'cloudy':
            imageWeather = 'images/clouds.png';
            break;
        case 'snow':
            imageWeather = 'images/snow.png';
            break;
        case 'clear':
            imageWeather = 'images/sun.png';
            break;
        case 'thunderstorm':
            imageWeather = 'images/thunder.png';
            break;
        default:
            imageWeather = 'images/default.png';
    }

    return imageWeather;
}

// This function updates the weather details by calling & fetching the api, display the content and catches errors
function updateWeatherDetails(lat, lon) {
    const currentweatherdataApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(currentweatherdataApi)
        .then(response => response.json())
        .then(weatherData => {

            document.getElementById('temperature').innerText = `${weatherData.main.temp} °C`;
            document.getElementById('humidity').innerText = `${weatherData.main.humidity}%`;
            document.getElementById('wind').innerText = `${weatherData.wind.speed} m/s, ${weatherData.wind.deg}°`;
            document.getElementById('visibility').innerText = `${weatherData.visibility} meters`;
            document.getElementById('cloudCover').innerText = `${weatherData.clouds.all}%`;
            document.getElementById('sunrise').innerText = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
            document.getElementById('sunset').innerText = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
        })
        .catch(error => {
            console.error('Fetching Current-Weather-Data-Api (Weather Details) Error:', error);
        });
}