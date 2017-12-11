var orderobjid = 0;

function loadMap() {
    /* Fetch the user location */
    navigator.geolocation.getCurrentPosition(function (position) { 
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
        user.addListener("mouseover", function() {
            infowindow = new google.maps.InfoWindow({
                content: 
                    "<h2>Your Location</h2>"
            });
            infowindow.open(map, user);
        });

        user.addListener('mouseout', function() {        
           infowindow.close();
        });

        user.setMap(map);
        getRestaurants();
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
                        pizza_shop: results[i].name
                    });

                    /* Place it on the map */
                    pizza_mrk.setMap(map);

                    /* Add a listener to open the infowindow */
                    pizza_mrk.addListener("mouseover", function() {
                        infowindow = new google.maps.InfoWindow({
                            content: "<h2>" + this.pizza_shop + "<h2>"
                        });
                        infowindow.open(map, this);
                    });

                    pizza_mrk.addListener('mouseout', function() {        
                       infowindow.close();
                    });

                    pizza_mrk.addListener("click", function() {
                        $("#no-pizza-shop-name").text(this.pizza_shop);
                        $("#newOrderModal").modal('show');
                    });
                }
            }
        } 
    });
    getCurrentRequests();
}

function startOrder()
{
    var form = document.getElementById("neworder_form");
    var numSlices = form.elements[1].value;
    var toppings = form.elements[2].value;
    var contact = { 'name': form.elements[0].value, 'phoneNumber': form.elements[3].value };
    var pizzaShopName = $("#no-pizza-shop-name").text();
    var url = "https://lets-share-pizza.herokuapp.com/startOrder";
    $.post(url, {'numSlices': numSlices, 'pizzaShopName': pizzaShopName, 'toppings': toppings, 'contactInfo': [ contact ], 'coordinates': [curr_lat, curr_lng] }, function () {  
        window.location.replace("firstorder_success.html");
    });
}

function getCurrentRequests()
{
    console.log("getting current requests");
    request = new XMLHttpRequest();
    request.open("GET", "https://lets-share-pizza.herokuapp.com/allOrders.json", true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send();
  //  console.log(request.readyState + "and" + request.status);
    request.onreadystatechange = function() {//Call a function when the state changes.
        if(request.readyState == 4 && request.status == 200) {
            console.log(request.readyState + "and" + request.status);
            parseData();
       }
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
    for (var i in orders) {
        var order = orders[i];
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(order.coordinates[0], order.coordinates[1]),
            map:map,
            icon: image,
        });

        var contentString = "<h2>Add to this order<h2>" +
            "<p>Number of slices: " + order.numSlices +"</p>" +
            "<p>Pizza Shop: " + order.pizzaShopName + "</p>" +
            "<p>Toppings: " + order.toppings + "</p>";

        marker.addListener("mouseover", function() {
            infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            infowindow.open(map, this);
        });

        marker.addListener('mouseout', function() {        
           infowindow.close();
        });

        marker.addListener("click", function() {
            orderobjid = order._id;
            $("#ao-pizza-shop-name").text(this.pizza_shop);
            $("#ao-slices-so-far").text(order.numSlices);
            $("#ao-toppings").text(order.toppings);
            $("#addToOrder").modal('show');
        });
    }
}

function addToOrder() 
{
    var form = document.getElementById("addtoorder_form");
    var numSlices = form.element[1].value;
    var contact = { 'name': form.element[0].value, 'phoneNumber': form.elements[2].value };
    var url = "https://lets-share-pizza.herokuapp.com/addToOrder";
    $.post(url, { 'objID': orderobjid, 'numSlices': numSlices, 'contact': contact }, function () {  
        window.location.replace("add_success.html");
    });
}
