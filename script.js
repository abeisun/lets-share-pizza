window.onload = loadMap();

function loadMap() {
    console.log("Got here");
    /* Fetch the user location */
    navigator.geolocation.getCurrentPosition(function (position) { 

        /* Instantiate and initialize the map at the current location */
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: {lat: position.coords.latitude, lng: position.coords.longitude},
            mapTypeId: 'terrain'
        });
    } );
}