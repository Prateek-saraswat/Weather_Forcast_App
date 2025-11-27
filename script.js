//selecting all the important elements by id
let cityNameInput = document.getElementById("cityInput");
let searchButton = document.getElementById("search-btn");
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = "fde95b9587706beec1e7c4be0e4b0ada";
const locationBtn = document.getElementById("location-btn");
const dropDownMenu = document.getElementById("recentCities");
const toggleBtn = document.getElementById("unit-toggle");
const switchKnob = document.getElementById("switch-knob");
const closePopupBtn = document.getElementById("popup-close");
let isCelcius = true;

//Made a function to show popup with a default message
function showPopUp(message = "Notice", desciption) {
  const coustomPopUpDiv = document.getElementById("custom-popup");
  const popupBox = document.getElementById("popup-box");
  const popUpMessage = document.getElementById("popup-message");
  const popUpdesc = document.getElementById("popup-desc");

  popUpMessage.innerText = message;
  popUpdesc.innerText = desciption;

  coustomPopUpDiv.classList.remove("hidden");
  setTimeout(() => {
    popupBox.classList.remove("scale-95", "opacity-0");
    popupBox.classList.add("scale-100", "opacity-100");
  }, 10);
}

//adding event listener to close the popup
closePopupBtn.addEventListener("click", () => {
  const coustomPopUpDiv = document.getElementById("custom-popup");
  const popupBox = document.getElementById("popup-box");
  popupBox.classList.remove("scale-100", "opacity-100");
  popupBox.classList.add("scale-95", "opacity-0");
  setTimeout(() => coustomPopUpDiv.classList.add("hidden"), 200);
});

//maping icons for changing acc to weather
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

//colour maping to match colour acc to weather
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

//made function to show sunrise time 
function convertSunriseTime(time) {
  const date = new Date(time * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  console.log(hours, minutes);
  document.getElementById("sunrise").innerText = `${hours}:${minutes}`;
}

//function to convert F-C
function convertToC(fahrenheit) {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}
//function to convert C-F
function convertToF(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}


function convertAllToF() {
  let currentCelcius = document.getElementById("current-temp");
  let currentUnit = document.getElementById("current-unit");
  let feels_like_temp = document.getElementById("feels-like");
  let feels_like_unit = document.getElementById("feels-like-unit");

  currentCelcius.innerText = convertToF(parseInt(currentCelcius.innerText));
  feels_like_temp.innerText = convertToF(parseInt(feels_like_temp.innerText));
  currentUnit.innerText = "°F";
  feels_like_unit.innerText = "°C";
}

function convertAlltoC() {
  let currentFarenheight = document.getElementById("current-temp");
  let currentUnit = document.getElementById("current-unit");
  let feels_like_temp = document.getElementById("feels-like");
  let feels_like_unit = document.getElementById("feels-like-unit");

  currentFarenheight.innerText = convertToC(
    parseInt(currentFarenheight.innerText)
  );
  feels_like_temp.innerText = convertToC(parseInt(feels_like_temp.innerText));
  currentUnit.innerText = "°C";
  feels_like_unit.innerText = "°C";
}

//Function for apllying background according to the fetched data
function applyRainBg(data){
  const bgVideo = document.getElementById("bg-video");
    let weather = data.list[0].weather[0].main
if (["Rain", "Snow", "Thunderstorm"].includes(weather)) {
    bgVideo.src = `./bg-vedios/${weather}.mp4`;  
    bgVideo.style.display = "block";  
    document.body.style.background = "none"; 
} else {
    bgVideo.style.display = "none";   
    document.body.style.background = ""; 
}
}

function dateConvertion(dt){
let date = new Date(dt);

let formatted = date.toLocaleDateString("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

return formatted
}

function simpleFormattedDate (dt){
let date = new Date(dt);

let day = date.getDate();
return day
}

//Funtion to fetch data from API 
function fetchForecast(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      saveCityToStorage(data.city.name);
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
       applyRainBg(data)
      

      if (Math.round(data.list[0].main.temp) > 40) {
        showPopUp(
          "Be Alert :Heat Warning",
          "Temperature of your location is too high!!"
        );
      } else if (Math.round(data.list[0].main.temp) < 5) {
        showPopUp(
          "Be Alert :Cold Warning",
          "Temperature of your location is too low!!"
        );
      } else if (Math.round(data.list[0].main.humidity) > 80) {
        showPopUp(
          "Rain Alert",
          "There is a high possibility of rain in your area!"
        );
      }
      document.getElementById("current-date").innerText = dateConvertion(data.list[0].dt_txt)
      document.getElementById("current-temp").innerText = Math.round(data.list[0].main.temp);
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
        document.getElementById(`next-day-${index}`).innerText = dayName
        document.getElementById(`next-day-${index}-weather`).innerText =
          eachDay.weather[0].description.replace(/^\w/, (c) => c.toUpperCase());
        document.getElementById(
          `next-day-${index}-temp`
        ).innerText = `${Math.round(eachDay.main.temp)}°C`;
        document.getElementById(
          `next-day-${index}-humidity`
        ).innerText = `${Math.round(eachDay.main.humidity)}%`;
        document.getElementById(`next-day-${index}-wind`).innerText = `${eachDay.wind.speed} km/h`
        document.getElementById(`date-${index}`).innerText = `${simpleFormattedDate(eachDay.dt_txt)}, `
        document.getElementById(`icon-${index}`).className = `wi ${
          OWM_to_WI[eachDay.weather[0].icon]
        } text-5xl ${weatherColorMap[eachDay.weather[0].main]} my-3`;
      });
      updateRecentDropdown();
    })
    .catch(() =>
      showPopUp("Enter a valid city Name", "The name you entered was not found")
    );
}

