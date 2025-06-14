export const fetchCountry = (name) => {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,languages,flags`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok');
    });
};