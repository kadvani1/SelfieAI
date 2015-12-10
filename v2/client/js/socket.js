/**
 * Created by Ben on 09/12/2015.
 */
var socket;
function makeSocket(){
    socket = io()
    socket.on('faces', function(msg){
        console.log('face: ' + msg);
        faceData(JSON.parse(msg))
        sendSnap()
    }).on('emotions', function(msg){
        console.log('emotion: ' + msg);
        emotionData(JSON.parse(msg))
        sendSnap()
    });
}

var DELAY = 500
var rateLimited = false
function deLimit() {
    rateLimited = false
}
function sendSnap() {
    if(!rateLimited) {
        console.log("snapping")
        socket.emit('image', webcam.snap(200).blob)
        rateLimited = setTimeout(deLimit, DELAY)
    } else {
        console.log("rate limited")
        clearTimeout(rateLimited)
        deLimit()
    }
}