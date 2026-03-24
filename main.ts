/**
 * Roversa Ultrasonic Sensor Extension
 */
//% color="#00A6ED" icon="\uf2db" block="Roversa Sensor"
namespace roversaSensor {
    let trig = DigitalPin.P13
    let echo = DigitalPin.P14
    let stopDistance = 15

    /**
     * Set ultrasonic sensor pins
     */
    //% block="set ultrasonic trig %trigPin echo %echoPin"
    //% group="Setup"
    export function setUltrasonicPins(trigPin: DigitalPin, echoPin: DigitalPin): void {
        trig = trigPin
        echo = echoPin
        pins.setPull(echo, PinPullMode.PullNone)
    }

    /**
     * Set stopping distance (cm)
     */
    //% block="set stop distance to %cm cm"
    //% cm.min=1 cm.max=200 cm.defl=15
    //% group="Threshold"
    export function setStopDistance(cm: number): void {
        stopDistance = cm
    }

    /**
     * Get distance in cm
     */
    //% block="distance (cm)"
    //% group="Readings"
    export function distanceCm(): number {
        pins.digitalWritePin(trig, 0)
        control.waitMicros(2)

        pins.digitalWritePin(trig, 1)
        control.waitMicros(10)
        pins.digitalWritePin(trig, 0)

        let duration = pins.pulseIn(echo, PulseValue.High, 25000)

        if (duration <= 0) {
            return 500
        }

        return Math.idiv(duration, 58)
    }

    /**
     * Check if obstacle is too close
     */
    //% block="is obstacle too close"
    //% group="Logic"
    export function isObstacleTooClose(): boolean {
        return distanceCm() <= stopDistance
    }

    /**
     * Check if object is within custom distance
     */
    //% block="object within %cm cm"
    //% cm.min=1 cm.max=200 cm.defl=15
    //% group="Logic"
    export function objectWithin(cm: number): boolean {
        return distanceCm() <= cm
    }

    /**
     * Check if path is clear
     */
    //% block="path is clear"
    //% group="Logic"
    export function pathIsClear(): boolean {
        return distanceCm() > stopDistance
    }

    /**
     * Show distance on LED display
     */
    //% block="show distance"
    //% group="Output"
    export function showDistance(): void {
        basic.showNumber(distanceCm())
    }
}
