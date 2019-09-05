let long;
let lat;
let WEATHER_KEY = "83b6660876df25f1d7d419c755b6846b";
// let temperatureDescription = document.querySelector('.temperature-description');
let temperatureDegree = document.querySelector('.temperature-degree');
// let locationTimezone = document.querySelector('.location-timezone');
let temperatureSection = document.querySelector('.temperature');
const temperatureSpan = document.querySelector('.temperature span')

function getWeather (date) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
    
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/${WEATHER_KEY}/${lat},${long},255657600?exclude=minutely,hourly,lang=ru,units=auto,alerts,flags&units=auto`;
    
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const { temperature, summary, icon } = data.currently;
                    temperatureDegree.textContent = temperature;
                    temperatureDescription.textContent = summary;
                    locationTimezone.textContent = data.timezone;
    
                    let celsius = (temperature - 32) * (5 / 9)
    
                    setIcons(icon, document.querySelector('.icon'));
    
                    temperatureSection. addEventListener('click', () => {
                        if(temperatureSpan.textContent === "F"){
                            temperatureSpan.textContent = "C";
                            temperatureDegree.textContent = Math.floor(celsius);
                        } else {
                            temperatureSpan.textContent = "F";
                            temperatureDegree.textContent = temperature;
                        }
                    })
                });
        });
    }
} 


function setIcons(icon, iconID) {
    const skycons = new Skycons({ color: "white" });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
}

export { getWeather, setIcons };