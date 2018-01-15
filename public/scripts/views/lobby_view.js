var lobbyChannel;

var addRoomToTable = function (data) {
    var markup = "<tr class='" + data.createdBy + "'id='" + data.name + "'>" +
        "<td>" + data.name + "</td>" +
        "<td>" + data.createdBy + "</td>" +
        "<td>" + data.playerLimit + "</td></tr>";
    console.log(markup);
    $("table[id=rooms] tbody").append(markup);
    $('#rooms tr').click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('td:first').html();
        console.log(value);
    });
}


var populateRooms = function () {
    $.get("/rooms",
        function (data, status) {
            for (var channelName in data) {
                addRoomToTable(data[channelName]);
            }
            initLobbyChannel();
        });
}

var openCreateRoomView = function () {
    console.log("try create room ");
    blur('lobbyScreen', 8);
    shownViewDiv = $('.createRoomScreen');
    shownViewDiv.show();
}

var joinRoom = function () {
    var selectedRoom = $("#rooms tr.selected");
    console.log(selectedRoom)
    if (selectedRoom.length > 0) {
        //var playerSection = $(selectedRoom).find("td:nth-child(3)").text().split("/");
        var roomName = selectedRoom.attr('id');
        $.post("/joinRoom",
            {
                roomName: roomName,
                playerName: playerName
            },
            function (data, status) {
                //lobbyChannel.trigger('client-room-player-number', { name: roomName, count: +1 });
                isHost = false;
                connectToGame(roomName);
            })
            .fail (function() {
                alert("room is full");
            });
    }
}

var showHelp = function (form) {
    //validate the texts.
    console.log("Help Screen");
    blur('lobbyScreen', 8);
    shownViewDiv = $('.helpScreenContainer');
    shownViewDiv.show();
}

var initLobbyChannel = function () {
    lobbyChannel = pusher.subscribe('presence-lobby');

    lobbyChannel.bind('client-room-added', function (data) {
        console.log(data);
        addRoomToTable(data);
    });

    lobbyChannel.bind('client-room-removed', function (data) {
        console.log(data);
        if (!!joinedRoom && data.name == joinedRoom) {
            quitRoom();
        }
        $("table #" + data.name).remove();
    });

    lobbyChannel.bind('pusher:subscription_succeeded', function (data) {
        console.log("lobby subscribed");

    });

    lobbyChannel.bind('pusher:subscription_error', function (status) {
        alert("Can not connect.");
    });

    lobbyChannel.bind('pusher:member_removed', function (member) {
        console.log($("." + member.info.name).prop('id'))
        if (!!joinedRoom && joinedRoom == $("." + member.info.name).prop('id'))
            quitRoom();
        $("table ." + member.info.name).remove();
    });
} 
