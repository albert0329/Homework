const API_KEY = "pk.eyJ1IjoiYWxiZXJ0MDMyOSIsImEiOiJjanN3bGowaGQwaXp5NDlwcjd1YmV1MjFjIn0.BRA8mDQ9HUVycliE-cQ4hg";

var earthquakeURL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
var plateURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json';

d3.json(plateURL).then(plates => { 
    d3.json(earthquakeURL).then(data => createMap(data, plates));
});

//function createFeatures(featureData) {
//
//
//    function onEachFeature(feature, layer) {
//    layer.bindPopup("<h3>" + feature.properties.place +
//      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//    }
//
//    var earthquakes = L.geoJSON(earthquakeData, {
//    onEachFeature: onEachFeature
//    });
//
//    createMap(earthquakes);
//
//};

function createMap(data, plates) {

    var street = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: API_KEY
    });

    var dark = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: 'API_KEY'
    });

    function magColor(mag) {
        if (mag > 6) return 'darkred';
        else if (mag > 4.5) return 'red';
        else if (mag > 2.5) return 'orange';
        else if (mag > 1) return 'yellow';
    }

    function makeCircles(feature, latlng) {
        var mag = feature.properties.mag;
        var color = magColor(mag);
        var style = {radius: mag * 30000, fillColor: color, opacity: 0, fillOpacity: 0.75};

        return L.circle(latlng, style).bindPopup(`${feature.properties.place} Magnitude: ${mag}`);
    }

    var earthquakes = L.geoJSON(data, {pointToLayer: makeCircles});
    var faultlines = L.geoJSON(plates, {'style': {'fillOpacity': 0}});

    var bglayers = {
    	'Street View': street,
    	'Dark View': dark
    };

    var overLayLayers = {
    	'Fault Lines': faultlines,
        'Earthquakes': earthquakes
    };

    var myMap = L.map('map', 
    	{'layers': [street, faultlines, earthquakes]}).setView([40, -30], 3);

    L.control.layers(bglayers, overLayLayers).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');
        
        div.innerHTML = `<p><i style="background:darkred"></i> 4+</p>
                         <p><i style="background:red"></i> 3-4</p>
                         <p><i style="background:orange"></i> 2-3</p>
                         <p><i style="background:yellow"></i> 1-2</p>
                         <p><i style="background:blue"></i> 0-1</p>`;
        return div;
    };

    legend.addTo(myMap);


}


