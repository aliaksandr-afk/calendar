

function getWeather(date) {
let long;
let lat;
let WEATHER_KEY = "83b6660876df25f1d7d419c755b6846b";
let temperatureSection = document.querySelector('.weather-info__degree-section');
console.log(temperatureSection);
let temperatureDegree = document.querySelector('.weather-info__temperature-section');
console.log(temperatureDegree);

const temperatureSpan = document.querySelector('.weather-info__degree-section span')
console.log(temperatureSpan);
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
                    const { temperature, icon } = data.currently;
                    temperatureDegree.textContent = temperature;

                    let celsius = (temperature - 32) * (5 / 9)

                    setIcons(icon, document.querySelector('.weather-info__weather-icon'));

                    temperatureDegree.addEventListener('click', () => {
                        if (temperatureSpan.textContent === "F") {
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


    function setIcons(icon, iconID) {
        const skycons = new Skycons({ color: "white" });
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
}
export { getWeather };