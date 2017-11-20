var {ipcRenderer, remote} = require('electron');  

$(function () {
    console.log("Ready");
    ipcRenderer.send('async', 'ready');

    $('#turn-on-js').click(function () {
        $('#start-publish-js').removeAttr("disabled");
        $(this).attr("disabled", "disabled");
        ipcRenderer.send('async', 'turn-on');
    });
    
    $('#start-publish-js').click(function () {
        $(this).attr("disabled", "disabled");
        $('#stop-publish-js').removeAttr("disabled")
        ipcRenderer.send('async', 'start');
    });
    
    $('#stop-publish-js').click(function () {
        $('#start-publish-js').removeAttr("disabled")
        $(this).attr("disabled", "disabled");
        ipcRenderer.send('async', 'stop');
    });
});