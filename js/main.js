const loader = document.querySelector(".loader");
const locationForm = document.querySelector(".location-form");
const searchBtn = document.querySelector(".search-btn");
const modal = document.querySelector(".modal-modified");
const closeBtn = document.querySelector(".close-btn");

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
            let weatherImage = `${icon}.png`;
            let celsius = Math.floor(((temperature - 32) * 5) / 9);

            let output = `
                  <div class="location">
                    <h1>${data.timezone.replace("/", ",").replace("_", "")}</h1>
                  </div>
                  <div class="result">
                    <canvas class="icon" width="80" height="80"></canvas>
                    <div class="temperature">
                      <h3>${celsius}<span class="space">C</span></h3><br>
                      <h3>${Math.floor(
                        temperature
                      )}<span class="space">F</span></h3>
                    </div>
                  </div>`;

            document.querySelector(".results-window").innerHTML = output;

            function setIcons(icon, iconID) {
              const skycons = new Skycons({ color: "white" });
              const currentIcon = icon.replace(/-/g, "_").toUpperCase();

              skycons.play();

              return skycons.set(iconID, Skycons[currentIcon]);
            }

            setIcons(icon, document.querySelector(".icon"));

            searchBtn.innerHTML = "D E T A I L";
          });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});

window.addEventListener("click", function(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
});
