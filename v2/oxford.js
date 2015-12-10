/**
 * Created by Ben on 09/12/2015.
 */
var fs = require('fs'),
    request = require('request-promise'),
    emotionskey = fs.readFileSync('oxford.emotions.key').toString(),
    key = fs.readFileSync('oxford.key').toString(),
    facekey = fs.readFileSync('oxford.face.key').toString(),
    base = "https://api.projectoxford.ai/"

module.exports = {
    detectFaces: function detectFaces(imageBlob, attributes) {
        console.log("faces")
        if(!attributes)
            attributes = "age,gender,smile,facialHair"

        return request.post({
            uri: base + 'face/v1.0/detect?returnFaceAttributes=' + attributes,
            headers: {
                'Ocp-Apim-Subscription-Key': facekey,
                'Content-Type': 'application/octet-stream'
            },
            body: imageBlob
        })
    },
    emotions: function emotions(imageBlob) {
        console.log("emotions")
        return request.post({
            uri: base + 'emotion/v1.0/recognize',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Content-Type': 'application/octet-stream'
            },
            body: imageBlob
        })
    }/*,
    superEmotions: function emotions(imageBlob) {
        console.log("emotions")
        return request.post({
            uri: base + 'emotion/v1.0/recognize',
            headers: {
                'Ocp-Apim-Subscription-Key': 'b4e449933a8541c4bbbe88cf7496c19a',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: 'www.tvmediainsights.com/wp-content/uploads/people-watching-tv.jpg'
            })
        })
    }*/
}