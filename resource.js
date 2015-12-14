/**
 * Created by Ben on 09/12/2015.
 */
var Promise = require('bluebird')

module.exports = function resource(obj, key) {
    obj[key] = new Date()
    return Promise.resolve().disposer(function () {
        obj[key] = false
    });
}