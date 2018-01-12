var joinedRoom;
var gameChannel;

var connectToGame = function(roomName, myName)
{
    joinedRoom = roomName;
    gameChannel = pusher.subscribe('presence-' + roomName);
    gameChannel.bind('joined', function (data) {
        $('.gamePrepScreen').append("<p id=" + data.name +">"+data.name+'</p>')
    });
    
    gameChannel.bind('left', function (data) {
        $('#' + data.name).remove()
    });
    
    gameChannel.bind('ready', function (data) {
        $('#' + data.name).css("font-weight","Bold");
    });
    
    gameChannel.bind('start', function (data) {
        //lets get this started bitches.
    });
    
    gameChannel.bind('pusher:subscription_succeeded', function (data) {
        $('.gamePrepScreen').append("<p id=" + myName +">"+myName+'</p>')
    });
    
    gameChannel.bind('pusher:subscription_error', function (status) {
        alert("Something went wrong");
        quit();
    });
    
    $('.gamePrepScreen').show();
}

var ready = function(){
    $("#readyBtn").attr("disabled", "disabled");
}
var quit = function(){
    joinedRoom = null;
    $('.gamePrepScreen p').remove();
    $('.gamePrepScreen').hide();
}

