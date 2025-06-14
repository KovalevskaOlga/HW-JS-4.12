import { fetchCountry } from "./apiService/apiService.js";
import makeCountryMarkUP from "../template/country.hbs";
import { alert, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

const container = document.getElementById("getAll");
const refs = {
  getInp: container.querySelector(".inp"),
  getResult: container.querySelector(".results"),
};

const getCountry = async () => {
  const name = refs.getInp.value.trim();
  if (!name) {
    refs.getResult.innerHTML = "";
    return;
  }

  try {
    const data = await fetchCountry(name);

    if (data.length > 10) {
      refs.getResult.innerHTML = "";
      alert({
        text: "Too many matches found. Please enter a more specific query!",
        delay: 2000,
      });
      return;
    }

    if (data.length > 1) {
      refs.getResult.innerHTML = `<ul>${data
        .map((el) => `<li>• ${el.name.common}</li>`)
        .join("")}</ul>`;
      return;
    }

    if (data.length === 1) {
      const country = {
        name: data[0].name.common,
        capital: data[0].capital?.[0] || "—",
        population: data[0].population,
        languages: Object.values(data[0].languages || {}),
        flag: data[0].flags.svg,
      };
      refs.getResult.innerHTML = makeCountryMarkUP(country);
    }
  } catch {
    refs.getResult.innerHTML = "";
    error({
      text: "Country not found",
      delay: 2000,
    });
  }
};

// Debounce function
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

refs.getInp.addEventListener("input", debounce(getCountry, 400));
