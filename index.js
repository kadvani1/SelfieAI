/**
 * Created by Ben on 09/12/2015.
 */
var express = require('express')
var request = require('request')
var requestErrors = require('./node_modules/request-promise/lib/errors'),
    StatusCodeError = requestErrors.StatusCodeError,
    RequestError = requestErrors.RequestError
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var projectOxford = require('./oxford')
var callSlot = require('./resource')
var using = require('bluebird').using

app.use(express.static('./client'));
app.use(express.static('../SelfieTV'));

io.on('connection', function(socket){
    console.log('a user connected');
    var busyCalls = {faces: false, emotions: false}
    var counter = 0
    socket.on('image', function(blob){
        var count = counter++
        console.log(new Date().toLocaleTimeString())
        if(!busyCalls['faces']) {
            using(callSlot(busyCalls, 'faces'), function () {
                projectOxford.detectFaces(blob, "age,gender").then(function (data) {
                    socket.emit('faces', count + "$" + data)
                    console.log('n faces', JSON.parse(data).length, new Date().toLocaleTimeString(), data)
                }).catch(StatusCodeError, function (e) {
                    console.error('faces', e.statusCode, e.message)
                    throw e
                })
            }).catch(function () {
                console.error('err faces')
            })
        }
        if(!busyCalls['emotions']) {
            using(callSlot(busyCalls, 'emotions'), function () {
                projectOxford.emotions(blob).then(function (data) {
                    socket.emit('emotions', count + "$" + data)
                    console.log('n emotions', JSON.parse(data).length, new Date().toLocaleTimeString(), data)
                }).catch(StatusCodeError, function (e) {
                    console.error('emotions', e.statusCode, e.message)
                    throw e
                })
            }).catch(function () {
                console.error('err emotions')
            })
        }
    }).on('disconnect', function(){
        console.log('user disconnected');
    });
});

var server = http.listen(process.env.PORT || 4000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host=='::'?'localhost':host, port);
});