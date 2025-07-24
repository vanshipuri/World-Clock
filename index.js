let selectedCityTimeZone = null;
let recentSearches = [];
let dynamicCities = new Set(); 

//  City-to-Timezone Mapping
const cityTimeZoneMap = {
    india: 'Asia/Kolkata',
    japan: 'Asia/Tokyo',
    china: 'Asia/Shanghai',
    nepal: 'Asia/Kathmandu',
 switzerland: "Europe/Zurich",
  usa: "America/New_York",
  thailand: "Asia/Bangkok",
  delhi: "Asia/Kolkata",
  mumbai: "Asia/Kolkata",
  kolkata: "Asia/Kolkata",
  tokyo: "Asia/Tokyo",
  sydney: "Australia/Sydney",
  london: "Europe/London",
  paris: "Europe/Paris",
  berlin: "Europe/Berlin",
  dubai: "Asia/Dubai",
  newyork: "America/New_York",
  "new york": "America/New_York",
  losangeles: "America/Los_Angeles",
  "los angeles": "America/Los_Angeles",
  toronto: "America/Toronto",
  chicago: "America/Chicago",
  beijing: "Asia/Shanghai",
  shanghai: "Asia/Shanghai",
  singapore: "Asia/Singapore",
  moscow: "Europe/Moscow",
  cairo: "Africa/Cairo",
  rome: "Europe/Rome",
  seoul: "Asia/Seoul"
};

function updateTime() {
  updateClock("los-angeles", "America/Los_Angeles");
  updateClock("paris", "Europe/Paris");
  updateClock("new-york", "America/New_York");

  dynamicCities.forEach((tz) => {
    const id = tz.replace("/", "-").toLowerCase();
    updateClock(id, tz);
  });
}

function updateClock(elementId, timeZone) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const dateEl = el.querySelector(".date");
  const timeEl = el.querySelector(".time");
  const time = moment().tz(timeZone);

  const cityName = timeZone.split("/")[1].replace("_", " ");
  dateEl.innerHTML = time.format("MMMM Do YYYY");
  timeEl.innerHTML = `${time.format("h:mm:ss")} <small>${time.format("A")}</small>`;
}

function addCityClock(timeZone) {
  if (dynamicCities.has(timeZone)) return;

  dynamicCities.add(timeZone);

  const id = timeZone.replace("/", "-").toLowerCase();
  const cityName = timeZone.split("/")[1].replace("_", " ");
  const citiesContainer = document.querySelector("#cities");

  const cityBlock = document.createElement("div");
  cityBlock.className = "city";
  cityBlock.id = id;
  cityBlock.innerHTML = `
    <div>
      <h2>${cityName}</h2>
      <div class="date"></div>
    </div>
    <div class="time"></div>
  `;
  citiesContainer.appendChild(cityBlock);
}

function updateSelectedCityTime() {
  if (!selectedCityTimeZone) return;
  addCityClock(selectedCityTimeZone);
}

function addRecentSearch(timeZone) {
  recentSearches = recentSearches.filter((tz) => tz !== timeZone);
  recentSearches.unshift(timeZone);
  if (recentSearches.length > 5) {
    recentSearches.pop();
  }
  renderRecentSearches();
}

function renderRecentSearches() {
  const recentContainer = document.querySelector("#recent-searches");
  recentContainer.innerHTML = "";

  recentSearches.forEach((tz) => {
    const li = document.createElement("li");
    li.textContent = tz;
    li.addEventListener("click", () => {
      selectedCityTimeZone = tz;
      updateSelectedCityTime();
    });
    recentContainer.appendChild(li);
  });
}

function updateCity(event) {
  selectedCityTimeZone = event.target.value;
  if (selectedCityTimeZone === "current") {
    selectedCityTimeZone = moment.tz.guess();
  }
  updateSelectedCityTime();
  addRecentSearch(selectedCityTimeZone);
}


const searchButton = document.querySelector("#search-button");
const searchInput = document.querySelector("#search-city");

searchButton.addEventListener("click", () => {
  const input = searchInput.value.trim().toLowerCase();
  if (!input) return;

  const mappedTimeZone = cityTimeZoneMap[input];
  if (!mappedTimeZone || !moment.tz.zone(mappedTimeZone)) {
    alert("City not recognized. Try typing a valid city like 'Tokyo', 'Dubai', or 'London'.");
    return;
  }

  selectedCityTimeZone = mappedTimeZone;
  updateSelectedCityTime();
  addRecentSearch(mappedTimeZone);
});


updateTime();
setInterval(updateTime, 1000);

let citiesSelectElement = document.querySelector("#city");
citiesSelectElement.addEventListener("change", updateCity);

