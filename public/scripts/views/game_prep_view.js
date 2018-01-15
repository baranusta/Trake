var joinedRoom;
var gameChannel;

let readyPlayer;
let isReady;

var connectToGame = function (roomName) {
    joinedRoom = roomName;
    readyPlayer = 0;
    isReady = false;
    gameChannel = pusher.subscribe('presence-' + roomName);

    gameChannel.bind('pusher:member_added', function (member) {
        $( ".joined_players" ).each(function( index ) {
            $(this).css("font-weight", "normal");
          });
        $("#readyBtn").prop("disabled", false);
        if(isReady){
            alert(member.info.name + "joined the room, click ready again when you are");
            isReady = false;
        }
        readyPlayer = 0;

        $('.gamePrepScreen').append("<p class ='joined_players' id=" + member.id + ">" + member.info.name + '</p>');
    });

    gameChannel.bind('pusher:member_removed', function (member) {
        $(".joined_players" ).each(function( index ) {
            $(this).css("font-weight", "normal");
          });
        $("#readyBtn").prop("disabled", false);
        if(isReady){
            alert(member.info.name + "left the room, click ready again when you are");
            isReady = false;
        }
        readyPlayer = 0;

        $('#' + member.id).remove();
    });


    gameChannel.bind('client-ready', function (data) {
        $('#' + data.id).css("font-weight", "Bold");
        increaseReady();
    });

    gameChannel.bind('client-start', function (data) {
        //lets get this started bitches.
    });
    gameChannel.bind('pusher:subscription_succeeded', function (members) {
        members.each(function (member) {
            // for example:
            $('.gamePrepScreen').append("<p id=" + member.id + ">" + member.info.name + '</p>');
        });
    })

    gameChannel.bind('pusher:subscription_error', function (status) {
        alert("Something went wrong");
        quit();
    });

    $('.gamePrepScreen').show();
}

var increaseReady = function(){
    if(++readyPlayer == gameChannel.members.count){
        let myId = gameChannel.members.myID;
        let index = 0;
        for (var memberId in gameChannel.members.members) {
            if (gameChannel.members.members.hasOwnProperty(memberId) && myId == memberId) {
                $('.gameScreen').show();
                $('.gamePrepScreen').hide();
                gameStart(readyPlayer, index);
                break;
            }
            index++;
        }
    }
}

var ready = function () {
    isReady = true;
    increaseReady();
    console.log(gameChannel.members);
    $("#readyBtn").prop("disabled", true);
    $('#' + gameChannel.members.me.id).css("font-weight", "Bold");
    gameChannel.trigger("client-ready", {id: gameChannel.members.me.id});
}

var quitRoom = function () {
    if(isHost){
        lobbyChannel.trigger('client-room-removed', {name: gameChannel.name.split("-")[1]});
    }
    pusher.unsubscribe(gameChannel.name);
    $.post("/leaveRoom", {name: joinedRoom},
    function (data, status) {
    });
    gameChannel = null;
    joinedRoom = null;
    $("#readyBtn").prop("disabled", false);
    $('.gamePrepScreen p').remove();
    $('.gamePrepScreen').hide();
}

