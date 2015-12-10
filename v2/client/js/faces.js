/**
 * Created by Ben on 09/12/2015.
 */
function showRectangles(positions) {
    $(".facebox").remove()
    if(positions.length) {
        if(positions[0].faceRectangle)
            positions = _.map(positions, 'faceRectangle')
        positions.forEach(function (pos) {
            var factor = webcam.video.videoWidth / webcam.canvas.width
            var top = Math.round(pos.top * factor);
            var left = Math.round(pos.left * factor);
            var width = Math.round(pos.width * factor);
            var height = Math.round(pos.height * factor);
            var facebox = $("<div class='facebox' style='border:3px solid " +
                (pos.colour || 'green') + "; position: absolute'></div>")
                .css({top: top + "px", left: left + "px", width: width + "px", height: height + "px"})
            $("#webcam").append(facebox)
        })
    }
}

function faceData(data) {
    showRectangles(data.map(function (f) {
        return _.defaults({
            colour: f.faceAttributes.gender == 'male' ? 'blue' : 'pink'
        }, f.faceRectangle)
    }))

    var gender = _.groupBy(data, function (f) {
        return f.faceAttributes.gender
    })

    data.forEach(function (f) {
        console.log(f.faceAttributes.gender + ' ' + f.faceAttributes.age)
    })
}

function maxEmotion(scores) {
    var emotionScore = 0, emotion = "neutral"
    _.each(scores, function (v, k) {
        if(v > emotionScore) {
            emotion = k
            emotionScore = v
        }
    })
    return emotion
}

function emotionData(data) {
    showRectangles(data)
    data.forEach(function (f) {
        console.log(maxEmotion(f.scores))
    })
}