// Set the access token for the Mapbox API
mapboxgl.accessToken = mapToken;

// Define the coordinates of the restaurant


// Create a new Mapbox map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: restaurant.geometry.coordinates,
    zoom: 16.5,
    pitch: 70,
    bearing: -17.6,
    antialias: true
});

map.addControl(new mapboxgl.NavigationControl());

// Add a marker for the restaurant location
const marker = new mapboxgl.Marker()
    .setLngLat(restaurant.geometry.coordinates)
    .addTo(map);

// Add a popup to the marker with information about the restaurant
const popup = new mapboxgl.Popup()
    .setHTML(`<h3>${restaurant.name}</h3><p>${restaurant.location}</p>`)
    .setMaxWidth('300px');

marker.setPopup(popup);

// Add 3D buildings to the map
map.on('load', () => {

    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
    ).id;

    map.addLayer(
        {
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.8
            }
        },
        labelLayerId
    );
});