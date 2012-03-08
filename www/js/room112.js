//State Constants
const ENTER_ROOM = "enter-room";
const CHECK_IN = "check-in";
const CHECK_OUT = "check-out";
const SAVE = "save";

// Application state
var mode = ENTER_ROOM;
var hotelData;
var currentRoomData;
var cacheMapURL;
/**
 * Init fucntion for app which adds event listeners, updates the display, and animates in the card
 */
function onDeviceReady() {
    
    $("#pocket").hide().delay(100).fadeIn(500);
    
    // First test to see if we have hotelData, if not get a reference to it
    getHotelData();
    var defaultTopPosition = 12;
    
    $("#top").css("background-image", "url('images/map-add-location.png')");
    
    if (currentRoomData == null) {
        mode = ENTER_ROOM;
        $("#topImage").css("background-image", "none");
        var currentTime = new Date()
        var month = currentTime.getMonth() + 1
        var day = currentTime.getDate()
        var year = currentTime.getFullYear();
        var currentDate = month + "/" + day + "/" + year;
        $("#date").attr("placeholder", currentDate).val(currentDate);
    }
    else {
        console.log("Has Data");
        $("#date").attr("placeholder", currentRoomData.date).val(currentRoomData.date);
        $("#room").val(currentRoomData.room);
        $("#floor").val(currentRoomData.floor);
        $("#date").val(currentRoomData.date);
        cacheMapURL = currentRoomData.map;
        mode = CHECK_OUT;
        if(cacheMapURL)
            $("#topImage").css("background-image", "url('"+cacheMapURL+"')");
            
        defaultTopPosition = 42;
    }
    
    // Add event listeners for fields and buttons
    addInputListeners();
    
    // This sets the correct state for the display
    updateDisplay();
    
    //Show card
    $('#card').delay(1000).animate({top:defaultTopPosition}, 500);
    $('#top').click(loadGPS);
}
function loadGPS()
{
    navigator.geolocation.getCurrentPosition(showMap, showMapError);
}
function addInputListeners() {
    $("input").focusout(function () {
                        invalidate(this.id);
                        updateDisplay();
                        });
    
    $("#action").click(formAction);
}

//TODO need invalidation for map?
function invalidate(value) {
    if (currentRoomData) {
        var fieldID = "#" + value;
        
        //Test state
        console.log("Invalidate", value, $(fieldID).val(), currentRoomData[value]);
        if ($(fieldID).val() != currentRoomData[value]) {
//            mode = SAVE;
            saveRoomData();
        }
        else
            mode = CHECK_OUT;
    }
    else {
        if (!$('#room').val())
            mode = ENTER_ROOM;
        else
            mode = CHECK_IN;
    }
}

function updateDisplay() {
    $("#action").attr('class', mode).text(mode.replace("-", " "));
}

function getHotelData() {
    
    // Get hotel save data object from Lawnchair
    if (!hotelData) {
        hotelData = new Lawnchair({name:'hoteldata'}, function (e) {
                                  console.log('Storage Open', this);
                                  });
    }
    
    // Get current room data from the hotelData object
    hotelData.get("room", function (obj) {
                  currentRoomData = (obj) ? obj.value : null;
                  });
}

function formAction() {
    // Return if room data is empty
    if (mode == ENTER_ROOM)
        return;
    
    switch (mode) {
        case CHECK_IN:
            checkIn();
            break;
        case CHECK_OUT:
            checkout();
            break;
        case SAVE:
            saveRoomData();
            mode = CHECK_OUT;
            break;
    }
    
    updateDisplay();
}

function checkIn() {
    saveRoomData();
    mode = CHECK_OUT;
    updateDisplay();
    $('#card').animate({top:42}, 200);
}

function saveRoomData() {
    var newRoom = $("#room").val();
    
    
    
    var formData = {
    room:$("#room").val(),
    floor:$("#floor").val(),
    date:$("#date").val(),
    map: cacheMapURL
    }
    hotelData.save({key:"room", value:formData});
    hotelData.get("room", function (obj) {
                  currentRoomData = obj.value;
                  }
                  );
    
}

function checkout() {
    if (confirm('Are you sure you want to check out?')) {
        $('#card').animate({top:-900}, 250, resetCard);
        
    }
}

function resetCard() {
    console.log("reset card");
    hotelData.nuke();
    currentRoomData = null;
    cacheMapURL = null;
    $("#room").val("");
    $("#floor").val("");
    mode = ENTER_ROOM;
    $("#topImage").css("background-image", "none");
    updateDisplay();
    $('#card').delay(500).animate({top:12}, 500);
    
}

function showMap(position) {
    // Show a map centered at position
    
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    
    var coords = position.coords;
    var width = 296;
    var height = 85;
    // Call for static google maps data - make sure you use your own Google Maps API key!
    cacheMapURL = "http://maps.google.com/maps/api/staticmap?center=" + coords.latitude + "," + coords.longitude + "&zoom=13&size="+width+"x"+height+"&maptype=roadmap&key=MyGoogleMapsAPIKey&sensor=true";
    $("#topImage").hide().css("background-image", "url('" + cacheMapURL + "')").delay(500).fadeIn(500);
}

function showMapError(error) {
    //TODO make map unavailable with message
    $("#topImage").hide().css("background-image", "url('images/map-error.png')").fadeIn(500);
}


//    if(device)
//document.addEventListener("deviceready", onDeviceReady, false);
//    else
onDeviceReady();