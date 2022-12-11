// Create a map object.
var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define Url
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        // layer.circle( {
        //     fillOpacity: 0.75,
        //     color: "purple",
        //     fillColor: "purple",
        //     radius: 400
        //   })
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

// Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  //var earthquakes = 
  L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  }).addTo(myMap);
  
}
