
// Create our map, giving it the streetmap and earthquakes layers to display on load
let myMap = L.map("map", {
    center: [
      39.8282, -98.5795
    ],
    zoom: 4,
    layers: [earthquakes]
})

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL
d3.json(queryURL).then(function(data){
    // Once e get a response, send the data.features and data.features object to the createFeatures function.
    createFeatures(data.features);
  });
    

function createFeatures(earthquakeData){

    // Give each feature a popup describing the place and time of the earthquakes
    function onEachFeature(feature, layer){
        layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Number of "Felt" Reports: ${feature.properties.felt}`);
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    function createCircleMarker(feature, latlng){
       let options = {
        radius:feature.properties.mag*5,
        fillColor: chooseColor(feature.properties.mag),
        color: chooseColor(feature.properties.mag),
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.35
       } 
       return L.circleMarker(latlng,options);
    }
    // Create a variable for earthquakes to house latlng, each feature for popup, and cicrle radius/color/weight/opacity
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
    });

    // Send earthquakes layer to the createMap function - will start creating the map and add features
    createMap(earthquakes);
}

// Circles color palette based on mag (feature) data marker: data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
function chooseColor(mag){
    switch(true){
        case(1.0 <= mag && mag <= 2.5):
            return "#0071BC"; // Strong blue
        case (2.5 <= mag && mag <=4.0):
            return "#35BC00";
        case (4.0 <= mag && mag <=5.5):
            return "#BCBC00";
        case (5.5 <= mag && mag <= 8.0):
            return "#BC3500";
        case (8.0 <= mag && mag <=20.0):
            return "#BC0000";
        default:
            return "#E2FFAE";
    }
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
          labels.push('<ul style="background-color:' + chooseColor(grades[i] + 1) + '"> <span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</span></ul>');
        }

      // add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
  };


// Create map
function createMap(earthquakes) {
   //Define outdoors and graymap layers
//    let streetstylemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 20,
//     id: "outdoors-v11",
//     accessToken: API_KEY
//   })

//   let graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 20,
//     id: "light-v10",
//     accessToken: API_KEY
//   });

//   // Define a baseMaps object to hold our base layers
//   let baseMaps = {
//     "Outdoors": streetstylemap,
//     "Grayscale": graymap
//   };

//   // Create overlay object to hold our overlay layer
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
//   let myMap = L.map("map", {
//     center: [
//       39.8282, -98.5795
//     ],
//     zoom: 4,
//     layers: [streetstylemap, earthquakes]
// });
// Add the layer control to the map
  L.control.layers(overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);

}








/////////////////////////////////////////






// // Create a map object.
// var myMap = L.map("map", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [earthquakeLayer]
// });

// // Add a tile layer.
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);

// // Define Url
// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // Create control layer
// L.control.layers(overlayMaps, {
//     collapsed: false
// }).addTo(myMap);



// // Create circle for each earthquake in dataset
// let earthquakes = []
// data.features.forEach(x => {
//     let lat = x.geometry.coordinates[1];
//     let lng = x.geometry.coordinates[0];

//     earthquakes.push(
//         L.circle([lat,lng], {
//             stroke: false,
//             fillOpacity: 0.8,
//             fillColor: circleColor(x.geometry.coordinates[2]),
//             radius: circleSize(x.properties.mag)
//         }).bindPopup(
//             `<h3>${x.properties.place}</h3><hr><p>${new Date(x.properties.time)}</p>`, {
//                 maxWidth : 560
//             })
//     )
// });

// // Function to determin circle size

// function circleSize(mag) {
//     return mag * 30000;
// }

// function circleColor(depth) {
//     let color="#FFEDA0";
//     switch(true) {
//         case (depth < 10):
//             color="#FFEDA0";
//             break;
        
//         case (depth < 30):
//             color="#FEB24C";
//             break;

//         case (depth < 50):
//             color="#FD8D3C";
//             break;

//         case (depth < 700):
//             color="#E31A1C";
//             break;
//     }
// }

// d3.json(queryUrl, function(data) {
//     let overlayMaps = {
//         earthquakes: earthquakeLayer
//     }
// });

// L.geoJSON(earthquakes, {
//     earthquakes: earthquakeLayer
//        }).addTo(myMap); 






////////////////////////////////////////////////////////////1st attempt





// // Perform a GET request to the query URL/
// d3.json(queryUrl).then(function (data) {
//     // Once we get a response, send the data.features object to the createFeatures function.
//     createFeatures(data.features);
//   });
  
//   function createFeatures(earthquakeData) {
  
//     // Define a function that we want to run once for each feature in the features array.
//     // Give each feature a popup that describes the place and time of the earthquake.
//     function onEachFeature(feature, layer) {
//         // layer.circle( {
//         //     fillOpacity: 0.75,
//         //     color: "purple",
//         //     fillColor: "purple",
//         //     radius: 400
//         //   })
//       layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);

//     //   let earthquakeData = {
//     //     "type": "Feature",
//     //     "properties": {
//     //         "name": "Coors Field",
//     //         "amenity": "Baseball Stadium",
            
//     //     },
//     //     "geometry": {
//     //         "type": "Point",
//     //         //"coordinates": [-104.99404, 39.75621]
//     //     }
//     // };
//     }

// // Create a GeoJSON layer that contains the features array on the earthquakeData object.
//   // Run the onEachFeature function once for each piece of data in the array.
//   //var earthquakes = 
//   L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
//   }).addTo(myMap);
  
// }

