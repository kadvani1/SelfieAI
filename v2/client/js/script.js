/**
 * Created by Ben on 09/12/2015.
 */
$(function () {
    webcam.run().then(function () {
        console.log("running")
        makeSocket()
        sendSnap()
    })
})