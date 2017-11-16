
function loadMap() {
    /* Fetch the user location */
    navigator.geolocation.getCurrentPosition(function (position) { 
        var curr_lat = position.coords.latitude;
        var curr_lng = position.coords.longitude;

        /* Instantiate and initialize the map at the current location */
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: {lat: curr_lat, lng: curr_lng},
            mapTypeId: 'terrain'
        });

        /* Place a marker to ID the user onto the map */
        var user = new google.maps.Marker({
                position: new google.maps.LatLng(curr_lat, curr_lng),
                zIndex: 100
            });

        /* Add a listener to open a dialogue linking to Pizza Form */
        user.addListener("click", function() {
                infowindow = new google.maps.InfoWindow({
                    content: "<p><a href='/new-pizza-form.html'>Place an order?</p>"

                });
                infowindow.open(map, user);
        });
        user.setMap(map);


    } );
}