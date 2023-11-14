// app.js

function fahrenheitToCelsius(temperatureCelsius) {
    return temperatureCelsius;
}

function getWeather() {
    const addressInput = document.getElementById('addressInput').value;

    // Fetch API for 5-day forecast    
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${addressInput}&appid=7ded80d91f2b280ec979100cc8bbba94&units=metric`)
        .then(response => response.json())
        .then(data => {
            const forecastDiv = document.getElementById('forecast');
            console.log(forecastDiv.responseText);
            forecastDiv.innerHTML = '<h2>5-Day Forecast:</h2>';
            console.log(forecastDiv.innerHTML);
            data.list.forEach(item => {
                const temperatureCelsius = fahrenheitToCelsius(item.main.temp);
                const weatherDescription = item.weather[0].description;
                forecastDiv.innerHTML += `<p>${item.dt_txt}: ${temperatureCelsius.toFixed(2)}°C, Weather: ${weatherDescription}</p>`;
            });
        })
        .catch(error => console.error('Error fetching forecast:', error));

    // XMLHttpRequest for current weather
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const currentWeatherDiv = document.getElementById('currentWeather');
                const data = JSON.parse(xhr.responseText);
                const temperatureCelsius = fahrenheitToCelsius(data.main.temp);
                const weatherDescription = data.weather[0].description;
                currentWeatherDiv.innerHTML = `<h2>Current Weather:</h2>
                                               <p>Temperature: ${temperatureCelsius.toFixed(2)}°C</p>
                                               <p>Weather: ${weatherDescription}</p>`;
            } else {
                console.error('Error fetching current weather:', xhr.statusText);
            }
        }
    };

    xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${addressInput}&appid=7ded80d91f2b280ec979100cc8bbba94&units=metric`);
    xhr.send();
}
