/*** Places rating ***/

/*** Rating Variables ***/
var allStars = false;
var fiveStars = false;
var fourStars = false;
var threeStars = false;
var twoStars = false;
var oneStar = false;

/*** Function for sorting restaurants ***/
function sortRestaurants() {
    oneStar = false;
    twoStars = false;
    fourStars = false;
    threeStars = false;
    fiveStars = false;
    allStars = false;
}

/*** Function for Places rating ***/
function placeRating(place) {
    var rating = [];
    if (place.rating) {
        for (var i = 0; i < 5; i++) {
            if (place.rating < (i + 1)) {
                rating.push(lowRate);
            } else {
                rating.push(topRate);
            }
        }
        return rating.join(' ');
    }
}

/*** Add Rating Function ***/
function addRating(place) {
    if (place.rating) {
        var showRating = '';
        for (var i = 0; i < 5; i++) {
            if (place.rating < (i + 1)) {
                showRating = '';
                showRating += lowRate;
            } else {
                showRating = '';
                showRating += topRate;
            }
            $('#rating-details').show();
            $('#rating-details').append(showRating);
        }
    } else {
        $('#rating-details').hide();
    }
}