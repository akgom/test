roversaPet.setUltrasonicPins(DigitalPin.P13, DigitalPin.P14)
roversaPet.setStopDistance(15)
roversaPet.setCautionDistance(25)
roversaPet.setPetStats(70, 20, 80)

input.onButtonPressed(Button.A, function () {
    roversaPet.petRobot()
})

input.onButtonPressed(Button.B, function () {
    roversaPet.feedRobot()
})

input.onButtonPressed(Button.AB, function () {
    roversaPet.showDistance()
})

basic.forever(function () {
    roversaPet.updatePetState()
    roversaPet.updateFace()

    if (roversaPet.dangerDetected()) {
        Roversa.stop()
    } else {
        Roversa.driveForward()
    }

    basic.pause(500)
})
