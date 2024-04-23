// Function to fetch the data from the JSON file and return the promise
function fetchData() {
  // Return the promise so 'then' can be called on it
  return fetch('travel_recommendation_api.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); // This also returns a promise
      });
}

// Function to search in the fetched data
function searchDestination(data, searchTerm) {
  const searchResults = {
      countries: [],
      temples: [],
      beaches: []
  };

  searchTerm = searchTerm.toLowerCase();

  // Search in countries and cities
  data.countries.forEach(country => {
      if (country.name.toLowerCase() === searchTerm) {
          searchResults.countries.push(country);
      }
      country.cities.forEach(city => {
          if (city.name.toLowerCase().includes(searchTerm)) {
              searchResults.countries.push(city);
          }
      });
  });

  // Search in temples
  data.temples.forEach(temple => {
      if (temple.name.toLowerCase().includes(searchTerm)) {
          searchResults.temples.push(temple);
      }
  });

  // Search in beaches
  data.beaches.forEach(beach => {
      if (beach.name.toLowerCase().includes(searchTerm)) {
          searchResults.beaches.push(beach);
      }
  });

  displayResults(searchResults);
}

// Function to display the search results
function displayResults(results) {
  // Clear previous results
  const container = document.getElementById('recommendations-container');
  container.innerHTML = '';

  // Make the container visible or not based on the search results
  if (results.countries.length > 0 || results.temples.length > 0 || results.beaches.length > 0) {
      container.classList.add('visible');
  } else {
      container.classList.remove('visible');
  }

  // Create and append new results
  ['countries', 'temples', 'beaches'].forEach(category => {
      results[category].forEach(item => {
          const element = document.createElement('div');
          element.classList.add('result-item');
          
          element.innerHTML = `
              <h3>${item.name}</h3>
              <img src="img/${item.imageUrl}" alt="${item.name}">
              <p>${item.description}</p>
          `;
          container.appendChild(element);
      });
  });
}

// Event listener for the search button
document.getElementById('search-btn').addEventListener('click', function() {
  const searchTerm = document.querySelector('input[type="text"]').value;
  if (searchTerm) {
      fetchData()
      .then(data => searchDestination(data, searchTerm))
      .catch(error => {
          console.error('Failed to fetch or search the data:', error);
      });
  }
});

// Event listener for the clear button
document.getElementById('clear-btn').addEventListener('click', function() {
  document.querySelector('input[type="text"]').value = ''; // Clear the text field
  const container = document.getElementById('recommendations-container');
  container.innerHTML = ''; // Clear the results
  container.classList.remove('visible'); // Hide the container
});
