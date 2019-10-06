const loader = document.querySelector(".loader");
const locationForm = document.querySelector(".location-form");
const searchSection = document.querySelector(".search-section h1");
const searchBtn = document.querySelector(".search-btn");
const resultsSection = document.querySelector(".results-section");
const information = document.querySelector(".information");
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
              uvIndex
            } = data.currently;

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

            document.querySelector(".results-window").innerHTML = output;

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

closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});

window.addEventListener("click", function(e) {
  if (e.target == modal || e.target == information) {
    modal.style.display = "none";
    information.style.display = "none";
  }
});

searchBtn.addEventListener("click", () => {
  if (searchBtn.innerHTML === "I N F O") {
    information.style.display = "block";
    information.classList.add("display");
  }
});
