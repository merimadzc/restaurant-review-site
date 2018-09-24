/*** Map Variables ***/
var ifNewRest = true;
var restaurantIndex = -1;
var restaurantInfoContainer = $('#restaurant-info');
var sortOptions = $('#sort-options');
sortOptions.hide();
restaurantInfoContainer.hide();
var sortBy = $('#sort');
var addRestaurantForm = $('#add-restaurant');
var reviewSubmit = $('#review-submit');
var reviewWindow = $('#review-window');
addRestaurantForm.hide();
reviewSubmit.hide();
var lowRate = '&#9734;'; // Empty Stars
var topRate = '&#9733;'; // Yellow Stars

/*** Map Arrays ***/
var ourReview = new Array;
var markers = new Array;
var pushRestaurantMarker = new Array;
var pushRestaurant = new Array;
// example restaurants 
var jsonRestaurants = new Array;
//restaurants from google maps API
var googleRestaurants = new Array;

/********** Load Map and Map Objects **********/

/*** Map ***/
function loadMap() {
    var currentPosition = {
        lat: 37.773972,
        lng: 122.431297,
    };
    var mapOptions = {
        center: currentPosition,
        zoom: 15,
        streetViewControl: false
    }

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var infoWindow = new google.maps.InfoWindow({
        content: document.getElementById('details')
    });
    var newWindow = new google.maps.InfoWindow({
        content: document.getElementById('add-new-restaurant')
    });


    /*** Geolocation for User current position ***/
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            currentPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            infoWindow.setPosition(currentPosition);
            map.setCenter(currentPosition);

            /*** Add special marker on user current position (arrow) ***/
            var marker = new google.maps.Marker({
                position: currentPosition,
                icon: {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    fillColor: 'violet',
                    fillOpacity: 0.9,
                    scale: 10,
                    strokeColor: 'purple',
                    strokeWeight: 1,
                    zIndex: 1
                },
            });
            marker.setMap(map);
            // drag the map and find new restaurants and other area in the map
            map.addListener('dragend', function() {
                findPlaces();
            });
            //drop marker on the map
            function dropMarker(i) {
                return function() {
                    markers[i].setMap(map);
                };
            }

            /********** List of Restaurants on the right side **********/

            /*** Load Places (Restaurants) from Google API ***/
            var places = new google.maps.places.PlacesService(map);
            var service = new google.maps.places.PlacesService(map);

            var request = {
                location: currentPosition,
                radius: 500,
                types: ['restaurant']
            }

            service.nearbySearch(request, callback);
            /*** Load OpenclassRooms Places ***/
            function callback(results, status) {
                var script = document.createElement('script');
                script.src = 'js/restaurants.js';
                document.getElementsByTagName('head')[0].appendChild(script);
                window.eqfeed_callback = function(results) {
                    results = results.results;
                    jsonRestaurants = [];
                    for (var i = 0; i < results.length; i++) {
                        jsonRestaurants.push(results[i]);
                    }

                };
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    findPlaces()
                }
            }

            function findPlaces() {
                var findPlaces = {
                    bounds: map.getBounds(),
                    types: ['restaurant']
                };
                places.nearbySearch(findPlaces, function(results, status) {

                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        clearResults();
                        clearMarkers();

                        googleRestaurants = [];
                        results.forEach(function(element) {
                            googleRestaurants.push(element);
                        })

                        /*** Create Marker for Restaurants ***/
                        var iconBase = 'img/placeholder.png';

                        for (var i = 0; i < results.length; i++) {
                            markers[i] = new google.maps.Marker({
                                position: results[i].geometry.location,
                                icon: iconBase,
                                placeId: results[i].id,
                                zIndex: 5,
                                id: googleRestaurants[i].id
                            });
                            /*** On Click show Restaurant Details ***/
                            google.maps.event.addListener(markers[i], 'click', displayInfoWindow);
                            google.maps.event.addListener(map, 'click', closeInfoWindow);
                            
                            if (threeStars) {
                                if (results[i].rating >= 3 && results[i].rating < 4) {
                                    displayResults(i, results, i);

                                }
                            } else if (fourStars) {
                                if (results[i].rating >= 4 && results[i].rating < 5) {
                                    displayResults(i, results, i);

                                }
                            } else if (fiveStars) {
                                if (results[i].rating === 5) {
                                    displayResults(i, results, i);


                                }
                            } else if (oneStar) {
                                if (results[i].rating === 1 && results[i].rating > 2) {
                                    displayResults(i, results, i);

                                }
                            } else if (twoStars) {
                                if (results[i].rating >= 2 && results[i].rating < 3) {
                                    displayResults(i, results, i);

                                }
                            } else {
                                displayResults(i, results, i);
                            }

                        }


                        for (var i = 0; i < jsonRestaurants.length; i++) {
                            markers[googleRestaurants.length + i] = new google.maps.Marker({
                                position: jsonRestaurants[i].geometry.location,
                                icon: iconBase,
                                placeId: jsonRestaurants[i].id,
                                zIndex: 5,
                                id: jsonRestaurants[i].id,
                            });
                            /*** On click show OpenClassrooms Restaurants ***/
                            google.maps.event.addListener(markers[googleRestaurants.length + i], 'click', showExampleRestaurant);
                            google.maps.event.addListener(map, "click", closeInfoWindow);
                            displayResults(googleRestaurants.length + i, jsonRestaurants, i);

                        }
                    }
                });
            }
            /*** Clear markers and results ***/
            function clearMarkers() {
                for (var i = 0; i < markers.length; i++) {
                    if (markers[i]) {
                        markers[i].setMap(null);
                    }
                }
                markers = [];
            }

            function clearResults() {
                var results = document.getElementById('results');
                while (results.childNodes[0]) {
                    results.removeChild(results.childNodes[0]);
                }
            }

            /*** Generate List of restaurants on the RIGHT SIDE ***/
            function addResultList(result, i) {
                var resultsDiv = document.getElementById('results');
                var listDiv = document.createElement('div');
                listDiv.setAttribute('class', 'right-list');
                listDiv.onclick = function() {
                    google.maps.event.trigger(markers[i], 'click');
                };
                var details = `<div class="placeIcon">
                                    <img src ="${createPhoto(result)}" alt="Restaurant Image" />
                                </div>
                                <div class="placeDetails">
                                    <div class="name">${result.name}</div>
                                    <div class="rating">${placeRating(result)}</div>
                                <div>`;                                
                listDiv.insertAdjacentHTML("beforeEnd", details);
                resultsDiv.appendChild(listDiv);
            }

            /*** Sort results of Restaurants on the right side by Stars from top rated to low rated ***/
            sortBy.on('change', function() {
                if (sortBy.val() === 'allStars') {
                    sortRestaurants();
                    allStars = true;
                    findPlaces();
                } else if (sortBy.val() === 'fiveStars') {
                    sortRestaurants();
                    fiveStars = true;
                    findPlaces();
                } else if (sortBy.val() === 'fourStars') {
                    sortRestaurants();
                    fourStars = true;
                    findPlaces();
                } else if (sortBy.val() === 'threeStars') {
                    sortRestaurants();
                    threeStars = true;
                    findPlaces();
                } else if (sortBy.val() === 'twoStars') {
                    sortRestaurants();
                    twoStars = true;
                    findPlaces();
                } else if (sortBy.val() === 'oneStar') {
                    sortRestaurants();
                    oneStar = true;
                    findPlaces();
                }
            });

            /*** Restaurants Photo using API ***/
            function createPhoto(place) {
                var photos = place.photos;
                var photo;
                if (!photos) {
                    photo = 'img/food.svg'; 
                } else {
                    photo = photos[0].getUrl({ 'maxWidth': 800, 'maxHeight': 540 });
                }
                return photo;
            }

            /*** Show Restaurants InfoWindow ***/
            function displayInfoWindow() {
                var marker = this;
                places.getDetails({
                    placeId: marker.placeResult.place_id
                }, function(place, status) {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        return;
                    }
                    infoWindow.open(map, marker);
                    infoWindowContent(place);
                    displayRestaurantInfo(place);
                });
            }

            function showExampleRestaurant() {
                var marker = this;
                infoWindow.open(map, marker);
                infoWindowContent(jsonRestaurants[marker.id]);
                displayRestaurantInfo(jsonRestaurants[marker.id]);
            }

            function pushRestaurantInfoWindow() {
                var marker = this;
                if (ifNewRest) {
                    newWindow.open(map, marker);
                    buildContent(marker);
                    pushRestaurantMarker.push(marker);
                    restaurantIndex += 1;
                } else {
                    infoWindow.open(map, marker);
                    infoWindowContent(pushRestaurant[marker.id]);
                    displayRestaurantInfo(pushRestaurant[marker.id]);
                }
            }

            /*** Hide the InfoWindows ***/
            function closeInfoWindow() {
                infoWindow.close(map, marker);
            }

            function closeInfoWindowNew() {
                newWindow.close(map, marker);
            }

            /********** Add New Restaurants on the MAP **********/

            /*** Create a new marker on the Map (right click) for creating new place ***/
            function displayResults(markerID, array, i) {
                addResultList(array[i], markerID);
                markers[markerID].placeResult = array[i];
                setTimeout(dropMarker(markerID), i);
            }

            /*** On Right Click add New Marker ***/ 
            map.addListener('rightclick', function(e) {
                closeInfoWindow();
                ifNewRest = true;
                var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
                var marker = new google.maps.Marker({
                    position: latlng,
                    id: restaurantIndex + 1
                });
                google.maps.event.addListener(marker, 'click', pushRestaurantInfoWindow);
                marker.setMap(map);
            });

            /*** Create the Info Window, after User click (left click) on the new marker ***/
            function infoWindowContent(place) {
                cleanWindowInfo();
                $('#info-window-photo').append('<img class="photo" ' + 'src="' + createPhoto(place) + '"/>');
                $('#info-url').append('<b><a href="#restaurant-info">' + place.name + '</a></b>');
                $('#info-address').text(place.vicinity);
                if (!place.formatted_phone_number) {
                    $('#info-phone').hide();
                } else {
                    $('#info-phone').text(place.formatted_phone_number);
                }
                addRating(place);
                $('#info-reviews').text('Read Reviews')
            }

            function cleanWindowInfo() {
                $('#info-window-photo').empty();
                $('#info-url').empty();
                $('#rating-details').empty();
            }

            /*** Add new restaurant form ***/
            function buildContent(marker) {
                restaurantInfoContainer.show();
                addRestaurantForm.empty();
                addRestaurantForm.show();
                addRestaurantForm.append(`
                    <input type="text" id="restaurant-name" name="restaurant-name" placeholder="Enter Restaurant Name" required/>
                    <input type="hidden" id="restaurant-lat" name="restaurant-lat" value="${marker.position.lat()}"/>
                    <input type="hidden" id="restaurant-lng" name="restaurant-lng" value="${marker.position.lng()}"/>
                    <input type="text" name="restaurant-address" id="restaurant-address" placeholder="Enter Address" required/>
                    <br />
                    <label for="restaurant-rating">Rate this Place: </label>
                    <select name="restaurant-rating" id="restaurant-rating" required>
                        <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733;</option>
                        <option value="4">&#9733;&#9733;&#9733;&#9733;&#9734;</option>
                        <option value="3">&#9733;&#9733;&#9733;&#9734;&#9734;</option>
                        <option value="2">&#9733;&#9733;&#9734;&#9734;&#9734;</option>
                        <option value="1">&#9733;&#9734;&#9734;&#9734;&#9734;</option>
                    </select>
                    <button id="add-new-restaurant-btn" class="button btn-submit">Add Restaurant</button>
                `);
            }

            /*** Push on click (Add restaurant button) ***/
            addRestaurantForm.on("submit", function(e) {
                e.preventDefault();
                var name = $('#restaurant-name');
                var address = $('#restaurant-address');
                var rating = $('#restaurant-rating');
                var locationLat = $('#restaurant-lat');
                var locationLng = $('#restaurant-lng');
                var position = new google.maps.LatLng(locationLat.value, locationLng.value);
                var place = {
                    name: name.val(),
                    vicinity: address.val(),
                    rating: rating.val(),
                    position: position,
                    geometry: { location: position },
                    icon: 'img/food.svg',
                    reviews: '',
                    photos: '',

                };
                pushRestaurant.push(place);
                closeInfoWindowNew();
                var marker = pushRestaurantMarker[restaurantIndex];
                ifNewRest = false;
                infoWindow.open(map, marker);
                infoWindowContent(place);
                displayRestaurantInfo(place);
            });

            /********* Restaurant Reviews - Details from Google API **********/

            /*** Container for details about Restaurants and Review Container ***/
            function displayRestaurantInfo(place) {
                $('#review-window').show();
                $('#add-review-button').show();
                restaurantInfoContainer.show();
                $('#name').text(place.name);
                $('#address').text(place.vicinity);
                $('#telephone').text(place.formatted_phone_number);

                var reviewsDiv = $('#reviews');
                var reviewHTML = '';
                reviewsDiv.html(reviewHTML);
                if (place.reviews) {
                    if (place.reviews.length > 0) {
                        for (var i = 0; i < place.reviews.length; i += 1) {
                            var review = place.reviews[i];
                            var avatar;
                            if (place.reviews[i].profile_photo_url) {
                                avatar = place.reviews[i].profile_photo_url;
                            } else {
                                avatar = 'img/avatar.svg';
                            }
                            reviewHTML +=   `<div class="restaurant-reviews">
                                                <h3 class="review-title">
                                                    <span class="user-avatar" style="background-image: url('${avatar}')"></span>`;
                                                    if (place.rating) {
                                                        reviewHTML += `<span id="review-rating" class="rating">${placeRating(review)}</span>`;
                                                    }
                                                    reviewHTML += ` <h3>${place.reviews[i].author_name}</h3>
                                                </h3>
                                                <p> ${place.reviews[i].text} </p>
                                                </div>`;
                            reviewsDiv.html(reviewHTML);
                        }
                    }
                }

                /********** Street view using Google API **********/

                /*** Add Street View ***/
                var streetView = new google.maps.StreetViewService();
                streetView.getPanorama({
                    location: place.geometry.location,
                    radius: 50
                }, processStreetViewData);

                var streetViewWindow = $('#street-view-window');
                var photoContainer = $('#photo');
                var photoWindow = $('#see-photo');
                var seeStreetView = $('#see-street-view');
                photoContainer.empty();
                photoContainer.append('<img class="place-api-photo" ' + 'src="' + createPhoto(place) + '"/>');

                streetViewWindow.show();
                if (photo) {
                    photoWindow.show();
                } else {
                    photoWindow.hide();
                }

                function processStreetViewData(data, status) {
                    if (status === 'OK') {
                        var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
                        panorama.setPano(data.location.pano);
                        panorama.setPov({
                            heading: 440,
                            pitch: 0
                        });
                        panorama.setVisible(true);

                    } else {
                        photoWindow.hide();
                        streetViewWindow.hide();
                        photoContainer.show();
                    }
                }
            }

        /*** Error Messages ***/    
        }, function(error) {
            if (error.code === 0); 
            else if (error.code === 1);
            handleLocationError(true, infoWindow, map.getCenter(currentPosition));
        });
    } else {
        /*** Browser doesn't support Geolocation ***/
        handleLocationError(false, infoWindow, map.getCenter(currentPosition));
        alert("Your browser does not support Geolocation!");
    }
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?            
            'Error: You are not Allow Geolocation. Please Refresh your Browser!' :
            'Error: The Geolocation service failed.');
        infoWindow.open(map);
    }
}