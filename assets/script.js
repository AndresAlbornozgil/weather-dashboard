// Global Variables
const searchCity = document.querySelector('#search-button');
const apiKey = '12f94b2cfb070aaff567973e5f387444';
const citiesArray = JSON.parse(localStorage.getItem('cities')) || [];
const searchHistory = document.getElementById('search-history');
const displayCurrentWeather = document.getElementById('current-weather');
const weeklyForecast = document.getElementById('week-forecast');

// --------------Functions Section--------------

function updateLocalStorage(cityName) {
    if (!citiesArray.includes(cityName)) {
        citiesArray.push(cityName);
        localStorage.setItem('cities', JSON.stringify(citiesArray));
    }
}

function getApi() {
    const cityName = document.querySelector('#search-bar').value;
    const requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
    updateLocalStorage(cityName);

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            const latitude = data[0].lat;
            const longitude = data[0].lon;
            getForecast(latitude, longitude);
        });
}

function getForecast(lat, lon) {
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            renderCurrentWeather(data);
            renderWeeklyWeather(data);
        });
}

function renderCurrentWeather(currentWeather) {
    displayCurrentWeather.innerHTML = ''; // Clear existing content

    const cityWeatherContainer = document.createElement('div');
    cityWeatherContainer.setAttribute('class', 'border');
    const cityName = document.createElement('h2');
    const temperature = document.createElement('p');
    const wind = document.createElement('p');
    const humidity = document.createElement('p');

    cityName.textContent = currentWeather.city.name;
    temperature.textContent = 'Temp: ' + currentWeather.list[0].main.temp;
    wind.textContent = 'Wind: ' + currentWeather.list[0].wind.speed;
    humidity.textContent = 'Humidity: ' + currentWeather.list[0].main.humidity;

    cityWeatherContainer.append(cityName);
    cityWeatherContainer.append(temperature);
    cityWeatherContainer.append(wind);
    cityWeatherContainer.append(humidity);

    displayCurrentWeather.append(cityWeatherContainer);
}

function renderWeeklyWeather(forecast) {
    weeklyForecast.innerHTML = ''; // Clear existing content

    for (let i = 0; i < 5; i++) {
        const weatherCard = document.createElement('div');
        weatherCard.setAttribute('class', 'card');
        const dayOfWeek = document.createElement('p');
        const temperature = document.createElement('p');
        const wind = document.createElement('p');
        const humidity = document.createElement('p');

        dayOfWeek.textContent = forecast.list[i].dt_txt;
        temperature.textContent = 'Temp: ' + forecast.list[i].main.temp;
        wind.textContent = 'Wind: ' + forecast.list[i].wind.speed;
        humidity.textContent = 'Humidity: ' + forecast.list[i].main.humidity;

        weatherCard.append(dayOfWeek);
        weatherCard.append(temperature);
        weatherCard.append(wind);
        weatherCard.append(humidity);

        weeklyForecast.append(weatherCard);
    }
}

function renderSearchHistory() {
    searchHistory.innerHTML = ''; // Clear existing content

    citiesArray.forEach(city => {
        const buttonEl = document.createElement('button');
        buttonEl.textContent = city;
        buttonEl.addEventListener('click', citySearchHistory);
        searchHistory.append(buttonEl);
    });
}

function citySearchHistory(event) {
    getApi(this.textContent);
}

renderSearchHistory();

// Event Listeners
searchCity.addEventListener('click', getApi);
