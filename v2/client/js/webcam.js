/**
 * Created by Ben on 09/12/2015.
 */
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
var webcam;

$(function () {
    var video = document.querySelector('video'),
        canvases = $("canvas").toArray()
    webcam = {
        video: video,
        canvases: canvases,
        latest: 0,
        launch: function launchWebcam() {
            return $.Deferred(function (def) {
                navigator.getUserMedia({video: true}, function (stream) {
                    def.resolve(stream)
                }, function (err) {
                    def.reject(err)
                })
            }).promise()
        },
        run: function(canvasDimension, errHandler) {
            return webcam.launch().then(function (stream) {
                if (window.URL) video.src = window.URL.createObjectURL(stream); else video.src = stream;
                video.onerror = function (e) {
                    stream.stop();
                    errHandler ? errHandler(e) : console.log(e)
                };
                stream.onended = errHandler || function(){console.log("stream ended")};

                return $.Deferred(function (def) {
                    video.onloadedmetadata = function () {
                        var size = webcam.getSize(),
                            factor = 1
                        if(canvasDimension) {
                            if(size.w > size.h) {
                                if(size.w > canvasDimension) {
                                    factor = canvasDimension / size.w
                                }
                            } else {
                                if(size.h > canvasDimension) {
                                    factor = canvasDimension / size.h
                                }
                            }
                        }
                        _.each(canvases, function (canvas) {
                            canvas.width = size.w * factor;
                            canvas.height = size.h * factor;
                        })
                        webcam.trackingCanvas = canvases.shift()
                        webcam.showWidth = $(webcam.video).width()
                        def.resolve()
                    }
                }).promise()
            })
        },
        snap: function capture(maxDimension) {
            var canvas = canvases[webcam.latest++ % canvases.length]
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL('img/png');
            return {
                blob: dataURItoBlob(dataURL),
                dataURL: dataURL
            }
        },
        getSize: function () {
            return {
                w: video.videoWidth,
                h: video.videoHeight
            }
        },
        testSnap: function () {
            var canvas = webcam.trackingCanvas
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        },
        track: function () {
            if(webcam.faceTracker) {
                webcam.testSnap()
                webcam.faceTracker.track(webcam.trackingCanvas)
                var trackingResult = webcam.faceTracker.getTrackObj()
                $("#webcam").append(fbox({
                    top: trackingResult.y - trackingResult.height / 2,
                    left: trackingResult.x - trackingResult.width / 2,
                    width: trackingResult.width, height: trackingResult.height
                }, webcam.showWidth / webcam.trackingCanvas.width, 'yellow', null, 1))
            }
        }
    }
})

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
        type: mimeString
    });
}

