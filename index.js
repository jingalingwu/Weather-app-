const userLocation = document.getElementById("userLocation"),
converter = document.getElementById ("converter"),
weatherIcon = document.querySelector (".weatherIcon"),
temperature = document.querySelector(".temperature"),
feelsLike = document.querySelector(".feelsLike"),
description = document.querySelector(".description"),
date = document.querySelector(".date"),
city = document.querySelector(".city"),
weatherInput = document.querySelector(".weather-input"),


HValue = document.getElementById ("HValue" ),
WValue = document.getElementById ("WValue"),
SRValue = document.getElementById("SRValue"),
SSValue = document.getElementById ("SSValue"),
CValue = document.getElementById("CValue"),
UVValue = document.getElementById ("UVValue"),
PValue = document.getElementById ("PValue"),

Forecast = document.querySelector (".Forecast");



function findUserLocation() {
    
    const cityName = userLocation.value;  
    const GEO_API_ENDPOINT = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`;
   Forecast.innerHTML ="";
    
    fetch(GEO_API_ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
        const location = data.results[0];  
        const lat = location.latitude;
        const lon = location.longitude;

        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        // Update the city name on the webpage
        city.innerHTML = location.name + ", " + location.country;
    

        // Use the latitude and longitude to get weather data
        const WEATHER_API_ENDPOINT = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,wind_speed_10m_max,wind_gusts_10m_max&timeformat=unixtime&timezone=auto`;


       
        return fetch(WEATHER_API_ENDPOINT);  

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

        const weatherGradientMap = {
            0: 'linear-gradient(-45deg, #81E4EB 0%, #F0FC8B 100%)', 
            1: 'linear-gradient(-45deg, #81E4EB 0%, #F0FC8B 100%)', 
            2: 'linear-gradient(-45deg, #BFC3E0 0%, #FCFCFC 100%)', 
            3: 'linear-gradient(-45deg, #BFC3E0 0%, #FCFCFC 100%)', 
            45: 'linear-gradient(-45deg, #BFC3E0 0%, #FCFCFC 100%)', 
            48: 'linear-gradient(-45deg, #BFC3E0 0%, #FCFCFC 100%)', 
            51: 'linear-gradient(-45deg, #4963BA 0%, #B3F0FC 100%)', 
            53: 'linear-gradient(-45deg, #4963BA 0%, #B3F0FC 100%)', 
            55: 'linear-gradient(-45deg, #4963BA 0%, #B3F0FC 100%)', 
            56: 'linear-gradient(-45deg, #5F9EA0 0%, #E8F5FC 100%)', 
            57: 'linear-gradient(-45deg, #4682B4 0%, #E8F5FC 100%)', 
            61: 'linear-gradient(-45deg, #6E8ABA 0%, #D9F5FC 100%)', 
            63: 'linear-gradient(-45deg, #6E8ABA 0%, #D9F5FC 100%)', 
            65: 'linear-gradient(-45deg, #6E8ABA 0%, #D9F5FC 100%)', 
            66: 'linear-gradient(-45deg, #6E8ABA 0%, #D9F5FC 100%)', 
            67: 'linear-gradient(-45deg, #6E8ABA 0%, #D9F5FC 100%)', 
            71: 'linear-gradient(-45deg, #A6C6F7 0%, #FCFCFC 100%)', 
            73: 'linear-gradient(-45deg, #A6C6F7 0%, #FCFCFC 100%)', 
            75: 'linear-gradient(-45deg, #A6C6F7 0%, #FCFCFC 100%)', 
            77: 'linear-gradient(-45deg, #A6C6F7 0%, #FCFCFC 100%)', 
            80: 'linear-gradient(-45deg, #4769AD 0%, #ACBDCC 100%)', 
            81: 'linear-gradient(-45deg, #4769AD 0%, #ACBDCC 100%)', 
            82: 'linear-gradient(-45deg, #4769AD 0%, #ACBDCC 100%)', 
            85: 'linear-gradient(-45deg, #4769AD 0%, #ACBDCC 100%)', 
            86: 'linear-gradient(-45deg, #4769AD 0%, #ACBDCC 100%)', 
            95: 'linear-gradient(-45deg, #4769AD 0%, #F2F0C6 51%, #ACBDCC 100%)', 
            96: 'linear-gradient(-45deg, #4769AD 0%, #F2F0C6 51%, #ACBDCC 100%)', 
            99: 'linear-gradient(-45deg, #4769AD 0%, #F2F0C6 51%, #ACBDCC 100%)', 
        };
        
       
        if (weatherGradientMap.hasOwnProperty(weatherCode)) {
            weatherInput.style.background = weatherGradientMap[weatherCode];
           
        } else {
            
            weatherInput.style.background = 'linear-gradient(-45deg, #FFFFFF 0%, #D3D3D3 100%)'; 
        } 

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
   

    
    div.style.background = weatherGradientMap[weather_code] || "linear-gradient(-45deg, #78c1f3, #ffffff)";

            Forecast.append(div);
            });
                

        
    })
    
    .catch((error) => {
        console.error('Error:', error);  
        alert("City not found");  
    });
}

function formatUnixTime(dtValue, options = {}) {
    const date = new Date(dtValue * 1000); 
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
    if (event.key === "Enter") {  
        event.preventDefault(); 
        findUserLocation();  
    }
});