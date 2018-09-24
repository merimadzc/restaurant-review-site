/*** Add Restaurant Review ***/
function createReviewWindow() {
    reviewWindow.append(`<form id="add-review">
                        <label for="your-name">Your Name</label>
                        <input type="text" name="your-name" id="your-name" placeholder="Enter Your Name" required>
                        <div class="add-rate">
                            <label for="your-rating">Rate this place</label>
                        </div>
                        <select name="your-rating" id="your-rating" required>
                            <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733;</option>
                            <option value="4">&#9733;&#9733;&#9733;&#9733;&#9734;</option>
                            <option value="3">&#9733;&#9733;&#9733;&#9734;&#9734;</option>
                            <option value="2">&#9733;&#9733;&#9734;&#9734;&#9734;</option>
                            <option value="1">&#9733;&#9734;&#9734;&#9734;&#9734;</option>
                        </select>
                        <label for="your-review">Share your opinion about this restaurant.</label>
                        <textarea name="your-review" id="your-review" placeholder="Your Review" required></textarea>
                    </select>
                </form>`);
    $('#add-review-button').hide();
    reviewSubmit.show();
}

/*** Add a new review function ***/
function addReview(yourName, yourRating, yourReview) {
    var yourReviewDetails = {
        name: yourName,
        rating: yourRating,
        review: yourReview,
    };
    var reviewsDiv = $('#reviews');
    var yourReviewHTML = '';
    yourReviewHTML += `<div class="restaurant-reviews">
                         <h3 class="review-title">
                         <span class="user-avatar" style="background-image: url('img/avatar.svg')"></span>
                         <span id="review-rating" class="rating">${placeRating(yourReviewDetails)}</span>
                         </h3>
                         <h3>${yourReviewDetails.name}</h3>
                         <p> ${yourReviewDetails.review} </p>
                       </div>`;
    ourReview.push(yourReviewDetails);
    reviewsDiv.prepend(yourReviewHTML);
}

/*** Save ***/
function submitReview() {
    var yourName = $("#your-name");
    var yourRating = $("#your-rating");
    var yourReview = $("#your-review");
    if (!(yourName.val() && yourRating.val() && yourReview.val())) {
        return;
    }
    addReview(yourName.val(), yourRating.val(), yourReview.val());
    yourName.html();
    yourRating.html();
    yourReview.html();
    hideReviewForm();
    reviewSubmit.hide();
    reviewWindow.empty();
}

/*** Show or hide restaurant review form ***/
function showReviewForm() {
    $("#review-window").show();
    $("#add-review-button").show();
}
function hideReviewForm() {
    $("#review-window").hide();
    $("#add-review-button").hide();
}