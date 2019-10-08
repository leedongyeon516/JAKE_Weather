const loader = document.querySelector(".loader");
const locationForm = document.querySelector(".location-form");
const searchSection = document.querySelector(".search-section h1");
const searchBtn = document.querySelector(".search-btn");
const resultsSection = document.querySelector(".results-section");
const information = document.querySelector(".information");
const informationContent = document.querySelector(".information-content");
const modal = document.querySelector(".modal-modified");
const modalContent = document.querySelector(".modal-content-modified p");
const closeBtn = document.querySelector(".close-btn");

searchSection.addEventListener("click", () => {
  window.location.reload();
});

locationForm.addEventListener("submit", geocode);
searchBtn.addEventListener("click", geocode);

window.addEventListener("load", () => {
  document.querySelector(".search-section").classList.add("show");
});

function geocode(e) {
  e.preventDefault();

  const location = document.querySelector(".location-input").value;

  if (location === "") {
    modal.style.display = "block";
  } else {
    loader.style.opacity = "0";

    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: location,
          key: "AIzaSyCiRFDqPBn0gnedizieHL7bCZc3__PEM5w"
        }
      })
      .then(function(response) {
        console.log(response);

        let lat = response.data.results[0].geometry.location.lat;
        let lng = response.data.results[0].geometry.location.lng;
        let city = response.data.results[0].formatted_address;

        const proxy = "https://cors-anywhere.herokuapp.com/";
        const api = `${proxy}https://api.darksky.net/forecast/0669e06f4eac8f026e089f2322af95ea/${lat},${lng}`;

        fetch(api)
          .then(response => {
            return response.json();
          })
          .then(data => {
            console.log(data);

            const {
              summary,
              icon,
              temperature,
              humidity,
              windSpeed,
              visibility,
              uvIndex
            } = data.currently;
            const { precipProbability } = data.daily.data[0];
            const { temperatureLow, temperatureHigh } = data.daily.data[1];

            let iconImage = `${icon}.png`;
            let weatherNight = `
                  <div class="stars"></div>
                  <div class="twinkling"></div>`;
            let celsius = convertToCel(temperature);

            let output = `
                  <div class="location">
                    <h1>${city}</h1>
                  </div>
                  <div class="result">
                    <div class="summary">
                      <h3>${summary}</h3>
                    </div>
                    <div class="temperature">
                      <h3>${celsius}<span class="space">C</span></h3><br>
                      <h3>${Math.floor(
                        temperature
                      )}<span class="space">F</span></h3>
                    </div>
                  </div>`;

            if (icon == "clear-day") {
              resultsSection.classList.add("clear");
              resultsSection.style.background =
                "linear-gradient(rgb(153, 240, 243), rgb(33, 126, 219))";
            } else if (icon == "cloudy" || icon == "partly-cloudy-day") {
              resultsSection.classList.add("cloud");
              resultsSection.style.background =
                "linear-gradient(rgb(104, 109, 109), rgb(33, 126, 219))";
            } else if (icon == "clear-night" || icon == "partly-cloudy-night") {
              resultsSection.style.background = "none";
              resultsSection.classList.add("night");

              output = `
                ${weatherNight}
                <div class="location">
                  <h1>${city}</h1>
                </div>
                <div class="result">
                  <div class="summary">
                    <h3>${summary}</h3>
                  </div>
                  <div class="temperature">
                    <h3>${celsius}<span class="space">C</span></h3><br>
                    <h3>${Math.floor(
                      temperature
                    )}<span class="space">F</span></h3>
                  </div>
                </div>`;
            } else if (icon == "rain") {
              resultsSection.classList.add("rain");
              resultsSection.style.background = "#999 url('images/Drops_.png')";
            } else if (icon == "snow" || icon == "sleet") {
              resultsSection.classList.add("snow");
              resultsSection.style.background = "#url('images/Snow_.gif')";
            } else if (icon == "wind" || icon == "fog") {
              resultsSection.classList.add("wind");
              resultsSection.style.background =
                "linear-gradient(rgb(135, 231, 241), rgb(235, 157, 245))";
            } else {
              resultsSection.style.background =
                "linear-gradient(rgb(4, 4, 7), rgb(37, 103, 170))";
            }

            let weatherInfo = `
                  <div class="data">
                    <div class="today">
                      <p><span class="impact">Today</span><img src="images/${iconImage}"><br><br>${
              data.daily.data[0].summary
            }</p><br>
                      <P>Temperature<br><span class="color">L ${convertToCel(
                        data.daily.data[0].temperatureLow
                      )} <span class="unit">C </span><br>H ${convertToCel(
              data.daily.data[0].temperatureHigh
            )} <span class="unit">C</span></span></p>
                      <P>Chance of rain <span class="color">${Math.floor(
                        precipProbability * 100
                      )} <span class="unit">%</span></span></P>
                      <P>Humidity <span class="color">${Math.floor(
                        humidity * 100
                      )} <span class="unit">%</span></span></P>
                      <P>Wind <span class="color">${windSpeed} <span class="unit">km/h</span></span></P>
                      <P>Visibility <span class="color">${visibility} <span class="unit">km</span></span></P>
                      <P>UV Index <span class="color">${uvIndex}</span></P>
                    </div>
                    <div class="tomorrow">
                      <p><span class="impact">Tomorrow</span><img src="images/${
                        data.daily.data[1].icon
                      }.png"><br><br>${data.daily.data[1].summary}</p><br>
                      <P>Temperature<br><span class="color"><span class="color">L</span> ${convertToCel(
                        temperatureLow
                      )} <span class="unit">C</span><br>H ${convertToCel(
              temperatureHigh
            )} <span class="unit">C</span></span></p>
                      <P>Chance of rain <span class="color">${Math.floor(
                        data.daily.data[1].precipProbability * 100
                      )} <span class="unit">%</span></span></P>
                      <P>Humidity <span class="color">${Math.floor(
                        data.daily.data[1].humidity * 100
                      )} <span class="unit">%</span></span></P>
                      <P>Wind <span class="color">${
                        data.daily.data[1].windSpeed
                      } <span class="unit">km/h</span></span></P>
                      <P>Visibility <span class="color">${
                        data.daily.data[1].visibility
                      } <span class="unit">km</span></span></P>
                      <P>UV Index <span class="color">${
                        data.daily.data[1].uvIndex
                      }</span></P>
                    </div>
                  </div>
                  <footer>
                    <h6>Powered by Dark Sky</h6>
                  </footer>`;

            document.querySelector(".results-window").innerHTML = output;
            document.querySelector(
              ".information-content"
            ).innerHTML = weatherInfo;

            searchBtn.innerHTML = "D E T A I L S";
            searchBtn.classList.add("blink");
          });
      })
      .catch(function(error) {
        console.log(error);

        modalContent.innerHTML = "There is no information in the database.";
        modal.style.display = "block";
      });
  }
}

function getFocus() {
  if (searchBtn.innerHTML === "D E T A I L S") {
    searchBtn.innerHTML = "G O";
    searchBtn.classList.remove("blink");
  }
}

function convertToCel(fahren) {
  let cel = Math.floor(((fahren - 32) * 5) / 9);

  return cel;
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

informationContent.addEventListener("click", () => {
  if (information.style.transform === "translateY(-200%)") {
    information.style.transform = "translateY(0)";
  } else {
    information.style.transform = "translateY(-200%)";
  }
});

window.addEventListener("click", e => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
});

searchBtn.addEventListener("click", () => {
  if (searchBtn.innerHTML === "D E T A I L S") {
    information.style.transform = "translateY(0)";
  }
});
