// Global Variables
const searchCity = document.querySelector('#search-button');


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
}








// Event Listeners
searchCity.addEventListener('click', getApi);
