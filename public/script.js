
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
                    content: 
    '<h2>New Pizza Request</h2>\
    <div class="submitButton">\
        <form action="/submit_request.html" method="post">\
            How many slices would you like?<br>\
            <input id="slices" type="text"><br>\
            How should other people get in touch with you?<br>\
            <input id="contact" type="text" placeholder="Email, phone, etc."><br>\
            What kind of pizza do you want?<br>\
            <input id="pizza_type" type="text"><br>\
            Where are you ordering from?<br>\
            <input id="pizza_shop" type="text"><br>\
            <input type="submit" value="Submit"></button>\
        </form>\
    </div>'

                });
                infowindow.open(map, user);
        });
        user.setMap(map);

        /* Search within one mile */
        var restaurant_req = {
            location: map_lat_lng,
            radius: 1600,
            query: 'pizza delivery'

        };

        /* Retrieves all nearby pizza shops */
        var nearby = new google.maps.places.PlacesService(map);
        var infowindow;
        var results_cache;
        nearby.textSearch(restaurant_req, function(results, status) {
            
            /* Place on the map */
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    var pizza_loc = results[i].geometry.location;

                    /* Only place locations within one mile */
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(pizza_loc, map_lat_lng);
                    if (distance < 1600) {

                        /* Create the new marker */
                        var pizza_mrk = new google.maps.Marker({
                            position: results[i].geometry.location,
                            title: results[i].name
                        });

                        /* Place it on the map */
                        pizza_mrk.setMap(map);

                        /* Add a listener to open the infowindow */
                        pizza_mrk.addListener("click", function() {
                            
                            infowindow = new google.maps.InfoWindow({
                                content: "<p>" + this.title + "</p>",
                            });

                            infowindow.open(map, this);
                        });


                    }

                }
            }
        });

    });


}
