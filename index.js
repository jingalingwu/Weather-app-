const userLocation = document.getElementById("userLocation"),
converter = document.getElementById ("converter"),
weatherIcon = document.querySelector (".weatherIcon"),
temperature = document.querySelector(".temperature"),
feelsLike = document.querySelector(".feelsLike"),
description = document.querySelector(".description"),
date = document. querySelector(".date"),
city = document. querySelector(".city"),

HValue = document.getElementById ("HValue" ),
WValue = document.getElementById ("WValue"),
SRValue = document.getElementById("SRValue"),
SSValue = document.getElementById ("SSValue"),
CValue = document.getElementById("CValue"),
UVValue = document.getElementById ("UVValue"),
PValue = document.getElementById ("PValue"),

Forecast = document.querySelector (".Forecast");



function findUserLocation() {
    
    const cityName = userLocation.value;  // Get the city name from the input field
    const GEO_API_ENDPOINT = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`;
   Forecast.innerHTML ="";
    // Fetch the location data
    fetch(GEO_API_ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
        const location = data.results[0];  // Get the first location in the results array
        const lat = location.latitude;
        const lon = location.longitude;

        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        // Update the city name on the webpage
        city.innerHTML = location.name + ", " + location.country;
    

        // Use the latitude and longitude to get weather data
        const WEATHER_API_ENDPOINT = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,wind_speed_10m_max,wind_gusts_10m_max&timeformat=unixtime&timezone=auto`;


        // Fetch the weather data
        return fetch(WEATHER_API_ENDPOINT);  // Return the fetch promise so we can chain it

    })
    .then((response) => response.json())
    .then((weatherData) => {
        const weatherDescriptions = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Dense Drizzle",
            56: "Light Freezing Drizzle ",
            57: "Dense Freezing Drizzle ",
            61: "Slight Rain",
            63: "Moderate Rain",
            65: "Heavy Rain",
            66: "Light Freezing Rain",
            67: "Heavy Freezing Rain",
            71: "Slight Snow Fall",
            73: "Moderate Snow Fall",
            75: "Heavy Snow Fall",
            77: "Snow grains",
            80: "Slight Rain Showers",
            81: "Moderate Rain Showers",
            82: "Violent Rain Showers",
            85: "Slight Snow Showers",
            86: "Heavy Snow Showers",
            95: "Slight or Moderate Thunderstorm",
            96: "Thunderstorm with Slight Hail",
            99: "Thunderstorm with Heavy Hail"
        };
        const weatherCode = weatherData.daily.weather_code[0];
        weatherIcon.style.background = `url('/images/${weatherCode}.PNG')`;
        temperature.innerHTML=TConverter(weatherData.current.temperature_2m);


        const descriptionText = weatherDescriptions[weatherCode] || "Unknown weather code";
        feelsLike.innerHTML = "Feels like " +TConverter(weatherData.current.apparent_temperature);
        description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> Description: ` + descriptionText;
        const options ={
            weekday:"long",
            month:"long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12:true

        }
        date.innerHTML=toLongFormatDateTime(weatherData.current.time, options);
        console.log(toLongFormatDateTime(weatherData.current.time));  // Check the raw timestamp
    

        HValue.innerHTML=Math.round(weatherData.current.relative_humidity_2m)+"<span>%</span>";
        WValue.innerHTML=Math.round(weatherData.current.wind_speed_10m)+"<span>m/s</span>";

        const options1={
            hour:"numeric",
            minute:"numeric",
            hour12:true,
            timeZone: weatherData.timezone 
        }

        SRValue.innerHTML = toLongFormatDateTime(weatherData.daily.sunrise[0], options1)+"<br> " + weatherData.timezone_abbreviation;
        SSValue.innerHTML=toLongFormatDateTime(weatherData.daily.sunset[0], options1)+"<br> " + weatherData.timezone_abbreviation;;
      

        CValue.innerHTML=Math.round(weatherData.current.cloud_cover)+"<span>%</span>";
        UVValue.innerHTML=Math.round(weatherData.daily.uv_index_max[0]);
        PValue.innerHTML=Math.round(weatherData.current.surface_pressure)+"<span>hPa</span>";

     
            weatherData.daily.weather_code.forEach((weather_code, index) => {
            let div = document.createElement("div");      
            let dailyDate = toLongFormatDateTime(weatherData.daily.time[index], options).split(" at ");
           
            let dailyMonth = dailyDate[0].split(", ");
            div.innerHTML = dailyDate[0];
            div.innerHTML = dailyMonth[1];

            div.innerHTML += `<img src="/images/${weather_code}.PNG" />`;
            const dailyDescription = weatherDescriptions[weather_code] || "Unknown weather code";
                div.innerHTML += `<p class="forecast-desc">${dailyDescription}</p>`;

                const maxTemp = TConverter(weatherData.daily.temperature_2m_max[index]);
                const minTemp = TConverter(weatherData.daily.temperature_2m_min[index]);
    div.innerHTML += `<p> ${minTemp} - ${maxTemp}</p>`;
   

        
        
            Forecast.append(div);
            });
                

        
    })
    
    .catch((error) => {
        console.error('Error:', error);  // Handle any errors from either fetch call
        alert("City not found");  
    });
}

function formatUnixTime(dtValue, options = {}) {
    const date = new Date(dtValue * 1000); // Adjust Unix timestamp by the timezone offset
    return date.toLocaleTimeString([], { ...options });
}

function toLongFormatDateTime(dtValue, options = {}) {
    return formatUnixTime(dtValue, options);
}


function TConverter(temp){
    let tempValue = Math.round(temp);
    let message ="";

    if(converter.value=="°C")
    {
        message =tempValue+"<span>\u00B0C</span>";
    }
    else{
        let ctof=(tempValue*9)/5+32;

        message =ctof+"<span>\u00B0F</span>";
    }
    return message

}



userLocation.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {  // Check if the Enter key is pressed
        event.preventDefault();  // Prevent form submission (if any)
        findUserLocation();  // Call your function to fetch and display weather data
    }
});