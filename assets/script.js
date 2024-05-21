// Global Variables
const searchCity = document.querySelector('#search-button');
const apiKey = '12f94b2cfb070aaff567973e5f387444'
const citiesArray = JSON.parse(localStorage.getItem('cities')) || [];
const searchHistory = document.getElementById('search-history');


// --------------Functions Section--------------


// Function that fetches city weather data and displays it on the screen
function updateLocalStorage(cityName) {
    if (!citiesArray.includes(cityName)) {
    citiesArray.push(cityName)
    localStorage.setItem('cities', JSON.stringify(citiesArray))
};
}

function getApi() {
    const cityName = document.querySelector('#search-bar').value;
    const requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`
    updateLocalStorage(cityName);

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        const latitude = data[0].lat
        const longitude = data[0].lon
        getForecast(latitude, longitude);
        })
};

function getForecast(lat, lon) {
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data)
            renderCurrentWeather(data);
        })
}

function renderCurrentWeather(currentWeather) {
    console.log(currentWeather)

    const cityWeatherContainer = document.createElement('div');
    const cityName = document.createElement('h2');
    const temperature = document.createElement('p');
    const wind = document.createElement('p');
    const humidity = document.createElement('p');

    cityName.textContent = currentWeather.city.name
    temperature.textContent = currentWeather.list[0].main.temp
    wind.textContent = currentWeather.list[0].wind.speed
    humidity.textContent = currentWeather.list[0].main.humidity
}

function renderWeeklyWeather() {

}


function renderSearchHistory() {
    citiesArray.forEach((city) => 
    {
        const buttonEl = document.createElement('button');
        buttonEl.textContent = city
        searchHistory.append(buttonEl)
    })
}

renderSearchHistory();


// Event Listeners
searchCity.addEventListener('click', getApi);
