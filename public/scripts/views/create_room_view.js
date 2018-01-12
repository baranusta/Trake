
var createRoom = function (form) {
    //validate the texts.
    if(form.RoomName.value.length == 0 ||
        form.PlayerCount.value.length == 0 ||
        isNaN(parseInt(form.PlayerCount.value)))
         {
             console.log("bad input");
             return;
         }

    $.post("/createRoom",
        {
            name: form.RoomName.value,
            playerCount: form.PlayerCount.value
        },
        function (data, status) {
            divOutClicked()
            connectToGame(form.RoomName.value);
        });
}
