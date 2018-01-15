
var createRoom = function (form) {
    //validate the texts.
    if (form.RoomName.value.length == 0 ||
        form.PlayerCount.value.length == 0 ||
        isNaN(parseInt(form.PlayerCount.value))) {
        console.log("bad input");
        return;
    }

    var req = {
        name: form.RoomName.value,
        createdBy: playerName,
        playerLimit: form.PlayerCount.value,
        joined: 1
    };
    $.post("/createRoom", req,
        function (data, status) {
            lobbyChannel.trigger('client-room-added', req);
            isHost = true;
            divOutClicked()
            connectToGame(form.RoomName.value);
        });
}
