//var pizzashop_name = "pizzaShop";
var curr_lat;
var curr_lng;
var map_lat_lng;
var map;

function loadMap() {
    console.log("hello");
    /* Fetch the user location */
    navigator.geolocation.getCurrentPosition(function (position) { //NOT CLOSED HERE
        curr_lat = position.coords.latitude;
        curr_lng = position.coords.longitude;
        map_lat_lng = new google.maps.LatLng(curr_lat, curr_lng);

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
                        "<h2>Your Location</h2>"
                });
                infowindow.open(map, user);
        });
        user.setMap(map);
        getRestaurants();
        getCurrentRequests();
    });
}

function getRestaurants() {
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

        nearby.textSearch(restaurant_req, function(results, status) { //NOT CLOSED
        
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
                            pizza_shop: results[i].name
                        });

                        /* Place it on the map */
                        pizza_mrk.setMap(map);

                        /* Add a listener to open the infowindow */
                        pizza_mrk.addListener("click", function() {
                            
                            infowindow = new google.maps.InfoWindow({
                                content: this.pizza_shop +
                                    '<div class="req_body">\
                                        <button id ="modal-btn" type="button" data-toggle="modal" data-target="#initReqButton">Create Pizza Request</button>\
                                        <div class="modal fade right" id="initReqButton" role="dialog">\
                                        <div class="modal-content">\
                                            <span class="close">&times;</span>\
                                            <div class="modal-header">\
                                                <h4 class="modal-title">Pizza Request Form</h4>\
                                            </div>\
                                            <div class="modal-body">\
                                                <form id = "neworder_form">\
                                                    Name: <input type = "text" name = "input" value = ""/></br></br>\
                                                    Number of Slices: <input type = "text" name = "input" value = ""/></br></br>\
                                                    Toppings: <input type = "text" name = "input" value = ""/></br></br>\
                                                    Phone Number: <input type = "text" name = "input" value = ""/></br></br>\
                                                    Pizza Shop Name: <input type = "text" name = "input" value = ""/></br></br>\
                                                </form>\
                                                <a onclick="startOrder()" href="firstorder_success.html" class="button" role="button">Submit\
                                            </div>\
                                        </div>\
                                        </div>\
                                    </div>'
                            });
                            infowindow.open(map, this);
                        });
                        /*
                        <button type = "button" onclick="startOrder()" class= "btn btn-default" role="button">Submit\
                                                    <a href = "firstorder_success.html">\
                        </button>\
                        var modal = document.getElementById('req_body');
                        var span = document.getElementById("close");
                        var btn = document.getElementById("modal-btn");
                            
                        btn.onclick = function() {
                            modal.style.display = "block";
                        }
                        span.onclick = function() {
                            modal.style.display = "none";
                        } */ 
                    }
                }
            } 
        });
}

function initModal()
{
        var modal = document.getElementById('req_body');
        var span = document.getElementById("close");
        var btn = document.getElementById("modal-btn");
            
        btn.onclick = function() {
            modal.style.display = "block";
        }
        span.onclick = function() {
            modal.style.display = "none";
        } 

}

function startOrder()
{
    var form = document.getElementById("neworder_form");
    var numSlices = form.elements[1].value;
    var toppings = form.elements[2].value;
    var contact = { 'name': form.elements[0].value, 'phoneNumber': form.elements[3].value };
    var pizzaShopName = form.elements[4].value; //self.pizzashop_name //this.title;
    url = "https://lets-share-pizza.herokuapp.com/startOrder";
    $.post(url, {'numSlices': numSlices, 'pizzaShopName': pizzaShopName, 'toppings': toppings, 'contactInfo': [ contact ], 'coordinates': [curr_lat, curr_lng] });

    for (var i=0; i<5;i++)
        form.elements[i].value = '';
}


function getCurrentRequests()
{
    console.log("getting current requests");
    request = new XMLHttpRequest();
    request.open("GET", "https://lets-share-pizza.herokuapp.com/allOrders.json", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {//Call a function when the state changes.
        console.log(request.readyState + "and" + request.status);
        if(request.readyState == 4 && request.status == 200) {
            parseData();
        }
        request.send();
    }
}

function parseData()
{
    console.log("parsing data");
    orders = JSON.parse(request.responseText);
    addRequests();
}

function addRequests()
{
    var image = {
        url: "pizzaprototype.png",
        scaledSize: new google.maps.Size(50, 50)
    };
    console.log("in addRequests");

    for (var location in orders) {
        console.log(location);
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.coordinates[0], location.coordinates[1]),
            map:map,
            icon: image,
        });

        google.maps.event.addListener(marker, 'click', function (){
            distance_from = google.maps.geometry.spherical.computeDistanceBetween(me, this.position)/1609.344;
            contentString: 
                '<p class="login">'+ this.toppings +'<p/><p>is <span class="distance"> ' + distance_from.toString() + '</span> miles away<p/>\
                <button id="myBtn">Add to request</button><div id="myModal" class="modal">\
                  <div class="modal-content">\
                    <span class="close">&times;</span>\
                    <p>Some text in the Modal..</p>\
                  </div>\
                </div>'
            });

            var modal = document.getElementById('myModal');

            // Get the button that opens the modal
            var btn = document.getElementById("myBtn");

            // Get the <span> element that closes the modal
            var span = document.getElementById("close")[0]; 

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
        }
}

