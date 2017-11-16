
function loadMap() {

    /* Fetch the user location */
    navigator.geolocation.getCurrentPosition(function (position) { 
        var curr_lat = position.coords.latitude;
        var curr_lng = position.coords.longitude;
        var map_lat_lng = new google.maps.LatLng(curr_lat, curr_lng);
        /* Instantiate and initialize the map at the current location */
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: {lat: curr_lat, lng: curr_lng},
            mapTypeId: 'terrain'
        });

        /* Place a marker to ID the user onto the map */
        var user = new google.maps.Marker({
                position: map_lat_lng,
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

        var restaurant_req = {
            location: map_lat_lng,
            radius: 1600,
            query: 'pizza'

        };

        /* Retrieves all nearby pizza shops */
        var nearby = new google.maps.places.PlacesService(map);
        nearby.textSearch(restaurant_req, function(results, status) {
            /* Place on the map? */
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                   
                    console.log(results[i]);

                }
            }
        });

    } );


}