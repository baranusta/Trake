var shownViewDiv;
var playerName;
var pusher;

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var enterLobby = function () {
    var nick = $('#nick').val();
    if (nick.length > 0) {
        $.post("/createUser",
            {
                name: nick,
            },
            function (data, status) {
                console.log(window.location.href + 'pusher/auth');
                
                pusher = new Pusher(pusherKey, {
                    cluster: 'eu',
                    encrypted: true,
                    authEndpoint: '/auth',
                    auth: {
                        params: {
                            name: nick
                        }
                    }
                });
                playerName = nick;
                populateRooms();
                blur('lobbyScreen', 0);
                $('.nickScreen').hide();
            })
            .fail(function (status) {
                alert("name taken by another user");
            });
    }
}

var startSinglePlayer = function () {
    var nick = $('#nick').val();
    if (nick.length > 0) {
        $('.gameScreen').show();
        $('.lobbyScreen').hide();
        isHost = true;
        gameStart(1, 0);
    }
}

var divOutClicked = function () {
    shownViewDiv.hide();
    shownViewDiv = null;
    blur('lobbyScreen', 0);
}

var closeHelp = function () {
    blur('lobbyScreen', 0);
    shownViewDiv.hide();
    shownViewDiv = null;
}

window.onload = function () {
    //$('.lobbyScreen').hide();
    blur('lobbyScreen', 8);
    $('.createRoomScreen').hide();
    $('.helpScreenContainer').hide();
    $('.gamePrepScreen').hide();
    $('.gamePrepScreen').hide();
    $('.gameScreen').hide();
    //startSinglePlayer();
}

var _wasPageCleanedUp = false;
function pageCleanup() {
    if (!_wasPageCleanedUp) {
        _wasPageCleanedUp = true;
        console.log("cleanup");
        if (!!lobbyChannel){
            pusher.unsubscribe(lobbyChannel.name);
            lobbyChannel = null;
        }
        if (!!gameChannel)
        {
            pusher.unsubscribe(gameChannel.name);
        }
        if (!!playerName)
            $.ajax({
                type: 'POST',
                url: "/deleteUser",
                data: { name: playerName },
                async: false
            });
    }
}


$(window).on('beforeunload', function () {
    //this will work only for Chrome
    pageCleanup();
});

$(window).on("unload", function () {
    //this will work for other browsers
    pageCleanup();
});

var blur = function (divClassName, blurNum) {
    var blurValue = 'blur(' + blurNum + 'px)';
    $('.' + divClassName)
        .css('filter', blurValue)
        .css('webkitFilter', blurValue)
        .css('mozFilter', blurValue)
        .css('oFilter', blurValue)
        .css('msFilter', blurValue);
}



