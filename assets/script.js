// Global Variables
const searchCity = document.querySelector('#search-button');
const apiKey = '12f94b2cfb070aaff567973e5f387444'


// --------------Functions Section--------------


// Function that fetches city weather data and displays it on the screen
function getApi() {
    const requestUrl = ''

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

        })
};








// Event Listeners
searchCity.addEventListener('click', getApi);
