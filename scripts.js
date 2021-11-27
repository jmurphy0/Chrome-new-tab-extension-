//using geolocations

// declairing global vars
let G, options, psans, today, bgstatus, surfData, lat, lng;
let stormglassKey = config.stormglassKey;
let openWeatherKey = config.openWeatherKey;

window.addEventListener("load", main);

function main() {
  if (navigator.geolocation) {
    // 30 second timeout
    let giveUp = 1000 * 30;
    // 30 min tooOld
    let tooOld = 1000 * 30 * 30;
    options = {
      enableHighAccuracy: true,
      timeout: giveUp,
      maximumAge: tooOld,
    };
    navigator.geolocation.getCurrentPosition(getPos, posFail, options);
  } else {
    // browser too old
    getDateTime();
  }
  getDateTime();
}
// if 200 respose from navigator getPos runs
function getPos(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;
  doSearch(lat, lng);
  // show surf button after position is found
  document.getElementById("showSurf").classList.remove("d-none");
}

// handle location error
function posFail(err) {
  let errors = {
    1: "not permitted",
    2: "Unable to complete",
    3: "Timeout: took too long",
  };
  document.querySelector("h1").textContent = errors[err];
}
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("showSurf")
    .addEventListener("click", getSurf, (disable = true));
});

let clicked = 0;
async function getSurf() {
  // hiding/showing divs/buttons
  document.getElementById("surfDiv").classList.remove("d-none");
  document.getElementById("surfDiv").classList.add("col-lg-6");
  document.getElementById("weatherDiv").classList.add("col-lg-6");
  document.getElementById("surf").classList.remove("d-none");

  let thisDiv = document.getElementById("first");
  let thisWidth = thisDiv.width;
  let thisHeight = thisDiv.height;
  document.getElementById("showSurf").classList.add("d-none");
  //parameters for API call
  const params = "waveHeight,wavePeriod";
  while (clicked < 1) {
    // surfLat & surfLng can be changed to the beach user wants, otherwise this will get closest point to current location.
    let surfLat = lat;
    let surfLng = lng;
    // styling to get similarly sized divs
    let surfDiv = document.querySelector("surf");
    surfDiv.attributes.style += `height: ${thisHeight}; width:${thisWidth};`;
    surfDiv.offsetHeight = thisHeight;
    surfDiv.classList.remove("d-none");
    // make stormglass API call based on current location or surfLat/surfLng if changed by user.
    surfData = await fetch(
      `https://api.stormglass.io/v2/weather/point?lat=${surfLat}&lng=${surfLng}&params=${params}&source=noaa`,
      {
        headers: {
          Authorization: stormglassKey,
        },
      }
    ).then((response) => response.json());
    console.log(surfData);
    wavedata = [
      // time is in UTC, convert to daylight savings eastern is utc-4
      // thus,  6AM is 2, 12pn is 8 and 6pm is 14
      surfData["hours"][2],
      surfData["hours"][8],
      surfData["hours"][14],
    ];
    localTimes = ["6:00 AM", "12:00 PM", "6:00 PM"];
    // display data from api call in table from NOAA data source
    for (x = 0; x < wavedata.length; x++) {
      let waveH = wavedata[x]["waveHeight"]["noaa"];
      let waveP = wavedata[x]["wavePeriod"]["noaa"];
      let time = localTimes[x];
      // create rows based on API response
      document.getElementById("surfTable").innerHTML += `
    <tr>
      <th scope="row">${time}</th>
      <td>${waveH} M</td>
      <td>${waveP} Sec.</td>
    </tr>
    `;
    }
    clicked++;
  }
}

// get local  time and date
function getDateTime() {
  // get todays date from moment.js
  let todayDate = moment().format("dddd, MMM Do YYYY");
  let t = moment().format("hh:mm A");
  let altTime = moment().format("HH:mm");
  var tnum = parseFloat(altTime);
  // call setBackground to change bg pic based on time
  setBackground(tnum);
  document.querySelector("time").innerHTML = `
  <h2>${t}<h2>`;
  document.querySelector("date").innerHTML = `
  <h3>${todayDate}<h3>`;
}

// set background based on time
// images and time from https://imgur.com/gallery/xTUEf
function setBackground(t) {
  console.log("here" + t);
  // 4-6
  if (t >= 4 && t < 6) {
    document.getElementById("container").style.backgroundImage =
      "url(/imgs/1.png)";
  }
  // 6-8
  else if (6 <= t && t < 8) {
    document.getElementById("container").style.backgroundImage =
      "url(/imgs/2.png)";
  }

  // 8-10
  else if (8 <= t && t < 10) {
    document.getElementById("container").style.backgroundImage =
      "url(/imgs/3.png)";
  }
  // 10-12
  else if (t >= 10 && t < 12) {
    document.getElementById("container").style.backgroundImage =
      "url(/imgs/4.png)";
  }
  // 12-14
  else if (t >= 12 && t < 14) {
    let img = "url(./imgs/5.png)";
    document.getElementById("container").style.backgroundImage = img;
  }
  // 14-16
  else if (t >= 14 && t < 16) {
    document.getElementById("container").style.backgroundImage =
      "url(./imgs/6.png)";
  }
  // 16-18
  else if (t >= 16 && t < 18) {
    document.getElementById("container").style.backgroundImage =
      "url(./imgs/7.png)";
  }
  // 18-20
  else if (t >= 18 && t < 20) {
    document.getElementById("container").style.backgroundImage =
      "url(./imgs/8.png)";
  }
  // 20-22
  else if (t >= 20 && t < 22) {
    document.getElementById("container").style.backgroundImage =
      "url(./imgs/9.png)";
  }
  // 22-24
  else if (t >= 22 && t < 24) {
    document.getElementById("container").style.backgroundImage =
      "url(./imgs/10.png)";
  } else {
    document.getElementById("container").style.backgroundImage =
      "url(./imgs/11.png)";
  }
}

// obtaining data from openweathermap API
async function doSearch(lat, lng) {
  var fiveDay =
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=` +
    openWeatherKey;
  weatherData = await fetch(fiveDay).then((r) => r.json());
  today = weatherData.current;
  showCurrent();
}
function showCurrent() {
  let weatherElement = document.getElementById("weatherElement");
  //weatherElement.classList.remove("d-none");
  currTemp = today["temp"];
  // update html on index page with current weather
  document.querySelector(
    "icon"
  ).innerHTML = `<img src='http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png' alt='no icon' />`;
  document.querySelector("temp").innerHTML = `${today["temp"]}`;
  document.querySelector("humidity").innerHTML = `${today["humidity"]}`;
  document.querySelector("wind").innerHTML = `${Math.round(
    today["wind_speed"] * 3.6
  )}`;
}

// adding event  listener  for search button
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("button-addon1").addEventListener("click", getSearch);
});
// adding event listner for "enter" key to search
document.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.key === "Enter") {
    document.getElementById("button-addon1").click();
  }
});
// obtains input and search google
function getSearch() {
  var search = document.querySelector("input").value;
  location.replace(`http://www.google.com/search?q=${search}`);
  console.log(search);
}
