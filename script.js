let apiKey ="fde95b9587706beec1e7c4be0e4b0ada"
let city = "Delhi"

fetch(`https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${apiKey}&units=metric`)
.then((res)=>res.json())
.then((data)=>console.log(data))

