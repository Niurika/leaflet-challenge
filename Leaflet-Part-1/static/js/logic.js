
// Store our API endpoint as queryUrl.
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place, magnitude and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h1>${feature.properties.place}</h1>
                        <hr>
                        <h3>Magnitude: ${feature.properties.mag}</h3>
                        <hr>
                        <p>Depth: ${feature.geometry.coordinates[2]} km</p>
                        <p>${new Date(feature.properties.time)}</p>`);
    }

    function createCircles(feature, layer) {
      return L.circleMarker(layer);
    }

    function circleSize (magnitude) {
      return (magnitude * 4)
    }

    function circleColor (depth) {
      if (depth >= 50.0) return "#E31A1C";
      else if (depth > 25.0 && depth <= 49.9) return "#FD8D3C";
      else if (depth > 15.0 && depth <= 24.9) return "#FEB24C";
      else if (depth > 5.0 && depth <= 14.9) return "#FFEDA0";
      else return "#FFEDA0"
    }
    
    function generateEarthquakeStyle (feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        color: circleColor (feature.geometry.coordinates[2]), 
        radius: circleSize (feature.properties.mag),
        stroke: true,
        weight: 0.5
        } 
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircles,
        style: generateEarthquakeStyle
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

    
// Create map legend to provide context for map data
let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [1.0, 2.5, 4.0, 5.5, 8.0];
    var labels = [];
    var legendInfo = "<h4>Magnitude</h4>";

    div.innerHTML = legendInfo

    // go through each magnitude item to label and color the legend
    // push to labels array as list item
    for (var i = 0; i < grades.length; i++) {
          labels.push('<ul style="background-color:' + circleColor(grades[i] + 1) + '"> <span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</span></ul>');
        }

      // add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
  };





    function createMap(earthquakes) {

        // Create the base layers.
        var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      
        var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });
      
        // Create a baseMaps object.
        var baseMaps = {
          "Street Map": street,
          "Topographic Map": topo
        };
      
        // Create an overlay object to hold our overlay.
        var overlayMaps = {
          "Earthquakes Marker": earthquakes
        };
      
        // Create map 
       var myMap = L.map("map", {
            center: [
                37.09, -95.71
            ],
            zoom: 4,
            layers: [street, earthquakes]
        });
      
        // Create a layer control.
        // Pass it our baseMaps and overlayMaps.
        // Add the layer control to the map.
        L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(myMap);
        legend.addTo(myMap);
      
    }
