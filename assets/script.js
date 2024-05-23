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
        renderSearchHistory();
    }
}

function getApi(cityName = null) {
    if (!cityName) {
        cityName = document.querySelector('#search-bar').value;
    }

    const requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
    updateLocalStorage(cityName);

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            const latitude = data[0].lat;
            const longitude = data[0].lon;
            getForecast(latitude, longitude, cityName);
        });
}

function getForecast(lat, lon, cityName) {
    const requestUrlCelsius = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const requestUrlFahrenheit = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    Promise.all([
        fetch(requestUrlCelsius).then(response => response.json()),
        fetch(requestUrlFahrenheit).then(response => response.json())
    ]).then(([dataCelsius, dataFahrenheit]) => {
        renderCurrentWeather(dataCelsius, dataFahrenheit, cityName);
        renderWeeklyWeather(dataCelsius, dataFahrenheit);
    });
}

function renderCurrentWeather(currentWeatherCelsius, currentWeatherFahrenheit, cityName) {
    displayCurrentWeather.innerHTML = ''; // Clear existing content

    const cityWeatherContainer = document.createElement('div');
    cityWeatherContainer.setAttribute('class', 'border');
    const cityNameEl = document.createElement('h2');
    const temperature = document.createElement('p');
    const wind = document.createElement('p');
    const humidity = document.createElement('p');

    cityNameEl.textContent = cityName;
    temperature.textContent = `Temp: ${currentWeatherCelsius.list[0].main.temp} °C / ${currentWeatherFahrenheit.list[0].main.temp} °F`;
    wind.textContent = `Wind: ${currentWeatherCelsius.list[0].wind.speed} m/s / ${currentWeatherFahrenheit.list[0].wind.speed} mph`;
    humidity.textContent = `Humidity: ${currentWeatherCelsius.list[0].main.humidity} %`;

    cityWeatherContainer.append(cityNameEl);
    cityWeatherContainer.append(temperature);
    cityWeatherContainer.append(wind);
    cityWeatherContainer.append(humidity);

    displayCurrentWeather.append(cityWeatherContainer);
}

function renderWeeklyWeather(forecastCelsius, forecastFahrenheit) {
    weeklyForecast.innerHTML = ''; // Clear existing content

    for (let i = 0; i < 5; i++) {
        const weatherCard = document.createElement('div');
        weatherCard.setAttribute('class', 'card');
        const dayOfWeek = document.createElement('h4');
        const temperature = document.createElement('p');
        const wind = document.createElement('p');
        const humidity = document.createElement('p');

        dayOfWeek.textContent = dayjs(forecastCelsius.list[i].dt_txt).format('dddd');
        temperature.textContent = `Temp: ${forecastCelsius.list[i].main.temp} °C / ${forecastFahrenheit.list[i].main.temp} °F`;
        wind.textContent = `Wind: ${forecastCelsius.list[i].wind.speed} m/s / ${forecastFahrenheit.list[i].wind.speed} mph`;
        humidity.textContent = `Humidity: ${forecastCelsius.list[i].main.humidity} %`;

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
        buttonEl.setAttribute('class', 'btn btn-secondary m-1'); // Optional: Add styling
        buttonEl.addEventListener('click', function() {
            getApi(city);
        });
        searchHistory.append(buttonEl);
    });
}

// Initial rendering of search history
renderSearchHistory();

// Event Listeners
searchCity.addEventListener('click', () => getApi());

