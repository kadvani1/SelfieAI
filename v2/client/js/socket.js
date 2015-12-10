/**
 * Created by Ben on 09/12/2015.
 */
var socket;
var latestReceivedMessageId = -1
function makeSocket(){
    socket = io()
    socket.on('faces', makeListener("faces", faceData))
        .on('emotions', makeListener("emotions", emotionData));
}

function makeListener(type, f) {
    return function(msg){
        console.log(type + ': ' + msg);
        var dollar = msg.indexOf('$')
        var i = parseInt(msg.substring(0, dollar))
        var data = JSON.parse(msg.substring(dollar+1))
        f(data)
        if(data.length && i > latestReceivedMessageId) {
            webcam.faceTracker = new camshift.Tracker();
            webcam.faceTracker.initTracker(webcam.canvases[i % webcam.canvases.length],
                new camshift.Rectangle(data[0].faceRectangle));
        }
        sendSnap()
        latestReceivedMessageId = i
    }
}

var DELAY = 500
var rateLimited = false
function deLimit() {
    rateLimited = false
}
function sendSnap() {
    if(!rateLimited) {
        console.log("snapping")
        socket.emit('image', webcam.snap().blob)
        rateLimited = setTimeout(deLimit, DELAY)
        return true
    } else {
        console.log("rate limited")
        clearTimeout(rateLimited)
        deLimit()
    }
}