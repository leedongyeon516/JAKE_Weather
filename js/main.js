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

            let weatherNight = `
                  <div class="stars"></div>
                  <div class="twinkling"></div>`;
            let celsius = Math.floor(((temperature - 32) * 5) / 9);

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
              resultsSection.classList.add("cloudy");
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
              resultsSection.style.background = "#999 url('images/Drops_.png')";
              resultsSection.classList.add("rain");
            } else if (icon == "wind" || icon == "fog") {
              resultsSection.style.background =
                "linear-gradient(rgb(135, 231, 241), rgb(235, 157, 245))";
            } else if (icon == "snow" || icon == "sleet") {
              resultsSection.style.background =
                "linear-gradient(rgb(135, 231, 241), rgb(235, 157, 245))";
            } else {
              resultsSection.style.background =
                "linear-gradient(rgb(4, 4, 7), rgb(37, 103, 170))";
            }

            let weatherInfo = `
                  <div class="data">
                    <div class="today">
                      <p><span class="color">Today</span><br>${
                        data.daily.data[0].summary
                      }</p>
                      <P>Temperature <span class="color">${
                        data.daily.data[0].temperatureLow
                      } F - ${data.daily.data[0].temperatureHigh} F</span></p>
                      <P>Chance of rain <span class="color">${Math.floor(
                        precipProbability * 100
                      )} %</span></P>
                      <P>Humidity <span class="color">${humidity *
                        100} %</span></P>
                      <P>Wind <span class="color">${windSpeed} km/h</span></P>
                      <P>Visibility <span class="color">${visibility} km</span></P>
                      <P>UV <span class="color">${uvIndex}</span></P>
                    </div>
                    <div class="tomorrow">
                      <p><span class="color">Tomorrow</span><br>${
                        data.daily.data[1].summary
                      }</p>
                      <P>Temperature <span class="color">${temperatureLow} F - ${temperatureHigh} F</span></p>
                      <P>Chance of rain <span class="color">${Math.floor(
                        data.daily.data[1].precipProbability * 100
                      )} %</span></P>
                      <P>Humidity <span class="color">${data.daily.data[1]
                        .humidity * 100} %</span></P>
                      <P>Wind <span class="color">${
                        data.daily.data[1].windSpeed
                      } km/h</span></P>
                      <P>Visibility <span class="color">${
                        data.daily.data[1].visibility
                      } km</span></P>
                      <P>UV <span class="color">${
                        data.daily.data[1].uvIndex
                      }</span></P>
                    </div>
                  </div>`;

            document.querySelector(".results-window").innerHTML = output;
            document.querySelector(
              ".information-content"
            ).innerHTML = weatherInfo;

            searchBtn.innerHTML = "I N F O";
          });
      })
      .catch(function(error) {
        console.log(error);

        modalContent.innerHTML = "There is no information in the database.";
        modal.style.display = "block";
      });
  }
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

informationContent.addEventListener("click", () => {
  if (information.style.display === "none") {
    information.style.display = "block";
  } else {
    information.style.display = "none";
  }
});

window.addEventListener("click", e => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
});

searchBtn.addEventListener("click", () => {
  if (searchBtn.innerHTML === "I N F O") {
    information.style.display = "block";
    information.classList.add("display");
  }
});
