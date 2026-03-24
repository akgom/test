roversaSensor.setUltrasonicPins(DigitalPin.P13, DigitalPin.P14)
roversaSensor.setStopDistance(15)

basic.forever(function () {
    if (roversaSensor.isObstacleTooClose()) {
        basic.showIcon(IconNames.No)
    } else {
        basic.showIcon(IconNames.Yes)
    }
})
