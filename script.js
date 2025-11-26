let cityNameInput = document.getElementById("cityInput");
let searchButton = document.getElementById("search-btn");
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = "fde95b9587706beec1e7c4be0e4b0ada";
const locationBtn = document.getElementById("location-btn");
const dropDownMenu = document.getElementById("recentCities")

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const OWM_to_WI = {
  "01d": "wi-day-sunny",
  "01n": "wi-night-clear",

  "02d": "wi-day-cloudy",
  "02n": "wi-night-alt-cloudy",

  "03d": "wi-cloud",
  "03n": "wi-cloud",

  "04d": "wi-cloudy",
  "04n": "wi-cloudy",

  "09d": "wi-showers",
  "09n": "wi-showers",

  "10d": "wi-day-rain",
  "10n": "wi-night-alt-rain",

  "11d": "wi-thunderstorm",
  "11n": "wi-thunderstorm",

  "13d": "wi-snow",
  "13n": "wi-snow",

  "50d": "wi-fog",
  "50n": "wi-fog",
};
const weatherColorMap = {
  Clear: "text-yellow-300",
  Clouds: "text-gray-300",
  Rain: "text-blue-400",
  Drizzle: "text-blue-300",
  Thunderstorm: "text-purple-400",
  Snow: "text-blue-200",
  Mist: "text-gray-400",
  Fog: "text-gray-400",
  Haze: "text-orange-300",
  Dust: "text-yellow-600",
  Sand: "text-yellow-500",
  Ash: "text-gray-500",
  Squall: "text-cyan-300",
  Tornado: "text-red-600",
};

function convertSunriseTime(time) {
  const date = new Date(time * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  console.log(hours, minutes);
  document.getElementById("sunrise").innerText = `${hours}:${minutes}`;
}

function fetchForecast(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

saveCityToStorage(data.city.name)
      const fiveDaysData = [];

      let lastDate = "";
      data.list.forEach((item) => {
        let date = item.dt_txt.split(" ")[0];
        if (date !== lastDate) {
          fiveDaysData.push(item);
          lastDate = date;
        }
      });
      console.log(fiveDaysData);
      document.getElementById("current-temp").innerText = Math.round(
        data.list[0].main.temp
      );
      document.getElementById("current-city").innerText = data.city.name;
      document.getElementById("current-country").innerText = data.city.country;
      document.getElementById("weather-discription").innerText =
        data.list[0].weather[0].description.replace(/^\w/, (c) =>
          c.toUpperCase()
        );
      document.getElementById("feels-like").innerText = Math.round(
        data.list[0].main.feels_like
      );
      document.getElementById("humidity").innerText = Math.round(
        data.list[0].main.humidity
      );
      document.getElementById("wind-speed").innerText = data.list[0].wind.speed;
      document.getElementById("pressure").innerText =
        data.list[0].main.pressure;
      convertSunriseTime(data.city.sunrise);

      let nextFiveDaysData = fiveDaysData.slice(1, 6);
      console.log(nextFiveDaysData);

      nextFiveDaysData.forEach((eachDay, index) => {
        let dt = eachDay.dt_txt;
        let date = new Date(dt);
        let dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        document.getElementById(`next-day-${index}`).innerText = dayName;
        document.getElementById(`next-day-${index}-weather`).innerText =
          eachDay.weather[0].description.replace(/^\w/, (c) => c.toUpperCase());
        document.getElementById(
          `next-day-${index}-temp`
        ).innerText = `${Math.round(eachDay.main.temp)}°`;
        document.getElementById(
          `next-day-${index}-humidity`
        ).innerText = `${Math.round(eachDay.main.humidity)}%`;
        document.getElementById(`icon-${index}`).className = `wi ${
          OWM_to_WI[eachDay.weather[0].icon]
        } text-5xl ${weatherColorMap[eachDay.weather[0].main]} my-3`;
      });
      updateRecentDropdown();
    })
    .catch(()=> alert("City not found : Enter a valid city name"));
}

function saveCityToStorage(city){

let cities = JSON.parse(localStorage.getItem("recentCities"))|| []
cities = cities.filter((c)=> c.toLowerCase() !== city.toLowerCase())

cities.unshift(city)
if(cities.length > 5)cities.pop()

    localStorage.setItem("recentCities" , JSON.stringify(cities))

}

function updateRecentDropdown() {
  const dropdownDiv = document.getElementById("recent-dropdown");
  const select = document.getElementById("recentCities");
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  if (cities.length === 0) {
    dropdownDiv.classList.add("hidden");
    return;
  }

  dropdownDiv.classList.remove("hidden");

  select.innerHTML = `<option value="">Recent</option>`;

  cities.forEach(city => {
    select.innerHTML += `<option value="${city}">${city}</option>`;
  });
}

searchButton.addEventListener("click", () => {
  if(cityNameInput.value !== ""){
    let url = `${BASE_URL}?q=${cityNameInput.value}&appid=${API_KEY}&units=metric`;
  fetchForecast(url);
   saveCityToStorage(cityNameInput.value);
    updateRecentDropdown();
  }else{
    alert("Enter a city name to fetch data")
  }
});

locationBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let longitude = position.coords.longitude;
      let latitude = position.coords.latitude;
      let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      fetchForecast(url);
      alert("Weather Forecast Sucessfully Fetched!!");
    },
    () =>
      alert(
        "Location permission denied! Please enable it from your browser settings."
      )
  );
});

dropDownMenu.addEventListener("change", (e) => {
  const city = e.target.value;
  if (city !== "") {
    let url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    fetchForecast(url);
  }
});

window.addEventListener("load", updateRecentDropdown);
