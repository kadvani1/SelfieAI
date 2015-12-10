/**
 * Created by Ben on 09/12/2015.
 */
function showRectangles(positions) {
    $(".facebox").remove()
    if(positions.length) {
        if(positions[0].faceRectangle)
            positions = _.map(positions, 'faceRectangle')
        positions.forEach(function (pos) {
            var factor = $(webcam.video).width() / webcam.canvas.width
            var top = Math.round(pos.top * factor);
            var left = Math.round(pos.left * factor);
            var width = Math.round(pos.width * factor);
            var height = Math.round(pos.height * factor);
            var facebox = $("<div class='facebox' style='border:3px solid " +
                (pos.colour || 'green') + "; position: absolute; text-align: center; font-size: 3em;'>" +
                    (pos.text||'') +
                "</div>")
                .css({top: top + "px", left: left + "px", width: width + "px", height: height + "px", color: pos.colour||'green'})
            $("#webcam").append(facebox)
        })
    }
}

function faceData(data) {
    showRectangles(data.map(function (f) {
        //function run on each face returned by detect
        console.log(f.faceAttributes.gender + ' ' + f.faceAttributes.age)

        return _.defaults({
            colour: f.faceAttributes.gender == 'male' ? 'blue' : 'pink',
            text: parseInt(f.faceAttributes.age)
        }, f.faceRectangle)
    }))

    updateVideoDetect(data.map(function (f) {
        //function run on each face returned by detect
        return {
            gender: f.faceAttributes.gender,
            age: parseInt(f.faceAttributes.age)
        }
    }))

    var gender = _.groupBy(data, function (f) {
        return f.faceAttributes.gender
    })
}

function maxEmotion(scores) {
    var emotionScore = 0.33, emotion = "neutral"
    _.each(scores, function (v, k) {
        if(k != "neutral" && v > emotionScore) {
            emotion = k
            emotionScore = v
        }
    })
    return emotion
}

var mapEmotions = {
    'happiness': ':)',
    'sadness': ':(',
    'neutral': ':I',
    'anger': 'anger',
    'disgust': 'disgust',
    'contempt':'contempt',
    'fear':'fear',
    'surprise':':O' 
}

function emotionData(data) {
    showRectangles(data.map(function (f) {
        //function run on each face returned by emotion
        var emotion = maxEmotion(f.scores);
        console.log(emotion || 'neutral')
        return _.defaults({
            text: mapEmotions[emotion] == null ? emotion : mapEmotions[emotion]
        }, f.faceRectangle)
    }))

    if(data.length)
        updateVideoEmotions(data.map(function (f) {
            return maxEmotion(f.scores)
        }))
}