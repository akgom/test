roversaPet.setUltrasonicPins(DigitalPin.P13, DigitalPin.P14)
roversaPet.setStopDistance(15)
roversaPet.setCautionDistance(25)

basic.forever(function () {
    roversaPet.updateFaceFromDistance()

    if (roversaPet.dangerDetected()) {
        Roversa.stop()
    } else {
        Roversa.driveForward()
    }
})