//function to save current searched cities to local storage
function saveCityToStorage(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  cities = cities.filter((c) => c.toLowerCase() !== city.toLowerCase());

  cities.unshift(city);
  if (cities.length > 5) cities.pop();

  localStorage.setItem("recentCities", JSON.stringify(cities));
}

//updating dropdown
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

  cities.forEach((city) => {
    select.innerHTML += `<option value="${city}">${city}</option>`;
  });
}

//adding event listener on search button
searchButton.addEventListener("click", () => {
  if (cityNameInput.value !== "") {
    let url = `${BASE_URL}?q=${cityNameInput.value}&appid=${API_KEY}&units=metric`;
    fetchForecast(url);
    saveCityToStorage(cityNameInput.value);
    updateRecentDropdown();
  } else {
    showPopUp(
      "Search Field cannot be empty",
      "Enter a city name to fetch weather deatails."
    );
  }
});


//event listener on location button
locationBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let longitude = position.coords.longitude;
      let latitude = position.coords.latitude;
      let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      fetchForecast(url);
      showPopUp(
        "Location fethed sucessfully",
        "Weather forecast has been updated with your location."
      );
    },
    () =>
      showPopUp(
        "User Denied Location Permission",
        "Please allow location permission from browser settings."
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

//toogle button for changing temp unit
toggleBtn.addEventListener("click", () => {
  if (isCelcius) {
    convertAllToF();
    isCelcius = false;
    switchKnob.style.transform = "translateX(32px)";
  } else {
    convertAlltoC();
    isCelcius = true;
    switchKnob.style.transform = "translateX(4px)";
  }
});

window.addEventListener("load",  ()=>{
  updateRecentDropdown()
    navigator.geolocation.getCurrentPosition(
    (position) => {
      let longitude = position.coords.longitude;
      let latitude = position.coords.latitude;
      let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      fetchForecast(url);
      showPopUp(
        "Location fethed sucessfully",
        "Weather forecast has been updated with your location."
      );
    },
    () =>
      showPopUp(
        "User Denied Location Permission",
        "Please allow location permission from browser settings."
      )
  );
});
