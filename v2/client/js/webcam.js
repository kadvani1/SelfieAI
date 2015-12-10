/**
 * Created by Ben on 09/12/2015.
 */
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
var webcam;

$(function () {
    var video = document.querySelector('video'),
        canvas = document.getElementById('photo')
    webcam = {
        video: video,
        canvas: canvas,
        ctx: canvas.getContext('2d'),
        launch: function launchWebcam() {
            return $.Deferred(function (def) {
                navigator.getUserMedia({video: true}, function (stream) {
                    def.resolve(stream)
                }, function (err) {
                    def.reject(err)
                })
            }).promise()
        },
        run: function(errHandler) {
            return webcam.launch().then(function (stream) {
                if (window.URL) video.src = window.URL.createObjectURL(stream); else video.src = stream;
                video.onerror = function (e) {
                    stream.stop();
                    errHandler ? errHandler(e) : console.log(e)
                };
                stream.onended = errHandler || function(){console.log("stream ended")};

                return $.Deferred(function (def) {
                    video.onloadedmetadata = function () {
                        var size = webcam.getSize()
                        canvas.width = size.w;
                        canvas.height = size.h;
                        def.resolve()
                    }
                }).promise()
            })
        },
        snap: function capture(maxDimension) {
            if(maxDimension) {
                var maxSize = webcam.getSize(),
                    factor = 1;
                if(maxSize.w > maxSize.h) {
                    if(maxSize.w > maxDimension) {
                        factor = maxDimension / maxSize.w
                    }
                } else {
                    if(maxSize.h > maxDimension) {
                        factor = maxDimension / maxSize.h
                    }
                }
                canvas.width = maxSize.w * factor;
                canvas.height = maxSize.h * factor;
                webcam.ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            } else webcam.ctx.drawImage(video, 0, 0);

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