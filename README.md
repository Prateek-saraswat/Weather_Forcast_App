# Weather Forecast Web Application

A responsive weather forecasting web application built using HTML, Tailwind CSS, and Vanilla JavaScript. The application provides real-time weather updates, a five-day forecast, dynamic video backgrounds based on weather conditions, temperature unit conversion, location-based fetching, and recent search storage.

## Github Link - https://github.com/Prateek-saraswat/Weather_Forcast_App

## Features

### Current Weather
- Displays city, country, temperature, date, humidity, pressure, wind speed, and description.
- Shows sunrise time converted from UNIX timestamp.
- Auto-fetches weather using user location on page load.

### City Search
- Users can search for any city worldwide.
- Validates empty inputs.
- Handles invalid city names gracefully.
- Stores up to five recent city searches.

### Five-Day Forecast
- Shows temperature, humidity, wind, weather icon, and date for the next 5 days.
- Icons and colors change based on weather type.

### Temperature Unit Toggle
- Switch between Celsius and Fahrenheit.
- Converts both current and feels-like temperatures.
- Smooth animated toggle switch.

### Dynamic Background System
- Background videos change based on weather conditions:
  - Rain
  - Snow
  - Thunderstorm
- Falls back to default background for other weather types.

### Custom Alert Popups
- Displays alerts for:
  - Very high temperature
  - Very low temperature
  - High humidity with possible rain
- Animated popup with smooth open/close transitions.

### Recent Searches
- Saves recent searched cities in localStorage.
- Dropdown updates dynamically.
- Directly fetches weather when a recent city is selected.

### Error Handling
- Handles API errors.
- Handles invalid city names.
- Handles denied location permission.
- Shows meaningful error popups.

---

## Technologies Used

- HTML5  
- Tailwind CSS  
- JavaScript (ES6)  
- OpenWeatherMap API  
- Geolocation API  

---
## Project structure
|-- index.html
|-- script.js
|-- style.css
|-- README.md
|-- /bg-vedios
|      |-- Rain.mp4
|      |-- Snow.mp4
|      |-- Thunderstorm.mp4


## API Used

OpenWeatherMap 5-Day / 3-Hour Forecast API:

```url
https://api.openweathermap.org/data/2.5/forecast?q={cityName}&appid={API_KEY}&units=metric



