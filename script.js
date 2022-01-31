//CHAVE PARA A API
//https://home.openweathermap.org/users/sign_up*/
const apiKey = "ca7d1174ab85f2853faa403ec721075e";

let listOfCities = document.querySelector(".result-ajax .cities");
let msg = document.querySelector(".msg");
const inputEnter = document.getElementById("cityID");
inputEnter.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    pesquisar();
  }
});

async function pesquisar() {
  let input = document.getElementById("cityID");
  let inputVal = input.value;

  if (inputVal === "") {
    msg.textContent = `You should type something, so I could search for you 😉`;
    return;
  }
  //check if there's already a city
  const listItems = listOfCities.querySelectorAll(".result-ajax .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter((el) => {
      let content = "";

      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `The Weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      }  has already been shown...But you might be more specific 😉`;
      return;
    }
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      listOfCities.appendChild(li);
      input.value = "";
    })
    .catch(() => {
      msg.textContent = "I couldn't find this city. Search for another one 😩";
    });

  msg.textContent = "";
}
