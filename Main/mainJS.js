const apiKey = "0458eed4077f6961f51b967ffde6eddf";
const units = "imperial";

// Main Function
document.querySelector('.search-box button').addEventListener("click", () => {
    const cityName = document.getElementById("search-inputbox").value;

    console.log(cityName); // testing if value is properly obtained
    
    const zipcode = document.getElementById("zipcode").value;

    // Geocoding Api Call
    const geocodeApi = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&appid=${apiKey}`;
    fetch(geocodeApi)
        .then(response => response.json())
        .then(data => {

            const city = data[0];
            // This displays the city name (Line 16) and calls the two functions to update weather image and weather details (Uses line 13. Json response data is an array)
            document.querySelector('.city-name').innerText = city.name;
            updateWeatherImage(city.lat, city.lon);
            updateWeatherDetails(city.lat, city.lon);
            hourlyAndDaily(city.lat, city.lon);
        })
        .catch(error => {
            console.error('Fetching Geocoding Api Error:', error);
            alert('Error fetching geocoding data. TRY AGAIN!');
            document.querySelector('.invalid-search').style.display = 'block';
        });
        
});

// This function updates the weather image by calling & fetching the api, display image and catches errors
function updateWeatherImage(lat, lon) {
    const currentweatherdataApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    fetch(currentweatherdataApi)
        .then(response => response.json())
        .then(weatherData => {
            
            console.log('Weather Data:', weatherData); // console weather data

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
    const currentweatherdataApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

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

// function uses lat and lon to fetch data from api for hourly weather data, uses helper functions to update hourly and daily innter text sections
function hourlyAndDaily(lat, lon) {
    const paid_key = "99d2b2119564b967920fc9c79ab0f977";
    const currentweatherdataApi = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${paid_key}`
    fetch(currentweatherdataApi)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Data:", data); // print data in so we can work with it visually

            hourlyText(data);
            dailyText(data);
            console.log(data["hourly"][0]["dt"]);
            unixToDay(data["hourly"][0]["dt"]);
            unixToHour(data["hourly"][0]["dt"]);
        })
    }


// function uses openweathermap's One Call 3.0 API json array to update inner text of hourly section to display weather data of searched location
function hourlyText(arr) {
    for (let i=1; i<13; i++) {
        // sets inner text for the hourly section for next 12 hours
        document.querySelector(`.hour${i}`).innerText =
        `` ;
    }
}

// function uses openweathermap's One Call 3.0 API json array to update inner text of hourly section to display weather data of searched location
function dailyText(arr) {
    for (let i=1; i<8; i++) {
        // set inner text for daily section for next 7 days (excludes current day as it's displayed above)
        document.querySelector(`.day${i}`).innerText = 
        ``;
    }
}

// function to convert unix timestamp to date time format
function unixToDay(num) {
    const date = new Date(num*1000);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const current_date = `${month}/${day}`;
    console.log(current_date);
    return current_date;
}

function unixToHour(num) {
    const date = new Date(num*1000);
    console.log(date.getHours())
    return date.getHours();
}