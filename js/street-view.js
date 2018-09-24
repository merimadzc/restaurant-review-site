/*** Hide Restaurant Information and Street View when User click X ***/
$(document).ready(function(){
    $("#button-hide").click(function(){
        $("#restaurant-info").hide();
        $("#street-view-window").hide();
    });
});