
var addRoomToTable = function (data) {
    var markup = "<tr id='" + data.name + "'>" +
        "<td>" + data.name + "</td>" +
        "<td>" + (data.createdBy || "lol") + "</td>" +
        "<td>" + data.joined + "/" + data.playerCount + "</td></tr>";
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
            console.log(data);
            for (var channelName in data) {
                addRoomToTable(data[channelName]);
            }
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
        var playerSection = $(selectedRoom).find("td:nth-child(3)").text().split("/");
        if (playerSection[0] < playerSection[1]) {
            var roomName = selectedRoom.attr('id');
            $.post("/joinRoom",
                {
                    name: roomName,
                },
                function (data, status) {
                    connectToGame(roomName);
                });
        }
    }
}

var showHelp = function (form) {
    //validate the texts.
    console.log("Help Screen");
    blur('lobbyScreen', 8);
    shownViewDiv = $('.helpScreenContainer');
    shownViewDiv.show();
}


var lobbyChannel = pusher.subscribe('lobby');


lobbyChannel.bind('room-added', function (data) {
    addRoomToTable(data);
});

lobbyChannel.bind('room-removed', function (data) {
    $("table #" + data["channelName"]).remove();
});

lobbyChannel.bind('room-joined', function (data) {
    console.log(data);
    $("#"+data.name+" td:eq(2)").html(data.joined + "/" + data.playerCount);
});

lobbyChannel.bind('pusher:subscription_succeeded', function (data) {
});

lobbyChannel.bind('pusher:subscription_error', function (status) {
    alert("Can not connect.");
});