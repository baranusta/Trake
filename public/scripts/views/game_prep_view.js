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
        if(!$('.gamePrepScreen').is(":visible"))
            return;

        $(".joined_players").each(function (index) {
            $(this).css("font-weight", "normal");
        });
        $("#readyBtn").prop("disabled", false);
        if (isReady) {
            alert(member.info.name + "joined the room, click ready again when you are");
            isReady = false;
        }
        readyPlayer = 0;

        $('.gamePrepScreen').append("<p class ='joined_players' id=" + member.id + ">" + member.info.name + '</p>');
    });

    gameChannel.bind('pusher:member_removed', function (member) {
        if(!$('.gamePrepScreen').is(":visible"))
            return;
            $(".joined_players").each(function (index) {
                $(this).css("font-weight", "normal");
            });
            $("#readyBtn").prop("disabled", false);
            if (isReady) {
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

    gameChannel.bind('client-snake-created', function (data) {
        setSnakes(data);
    });

    gameChannel.bind('client-turn', function (data) {
        turnSnake(data);
    });    
    
    gameChannel.bind('client-collectible', function (data) {
        addCollectible(data);
    });

    gameChannel.bind('client-use-power', function (data) {
        usePower(data);
    });    
    
    gameChannel.bind('client-stop-power', function (data) {
        stopPower(data);
    });

    gameChannel.bind('client-start-game', function (data) {
        Object.keys(gameChannel.members.members).sort().forEach(function(key,index) {
            if (gameChannel.members.myID == key) {
                startGame(index);
                return;
            }
        });
    });
    $('.gamePrepScreen').show();
}

var increaseReady = function () {
    if (++readyPlayer == gameChannel.members.count) {
        let myId = gameChannel.members.myID;
        initGame(readyPlayer);

        $('.gameScreen').show();
        $('.gamePrepScreen').hide();
        $('.lobbyScreen').hide();
    }
}

var ready = function () {
    isReady = true;
    increaseReady();
    console.log(gameChannel.members);
    $("#readyBtn").prop("disabled", true);
    $('#' + gameChannel.members.me.id).css("font-weight", "Bold");
    gameChannel.trigger("client-ready", { id: gameChannel.members.me.id });
}

var quitRoom = function () {
    if (isHost) {
        lobbyChannel.trigger('client-room-removed', { name: gameChannel.name.split("-")[1] });
    }
    pusher.unsubscribe(gameChannel.name);
    $.post("/leaveRoom", { name: joinedRoom },
        function (data, status) {
        });
    gameChannel = null;
    joinedRoom = null;
    $("#readyBtn").prop("disabled", false);
    $('.gamePrepScreen p').remove();
    $('.gamePrepScreen').hide();
    $('.gameScreen').hide();
    $('.lobbyScreen').show();
}

