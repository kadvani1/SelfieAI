/**
 * Created by Ben on 09/12/2015.
 */
$(function () {
    webcam.run(200).then(function () {
        console.log("running")
        makeSocket()
        sendSnap()

        //tracking
        setInterval(webcam.track, 300)
    })
})