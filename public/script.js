
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
        <form action="/startOrder" method="post">\
            How many slices would you like?<br>\
            <input id="slices" type="text" name="num_slices"><br>\
            How should other people get in touch with you?<br>\
            <input id="contact" type="text" placeholder="Email, phone, etc." name="contact_info"><br>\
            What kind of pizza do you want?<br>\
            <input id="pizza_type" type="text" name="type_of"><br>\
            What pizza shop are you ordering from?<br>\
            <input id="pizza_shop" type="text" name="shop"><br>\
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
    getCurrentRequests();
}

function getCurrentRequests()
{
    request = new XMLHttpRequest();
    request.open("POST", "https://lets-share-pizza.herokuapp.com/requestSlice", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {//Call a function when the state changes.
    if(request.readyState == 4 && request.status == 200) {
        parseData();
    }
    }
    request.send();
}
function parseData()
{
    orders = JSON.parse(request.responseText);
    addRequests();
}

function addRequests()
{
    var image = {
        url: "pizzaprototype.png",
        scaledSize: new google.maps.Size(50, 50)
    };
    //var image = "cat_icon.png";
    for (var order in orders){
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(order.coordinates[0], order.coordinates[1]),
            map:map,
            icon: image,
        });

    google.maps.event.addListener(marker, 'click', function (){
        distance_from = google.maps.geometry.spherical.computeDistanceBetween(me, this.position)/1609.344;
        contentString = '<p class="login">'+this.toppings+'<p/><p>is <span class="distance"> ' + distance_from.toString() + '</span> miles away<p/>\
        <button id="myBtn">Add to request</button><div id="myModal" class="modal">\
          <div class="modal-content">\
            <span class="close">&times;</span>\
            <p>Some text in the Modal..</p>\
          </div>\
        </div>';
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
        infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        infowindow.open(map, this);
    });
    }
}
